import React, { useState, useEffect, useContext } from 'react';
import { navigate, useLocation } from '@reach/router';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

import Plus from '@bit/mui-org.material-ui-icons.add-rounded';
import Minus from '@bit/mui-org.material-ui-icons.remove-rounded';
import Cross from '@bit/mui-org.material-ui-icons.close-rounded';

import { LangContext } from '../pages/App';
import AutoComplete from './AutoComplete';
import ActivePanel, { slideDuration } from './ActivePanel';
import CreditsPanel from './CreditsPanel';

// * styled components
export const Raised = styled.div.attrs(
	(p: { position: string; minWidth: string; shadow?: boolean }) => ({
		position: p.position || 'absolute',
		minWidth: p.minWidth || '3rem',
		shadow: p.shadow ?? true,
	})
)`
	position: ${p => p.position};
	min-height: 3rem;
	min-width: ${p => p.minWidth};

	display: flex;
	align-items: center;
	justify-content: center;

	background-color: ${p => p.theme.offwhite};
	outline: none;
	border: none;
	border-color: ${p => p.theme.activeColour};
	border-radius: 0.75rem;
	${p => (p.shadow ? `box-shadow: 0.125rem 0.25rem 0.5rem ${p.theme.activeColour};` : undefined)}
`;

export const RaisedButton = styled(Raised)`
	svg {
		transform: scale(1.25);
	}
	&:active:enabled {
		background-color: ${p => p.theme.activeColour};

		svg {
			fill: ${p => p.theme.offwhite};
		}
	}
	&:disabled {
		color: initial;
	}
`;

const LangButtonWrapper = styled.div`
	display: inline-block;
	width: 1.5rem;
	height: 1.5rem;
	padding: 0.25rem;

	img {
		outline-style: solid;
		outline-color: ${p => p.theme.activeColour};
	}
`;

const LangButton = ({ src, alt, active }: { src: string; alt: string; active: boolean }) => (
	<LangButtonWrapper>
		<motion.img
			src={src}
			alt={alt}
			initial="other"
			animate={active ? 'active' : 'other'}
			variants={flagAnim}
		/>
	</LangButtonWrapper>
);

// * motion anim JSS
const buttonGroupAnim = {
	open: { right: '33.3%', transition: { ease: 'easeOut', duration: slideDuration } },
	closed: { right: '0%', transition: { ease: 'easeIn', duration: slideDuration } },
};
const exitButtonAnim = {
	open: { opacity: 1, transition: { ease: 'easeOut', duration: slideDuration } },
	closed: { opacity: 0, transition: { ease: 'easeIn', duration: 0.25 } },
};
const flagAnim = {
	active: {
		outlineWidth: '3px',
		filter: 'grayscale(0)',
		transition: { ease: 'easeOut', duration: 0.25 },
	},
	other: {
		outlineWidth: '0px',
		filter: 'grayscale(100%)',
		transition: { ease: 'easeIn', duration: 0.25 },
	},
};

export interface OverlayProps {
	transform: { scale: number; translation: { x: number; y: number } };
	updateScale: (step: number) => void;
	active: SauceName;
}

const SEARCHOFF = 'thisisoff';

const Overlay: React.FC<OverlayProps> = ({ transform, updateScale, active }) => {
	const lang = useContext(LangContext);
	const [search, _setSearch] = useState(SEARCHOFF);
	const [display, setDisplay] = useState('');
	const setSearch = (nom: string, dis?: string) => (
		setDisplay(dis ?? nom), _setSearch(nom.toLowerCase().trim())
	);

	const [credits, setCredits] = useState(false);
	const exit = (_lang?: string) =>
		credits ? setCredits(false) : (navigate(`/#${_lang ?? lang}`), setSearch(''));

	useEffect(() => {
		const keyListener = (e: KeyboardEvent) =>
			e.key.includes('Esc') && exit(window.location.hash.slice(1));
		window.addEventListener('keydown', keyListener);
		return () => window.removeEventListener('keydown', keyListener);
	}, []);

	return (
		<>
			<motion.div
				style={{ position: 'fixed', top: 0, zIndex: 3 }}
				initial={buttonGroupAnim.closed}
				animate={active ? buttonGroupAnim.open : buttonGroupAnim.closed}>
				<AutoComplete {...{ search, setSearch, display, SEARCHOFF }} />
				<RaisedButton
					as="button"
					onClick={() => updateScale(+0.1)}
					style={{ right: '12rem', top: '2rem', cursor: 'zoom-in' }}>
					<Plus />
				</RaisedButton>
				<RaisedButton
					as="button"
					onClick={() => updateScale(-0.1)}
					style={{ right: '8rem', top: '2rem', cursor: 'zoom-out' }}>
					<Minus />
				</RaisedButton>
				<Raised
					as="button"
					onClick={() => navigate(`/?${active}#${lang === 'en' ? 'fr' : 'en'}`)}
					style={{ right: '2rem', top: '2rem', cursor: 'pointer' }}>
					<LangButton
						src="https://raw.githubusercontent.com/lipis/flag-icon-css/master/flags/4x3/us.svg"
						alt="🇺🇸"
						active={lang === 'en'}
					/>
					<LangButton
						src="https://raw.githubusercontent.com/lipis/flag-icon-css/master/flags/4x3/fr.svg"
						alt="🇫🇷"
						active={lang === 'fr'}
					/>
				</Raised>
			</motion.div>
			<AnimatePresence>
				{(active || credits) && (
					<RaisedButton
						as={motion.button}
						position="fixed"
						onClick={() => exit(lang)}
						style={{ left: '2rem', top: '2rem', cursor: 'pointer', zIndex: 5 }}
						initial="closed"
						animate="open"
						exit="closed"
						variants={exitButtonAnim}>
						<Cross />
					</RaisedButton>
				)}
			</AnimatePresence>
			<ActivePanel active={active} />
			<CreditsPanel active={credits} onClick={() => setCredits(true)} />
		</>
	);
};

export default Overlay;

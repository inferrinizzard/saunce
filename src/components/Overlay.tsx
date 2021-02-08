import React, { useState, useEffect } from 'react';
import { navigate } from '@reach/router';
import styled from 'styled-components';

import Plus from '@bit/mui-org.material-ui-icons.add-rounded';
import Minus from '@bit/mui-org.material-ui-icons.remove-rounded';
import Cross from '@bit/mui-org.material-ui-icons.close-rounded';

import AutoComplete from './AutoComplete';
import ActivePanel from './ActivePanel';
import CreditsPanel from './CreditsPanel';

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

export interface OverlayProps {
	transform: { scale: number; translation: { x: number; y: number } };
	setTransform: (transform: { scale: number; translation: { x: number; y: number } }) => void;
	active: SauceName;
}

const SEARCHOFF = 'thisisoff';

const Overlay: React.FC<OverlayProps> = ({ transform, setTransform, active }) => {
	const [search, _setSearch] = useState(SEARCHOFF);
	const [display, setDisplay] = useState('');
	const setSearch = (nom: string, dis?: string) => (setDisplay(dis ?? nom), _setSearch(nom.toLowerCase().trim())); // prettier-ignore

	const [credits, setCredits] = useState(false);
	const exit = () => (credits ? setCredits(false) : (navigate('/'), setSearch('')));

	useEffect(() => {
		const keyListener = (e: KeyboardEvent) => (e.key === 'Esc' || e.key === 'Escape') && exit();
		window.addEventListener('keydown', keyListener);
		return () => window.removeEventListener('keydown', keyListener);
	}, []);

	return (
		<>
			<div style={{ position: 'fixed', right: active ? '33.3%' : 0, top: 0, zIndex: 3 }}>
				<AutoComplete {...{ search, setSearch, display, SEARCHOFF }} />
				<Raised
					as="button"
					onClick={() => setTransform({ ...transform, scale: transform.scale + 0.1 })} // lerp this, also unbounded
					style={{ right: '6rem', top: '2rem', cursor: 'zoom-in' }}>
					<Plus />
				</Raised>
				<Raised
					as="button"
					onClick={() => setTransform({ ...transform, scale: transform.scale - 0.1 })} // lerp this, also unbounded
					style={{ right: '2rem', top: '2rem', cursor: 'zoom-out' }}>
					<Minus />
				</Raised>
				<Raised
					as="button"
					position="fixed"
					onClick={() => setCredits(true)}
					style={{ left: '2rem', bottom: '2rem', cursor: 'pointer' }}>
					<h2>Credits</h2>
				</Raised>
			</div>
			{(active || credits) && (
				<Raised
					as="button"
					position="fixed"
					onClick={exit}
					style={{ left: '2rem', top: '2rem', cursor: 'pointer', zIndex: 5 }}>
					<Cross />
				</Raised>
			)}
			<ActivePanel active={active} />
			{credits && <CreditsPanel />}
		</>
	);
};

export default Overlay;

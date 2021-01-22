import React, { useState } from 'react';
import { navigate } from '@reach/router';

import styled from '../util/Styled';
import { deaccent } from '../util/util';

import Plus from '@bit/mui-org.material-ui-icons.add-rounded';
import Minus from '@bit/mui-org.material-ui-icons.remove-rounded';
import Cross from '@bit/mui-org.material-ui-icons.close-rounded';
import Search from '@bit/mui-org.material-ui-icons.search-rounded';

import AutoComplete from './AutoComplete';
import ActivePanel from './ActivePanel';

export const Raised = styled('div')({ shadow: true, position: 'absolute' })`
	position: ${p => p.position};
	min-height: 3rem;
	min-width: 3rem;

	display: flex;
  align-items: center;
	justify-content: center;
	
	background-color: ${p => p.theme.offwhite};
	outline: none;
	border: none;
	border-radius: 0.75rem;
	${p => p.shadow && 'box-shadow: 0.125rem 0.25rem 0.5rem salmon;'}
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

	const setSearch = (nom: string) => (
		setDisplay(nom), _setSearch(deaccent(nom.toLowerCase().trim()))
	);

	return (
		<>
			<div style={{ position: 'fixed', right: active ? '33.3%' : 0, top: 0, zIndex: 3 }}>
				<Raised
					// wait for MUI v5 collapse to do shrink
					as="div"
					style={{ right: '10rem', top: '2rem' }}>
					<div>
						{search !== SEARCHOFF && (
							<Raised
								as="input" // make auto-expand as span?
								placeholder="Search for Sauces!"
								shadow={false}
								position="relative"
								onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
									setSearch(e.currentTarget.value)
								}
								value={display}
								style={{
									display: 'inline-block',
									padding: '0 0 0 0.5rem',
									fontFamily: 'Courgette',
									fontSize: '1.5rem',
									minWidth: '15rem',
								}}
							/>
						)}
						{display && <AutoComplete {...{ search, setSearch }} />}
					</div>
					<Raised
						as="button"
						onClick={() => (search === SEARCHOFF ? setSearch('') : console.log(search))}
						shadow={false}
						position="relative"
						style={{ display: 'inline-flex' }}>
						<Search />
					</Raised>
				</Raised>
				<Raised
					as="button"
					onClick={() => setTransform({ ...transform, scale: transform.scale + 0.1 })} // lerp this, also unbounded
					style={{ right: '6rem', top: '2rem' }}>
					<Plus />
				</Raised>
				<Raised
					as="button"
					onClick={() => setTransform({ ...transform, scale: transform.scale - 0.1 })} // lerp this, also unbounded
					style={{ right: '2rem', top: '2rem' }}>
					<Minus />
				</Raised>
				{active && (
					<Raised
						as="button"
						position="fixed"
						onClick={() => navigate('/')}
						style={{ left: '2rem', top: '2rem' }}>
						<Cross />
					</Raised>
				)}
				<Raised
					as="button"
					position="fixed"
					onClick={() => navigate('/credits')}
					style={{ left: '2rem', bottom: '2rem' }}>
					<h2>Credits</h2>
				</Raised>
			</div>
			{active && <ActivePanel active={active} />}
		</>
	);
};

export default Overlay;

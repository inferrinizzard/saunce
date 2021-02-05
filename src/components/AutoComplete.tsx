import React, { useEffect } from 'react';
import styled from 'styled-components';

import Search from '@bit/mui-org.material-ui-icons.search-rounded';

import { Raised } from './Overlay';
import { nav, deaccent } from '../scripts/util';

import _sauces from '../data/sauce.json';
const sauces = Object.entries(_sauces).reduce(
	(a, [k, v]) => ({ ...a, [deaccent(k)]: { nom: v.nom, key: k } }),
	{}
) as Record<string, { nom: string; key: SauceName }>;

const Item = styled.li`
	list-style: none;
	font-family: ${p => p.theme.font};
	font-size: 1.25rem;
	margin: 0.25rem 0;
	padding-left: 0.5rem;

	&:hover {
		background-color: salmon;
		color: #0003f;
	}
`;

interface AutoCompleteProps {
	search: string;
	setSearch: (s: string, d?: string) => void;
	display: string;
	SEARCHOFF: string;
}

const AutoComplete: React.FC<AutoCompleteProps> = ({ search: _search, setSearch, display, SEARCHOFF }) => {
	const search = deaccent(_search);
	const items = Object.entries(sauces).filter(([k, v]) => k.includes(search) || v.nom.includes(search)); // prettier-ignore
	const found = items.some(([_, v]) => display === v.nom);
	
	const bestGuess = () => items.length && setSearch(items[0][1].key, items[0][1].nom);
	const runSearch = (sauce: string) => (found ? nav(sauce as SauceName) : bestGuess());
	const enterPress = (e: React.KeyboardEvent<Element>) => e.key === 'Enter' && runSearch(_search);

	useEffect(() => {
		document.addEventListener('keydown', (enterPress as unknown) as EventListener, false);
		return () => document.removeEventListener('keydown', (enterPress as unknown) as EventListener, false);
	}, []);

	return (
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
						onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.currentTarget.value)}
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
				{display && !found && (
					<Raised
						as="ul"
						position="absolute"
						style={{
							display: 'block',
							top: '3rem',
							left: 0,
							width: '15rem',
							paddingInlineStart: 0,
							maxHeight: '12rem',
							overflowY: 'auto',
						}}>
						{items.map(([k, v]) => (
							<Item key={k + '-li'} onClick={() => setSearch(v.key, v.nom)}>
								{v.nom}
							</Item>
						))}
					</Raised>
				)}
			</div>
			<Raised
				as="button"
				onClick={() => (search === SEARCHOFF ? setSearch('') : runSearch(_search))}
				shadow={false}
				position="relative"
				style={{ display: 'inline-flex', cursor: 'pointer' }}>
				<Search />
			</Raised>
		</Raised>
	);
};

export default AutoComplete;

import React, { useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

import Search from '@bit/mui-org.material-ui-icons.search-rounded';

import { Raised } from './Overlay';
import { nav, deaccent } from '../scripts/util';

import _sauces from '../data/sauce.json';
const sauces = Object.entries(_sauces).reduce(
	(a, [key, { nom }]) => ({
		...a,
		[deaccent(key)]: { nom, lower: deaccent(nom).toLowerCase(), key },
	}),
	{}
) as Record<string, { nom: string; lower: string; key: SauceName }>;

const Item = styled.li.attrs((p: { sauce: SauceName }) => ({ sauce: p.sauce }))`
	list-style: none;
	font-family: ${p => p.theme.font};
	font-size: 1.25rem;
	margin: 0.25rem 0;
	padding-left: 0.5rem;

	&:hover {
		background-color: ${p => p.theme.colours[p.sauce] || 'salmon'};
		color: #0003f;
	}
`;

const searchBarAnim = (length: number) => ({
	open: {
		width: `${Math.max(15, ((length + 2) / 21) * 17)}rem`,
		padding: '0 0 0 0.5rem',
		transition: { ease: 'easeOut', duration: 0.3 },
	},
	closed: { width: 0, padding: '0 0 0 0', transition: { ease: 'easeIn', duration: 0.25 } },
});

interface AutoCompleteProps {
	search: string;
	setSearch: (s: string, d?: string) => void;
	display: string;
	SEARCHOFF: string;
}

const AutoComplete: React.FC<AutoCompleteProps> = ({
	search: _search,
	setSearch,
	display,
	SEARCHOFF,
}) => {
	const search = deaccent(_search);
	const items = Object.entries(sauces).filter(
		([k, v]) => k.includes(search) || v.lower.includes(search)
	);
	const found = items.some(([_, v]) => display === v.nom);

	const bestGuess = () => items.length && setSearch(items[0][1].key, items[0][1].nom);
	const runSearch = (sauce: string) => (found ? nav(sauce as SauceName) : bestGuess());
	const enterPress = (e: React.KeyboardEvent<Element>) => e.key === 'Enter' && runSearch(_search);

	useEffect(() => {
		document.addEventListener('keydown', (enterPress as unknown) as EventListener, false);
		return () =>
			document.removeEventListener('keydown', (enterPress as unknown) as EventListener, false);
	}, []);

	return (
		<Raised as="div" style={{ right: '16rem', top: '2rem' }}>
			<Raised
				className="search-bar"
				as={motion.input}
				placeholder="Search for Sauces!"
				minWidth="0"
				shadow={false}
				position="relative"
				onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.currentTarget.value)}
				value={display}
				style={{ display: 'inline-block', fontFamily: 'Courgette', fontSize: '1.5rem' }}
				initial="closed"
				animate={search === SEARCHOFF ? 'closed' : 'open'}
				variants={searchBarAnim(search.length)}
			/>
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
						<Item key={k + '-li'} sauce={v.key} onClick={() => setSearch(v.key, v.nom)}>
							{v.nom}
						</Item>
					))}
				</Raised>
			)}
			<Raised
				as="button"
				onClick={() => search && (search === SEARCHOFF ? setSearch('') : runSearch(_search))}
				shadow={false}
				position="relative"
				style={{ display: 'inline-flex', cursor: 'pointer' }}>
				<Search />
			</Raised>
		</Raised>
	);
};

export default AutoComplete;

import React, { useState } from 'react';

import styled from '../util/Styled';

import { Raised } from './Overlay';

import _sauces from '../data/sauce.json';
export const deaccent = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
const sauces = Object.entries(_sauces).reduce(
	(a, [k, v]) => ({
		...a,
		[deaccent(k)]: { nom: v.nom, key: deaccent(v.nom.toLowerCase()) },
	}),
	{}
) as Record<SauceName, { nom: string; key: string }>;

const Item = styled('li')({})`
	list-style: none;
	font-family: Courgette;
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
	setSearch: (s: string) => void;
}

const AutoComplete: React.FC<AutoCompleteProps> = ({ search, setSearch }) => {
	const [found, setFound] = useState(false);
	return (
		(!found && (
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
				{Object.entries(sauces)
					.filter(([k, v]) => k.includes(search) || v.key.includes(search))
					.map(([k, v]) => (
						<Item key={k + '-li'} onClick={() => (setSearch(v.nom), setFound(true))}>
							{v.nom}
						</Item>
					))}
			</Raised>
		)) ||
		null
	);
};

export default AutoComplete;

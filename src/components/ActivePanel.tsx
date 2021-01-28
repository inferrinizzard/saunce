import React, { useState, useEffect } from 'react';
import { nav } from '../scripts/util';
import styled from '../scripts/Styled';

import sauces from '../data/sauce.json';
import filles from '../data/filles.json';
import recipes from '../data/guide.json';

const Panel = styled('div')({ pad: 2.5 })`
	position: fixed;
	right: 0;
	top: 0;
	width: calc(33.3% - ${p => p.pad * 2}rem);
	height: calc(100% - ${p => p.pad}rem);
	z-index: 3;
	background-color: ${p => p.theme.bg};
	border-left 0.125rem solid ${p => p.theme.activeColour};
	padding: ${p => p.pad / 2}rem ${p => p.pad}rem;
`;

const ActiveCard = styled('div')({})`
	border-radius: 1rem;
	padding: 1rem;
	margin-bottom: 1.5rem;
	background-color: ${p => p.theme.offwhite};
	box-shadow: 0.5rem 0.5rem 0 ${p => p.theme.activeColour};

	> h2 {
		margin: 0;
	}

	> hr {
		height: 3px;
		border: none;
		background-color: ${p => p.theme.activeColour};
	}
`;

const Chip = styled('span')({})`
	border-radius: 1rem;
	display: inline-block;
	font-family: ${p => p.theme.font};
	border: 0.125rem solid ${p => p.theme.activeColour};
	margin: 0.25rem;
	padding: 0.375rem;
	cursor: pointer;

	&:hover {
		background-color: ${p => p.theme.activeColour};
	}
`;

const Row = styled('hr')({})` border: 0.125rem solid ${p => p.theme.activeColour};`;

export interface ActivePanelProps {
	active: SauceName;
}

const ActivePanel: React.FC<ActivePanelProps> = ({ active }) => {
	const [data, setData] = useState({
		recipe: 'Recipe Here',
		links: ['Links Here'],
	});

	// useEffect(() => import('').then(() => setData({})), []);
	const mères = Object.entries(filles).reduce(
		(a, [k, v]) => (v.includes(active) ? ([...a, k] as SauceName[]) : a),
		[] as SauceName[]
	);
	const activeFilles =
		filles[active as keyof typeof filles]?.reduce(
			(a, f) =>
				[...a, { fille: f, nom: sauces[f as keyof typeof sauces].nom }] as {
					fille: SauceName;
					nom: string;
				}[],
			[] as { fille: SauceName; nom: string }[]
		) ?? [];

	return (
		<Panel>
			<ActiveCard as="h1">{sauces[active].nom}</ActiveCard>
			<Row />
			<ActiveCard>
				<h2>Recipe</h2>
				<hr />
				{(recipes[(active as unknown) as keyof typeof recipes]?.recette ?? sauces[active].nom)
					.split('\n')
					.map((line, i) => (
						<h4 key={`${active}-recipes-${i}`}>{line}</h4>
					))}
			</ActiveCard>
			{!!mères.length && (
				<ActiveCard>
					<h2 style={{ display: 'inline-block' }}>Derived From: </h2>
					{mères.map(m => (
						<Chip key={m + '-mère'} onClick={() => nav(m)}>
							{sauces[m as keyof typeof sauces].nom}
						</Chip>
					))}
				</ActiveCard>
			)}
			{!!activeFilles.length && (
				<ActiveCard>
					<h2>Daughters</h2>
					<hr />
					{activeFilles?.map(({ fille, nom }) => (
						<Chip key={fille + '-chip'} onClick={() => nav(fille)}>
							{nom}
						</Chip>
					))}
				</ActiveCard>
			)}
			<ActiveCard>
				<h2>Links</h2>
				<hr />
				{data.links.map((link, i) => (
					<h4 key={`${active}-link${i}`}>{link}</h4>
				))}
			</ActiveCard>
		</Panel>
	);
};

export default ActivePanel;

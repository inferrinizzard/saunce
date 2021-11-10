import React, { useState, useEffect, useContext } from 'react';
import styled, { ThemeContext } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

import type { translate as TranslateFunction } from '../types/translate.types';
import { setCORS, translate as browserTranslate } from 'google-translate-api-browser';
const translate = setCORS('https://inferrinizzard-cors.herokuapp.com/') as (
	...params: Parameters<typeof browserTranslate>
) => ReturnType<TranslateFunction>;

import { nav } from '../scripts/util';
import SaucesEn from '../data/sauces.en.json';
import SaucesFr from '../data/sauces.fr.json';
import filles from '../data/filles.json';
import recipes from '../data/guide.json';

import { LangContext } from '../pages/App';
import Ingredient from './Ingredient';

// * styled components
const Panel = styled.div.attrs({ pad: 2.5 })`
	position: fixed;
	right: 0;
	top: 0;
	height: calc(100% - ${p => p.pad}rem);
	z-index: 3;
	background-color: ${p => p.theme.bg};
	border-left 0.125rem solid ${p => p.theme.activeColour};
	overflow-y: auto;
`;

const ActiveCard = styled.div`
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

export const Chip = styled.span`
	border-radius: 1rem;
	display: inline-block;
	font-family: ${p => p.theme.font};
	border: 0.125rem solid ${p => p.theme.activeColour};
	margin: 0.25rem;
	padding: 0.375rem;
	cursor: pointer;

	&:hover {
		color: ${p => p.theme.offwhite};
		background-color: ${p => p.theme.activeColour};
	}
`;

export const Row = styled.hr`
	border: 0.125rem solid ${p => p.theme.activeColour};
`;

// * motion anim JSS
const panelPad = (Panel.attrs[0] as { pad: number }).pad;
export const slideDuration = 0.35;
const panelAnim = {
	open: {
		width: `calc(33.3% - ${panelPad * 2}rem)`,
		padding: `${panelPad / 2}rem ${panelPad}rem`,
		transition: { duration: slideDuration, ease: 'easeOut' },
	},
	closed: {
		width: 0,
		padding: `${panelPad / 2}rem 0rem`,
		transition: { duration: slideDuration, ease: 'easeIn' },
	},
};
const fadeLeft = {
	open: { opacity: 1, x: 0, transition: { duration: 0.6, staggerChildren: 0.15 } },
	closed: { opacity: 0, x: 100, transition: { duration: slideDuration } },
};

export interface ActivePanelProps {
	active: SauceName;
}

const ActivePanel: React.FC<ActivePanelProps> = ({ active }) => {
	const lang = useContext(LangContext);
	const theme = useContext(ThemeContext);
	const [data, setData] = useState({
		recipe: 'Recipe Here',
		links: ['Links Here'],
	});

	const sauces: SauceList = lang === 'fr' ? SaucesFr : SaucesEn;

	useEffect(() => {
		if (active)
			if (lang === 'fr')
				setData({
					recipe:
						recipes[(active as unknown) as keyof typeof recipes]?.recette ?? sauces[active].nom,
					links: ['Liens ici'],
				});
			else {
				setData({
					recipe: 'Translating Recipe...',
					links: ['Links here'],
				});
				translate(
					recipes[(active as unknown) as keyof typeof recipes]?.recette ?? sauces[active].nom,
					{ from: 'fr', to: 'en' }
				)
					.then(recipe => setData({ recipe: recipe.text, links: ['Links here'] }))
					.catch(() => setData({ recipe: 'Translation unavailable', links: [] }));
			}
	}, [active, lang]);
	const mères = Object.entries(filles).reduce(
		(a, [k, v]) => (v.includes(active) ? ([...a, k] as SauceName[]) : a),
		[] as SauceName[]
	);
	type FilleList = { fille: SauceName; nom: string }[];
	const activeFilles =
		filles[active as keyof typeof filles]?.reduce(
			(a, f) => [...a, { fille: f, nom: sauces[f as SauceName].nom }] as FilleList,
			[] as FilleList
		) ?? [];

	return (
		<AnimatePresence>
			{active && (
				<Panel as={motion.div} initial="closed" animate="open" exit="closed" variants={panelAnim}>
					<AnimatePresence exitBeforeEnter>
						<motion.div
							initial="closed"
							animate="open"
							exit="closed"
							key={`activeCards-${active}`}
							variants={fadeLeft}>
							<ActiveCard as={motion.div} variants={fadeLeft}>
								{<h1>{sauces[active].nom}</h1>}
								{'autrenom' in sauces[active] && (
									<h3 style={{ margin: 0 }}>{`${lang === 'fr' ? 'ou' : 'aka'} ${
										(sauces[active] as Sauce).autrenom
									}`}</h3>
								)}
								<div>
									{sauces[active].ingredients.map((i, k) => (
										<Ingredient
											key={k}
											name={i}
											lang={lang ?? 'en'}
											colour={theme.activeColour}
											count={sauces[active].ingredients.length}
										/>
									))}
								</div>
							</ActiveCard>
							<Row as={motion.hr} variants={fadeLeft} />
							<ActiveCard as={motion.div} variants={fadeLeft}>
								<h2>{lang === 'fr' ? 'Recette' : 'Recipe'}</h2>
								<hr />
								{data.recipe.split('\n').map((line, i) => (
									<h4 key={`${active}-recipes-${i}`}>{line}</h4>
								))}
							</ActiveCard>
							<motion.div variants={fadeLeft}>
								{!!mères.length && (
									<ActiveCard>
										<h2 style={{ display: 'inline-block' }}>{`${
											lang === 'fr' ? 'Dérivée de' : 'Derived From'
										}: `}</h2>
										{mères.map(m => (
											<Chip key={m + '-mère'} onClick={() => nav(m)}>
												{sauces[m as SauceName].nom}
											</Chip>
										))}
									</ActiveCard>
								)}
							</motion.div>
							<motion.div variants={fadeLeft}>
								{!!activeFilles.length && (
									<ActiveCard>
										<h2>{lang === 'fr' ? 'Filles' : 'Daughters'}</h2>
										<hr />
										{activeFilles?.map(({ fille, nom }) => (
											<Chip key={fille + '-chip'} onClick={() => nav(fille)}>
												{nom}
											</Chip>
										))}
									</ActiveCard>
								)}
							</motion.div>
							<ActiveCard as={motion.div} variants={fadeLeft}>
								<h2>{lang === 'fr' ? 'Liens' : 'Links'}</h2>
								<hr />
								{data.links.map((link, i) => (
									<h4 key={`${active}-link${i}`}>{link}</h4>
								))}
							</ActiveCard>
						</motion.div>
					</AnimatePresence>
				</Panel>
			)}
		</AnimatePresence>
	);
};

export default ActivePanel;

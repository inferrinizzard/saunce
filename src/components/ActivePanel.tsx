import React, { useState, useEffect, useContext } from 'react';
import styled, { ThemeContext } from 'styled-components';
import { Transition } from 'react-transition-group';
import { globalHistory } from '@reach/router';
import { Fade, Slide } from 'react-awesome-reveal';

import { nav } from '../scripts/util';
import SaucesEn from '../data/sauces.en.json';
import SaucesFr from '../data/sauces.fr.json';
import filles from '../data/filles.json';
import recipes from '../data/guide.json';

import Ingredient from './Ingredient';

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
		background-color: ${p => p.theme.activeColour};
	}
`;

const Row = styled.hr`
	border: 0.125rem solid ${p => p.theme.activeColour};
`;

export interface ActivePanelProps {
	active: SauceName;
	lang: string;
}

const ActivePanel: React.FC<ActivePanelProps> = ({ active, lang }) => {
	const theme = useContext(ThemeContext);
	const [data, setData] = useState({
		recipe: 'Recipe Here',
		links: ['Links Here'],
	});

	const sauces: SauceList = lang === 'fr' ? SaucesFr : SaucesEn;

	// useEffect(() => import('').then(() => setData({})), []);
	const mères = Object.entries(filles).reduce(
		(a, [k, v]) => (v.includes(active) ? ([...a, k] as SauceName[]) : a),
		[] as SauceName[]
	);
	const activeFilles =
		filles[active as keyof typeof filles]?.reduce(
			(a, f) =>
				[...a, { fille: f, nom: sauces[f as SauceName].nom }] as {
					fille: SauceName;
					nom: string;
				}[],
			[] as { fille: SauceName; nom: string }[]
		) ?? [];

	const panelPad = (Panel.attrs[0] as { pad: number }).pad;
	return (
		<Transition in={!!active} mountOnEnter unmountOnExit timeout={350}>
			{state =>
				active && (
					<Panel
						style={{
							width:
								state === 'entered' || state === 'exiting' ? `calc(33.3% - ${panelPad * 2}rem)` : 0,
							padding:
								state === 'entered' || state === 'exiting'
									? `${panelPad / 2}rem ${panelPad}rem`
									: 0,
							transition: (ease => `width 350ms ease-${ease}, padding 350ms ease-${ease}`)(
								state.includes('enter') ? 'out' : 'in'
							),
						}}>
						<Fade
							direction="right"
							cascade
							triggerOnce
							delay={350}
							damping={5 / 35 / 2}
							duration={800}>
							<ActiveCard as="div">
								<h1>{sauces[active].nom}</h1>
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
							<Row />
							<ActiveCard>
								<h2>{lang === 'fr' ? 'Recette' : 'Recipe'}</h2>
								<hr />
								{(
									recipes[(active as unknown) as keyof typeof recipes]?.recette ??
									sauces[active].nom
								)
									.split('\n')
									.map((line, i) => (
										<h4 key={`${active}-recipes-${i}`}>{line}</h4>
									))}
							</ActiveCard>
							<div>
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
							</div>
							<div>
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
							</div>
							<ActiveCard>
								<h2>{lang === 'fr' ? 'Liens' : 'Links'}</h2>
								<hr />
								{data.links.map((link, i) => (
									<h4 key={`${active}-link${i}`}>{link}</h4>
								))}
							</ActiveCard>
						</Fade>
					</Panel>
				)
			}
		</Transition>
	);
};

export default ActivePanel;

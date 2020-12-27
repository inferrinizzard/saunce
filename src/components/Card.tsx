import React, { useEffect } from 'react';

import styled from '../util/Styled';
import { lighten } from 'polished';

import sauces from '../data/sauce.json';
type Sauce = { nom: string; desc: string; ingredients: string[]; temp?: string };
import Ingredient from './Ingredient';

let ceilToNearestFive = (x: number) => Math.ceil(x / 5) * 5;
let smoothPhi = (x: number) => ceilToNearestFive(x * 1.618) - x * 1.618;
const margins = { top: 70, right: 90, bottom: 130, left: 60 };
const cardSize = 250;

// margin border
// &::before {
// 	content: '';
// 	position: absolute;
// 	${p => Object.entries(p.margins).reduce((a, [k, v]) => `${a}\n${k}: -${v}px;`, '')}
// 	border: 1px solid #000;
// }

let StyledCard = styled('div')({
	size: cardSize,
	shadowSize: 20,
	margins: margins,
})`
	display: block;
	position: fixed;
	left: ${p => p.pos.x}px;
	top: ${p => p.pos.y}px;
	height: ${p => p.size}px;
	width: ${p => 1.618 * p.size}px;
	background-color: ${p => p.theme.offwhite};
	margin: ${p => Object.entries(p.margins).reduce((a, c) => a + c + 'px ', '')};
	
	border-radius: ${p => smoothPhi(p.size) + 20}px;
	box-shadow: ${p => smoothPhi(p.size) + 20}px ${p => smoothPhi(p.size) + 20}px 0px 0px ${p =>
	lighten(0.05, p.accentColour)};
	
	div {
		padding: 20px;
		
		h1 {
			margin: 0;
			font-size: ${p => p.size / 6}px;
		}

		h2 {
			margin: 0;
			font-size: ${p => p.size / 10}px;
		}

		hr {
			height: 3px;
			border: none;
			background-color: ${'accentColour'}
		}
	}
`;

export type Pos = { x: number; y: number };

export interface CardProps {
	name: keyof typeof sauces;
	pos: Pos; // top-left corner of card, pre-margin
	attach?: (sauce: string, pos: { in: Pos; out: Pos }) => void;
}

// enter: pos + (size * 1.618 / 2, 0)
// exit: pos + (size * 1.618 / 2, size)
const Card: React.FC<CardProps> = ({ name, pos, attach }) => {
	const sauce = sauces[name] as Sauce;
	let colour = 'salmon';

	useEffect(
		() => (
			attach &&
				attach(name, {
					in: { x: pos.x + (cardSize * 1.618) / 2, y: pos.y },
					out: { x: pos.x + (cardSize * 1.618) / 2, y: pos.y + cardSize },
				}),
			console.log(name, pos, {
				in: { x: pos.x + (cardSize * 1.618) / 2, y: pos.y },
				out: { x: pos.x + (cardSize * 1.618) / 2, y: pos.y + cardSize },
			})
		),
		[]
	);

	return (
		<StyledCard accentColour={colour} pos={pos}>
			<div className="card-content">
				<h1>{sauce.nom}</h1>
				<hr />
				<h2>{sauce.desc}</h2>
				{sauce.ingredients.map((i, k) => (
					<Ingredient key={k} name={i} colour={colour} />
				))}
			</div>
		</StyledCard>
	);
};

export default Card;

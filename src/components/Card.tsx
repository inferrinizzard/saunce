import React, { useEffect } from 'react';

import styled from '../util/Styled';
import { lighten } from 'polished';

import Sauces from '../data/sauce.json';
type Sauce = { nom: string; desc: string; ingredients: string[]; temp?: string };
import Ingredient from './Ingredient';

let ceilToNearestFive = (x: number) => Math.ceil(x / 5) * 5;
let smoothPhi = (x: number) => ceilToNearestFive(x * 1.618) - x * 1.618;
const phi = 1.618;
const cardSize = 250;

// margin border
// &::before {
// 	content: '';
// 	position: absolute;
// 	${p => Object.entries(p.margins).reduce((a, [k, v]) => `${a}\n${k}: -${v}px;`, '')}
// 	border: 1px solid #000;
// }

let StyledCard = styled('section')({
	size: cardSize,
	shadowSize: 20,
})`
	display: block;
	position: fixed;
	left: ${p => p.pos.x.toString()}px;
	top: ${p => p.pos.y.toString()}px;
	height: ${p => p.size}px;
	width: ${p => phi * p.size}px;
	background-color: ${p => p.theme.offwhite};
	
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
export type SauceName = keyof typeof Sauces;
export interface CardProps {
	name: SauceName;
	pos: Pos; // top-left corner of card, pre-margin
	attach?: (sauce: SauceName, pos: { in: Pos; out: Pos }) => void;
}

const cardBlockSize: Pos = { x: 525, y: 400 };
// enter: pos + (size * phi / 2, 0)
// exit: pos + (size * phi / 2, size)
const Card: React.FC<CardProps> = ({ name, pos, attach }) => {
	const sauce = Sauces[name] as Sauce;
	let colour = 'salmon';
	pos = { x: pos.x * cardBlockSize.x, y: pos.y * cardBlockSize.y };

	useEffect(
		() =>
			attach &&
			attach(name, {
				in: { x: pos.x + (cardSize * phi) / 2, y: pos.y },
				out: { x: pos.x + (cardSize * phi) / 2, y: pos.y + cardSize },
			}),
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

import React from 'react';

import styled from '../util/Styled';
import { lighten } from 'polished';

import sauces from '../data/sauce.json';
type Sauce = { nom: string; desc: string; ingredients: string[]; temp?: string };
import Ingredient, { IngredientName } from './Ingredient';

let ceilToNearestFive = (x: number) => Math.ceil(x / 5) * 5;
let smoothPhi = (x: number) => ceilToNearestFive(x * 1.618) - x * 1.618;

let StyledCard = styled('div')({ size: 250, shadowSize: 20 })`
	display: block;
	position: fixed;
	left: ${p => p.pos.x}px;
	top: ${p => p.pos.y}px;
	height: ${p => p.size}px;
	width: ${p => 1.618 * p.size}px;
	background-color: ${p => p.theme.offwhite};
	margin: 40px 75px 80px 45px;
	
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

type Pos = { x: number; y: number };

export interface CardProps {
	name: keyof typeof sauces;
	pos: Pos;
}

const Card: React.SFC<CardProps> = ({ name, pos }) => {
	const sauce = sauces[name] as Sauce;
	return (
		<StyledCard accentColour="salmon" pos={pos}>
			<div className="card-content">
				<h1>{sauce.nom}</h1>
				<hr />
				<h2>{sauce.desc}</h2>
				{sauce.ingredients.map((i, k) => (
					<Ingredient key={k} name={i as IngredientName} colour={'#fb968b'} />
				))}
			</div>
		</StyledCard>
	);
};

export default Card;

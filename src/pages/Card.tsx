import React from 'react';

import styled from '../util/Styled';
import { lighten } from 'polished';

import sauces from '../data/sauce.json';
import Ingredient, { IngredientName } from './Ingredient';

let StyledCard = styled('div')({ height: 250 })`
	display: block;
	height: ${p => p.height}px;
	width: ${p => 1.618 * p.height}px;
	background-color: ${p => p.theme.offwhite};
	margin: 2em;
	
	border-radius: 20px;
	box-shadow: 20px 20px 0px 0px ${p => lighten(0.05, p.accentColour)};
	
	div {
		padding: 20px;
		
		h1 {
			margin: 0;
			font-size: ${p => p.height / 6}px;
		}

		hr {
			height: 3px;
			border: none;
			background-color: ${'accentColour'}
		}
	}
`;

export interface CardProps {
	name: keyof typeof sauces;
}

const Card: React.SFC<CardProps> = ({ name }) => {
	const sauce = sauces[name];
	return (
		<StyledCard accentColour="salmon">
			<div className="card-content">
				<h1>{sauce.nom}</h1>
				<hr />
				{/* {sauce.ingredients.map((i, k) => ( */}
				{(sauce.ingredients as string[]).map((i, k) => (
					<Ingredient key={k} name={i as IngredientName} colour={'#fb968b'} />
				))}
			</div>
		</StyledCard>
	);
};

export default Card;

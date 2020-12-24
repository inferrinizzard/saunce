import React from 'react';

import styled from './Styled';
import { lighten } from 'polished';

let StyledCard = styled('div')({ height: 250 })`
	display: block;
	height: ${p => p.height}px;
	width: ${p => 1.618 * p.height}px;
	background-color: ${p => p.theme.offwhite};

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

		.ingredient {
			
		}
	}

`;

export interface CardProps {
	name: string;
	ingredients: string[];
}

const Card: React.SFC<CardProps> = ({ name, ingredients }) => {
	return (
		<StyledCard accentColour="salmon">
			<div className="card-content">
				<h1>{name}</h1>
				<hr />
				{ingredients.map((i, k) => (
					<div key={k} className="ingredient" />
				))}
			</div>
		</StyledCard>
	);
};

export default Card;

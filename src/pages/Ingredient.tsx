import React from 'react';

// @ts-ignore: @bit components
import Tooltip from '@bit/mui-org.material-ui.tooltip';

import styled from '../util/Styled';
import ShiftColour from '../util/ColorShift';

import { list as ingredientsList } from '../data/ingredients.json';
export type IngredientName = keyof typeof ingredientsList;

export interface IngredientProps {
	name: IngredientName;
	colour: string;
}

const IngredientIcon = styled('img')({ pad: 10 })`
	${p => ShiftColour(p.colour)}
	padding: ${'pad'}px;
`;

const Ingredient: React.FC<IngredientProps> = ({ name, colour }) => {
	const missing = 'https://www.svgrepo.com/show/33204/dish.svg';
	return (
		<Tooltip title={name[0].toUpperCase() + name.slice(1)}>
			<IngredientIcon
				src={ingredientsList[name]?.url || missing}
				height="50px"
				width="50px"
				colour={colour}
			/>
		</Tooltip>
	);
};

export default Ingredient;

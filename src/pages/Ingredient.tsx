import React from 'react';
import styled from '../util/Styled';

import ShiftColour from '../util/ColorShift';

import { list as ingredientsList } from '../data/ingredients.json';
// const ingredientsList = ingredients.list;
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
	return (
		<IngredientIcon src={ingredientsList[name].url} height="40px" width="40px" colour={colour} />
	);
};

export default Ingredient;

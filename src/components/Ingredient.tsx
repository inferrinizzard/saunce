import React from 'react';
import styled from 'styled-components';

import Tooltip from '@bit/mui-org.material-ui.tooltip';

import { list as ingredientsList } from '../data/ingredients.json';
// type ArrayElement<ArrayType extends readonly unknown[]> = ArrayType[number];
// export type IngredientName = ArrayElement<typeof ingredientsList>;

export interface IngredientProps {
	name: string;
	colour: string;
	count: number;
}

const IngredientIcon = styled.span<{ colour: string; size: number; pad: number }>`
	padding: ${p => p.pad}px;
	color: ${p => p.colour};
	font-size: ${p => p.size}px;
`;

const Ingredient: React.FC<IngredientProps> = ({ name, colour, count }) => {
	return (
		<Tooltip title={name[0].toUpperCase() + name.slice(1)} placement="bottom">
			<IngredientIcon
				className={`ingredient-${
					ingredientsList.includes(name)
						? name
						: window.location.hash.includes('en')
						? 'missing'
						: 'absent'
				}`}
				colour={colour}
				size={45 + +(count > 6 && -count + 6) * 2}
				pad={5 + +(count > 6 && -count + 6)}
			/>
		</Tooltip>
	);
};

export default Ingredient;

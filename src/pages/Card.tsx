import React from 'react';
import pureStyled from 'styled-components';
import { styled } from './Styled';

const StyledCard = pureStyled.div``;

const StyledBar = pureStyled.hr``;

let Test = styled(StyledCard)({ red: '#ff0000' })`
	color: ${'red'};
	background-color: ${p => p.blue};
`;

export interface CardProps {}

const Card: React.SFC<CardProps> = () => {
	return (
		<div>
			<Test blue="#00f">styled</Test>
		</div>
	);
};

export default Card;

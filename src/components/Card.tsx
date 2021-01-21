import React, { useEffect } from 'react';
import { navigate } from '@reach/router';

import styled from '../util/Styled';
import { lighten } from 'polished';

import Sauces from '../data/sauce.json';

import Ingredient from './Ingredient';
import Buttons from './Buttons';

const phi = 1.618;
export const cardSize = 250;
let ceilToNearestFive = (x: number) => Math.ceil(x / 5) * 5;
let smoothPhi = (x: number) => ceilToNearestFive(x * phi) - x * phi;

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
			font-size: ${p => p.size / 7}px;

			&.aux {
				padding-left: 7.5px;
				padding-right: 7.5px;
				font-size: ${p => p.size / 8}px;
			}
		}

		h2 {
			margin: 0;
			font-size: ${p => p.size / (p?.textScale ?? 11)}px;
		}

		hr {
			height: 3px;
			border: none;
			background-color: ${'accentColour'}
		}
	}
`;

export const CardBlockSize: Pos = { x: ceilToNearestFive(cardSize * phi) + 120, y: cardSize + 150 }; // 525, 400

export interface CardProps {
	name: SauceName;
	pos: Pos; // top-left corner of card, pre-margin
	attach: (sauce: Card, force?: boolean) => void;
	colour?: string;
}

export interface CardState {
	pos: Pos;
}

class Card extends React.Component<CardProps, CardState> {
	state = {
		pos: { x: this.props.pos.x * CardBlockSize.x, y: this.props.pos.y * CardBlockSize.y },
	};

	name = this.props.name;
	sauce = Sauces[this.props.name] as Sauce;
	colour = this.props.colour ?? 'salmon';
	in = { x: this.state.pos.x + (cardSize * phi) / 2, y: this.state.pos.y };
	out = { x: this.state.pos.x + (cardSize * phi) / 2, y: this.state.pos.y + cardSize };

	componentDidMount() {
		this.props.attach(this);
	}

	render() {
		return (
			<StyledCard
				accentColour={this.colour}
				pos={this.state.pos}
				textScale={(this.name === 'tortue' && 14) || (this.sauce.desc.length > 100 && 12)}
				onClick={(e: MouseEvent) =>
					!e.defaultPrevented && navigate('/#' + this.name.replace(/\s/, '_'))
				}>
				<div className="card-content">
					{(split =>
						split ? (
							(([a, b]) => [a, split, b])(this.sauce.nom.split(split)).map((frag, i) => (
								<h1
									key={`${this.name} ${frag}`}
									className={i == 1 ? 'aux' : ''}
									style={{ display: 'inline-block' }}>
									{i == 1 ? ` ${frag} ` : frag}
								</h1>
							))
						) : (
							<h1>{this.sauce.nom}</h1>
						))(this.sauce.nom.match(/\s(à(\sla)?|aux?|de)\s/g)?.pop())}
					<hr />
					<h2>
						{this.sauce.desc.length > 90 ? this.sauce.desc.replace(/\s\+/g, ',') : this.sauce.desc}
					</h2>
					<div style={{ position: 'absolute', bottom: 0, left: 0 }}>
						{this.sauce.ingredients.map((i, k) => (
							<Ingredient
								key={k}
								name={i}
								colour={this.colour}
								count={this.sauce.ingredients.length}
							/>
						))}
					</div>
				</div>
			</StyledCard>
		);
	}
}

export default Card;

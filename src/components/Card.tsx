import React, { useEffect } from 'react';

import styled from '../util/Styled';
import { lighten } from 'polished';

import Sauces from '../data/sauce.json';
type Sauce = { nom: string; desc: string; ingredients: string[]; temp?: string };
import Ingredient from './Ingredient';

import Buttons from './Buttons';

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
export const CardBlockSize: Pos = { x: 525, y: 400 };

export interface CardProps {
	name: SauceName;
	pos: Pos; // top-left corner of card, pre-margin
	attach: (sauce: Card, force?: boolean) => void;
	colour?: string;
}

export interface CardState {
	pos: Pos;
	active: number;
}

class Card extends React.Component<CardProps, CardState> {
	state = {
		pos: { x: this.props.pos.x * CardBlockSize.x, y: this.props.pos.y * CardBlockSize.y },
		active: 0,
	};

	name = this.props.name;
	sauce = Sauces[this.props.name] as Sauce;
	colour = this.props.colour ?? 'salmon';
	in = { x: this.state.pos.x + (cardSize * phi) / 2, y: this.state.pos.y };
	out = { x: this.state.pos.x + (cardSize * phi) / 2, y: this.state.pos.y + cardSize };
	force = false;

	arrowKeys = (key: string) => {
		let delta: Pos = { x: 0, y: 0 };
		switch (key) {
			case 'ArrowLeft':
				delta.x = -1;
				break;
			case 'ArrowRight':
				delta.x = 1;
				break;
			case 'ArrowDown':
				delta.y = 1;
				break;
			case 'ArrowUp':
				delta.y = -1;
				break;
		}

		let pos = {
			x: this.state.pos.x + CardBlockSize.x * delta.x,
			y: this.state.pos.y + CardBlockSize.y * delta.y,
		};
		this.setState({ pos });
		this.in = { x: pos.x + (cardSize * phi) / 2, y: pos.y };
		this.out = { x: pos.x + (cardSize * phi) / 2, y: pos.y + cardSize };
		this.props.attach(this, true);
	};

	arrowListener = (e: KeyboardEvent) =>
		e.key.includes('Arrow') && this.state.active && this.arrowKeys(e.key);

	componentDidMount() {
		this.props.attach(this);
		window.addEventListener('keydown', this.arrowListener);
	}

	componentWillUnmount() {
		window.removeEventListener('keydown', this.arrowListener);
	}

	componentDidUpdate() {
		if (this.force) {
			this.force = false;
			this.props.attach(this, true);
		}
	}

	render() {
		return (
			<StyledCard
				accentColour={this.state.active ? 'cornflowerblue' : this.colour}
				pos={this.state.pos}
				onClick={(e: MouseEvent) => (
					e.stopPropagation(), this.setState({ active: this.state.active ? 0 : 1 })
				)}>
				<div className="card-content">
					<h1>{this.sauce.nom}</h1>
					<hr />
					<h2>{this.sauce.desc}</h2>
					{this.sauce.ingredients.map((i, k) => (
						<Ingredient key={k} name={i} colour={this.colour} />
					))}
				</div>
				{this.state.active > 0 && (
					<Buttons
						pos={this.state.pos}
						setPos={(pos: Pos) => {
							this.setState({ pos: pos, active: 2 });
							this.force = true;
							this.in = { x: pos.x + (cardSize * phi) / 2, y: pos.y };
							this.out = { x: pos.x + (cardSize * phi) / 2, y: pos.y + cardSize };
						}}
					/>
				)}
			</StyledCard>
		);
	}
}

export default Card;

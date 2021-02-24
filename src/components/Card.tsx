import React, { useEffect } from 'react';
import styled from 'styled-components';
import { lighten } from 'polished'; // I kinda don't want you

import { nav } from '../scripts/util';
import SaucesEn from '../data/sauces.en.json';
import SaucesFr from '../data/sauces.fr.json';

import Ingredient from './Ingredient';

const phi = 1.618;
export const cardSize = 250;
let ceilToNearestFive = (x: number) => Math.ceil(x / 5) * 5;
let smoothPhi = (x: number) => ceilToNearestFive(x * phi) - x * phi;

const StyledCard = styled('section').attrs({
	size: cardSize,
	shadowSize: 20,
})<{ pos: Pos; accentColour: string; textScale?: number }>`
	display: block;
	position: fixed;
	left: ${p => p.pos.x.toString()}px;
	top: ${p => p.pos.y.toString()}px;
	height: ${p => p.size}px;
	width: ${p => phi * p.size}px;
	background-color: ${p => p.theme.offwhite};

	border-radius: ${p => smoothPhi(p.size) + 20}px;
	box-shadow: ${p => smoothPhi(p.size) + 20}px ${p => smoothPhi(p.size) + 20}px 0px 0px
		${p => lighten(0.05, p.accentColour)};

	&:hover {
		border: 2px solid ${p => p.accentColour};
	}

	div {
		cursor: pointer;
		padding: 20px;

		h1 {
			margin: 0;
			font-size: ${p => p.size / 7.1}px;

			&.aux {
				padding-left: 7.5px;
				padding-right: 7.5px;
				font-size: ${p => p.size / 8}px;
			}
		}

		h2 {
			margin: 0;
			font-size: ${p => p.size / (p.textScale ?? 11)}px;
		}

		hr {
			height: 3px;
			border: none;
			background-color: ${'accentColour'};
		}
	}
`;

export const CardBlockSize: Pos = { x: ceilToNearestFive(cardSize * phi) + 120, y: cardSize + 150 }; // 525, 400

export interface CardProps {
	name: SauceName;
	lang: string;
	pos: Pos; // top-left corner of card, pre-margin
	attach: (sauce: Card, force?: boolean) => void;
	colour?: string;
}

export interface CardState {
	pos: Pos;
	sauce: Sauce;
}

class Card extends React.Component<CardProps, CardState> {
	state = {
		pos: { x: this.props.pos.x * CardBlockSize.x, y: this.props.pos.y * CardBlockSize.y },
		sauce: (this.props.lang === 'en' ? SaucesEn : SaucesFr)[this.props.name] as Sauce,
	};

	name = this.props.name;
	colour = this.props.colour ?? 'salmon';
	in = { x: this.state.pos.x + (cardSize * phi) / 2, y: this.state.pos.y };
	out = { x: this.state.pos.x + (cardSize * phi) / 2, y: this.state.pos.y + cardSize };

	componentDidMount() {
		this.props.attach(this);
	}
	static getDerivedStateFromProps = ({ lang, name }: CardProps) => ({
		sauce: (lang === 'en' ? SaucesEn : SaucesFr)[name] as Sauce,
	});

	render() {
		return (
			<StyledCard
				accentColour={this.colour}
				pos={this.state.pos}
				textScale={
					(this.state.sauce.desc.length > 90 &&
						12 + Math.floor((this.state.sauce.desc.length - 90) / 25)) ||
					undefined
				}
				onClick={e => !e.defaultPrevented && nav(this.name)}>
				<div className="card-content">
					{(split =>
						split ? (
							(([a, b]) => [a, split, b])(this.state.sauce.nom.split(split)).map((frag, i) => (
								<h1
									key={`${this.name} ${frag}`}
									className={i == 1 ? 'aux' : ''}
									style={{ display: 'inline-block' }}>
									{i == 1 ? ` ${frag} ` : frag}
								</h1>
							))
						) : (
							<h1>{this.state.sauce.nom}</h1>
						))(this.state.sauce.nom.match(/\s(à(\sla)?|aux?|de)\s/g)?.pop())}
					<hr />
					<h2>
						{this.state.sauce.desc.length > 90
							? this.state.sauce.desc.replace(/\s\+/g, ',')
							: this.state.sauce.desc}
					</h2>
					<div style={{ position: 'absolute', bottom: 0, left: 0 }}>
						{this.state.sauce.ingredients.map((i, k) => (
							<Ingredient
								key={k}
								name={i}
								lang={this.props.lang}
								colour={this.colour}
								count={this.state.sauce.ingredients.length}
							/>
						))}
					</div>
				</div>
			</StyledCard>
		);
	}
}

export default Card;

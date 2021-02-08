import React, { useState, useContext } from 'react';
import { ThemeContext } from 'styled-components';

import Positions from '../data/pos.json';
import filles from '../data/filles.json';

import Card, { CardBlockSize } from './Card';
import Arrow from './Arrow';

export interface MainProps {
	active: SauceName;
	lang: string;
	transform: { scale: number; translation: Pos };
}

const Main: React.FC<MainProps> = ({ active, lang, transform }) => {
	const [cards, setCards] = useState({} as { [k: string]: Card });
	const linkCard = (sauce: Card) =>
		!cards[sauce.name] && setCards(prev => ({ ...prev, [sauce.name]: sauce }));

	const arrowExceptions: Partial<Record<SauceName, number>> = { 'bonnefoy': 4, 'vin blanc': 4 };
	const colours = useContext(ThemeContext).colours;

	let visible = Object.entries(Positions).filter(([_, pos]) =>
		(({ x: cx, y: cy }, { scale, translation: { x, y } }, { innerWidth, innerHeight }) =>
			pos.x * cx * scale <= -x + innerWidth && (pos.x + 1) * cx * scale >= -x &&
			pos.y * cy * scale <= -y + innerHeight && (pos.y + 1) * cy * scale >= -y
		)(CardBlockSize, transform, window)
	);
	const arrows = Object.entries(filles).filter(([mère, filles]) => (
			vis => (vis && visible.every(([sauce]) => sauce !== mère) && visible.push([mère, Positions[mère as SauceName]]), vis)
		)(visible.some(([sauce]) => sauce === mère || filles.some(fille => fille === sauce)))
	);

	return (
		<div className="main">
			{visible.map(([sauce, pos]) => (
				<Card
					key={sauce}
					name={sauce as SauceName}
					lang={lang}
					pos={pos}
					colour={colours[sauce]}
					attach={linkCard}
				/>
			))}

			{arrows.map(([mère, filles]) =>
				filles.map(fille => (
					<Arrow
						key={fille}
						colour={colours[mère]}
						tail={cards[mère]?.out}
						head={cards[fille]?.in}
						height={arrowExceptions[fille as SauceName]}
					/>
				))
			)}
		</div>
	);
};

export default Main;

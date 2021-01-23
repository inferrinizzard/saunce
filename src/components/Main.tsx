import React, { useState, useContext } from 'react';
import { ThemeContext } from 'styled-components';

import Positions from '../data/pos.json';
import filles from '../data/filles.json';
import sauces from '../data/sauce.json';

import Card from './Card';
import Arrow from './Arrow';

export interface MainProps {
	active: SauceName;
}

const Main: React.FC<MainProps> = () => {
	const [cards, setCards] = useState({} as { [k: string]: Card });
	const linkCard = (sauce: Card) =>
		!cards[sauce.name] && setCards(prev => ({ ...prev, [sauce.name]: sauce }));

	const arrowExceptions: Partial<Record<SauceName, number>> = { 'bonnefoy': 4, 'vin blanc': 4 };
	const colours = useContext(ThemeContext).colours;

	return (
		<div className="main">
			{Object.entries(Positions).map(([sauce, pos]) => (
				<Card
					key={sauce}
					name={sauce as SauceName}
					pos={pos}
					colour={colours[sauce]}
					attach={linkCard}
				/>
			))}

			{Object.entries(filles).map(([mère, filles]) =>
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

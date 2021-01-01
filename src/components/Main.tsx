import React, { useState } from 'react';

import Positions from '../data/pos.json';
import filles from '../data/filles.json';
import { dupes } from '../data/notes.json';
const connected = Object.values(filles)
	.reduce((all, vals) => [...all, ...vals.filter(v => Object.keys(filles).includes(v))], [])
	.concat(dupes);

import Card, { SauceName, Pos } from './Card';
import Arrow from './Arrow';

export interface MainProps {}

const Main: React.FC<MainProps> = () => {
	let [cards, setCards] = useState({} as { [k: string]: Card });
	let linkCard = (sauce: Card, force: boolean = false) =>
		(!cards[sauce.name] || force) && setCards(prev => ({ ...prev, [sauce.name]: sauce }));

	return (
		<div
			className="main"
			onClick={() => Object.values(cards).forEach(card => card.setState({ active: 0 }))}>
			<div
				style={{
					backgroundColor: 'black',
					display: 'block',
					height: '10px',
					width: '10px',
					position: 'fixed',
					top: '-5px',
					left: '-5px',
				}}
			/>
			{Object.entries(Positions).map(([sauce, pos]) => (
				<Card key={sauce} name={sauce as SauceName} pos={pos} attach={linkCard} />
			))}

			{Object.entries(filles).map(([mère, filles]) =>
				filles.map(fille => (
					<Arrow key={fille} colour={'salmon'} tail={cards[mère]?.out} head={cards[fille]?.in} />
				))
			)}
		</div>
	);
};

export default Main;

import React, { useState } from 'react';

import Positions from '../data/pos.json';
import filles from '../data/filles.json';
import sauces from '../data/sauce.json';

let tiers: { [k: string]: string } = new Array(5)
	.fill(['lightsalmon', 'salmon', 'indianred', 'firebrick', 'maroon'])
	.reduce(
		({ q, acc }: { q: string[]; acc: { [k: string]: string } }, colours, i) => ({
			q: q.reduce(
				(a, mère) => [...a, ...(filles[mère as keyof typeof filles] ?? [])],
				[] as string[]
			),
			acc: { ...acc, ...q.reduce((a, sauce) => ({ ...a, [sauce]: colours[i] ?? 'salmon' }), {}) },
		}),
		{
			q: [
				'tomate',
				'espagnole',
				'béchamel',
				'velouté de volaille',
				'velouté de veau',
				'velouté de poisson',
				'hollandaise',
				'mayonnaise',
				'beurre',
				'vinaigrette',
			],
			acc: {},
		} as { q: string[]; acc: { [k: string]: string } }
	).acc;

import Card, { SauceName, Pos, CardBlockSize } from './Card';
import Arrow from './Arrow';

export interface MainProps {
	active: string;
}

const Main: React.FC<MainProps> = () => {
	let [cards, setCards] = useState({} as { [k: string]: Card });
	let linkCard = (sauce: Card) =>
		!cards[sauce.name] && setCards(prev => ({ ...prev, [sauce.name]: sauce }));
	let arrowExceptions: { [k: string]: number } = {
		'bonnefoy': 4,
		'vin blanc': 4,
	};

	return (
		<div className="main">
			{Object.entries(Positions).map(([sauce, pos]) => (
				<Card
					key={sauce}
					name={sauce as SauceName}
					pos={pos}
					colour={tiers[sauce]}
					attach={linkCard}
				/>
			))}

			{Object.entries(filles).map(([mère, filles]) =>
				filles.map(fille => (
					<Arrow
						key={fille}
						colour={tiers[mère]}
						tail={cards[mère]?.out}
						head={cards[fille]?.in}
						height={arrowExceptions[fille]}
					/>
				))
			)}
		</div>
	);
};

export default Main;

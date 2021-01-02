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
			],
			acc: {},
		} as { q: string[]; acc: { [k: string]: string } }
	).acc;

import Card, { SauceName, Pos, CardBlockSize } from './Card';
import Arrow from './Arrow';

export interface MainProps {}

const Main: React.FC<MainProps> = () => {
	let [cards, setCards] = useState({} as { [k: string]: Card });
	let linkCard = (sauce: Card, force: boolean = false) =>
		(!cards[sauce.name] || force) && setCards(prev => ({ ...prev, [sauce.name]: sauce }));
	let arrowExceptions: { [k: string]: number } = {
		'bonnefoy': 4,
		'vin blanc': 4,
	};

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
			<button
				style={{
					position: 'absolute',
					top: '-300px',
					right: '10px',
					backgroundColor: 'salmon',
					height: '50px',
					width: '100px',
					borderRadius: '25px',
					fontSize: '25px',
				}}
				onClick={() => {
					let json = JSON.stringify(
						Object.entries(cards).reduce(
							(acc, [name, card]) => ({
								...acc,
								[name]: {
									x: card?.state.pos.x / CardBlockSize.x,
									y: card?.state.pos.y / CardBlockSize.y,
								},
							}),
							{}
						)
					);
					let blob = new Blob([json], { type: 'application/json' });
					let url = URL.createObjectURL(blob);

					let a = document.createElement('a');
					a.download = 'pos.json';
					a.href = url;
					a.click();
				}}>
				Save
			</button>
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

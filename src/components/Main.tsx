import React, { useState } from 'react';

import Positions from '../data/pos.json';
import filles from '../data/filles.json';
import sauces from '../data/sauce.json';
import { dupes } from '../data/notes.json';
const connected = Object.values(filles)
	.reduce((all, vals) => [...all, ...vals.filter(v => Object.keys(filles).includes(v))], [])
	.concat(dupes);

import Card, { SauceName, Pos, CardBlockSize } from './Card';
import Arrow from './Arrow';

export interface MainProps {}

const Main: React.FC<MainProps> = () => {
	let [cards, setCards] = useState({} as { [k: string]: Card });
	let linkCard = (sauce: Card, force: boolean = false) =>
		(!cards[sauce.name] || force) && setCards(prev => ({ ...prev, [sauce.name]: sauce }));

	let remaining = Object.keys(sauces).filter(sauce => !Object.keys(Positions).includes(sauce));

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
				<Card key={sauce} name={sauce as SauceName} pos={pos} attach={linkCard} />
			))}

			{remaining
				.filter(
					sauce =>
						!Object.keys(filles).includes(sauce) &&
						!Object.values(filles)
							.reduce((arr, cur) => [...arr, ...cur], [])
							.includes(sauce)
				)
				.map((sauce, i) => (
					<Card
						key={sauce}
						name={sauce as SauceName}
						pos={{ x: -5 + i, y: 12 }}
						attach={linkCard}
					/>
				))}
			{['poivrade', 'beurre', 'vinaigrette'].map((mère, j) => (
				<React.Fragment key={mère}>
					<Card name={mère as SauceName} pos={{ x: -5, y: 4 + 2 * j }} attach={linkCard} />
					{(filles[mère as keyof typeof filles] as SauceName[]).map((fille, i) => (
						<Card
							key={fille}
							name={fille}
							pos={{ x: -5 - i, y: 4 + 2 * j + 1 }}
							attach={linkCard}
						/>
					))}
				</React.Fragment>
			))}
			<Card
				key={'glace de viande'}
				name={'glace de viande'}
				pos={{ x: -1, y: 9 }}
				attach={linkCard}
			/>

			{Object.entries(filles).map(([mère, filles]) =>
				filles.map(fille => (
					<Arrow key={fille} colour={'salmon'} tail={cards[mère]?.out} head={cards[fille]?.in} />
				))
			)}
		</div>
	);
};

export default Main;

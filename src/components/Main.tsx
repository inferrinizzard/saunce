import React, { useState } from 'react';

import filles from '../data/filles.json';
import { dupes } from '../data/notes.json';
const connected = Object.values(filles)
	.reduce((all, vals) => [...all, ...vals.filter(v => Object.keys(filles).includes(v))], [])
	.concat(dupes);

import Card, { SauceName, Pos } from './Card';
import Arrow from './Arrow';

export interface MainProps {}

const defaultPos: Pos = { x: 0, y: 0 };

const Main: React.FC<MainProps> = () => {
	let [anchors, setAnchors] = useState({} as { [k: string]: { in: Pos; out: Pos } });
	let attachAnchor = (sauce: SauceName, pos: { in: Pos; out: Pos }) =>
		!anchors[sauce] && setAnchors(prev => ({ ...prev, [sauce]: pos }));

	// const Tree = (mère: SauceName, pos: Pos, rowWidth: number = 5, head = true): JSX.Element => (
	// 	<>
	// 		{head && <Card name={mère} pos={pos} attach={attachAnchor} />}
	// 		{(filles[mère as keyof typeof filles] as SauceName[])?.map((fille, i) => {
	// 			let newPos = {
	// 				x:
	// 					pos.x -
	// 					Math.floor(i % rowWidth) -
	// 					(filles[mère as keyof typeof filles].length > rowWidth ? 0.5 : 0),
	// 				y: pos.y + 1 + Math.floor(i / rowWidth),
	// 			};
	// 			return (
	// 				<React.Fragment key={fille}>
	// 					<Card name={fille} pos={newPos} attach={attachAnchor} />
	// 					<Arrow colour={'salmon'} tail={anchors[mère]?.out} head={anchors[fille]?.in} />
	// 					{Tree(fille, newPos, rowWidth, false)}
	// 				</React.Fragment>
	// 			);
	// 		})}
	// 	</>
	// );

	const Tree = (
		sauce: keyof typeof filles,
		num: number,
		posFunction: (i: number) => Pos,
		flags?: { filter: boolean }
	) =>
		(filles[sauce] as SauceName[])
			.filter(fille => !flags?.filter || !connected.includes(fille))
			.splice(0, num)
			.map((fille, i) => (
				<Card key={fille} name={fille} pos={posFunction(i)} attach={attachAnchor} />
			));

	return (
		<div className="main">
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

			<Card name="espagnole" pos={{ x: 0, y: 0 }} attach={attachAnchor} />
			{Tree('espagnole', 8, i => ({ x: -(3 - (i % 3)), y: 1 + Math.floor(i / 3) }), {
				filter: false,
			})}
			{/* {(filles['espagnole'] as SauceName[])
				.filter(fille => !connected.includes(fille))
				.splice(0, 9)
				.map((fille, i) => (
					<Card
						key={fille}
						name={fille}
						pos={{ x: -(3 - (i % 3)), y: 1 + Math.floor(i / 3) }}
						attach={attachAnchor}
					/>
				))} */}
			<Card name="romaine" pos={{ x: -3, y: 4 }} attach={attachAnchor} />
			<Card name="vin rouge" pos={{ x: -2, y: 4 }} attach={attachAnchor} />
			<Card name="bercy" pos={{ x: 1, y: 3 }} attach={attachAnchor} />
			<Card name="marinière" pos={{ x: 1, y: 4 }} attach={attachAnchor} />
			<Card name="demi-glace" pos={{ x: 0, y: 4 }} attach={attachAnchor} />
			<Card name="gratin" pos={{ x: -1, y: 5 }} attach={attachAnchor} />

			<Card name="tomate" pos={{ x: -4, y: 0 }} attach={attachAnchor} />
			{Tree('tomate', 3, i => ({ x: -5, y: 1 + i }))}
			<Card name="zingara" pos={{ x: -4, y: 5 }} attach={attachAnchor} />

			<Card name="velouté de poisson" pos={{ x: 2, y: 0 }} attach={attachAnchor} />
			<Card name="crevettes" pos={{ x: 4, y: 1 }} attach={attachAnchor} />
			<Card name="bonnefoy" pos={{ x: 1, y: 1 }} attach={attachAnchor} />
			<Card name="bretonne" pos={{ x: 3, y: 1 }} attach={attachAnchor} />
			<Card name="l'aurore" pos={{ x: 1, y: 2 }} attach={attachAnchor} />
			<Card name="livonienne" pos={{ x: 3, y: 2 }} attach={attachAnchor} />
			<Card name="nantua" pos={{ x: 4, y: 2 }} attach={attachAnchor} />
			<Card name="vénitienne" pos={{ x: 3, y: 3 }} attach={attachAnchor} />
			<Card name="vin blanc" pos={{ x: 4, y: 3 }} attach={attachAnchor} />
			<Card name="normande" pos={{ x: 2, y: 5 }} attach={attachAnchor} />
			<Card name="homard" pos={{ x: 3, y: 4 }} attach={attachAnchor} />
			<Card name="américaine" pos={{ x: 4, y: 4 }} attach={attachAnchor} />

			<Card name="béchamel" pos={{ x: 5, y: 0 }} attach={attachAnchor} />
			<Card name="bohémienne" pos={{ x: 6, y: 1 }} attach={attachAnchor} />
			<Card name="cardinal" pos={{ x: 6, y: 2 }} attach={attachAnchor} />
			<Card name="mornay" pos={{ x: 6, y: 3 }} attach={attachAnchor} />
			{/* <Card name="moutarde" pos={{ x: 7, y: 2 }} attach={attachAnchor} /> */}
			<Card name="soubise" pos={{ x: 6, y: 4 }} attach={attachAnchor} />
			<Card name="crème" pos={{ x: 5, y: 5 }} attach={attachAnchor} />
		</div>
	);
};

export default Main;

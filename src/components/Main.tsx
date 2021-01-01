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

const defaultPos: Pos = { x: 0, y: 0 };

const Main: React.FC<MainProps> = () => {
	let [anchors, setAnchors] = useState({} as { [k: string]: Card });
	let linkCard = (sauce: Card) =>
		!anchors[sauce.name] && setAnchors(prev => ({ ...prev, [sauce.name]: sauce }));

	// const Tree = (mère: SauceName, pos: Pos, rowWidth: number = 5, head = true): JSX.Element => (
	// 	<>
	// 		{head && <Card name={mère} pos={pos} attach={linkCard} />}
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
	// 					<Card name={fille} pos={newPos} attach={linkCard} />
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
		flags?: { filter?: boolean; sliceStart?: number }
	) =>
		(filles[sauce] as SauceName[])
			.filter(fille => !flags?.filter || !connected.includes(fille))
			.splice(flags?.sliceStart ?? 0, num)
			.map((fille, i) => (
				<React.Fragment key={fille}>
					<Card name={fille} pos={posFunction(i)} attach={linkCard} />
					{filles[fille as keyof typeof filles]?.length === 1 && (
						<Card
							name={filles[fille as keyof typeof filles][0] as SauceName}
							pos={{ x: posFunction(i).x, y: posFunction(i).y + 1 }}
							attach={linkCard}
						/>
					)}
				</React.Fragment>
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
			{Object.entries(Positions).map(([sauce, pos]) => (
				<Card key={sauce} name={sauce as SauceName} pos={pos} attach={linkCard} />
			))}

			{Object.entries(filles).map(([mère, filles]) =>
				filles.map(fille => (
					<Arrow
						key={fille}
						colour={'salmon'}
						tail={anchors[mère]?.out}
						head={anchors[fille]?.in}
					/>
				))
			)}
		</div>
	);
};

export default Main;

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
		flags?: { filter?: boolean; sliceStart?: number }
	) =>
		(filles[sauce] as SauceName[])
			.filter(fille => !flags?.filter || !connected.includes(fille))
			.splice(flags?.sliceStart ?? 0, num)
			.map((fille, i) => (
				<React.Fragment key={fille}>
					<Card key={fille} name={fille} pos={posFunction(i)} attach={attachAnchor} />
					{filles[fille as keyof typeof filles]?.length === 1 && (
						<Card
							key={fille}
							name={filles[fille as keyof typeof filles][0]}
							pos={{ x: posFunction(i).x, y: posFunction(i).y + 1 }}
							attach={attachAnchor}
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

			<Card name="espagnole" pos={{ x: 0, y: 0 }} attach={attachAnchor} />
			{Tree('espagnole', 9, i => ({ x: -(3 - (i % 3)), y: 1 + Math.floor(i / 3) }), {
				filter: false,
			})}
			{/* <Arrow
				colour={'salmon'}
				tail={anchors['espagnole']?.out}
				head={anchors['gratin']?.in}
				heightOverride={2}
			/> */}
			<Card name="vin rouge" pos={{ x: 1, y: 3 }} attach={attachAnchor} />
			<Card name="bercy" pos={{ x: 1, y: 4 }} attach={attachAnchor} />
			<Card name="marinière" pos={{ x: 1, y: 5 }} attach={attachAnchor} />

			<Card name="demi-glace" pos={{ x: -1, y: 4 }} attach={attachAnchor} />
			<Card name="gratin" pos={{ x: 0, y: 5 }} attach={attachAnchor} />
			{Tree('demi-glace', 21, i => ({ x: -4 + (i % 6), y: 6 + Math.floor(i / 6) }), {
				sliceStart: 1,
			})}
			{/* <Card name="poivrade" pos={{ x: 0, y: 9 }} attach={attachAnchor} />
			{Tree('poivrade', 4, i => ({ x: -1 + i, y: 10 }))} */}

			<Card name="tomate" pos={{ x: -4, y: 0 }} attach={attachAnchor} />
			{Tree('tomate', 3, i => ({ x: -5, y: 1 + i }))}
			<Card name="zingara" pos={{ x: -4, y: 5 }} attach={attachAnchor} />

			<Card name="velouté de poisson" pos={{ x: 2, y: 0 }} attach={attachAnchor} />
			{Tree(
				'velouté de poisson',
				8,
				i => ({
					x: 2 + ((8 - i) % 3 || -1),
					y: 1 + Math.floor(i / 3),
				}),
				{ filter: false }
			)}

			<Card name="américaine" pos={{ x: 3, y: 4 }} attach={attachAnchor} />
			<Card name="homard" pos={{ x: 4, y: 4 }} attach={attachAnchor} />
			<Card name="orientale" pos={{ x: 3, y: 5 }} attach={attachAnchor} />
			<Card name="victoria" pos={{ x: 4, y: 5 }} attach={attachAnchor} />

			<Card name="normande" pos={{ x: 2, y: 5 }} attach={attachAnchor} />
			{Tree('normande', 4, i => ({ x: 2 + (i % 2), y: 6 + Math.floor(i / 2) }))}

			<Card name="béchamel" pos={{ x: 5, y: 0 }} attach={attachAnchor} />
			{Tree('béchamel', 4, i => ({ x: 6, y: 1 + i }))}
			{/* <Card name="moutarde" pos={{ x: 7, y: 2 }} attach={attachAnchor} /> */}
			<Card name="crème" pos={{ x: 5, y: 5 }} attach={attachAnchor} />

			<Card name="hollandaise" pos={{ x: 7, y: 0 }} attach={attachAnchor} />
			{Tree('hollandaise', 4, i => ({ x: 8 + (i % 2), y: 1 + Math.floor(i / 2) }))}
			<Card name="béarnaise" pos={{ x: 7, y: 2 }} attach={attachAnchor} />
			{Tree('béarnaise', 4, i => ({ x: 8 + (i % 2), y: 3 + Math.floor(i / 2) }))}
			<Card name="tyrolienne" pos={{ x: 7, y: 4 }} attach={attachAnchor} />

			<Card name="velouté de veau" pos={{ x: 10, y: 0 }} attach={attachAnchor} />
			{Tree('velouté de veau', 4, i => ({ x: 10 + 1 + (i % 2), y: 1 + Math.ceil(i / 2) }))}
			<Card name="allemande" pos={{ x: 11, y: 3 }} attach={attachAnchor} />
			<Card name="poulette" pos={{ x: 10, y: 4 }} attach={attachAnchor} />

			<Card name="velouté de volaille" pos={{ x: 13, y: 0 }} attach={attachAnchor} />
			{Tree('velouté de volaille', 4, i => ({
				x: 13 + (i ? i % 2 : -1),
				y: 1 + Math.floor(i / 2),
			}))}

			<Card name="mayonnaise" pos={{ x: 15, y: 0 }} attach={attachAnchor} />
			{Tree('mayonnaise', 6, i => ({ x: 16 + (i % 3), y: 1 + Math.floor(i / 3) }))}
			{Tree('mayonnaise', 5, i => ({ x: 14 + i, y: 3 }), { sliceStart: 6 })}

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

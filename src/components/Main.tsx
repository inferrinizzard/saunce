import React, { useState } from 'react';

import filles from '../data/filles.json';
const connected = Object.entries(filles).reduce((all, [k, v]) => [...all, k, ...v], [] as string[]);

import Card, { SauceName, Pos } from './Card';
import Arrow from './Arrow';

export interface MainProps {}

const defaultPos: Pos = { x: 0, y: 0 };

const Main: React.FC<MainProps> = () => {
	let [anchors, setAnchors] = useState({} as { [k: string]: { in: Pos; out: Pos } });
	let attachAnchor = (sauce: SauceName, pos: { in: Pos; out: Pos }) =>
		!anchors[sauce] && setAnchors(prev => ({ ...prev, [sauce]: pos }));

	let [cards, setCards] = useState({} as { [k: string]: Pos });

	// const Card = (props: Omit<CardProps, 'attach'>) => <_Card {...props} attach={attachAnchor} />;
	// if (!cards[props.name]) setCards(prev => ({ ...prev, [props.name]: props.pos }));

	const Tree = (mère: SauceName, pos: Pos, rowWidth: number = 5, head = true): JSX.Element => (
		<>
			{head && <Card name={mère} pos={pos} attach={attachAnchor} />}
			{(filles[mère as keyof typeof filles] as SauceName[])?.map((fille, i) => {
				let newPos = {
					x: pos.x + Math.ceil((i % rowWidth) - rowWidth / 2),
					y: pos.y + 1 + Math.floor(i / rowWidth),
				};
				return (
					<React.Fragment key={fille}>
						<Card name={fille} pos={newPos} attach={attachAnchor} />
						<Arrow colour={'salmon'} tail={anchors[mère]?.out} head={anchors[fille]?.in} />
						{Tree(fille, newPos, rowWidth, false)}
					</React.Fragment>
				);
			})}
		</>
	);

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
			{Tree('hollandaise', { x: 0, y: 0 })}
			{Tree('mayonnaise', { x: 6, y: 0 })}
			{/* {Tree('espagnole', { x: 6, y: 0 }, 6)} */}
		</div>
	);
};

export default Main;

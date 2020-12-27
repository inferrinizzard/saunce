import React, { useState } from 'react';

import filles from '../data/filles.json';
const connected = Object.entries(filles).reduce((all, [k, v]) => [...all, k, ...v], [] as string[]);

import Card, { Pos } from './Card';
import _Arrow, { ArrowProps } from './Arrow';

export interface MainProps {}

const defaultPos = { x: 0, y: 0 };

const Main: React.FC<MainProps> = () => {
	let [anchors, setAnchors] = useState({} as { [k: string]: { in: Pos; out: Pos } });
	let attachAnchor = (sauce: string, pos: { in: Pos; out: Pos }) =>
		setAnchors(prev => ({ ...prev, [sauce]: pos }));

	const Arrow = ({
		head,
		tail,
		...props
	}: {
		head: keyof typeof anchors;
		tail: keyof typeof anchors;
	} & Omit<ArrowProps, 'head' | 'tail'>) => (
		<_Arrow
			head={anchors[head]?.in || defaultPos}
			tail={anchors[tail]?.out || defaultPos}
			{...(props as Omit<ArrowProps, 'head' | 'tail'>)}
		/>
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
			<Arrow colour={'salmon'} head={'crème'} tail={'béchamel'} />
			<Arrow colour={'salmon'} head={'mornay'} tail={'béchamel'} />
			<Arrow colour={'salmon'} head={'écossaise'} tail={'crème'} />
			<Card name="béchamel" pos={{ x: 50, y: 50 }} attach={attachAnchor} />
			<Card name="mornay" pos={{ x: 50, y: 500 }} attach={attachAnchor} />
			<Card name="crème" pos={{ x: 605, y: 500 }} attach={attachAnchor} />
			<Card name="écossaise" pos={{ x: 605, y: 950 }} attach={attachAnchor} />
			<Card name="velouté de volaille" pos={{ x: 1160, y: 500 }} attach={attachAnchor} />
			<Card name="hollandaise" pos={{ x: 1160, y: 50 }} attach={attachAnchor} />
		</div>
	);
};

export default Main;

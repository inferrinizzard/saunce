import React, { useState } from 'react';

import filles from '../data/filles.json';
const connected = Object.entries(filles).reduce((all, [k, v]) => [...all, k, ...v], [] as string[]);

import Card, { SauceName, Pos } from './Card';
import _Arrow, { ArrowProps } from './Arrow';

export interface MainProps {}

const defaultPos: Pos = { x: 0, y: 0 };

const Main: React.FC<MainProps> = () => {
	let [anchors, setAnchors] = useState({} as { [k: string]: { in: Pos; out: Pos } });
	let attachAnchor = (sauce: SauceName, pos: { in: Pos; out: Pos }) =>
		setAnchors(prev => ({ ...prev, [sauce]: pos }));

	const Arrow = ({
		head,
		tail,
		...props
	}: {
		head: SauceName;
		tail: SauceName;
	} & Omit<ArrowProps, 'head' | 'tail'>) => (
		console.log(head, tail, anchors[head]?.in, anchors[tail]?.out),
		(
			<_Arrow
				head={anchors[head]?.in || defaultPos}
				tail={anchors[tail]?.out || defaultPos}
				{...(props as Omit<ArrowProps, 'head' | 'tail'>)}
			/>
		)
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
			<Arrow colour={'salmon'} tail={'béchamel'} head={'crème'} />
			<Arrow colour={'salmon'} tail={'béchamel'} head={'mornay'} />
			<Arrow colour={'salmon'} tail={'crème'} head={'écossaise'} />
			<Card name="béchamel" pos={{ x: 4, y: 0 }} attach={attachAnchor} />
			<Card name="mornay" pos={{ x: 5, y: 1 }} attach={attachAnchor} />
			<Card name="crème" pos={{ x: 4, y: 1 }} attach={attachAnchor} />
			<Card name="écossaise" pos={{ x: 4, y: 2 }} attach={attachAnchor} />
			<Card name="velouté de poisson" pos={{ x: 2, y: 0 }} attach={attachAnchor} />
			<Card name="hollandaise" pos={{ x: 0, y: 0 }} attach={attachAnchor} />
			{(filles['hollandaise'] as SauceName[]).map((fille, i) => [
				<Card
					name={fille}
					pos={{ x: Math.ceil(i - filles['hollandaise'].length / 2) - 1, y: 1 }}
					attach={attachAnchor}
				/>,
				<Arrow colour={'salmon'} tail={'hollandaise'} head={fille} />,
			])}
			{(filles['béarnaise'] as SauceName[]).map((fille, i) => [
				<Card
					name={fille}
					pos={{ x: Math.ceil(i - filles['béarnaise'].length / 2) - 1, y: 2 }}
					attach={attachAnchor}
				/>,
				<Arrow colour={'salmon'} tail={'béarnaise'} head={fille} />,
			])}
			<Card name="véron" pos={{ x: 2, y: 3 }} attach={attachAnchor} />
			<Arrow colour={'salmon'} tail={'tyrolienne'} head={'véron'} />,
			<Card name="colbert" pos={{ x: -1, y: 3 }} attach={attachAnchor} />
			<Arrow colour={'salmon'} tail={'foyot'} head={'colbert'} />,
			<Card name="normande" pos={{ x: 2, y: 1 }} attach={attachAnchor} />
			<Arrow colour={'salmon'} tail={'velouté de poisson'} head={'normande'} />,
			<Card name="espagnole" pos={{ x: 3, y: 0 }} attach={attachAnchor} />
			<Card name="demi-glace" pos={{ x: 3, y: 1 }} attach={attachAnchor} />
			<Arrow colour={'salmon'} tail={'espagnole'} head={'demi-glace'} />,
			<Card name="glace de viande" pos={{ x: 3, y: 2 }} attach={attachAnchor} />
			<Arrow colour={'salmon'} tail={'demi-glace'} head={'glace de viande'} />,
			<Arrow colour={'salmon'} tail={'normande'} head={'véron'} />,
			<Arrow colour={'salmon'} tail={'glace de viande'} head={'véron'} />,
		</div>
	);
};

export default Main;

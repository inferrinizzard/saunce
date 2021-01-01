import React, { useState } from 'react';

import Positions from '../data/pos.json';
import filles from '../data/filles.json';

import Card, { SauceName, Pos } from './Card';
import Arrow from './Arrow';

export interface MainProps {}

const Main: React.FC<MainProps> = () => {
	let [anchors, setAnchors] = useState({} as { [k: string]: Card });
	let linkCard = (sauce: Card) =>
		!anchors[sauce.name] && setAnchors(prev => ({ ...prev, [sauce.name]: sauce }));

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

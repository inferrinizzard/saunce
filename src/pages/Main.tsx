import React from 'react';

import Card from './Card';
import filles from '../data/filles.json';

export interface MainProps {}

const Main: React.SFC<MainProps> = () => {
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
			<Card name="béchamel" pos={{ x: 100, y: 100 }} />
			<Card name="hollandaise" pos={{ x: 600, y: 100 }} />
		</div>
	);
};

export default Main;

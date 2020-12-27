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
			<Card name="béchamel" pos={{ x: 50, y: 50 }} />
			<Card name="mornay" pos={{ x: 50, y: 400 }} />
			<Card name="crème" pos={{ x: 600, y: 400 }} />
			<Card name="écossaise" pos={{ x: 600, y: 750 }} />
			<Card name="velouté de volaille" pos={{ x: 1150, y: 400 }} />
			<Card name="hollandaise" pos={{ x: 1150, y: 50 }} />
		</div>
	);
};

export default Main;

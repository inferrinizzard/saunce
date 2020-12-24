import React from 'react';

import Card from './Card';
import filles from '../data/filles.json';

export interface MainProps {}

const Main: React.SFC<MainProps> = () => {
	return (
		<div>
			<Card name="Sauce Velouté de Volaille" ingredients={[]} />
		</div>
	);
};

export default Main;

import React from 'react';

export interface HomeProps {}

const Home: React.FC<HomeProps> = () => {
	return (
		<div style={{ width: '100%', height: '100%' }}>
			<h1>{'French Sauces'}</h1>
		</div>
	);
};

export default Home;

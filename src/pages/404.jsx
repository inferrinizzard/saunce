import React from 'react';

const NotFound = () => (
	<div
		style={{
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
		}}>
		<h2 style={{ marginTop: '15%', fontSize: '5em' }}>You got lost in the sauce!</h2>
		<a href="/" style={{ fontSize: '3em', fontFamily: 'Courgette' }}>
			Click here to return.
		</a>
	</div>
);

export default NotFound;

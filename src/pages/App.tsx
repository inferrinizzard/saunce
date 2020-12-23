import React, { useState } from 'react';

import Overlay from './Overlay';
import Main from './Main';

export default function App() {
	return (
		<div>
			<h1>Hello World!</h1>
			<Overlay />
			<Main />
		</div>
	);
}

import React, { useState } from 'react';
import { ThemeProvider } from 'styled-components';

import '../css/main.css';

import Overlay from './Overlay';
import Main from './Main';

let theme = {
	offwhite: '#f7f7f2', // #faf3dd
	font: 'Courgette',
};

export default function App() {
	return (
		<div>
			<ThemeProvider theme={theme}>
				<Overlay />
				<Main />
			</ThemeProvider>
		</div>
	);
}

import React, { useState } from 'react';

import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

import styled, { ThemeProvider } from 'styled-components';
import '../css/main.css';
import '../css/ingredients.css';

import Overlay from '../components/Overlay';
import Main from '../components/Main';

let theme = {
	offwhite: '#f7f7f2', // #faf3dd
	font: 'Courgette',
};

let AppHead = styled.div`
	&,
	> div.react-transform-component {
		height: 100%;
		width: 100%;
	}
`;

export default function App() {
	return (
		<AppHead>
			<ThemeProvider theme={theme}>
				<Overlay />
				<TransformWrapper
					defaultPositionX={0}
					defaultPositionY={0}
					wheel={{ step: 10 }}
					options={{ minScale: 0.5, centerContent: false, limitToBounds: false }}>
					<TransformComponent>
						<Main />
					</TransformComponent>
				</TransformWrapper>
			</ThemeProvider>
		</AppHead>
	);
}

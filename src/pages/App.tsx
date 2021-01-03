import React, { useState } from 'react';

import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

import styled, { ThemeProvider } from 'styled-components';
import '../css/main.css';
import '../css/ingredients.css';

import Overlay from '../components/Overlay';
import Main from '../components/Main';
import { CardBlockSize } from '../components/Card';

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
					wheel={{ step: 15 }}
					// onPanningStop={(e: any) => console.log(e)}
					options={{
						minScale: 0.35,
						maxScale: 1,
						centerContent: false,
						limitToBounds: false,
						maxPositionX: 11 * CardBlockSize.x,
						minPositionX: -12 * CardBlockSize.x,
						maxPositionY: 1 * CardBlockSize.y,
						minPositionY: -10 * CardBlockSize.y,
					}}>
					<TransformComponent>
						<Main />
					</TransformComponent>
				</TransformWrapper>
			</ThemeProvider>
		</AppHead>
	);
}

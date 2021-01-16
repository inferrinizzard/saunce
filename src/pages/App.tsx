import React, { useState } from 'react';

import { MapInteractionCSS as TransformComponent } from 'react-map-interaction';

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
	height: 100%;
	width: 100%;
`;

export default function App() {
	let [transform, setTransform] = useState({ scale: 0.7, translation: { x: 0, y: 0 } });
	return (
		<AppHead>
			<ThemeProvider theme={theme}>
				<Overlay />
				<TransformComponent
					value={transform}
					minScale={0.35}
					maxScale={1}
					translationBounds={{
						xMax: (CardBlockSize.x / 5) * transform.scale,
						yMax: (CardBlockSize.y / 5) * transform.scale,
						xMin:
							-((24 + 1) * CardBlockSize.x - window.innerWidth) * transform.scale +
							window.innerWidth * (1 - transform.scale),
						yMin:
							-((11 + 1) * CardBlockSize.y - window.innerHeight) * transform.scale +
							window.innerHeight * (1 - transform.scale),
					}}
					onChange={(e: typeof transform) => setTransform(e)}>
				</TransformComponent>
			</ThemeProvider>
		</AppHead>
	);
}

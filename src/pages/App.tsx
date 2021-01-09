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
						xMin: -11.5 * CardBlockSize.x * transform.scale ** 1.75,
						xMax: 10.5 * CardBlockSize.x * transform.scale,
						yMin: -10 * CardBlockSize.y * transform.scale ** 1.5,
						yMax: 0.5 * CardBlockSize.y * transform.scale,
					}}
					onChange={(e: typeof transform) => setTransform(e)}
					// onChange={(e: typeof transform) => console.log(e)}
				>
					<Main />
				</TransformComponent>
			</ThemeProvider>
		</AppHead>
	);
}

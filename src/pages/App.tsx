import React, { useState, useEffect } from 'react';

import { MapInteractionCSS as TransformComponent } from 'react-map-interaction';
import { LocationContext } from '@reach/router';

import styled, { ThemeProvider } from 'styled-components';
import '../css/main.css';
import '../css/ingredients.css';

import Overlay from '../components/Overlay';
import Main from '../components/Main';
import { CardBlockSize } from '../components/Card';

import pos from '../data/pos.json';

let theme = {
	offwhite: '#f7f7f2', // #faf3dd
	bg: '#f9f9ff',
	font: 'Courgette',
};

let AppHead = styled.div`
	height: 100%;
	width: 100%;
	background-color: ${p => p.theme.bg};
`;

let baseScale = 0.7;

const App: React.FC<LocationContext> = ({ location }) => {
	const active = decodeURI(location.hash).slice(1).replace(/[_]/g, ' ') as SauceName;

	const [transform, setTransform] = useState({
		scale: baseScale,
		translation: active
			? {
					x: -(pos[active as keyof typeof pos].x * CardBlockSize.x * baseScale),
					y: -(pos[active as keyof typeof pos].y * CardBlockSize.y * baseScale),
			  }
			: { x: 0, y: 0 },
	});

	const [minBounds, setBounds] = useState({ xMin: -(24 + 1) * CardBlockSize.x, yMin: -(11 + 1) * CardBlockSize.y });

	useEffect(
		() =>
			setBounds({
				xMin: -((24 + 1) * CardBlockSize.x - window.innerWidth) * transform.scale + window.innerWidth * (1 - transform.scale),
				yMin: -((11 + 1) * CardBlockSize.y - window.innerHeight) * transform.scale + window.innerHeight * (1 - transform.scale),
			}),
		[transform.scale]
	);

	return (
		<AppHead>
			<ThemeProvider theme={theme}>
				<Overlay transform={transform} setTransform={setTransform} active={active} />
				<TransformComponent
					value={transform}
					minScale={0.35}
					maxScale={1}
					translationBounds={{
						xMax: (CardBlockSize.x / 5) * transform.scale,
						yMax: (CardBlockSize.y / 5) * transform.scale,
						...minBounds,
					}}
					onChange={(e: typeof transform) => setTransform(e)}>
					<Main active={active} />
				</TransformComponent>
			</ThemeProvider>
		</AppHead>
	);
};

export default App;

import React, { useState, useEffect } from 'react';

import { MapInteractionCSS as TransformComponent } from 'react-map-interaction';
import { LocationContext, globalHistory, navigate } from '@reach/router';

import styled, { ThemeProvider } from 'styled-components';
import '../css/main.css';
import '../css/ingredients.css';

import Overlay from '../components/Overlay';
import Main from '../components/Main';
import { CardBlockSize } from '../components/Card';

import pos from '../data/pos.json';
import filles from '../data/filles.json';
const colours = new Array(5).fill(['lightsalmon', 'salmon', 'indianred', 'firebrick', 'maroon']).reduce(
		({ q, acc }: { q: SauceName[]; acc: Record<SauceName, string> }, colours, i) => ({
			q: q.reduce((a, mère) => [...a, ...(filles[mère as keyof typeof filles] ?? [])], [] as string[]),
			acc: { ...acc, ...q.reduce((a, sauce) => ({ ...a, [sauce]: colours[i] ?? 'salmon' }), {}) },
		}),
	{ q: Object.keys(filles).filter(k => !Object.values(filles).some(v => v.includes(k))), acc: {} } as { q: SauceName[]; acc: Record<SauceName, string> }
	).acc;

const theme = (sauce?: SauceName) => ({
	offwhite: '#f7f7f2', // #faf3dd
	bg: '#f9f9ff',
	font: 'Courgette',
	activeColour: sauce ? colours[sauce] : 'salmon',
	colours,
});

let AppHead = styled.div`
	height: 100%;
	width: 100%;
	background-color: ${p => p.theme.bg};
`;

const baseScale = 0.7;

const App: React.FC<LocationContext> = ({ location }) => {
	const lang = decodeURI(location.hash).slice(1);
	const active = decodeURI(location.search).slice(1).replace(/[_]/g, ' ') as SauceName;

	const getActivePos = (active: keyof typeof pos) => ({
		x: -(pos[active].x * CardBlockSize.x * baseScale),
		y: -(pos[active].y * CardBlockSize.y * baseScale),
	});
	const [transform, setTransform] = useState({
		scale: baseScale,
		translation: active ? getActivePos(active) : { x: 0, y: 0 },
	});

	useEffect(() => {
		!lang && navigate(`/${location.search}#${localStorage.getItem('saunce-lang') ?? 'en'}`);
		return globalHistory.listen(() => localStorage.setItem('saunce-lang', lang));
		// setTransform({ ...transform, translation: getActivePos(active) })
	}, []);

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
			<ThemeProvider theme={active ? theme(active) : theme()}>
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
					<Main active={active} transform={transform} />
				</TransformComponent>
			</ThemeProvider>
		</AppHead>
	);
};

export default App;

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
const colours = new Array(5)
	.fill(['lightsalmon', 'salmon', 'indianred', 'firebrick', 'maroon'])
	.reduce(
		({ q, acc }: { q: SauceName[]; acc: Record<SauceName, string> }, colours, i) => ({
			q: q.reduce(
				(a, mère) => [...a, ...(filles[mère as keyof typeof filles] ?? [])],
				[] as string[]
			),
			acc: { ...acc, ...q.reduce((a, sauce) => ({ ...a, [sauce]: colours[i] ?? 'salmon' }), {}) },
		}),
		{
			q: Object.keys(filles).filter(k => !Object.values(filles).some(v => v.includes(k))),
			acc: {},
		} as { q: SauceName[]; acc: Record<SauceName, string> }
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

const scaleParams = {
	default: 0.7,
	min: 0.35,
	max: 1,
};

const App: React.FC<LocationContext> = ({ location }) => {
	const [lang, setLang] = useState(location.hash.slice(1));
	const [active, setActive] = useState(
		decodeURI(location.search).slice(1).replace(/[_]/g, ' ') as SauceName
	);

	const getActivePos = (active: keyof typeof pos) => ({
		x: -(pos[active].x * CardBlockSize.x * scaleParams.default),
		y: -(pos[active].y * CardBlockSize.y * scaleParams.default),
	});
	const [transform, setTransform] = useState({
		scale: scaleParams.default,
		translation: active ? getActivePos(active) : { x: 0, y: 0 },
	});

	useEffect(() => {
		const local = localStorage.getItem('saunce-lang') ?? 'en';
		if (!lang) {
			navigate(`/${location.search}#${local}`);
			setLang(local);
		}
		return globalHistory.listen(({ location: next }) => {
			const newHash = next.hash.slice(1);
			localStorage.setItem('saunce-lang', newHash);
			setLang(newHash);

			setActive(decodeURI(next.search).slice(1).replace(/[_]/g, ' ') as SauceName);
		});
		// setTransform({ ...transform, translation: getActivePos(active) })
	}, []);

	const [minBounds, setBounds] = useState({
		xMin: -(24 + 1) * CardBlockSize.x,
		yMin: -(11 + 1) * CardBlockSize.y,
	});

	const updateScale = (step: number) =>
		setTransform({
			...transform,
			scale: Math.max(Math.min(transform.scale + step, scaleParams.max), scaleParams.min),
		});

	useEffect(
		() =>
			setBounds({
				xMin:
					-((24 + 1) * CardBlockSize.x - window.innerWidth) * transform.scale +
					window.innerWidth * (1 - transform.scale - (active && 0.33)),
				yMin:
					-((11 + 1) * CardBlockSize.y - window.innerHeight) * transform.scale +
					window.innerHeight * (1 - transform.scale),
			}),
		[transform.scale]
	);

	return (
		<AppHead>
			<ThemeProvider theme={active ? theme(active) : theme()}>
				<Overlay {...{ transform, updateScale, active, lang }} />
				<TransformComponent
					value={transform}
					minScale={scaleParams.min}
					maxScale={scaleParams.max}
					translationBounds={{
						xMax: (CardBlockSize.x / 5) * transform.scale,
						yMax: (CardBlockSize.y / 5) * transform.scale,
						...minBounds,
					}}
					onChange={(e: typeof transform) => setTransform(e)}>
					<Main {...{ active, lang, transform }} />
				</TransformComponent>
			</ThemeProvider>
		</AppHead>
	);
};

export default App;

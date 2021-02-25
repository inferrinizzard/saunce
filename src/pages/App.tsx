import React, { useState, useEffect, createContext } from 'react';

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
const transformWrapperId = 'transformWrapper';

export const LangContext = React.createContext('en');

const App: React.FC<LocationContext> = ({ location }) => {
	const [lang, setLang] = useState(location.hash.slice(1));
	const [active, setActive] = useState(
		decodeURI(location.search).slice(1).replace(/[_]/g, ' ') as SauceName
	);

	const [transform, setTransform] = useState({
		scale: scaleParams.default,
		translation: active
			? {
					x: -(pos[active].x * CardBlockSize.x * scaleParams.default),
					y: -(pos[active].y * CardBlockSize.y * scaleParams.default),
			  }
			: { x: 0, y: 0 },
	});

	const [minBounds, setBounds] = useState({
		xMin: -(24 + 1) * CardBlockSize.x,
		yMin: -(11 + 1) * CardBlockSize.y,
	});

	const updateScale = (step: number) => {
		const n = 30;
		const nextScale = Math.max(Math.min(transform.scale + step, scaleParams.max), scaleParams.min);
		const start = transform;
		Math.abs(nextScale - start.scale) > 0 &&
			[...new Array(n)].forEach((_, i) =>
				setTimeout(() => {
					const stepScale = ((nextScale - start.scale) / 30) * i + start.scale;
					setTransform(prev => ({
						translation: {
							x:
								start.translation.x -
								((stepScale / prev.scale) * prev.translation.x - prev.translation.x),
							y:
								start.translation.y -
								((stepScale / prev.scale) * prev.translation.y - prev.translation.y),
						},
						scale: stepScale,
					}));
				}, i * 100)
			);
	};

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

			const nextActive = decodeURI(next.search).slice(1).replace(/[_]/g, ' ') as SauceName;
			if (nextActive) {
				setActive(nextActive);

				const nextPos = {
					x: -(pos[nextActive].x * CardBlockSize.x * transform.scale),
					y: -(pos[nextActive].y * CardBlockSize.y * transform.scale),
				};
				const startPos = transform.translation;
				const n = 30;
				[...new Array(n)].forEach((_, i) =>
					setTimeout(
						() =>
							setTransform(prev => ({
								...prev,
								translation: {
									x: ((nextPos.x - startPos.x) / n) * i + startPos.x,
									y: ((nextPos.y - startPos.y) / n) * i + startPos.y,
								},
							})),
						i * 100
					)
				);
			}
		});
	}, [transform.translation]);

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
			<LangContext.Provider value={lang}>
				<ThemeProvider theme={active ? theme(active) : theme()}>
					<Overlay {...{ updateScale, active }} />
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
						<Main transform={transform} />
					</TransformComponent>
				</ThemeProvider>
			</LangContext.Provider>
		</AppHead>
	);
};

export default App;

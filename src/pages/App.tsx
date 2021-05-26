import React, { useState, useEffect } from 'react';

import { MapInteractionCSS as TransformComponent } from '../components/Transform';
import { clamp, coordChange } from '../components/Transform/MapInteraction';
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
			setActive(nextActive);
			if (nextActive)
				setTransform(prev => ({
					...prev,
					translation: {
						x: -(pos[nextActive].x * CardBlockSize.x * prev.scale),
						y: -(pos[nextActive].y * CardBlockSize.y * prev.scale),
					},
				}));
		});
	}, []);

	const [minBounds, setBounds] = useState({
		xMin: -(24 + 1) * CardBlockSize.x,
		yMin: -(11 + 1) * CardBlockSize.y,
	});

	const stepScale = (initial: number, final: number, dur = 2000, start = 0) => (time: number) => {
		if (!start) start = time;
		const elapsed = time - start;

		const newScale = initial + ((final - initial) * elapsed) / dur;
		const center = {
			x: window.innerWidth / 2 - transform.translation.x,
			y: window.innerHeight / 2 - transform.translation.y,
		};
		const focalPtDelta = {
			x: coordChange(center.x, newScale / initial),
			y: coordChange(center.y, newScale / initial),
		};
		const newTranslation = {
			x: transform.translation.x - focalPtDelta.x,
			y: transform.translation.y - focalPtDelta.y,
		};

		setTransform({ scale: newScale, translation: newTranslation });
		if (elapsed < dur) window.requestAnimationFrame(stepScale(initial, final, dur, start));
	};

	const updateScale = (step: number) => {
		const initialScale = transform.scale;
		const finalScale = clamp(scaleParams.min, initialScale + step, scaleParams.max);
		window.requestAnimationFrame(stepScale(initialScale, finalScale, 300));
	};

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
						onChange={setTransform}>
						<Main transform={transform} />
					</TransformComponent>
				</ThemeProvider>
			</LangContext.Provider>
		</AppHead>
	);
};

export default App;

import React, { useState, useEffect } from 'react';
import { LocationContext, globalHistory, navigate } from '@reach/router';

import styled, { ThemeProvider } from 'styled-components';
import '../css/main.css';
import '../css/ingredients.css';

import GraphTransform from '../components/GraphTransform';
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

export const LangContext = React.createContext('en');

const App = (page: string): React.FC<LocationContext> => ({ location }) => {
	const [lang, setLang] = useState(location.hash.slice(1));
	const [active, setActive] = useState(
		decodeURI(location.search).slice(1).replace(/[_]/g, ' ') as SauceName
	);

	useEffect(() => {
		const local = localStorage.getItem('saunce-lang') ?? 'en';
		if (!lang) {
			navigate(`/${page}${location.search}#${local}`);
			setLang(local);
		}
		return globalHistory.listen(({ location: next }) => {
			const newHash = next.hash.slice(1);
			localStorage.setItem('saunce-lang', newHash);
			setLang(newHash);

			const nextActive = decodeURI(next.search).slice(1).replace(/[_]/g, ' ') as SauceName;
			setActive(nextActive);
		});
	}, []);

	return (
		<AppHead>
			<LangContext.Provider value={lang}>
				<ThemeProvider theme={active ? theme(active) : theme()}>
					{{ graph: <GraphTransform active={active} /> }[page]}
				</ThemeProvider>
			</LangContext.Provider>
		</AppHead>
	);
};

export default App;

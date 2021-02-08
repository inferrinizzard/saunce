import { navigate } from '@reach/router';
export const nav = (sauce: SauceName) => navigate(`/?${sauce.replace(/\s/g, '_')}${window.location.hash}`);

export const deaccent = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

// import React, { useContext } from 'react';
// import { ThemeContext } from 'styled-components';
// export const activeColour: React.FC<SauceName> = (sauce: SauceName) => {
// 	const theme = useContext(ThemeContext);
// 	return theme.colours[sauce];
// };

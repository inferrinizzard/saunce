import React from 'react';

export const onRenderBody = ({ setHeadComponents }) =>
	setHeadComponents([
		<title key="title">Sauce</title>,
		// <link key="icon" rel="icon" href="src/svg/pan.svg" />,
	]);

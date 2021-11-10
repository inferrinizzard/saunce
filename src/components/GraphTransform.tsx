import React, { useEffect, useState } from 'react';

import { MapInteractionCSS as TransformComponent } from 'react-map-interaction';

import Overlay from './Overlay';
import Graph from './Graph';
import { CardBlockSize } from './Card';

import pos from '../data/pos.json';

const scaleParams = {
	default: 0.7,
	min: 0.35,
	max: 1,
};

export interface GraphTransformProps {
	active: SauceName;
}

const GraphTransform: React.FC<GraphTransformProps> = ({ active }) => {
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

	useEffect(
		() =>
			active &&
			setTransform(prev => ({
				...prev,
				translation: {
					x: -(pos[active].x * CardBlockSize.x * prev.scale),
					y: -(pos[active].y * CardBlockSize.y * prev.scale),
				},
			})),
		[active]
	);

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
		<>
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
				<Graph transform={transform} />
			</TransformComponent>
		</>
	);
};

export default GraphTransform;

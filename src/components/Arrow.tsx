import React from 'react';

import { Pos, CardBlockSize } from './Card';

export interface ArrowProps {
	head?: Pos;
	tail?: Pos;
	colour: string;
	heightOverride?: number;
}

const Arrow: React.FC<ArrowProps> = ({ head, tail, colour, heightOverride }) => {
	if (!head || !tail) return null;
	const dx = head.x - tail.x;
	let dy = head.y - tail.y;
	let y = 0;
	if (head.y - tail.y > CardBlockSize.y || heightOverride) {
		dy = heightOverride
			? head.y - tail.y - CardBlockSize.y * heightOverride
			: (head.y - tail.y) % CardBlockSize.y;
		y = (heightOverride ?? Math.floor((head.y - tail.y) / CardBlockSize.y)) * CardBlockSize.y;
	}
	const controlDist = dy;
	const width = 20;
	return (
		<svg
			width={Math.abs(dx) + width * 2}
			height={Math.abs(dy + y)}
			style={{
				zIndex: -1,
				position: 'fixed',
				left: dx >= 0 ? tail.x - width / 2 : tail.x + dx - width / 2,
				top: tail.y,
			}}>
			<path
				d={
					// why does controldist - width work on left-facing arrows? bro who knows
					(dx &&
						(dx > 0
							? `M ${width / 2} 0
							v ${y}
							c 0 ${controlDist} ${dx} ${dy - controlDist} ${dx} ${dy - width}
							h ${-width / 2}
							l ${width} ${width}
							l ${width} ${-width}
							h ${-width / 2}
							c 0 ${-controlDist} ${-dx} ${-dy + controlDist} ${-dx} ${-dy + width}
							v ${-y}
							z`
							: `M ${width / 2 - dx} 0
							v ${y}
							c 0 ${controlDist - width} ${dx} ${dy - controlDist - width} ${dx} ${dy - width}
							h ${-width / 2}
							l ${width} ${width}
							l ${width} ${-width}
							h ${-width / 2}
							c 0 ${-controlDist + width} ${-dx} ${-dy + controlDist + width} ${-dx} ${-dy + width}
							v ${-y}
							z`)) ||
					`M ${width / 2} 0 
							v ${y}
							v ${dy - width} 
							h ${-width / 2}
							l ${width} ${width}
							l ${width} ${-width}
							h ${-width / 2}
							v ${-dy + width}
							v ${-y}
							z`
				}
				fill={colour}
				stroke={colour}
			/>
		</svg>
	);
};

export default Arrow;

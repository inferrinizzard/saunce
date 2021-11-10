import React from 'react';

import { CardBlockSize } from './Card';

export interface ArrowProps {
	head?: Pos;
	tail?: Pos;
	colour: string;
	height?: number;
}

const Arrow: React.FC<ArrowProps> = ({ head, tail, colour, height }) => {
	if (!head || !tail) return null;
	const dx = head.x - tail.x;
	let dy = head.y - tail.y;
	let y1 = 0,
		y2 = 0;
	if (dy > CardBlockSize.y) {
		y1 = (height ?? Math.floor(dy / CardBlockSize.y)) * CardBlockSize.y;
		dy = dy % CardBlockSize.y;
		y2 = head.y - tail.y - dy - y1;
	}
	const controlDist = dy;
	const width = 20;
	return (
		<svg
			width={Math.abs(dx) + width * 2}
			height={Math.abs(dy + y1 + y2)}
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
							v ${y1}
							c 0 ${controlDist} ${dx} ${dy - controlDist} ${dx} ${dy - width}
							v ${y2}
							h ${-width / 2}
							l ${width} ${width}
							l ${width} ${-width}
							h ${-width / 2}
							v ${-y2}
							c 0 ${-controlDist} ${-dx} ${-dy + controlDist} ${-dx} ${-dy + width}
							v ${-y1}
							z`
							: `M ${width / 2 - dx} 0
							v ${y1}
							c 0 ${controlDist - width} ${dx} ${dy - controlDist - width} ${dx} ${dy - width}
							v ${y2}
							h ${-width / 2}
							l ${width} ${width}
							l ${width} ${-width}
							h ${-width / 2}
							v ${-y2}
							c 0 ${-controlDist + width} ${-dx} ${-dy + controlDist + width} ${-dx} ${-dy + width}
							v ${-y1}
							z`)) ||
					`M ${width / 2} 0 
							v ${y1}
							v ${dy - width} 
							h ${-width / 2}
							l ${width} ${width}
							l ${width} ${-width}
							h ${-width / 2}
							v ${-dy + width}
							v ${-y1}
							z`
				}
				fill={colour}
				stroke={colour}
			/>
		</svg>
	);
};

export default Arrow;

import React from 'react';

import { Pos } from './Card';

export interface ArrowProps {
	head: Pos;
	tail: Pos;
	colour: string;
}

const Arrow: React.FC<ArrowProps> = ({ head, tail, colour }) => {
	const dx = head.x - tail.x;
	const dy = head.y - tail.y;
	const controlDist = dy / 2;
	const width = 20;
	return (
		<svg
			width={Math.abs(dx) + width * 2}
			height={Math.abs(dy)}
			style={{ position: 'fixed', left: tail.x - width / 2, top: tail.y }}>
			<path
				d={
					dx
						? `M ${width / 2} 0
							c 0 ${controlDist} ${dx} ${dy - controlDist} ${dx} ${dy - width}
							h ${-width / 2}
							l ${width} ${width}
							l ${width} ${-width}
							h ${-width / 2}
							c 0 ${-controlDist} ${-dx} ${-dy + controlDist} ${-dx + width / 2} ${-dy + width}
							z`
						: `M ${width / 2} 0 
							v ${dy - width} 
							h ${-width / 2}
							l ${width} ${width}
							l ${width} ${-width}
							h ${-width / 2}
							v ${-dy + width}
							z`
				}
				fill={colour}
				stroke={colour}
			/>
		</svg>
	);
};

export default Arrow;

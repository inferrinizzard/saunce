import React from 'react';

import { Pos } from './Card';

export interface ArrowProps {
	head: Pos;
	tail: Pos;
}

const Arrow: React.FC<ArrowProps> = ({ head, tail }) => {
	const x = head.x - tail.x;
	const y = head.y - tail.y;
	const controlDist = y / 2;
	return (
		<svg
			width={Math.abs(head.x - tail.x) + tail.x}
			height={Math.abs(head.y - tail.y) + tail.y}
			style={{ position: 'fixed', left: tail.x, top: tail.y }}>
			<path
				d={`M 0 0 c 0 ${controlDist} ${head.x - tail.x} ${head.y - tail.y - controlDist} ${
					head.x - tail.x
				} ${head.y - tail.y}`}
				fill="white"
				stroke="salmon"
				strokeWidth={20}
			/>
		</svg>
	);
};

export default Arrow;

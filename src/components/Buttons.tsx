import React from 'react';

import { Pos, CardBlockSize } from './Card';

export interface ButtonsProps {
	pos: Pos;
	setPos: (pos: Pos) => void;
}

const Buttons: React.FC<ButtonsProps> = ({ pos, setPos }) => {
	return (
		<React.Fragment>
			<button
				style={{
					position: 'absolute',
					top: '50%',
					right: '-100px',
					backgroundColor: 'salmon',
					height: '50px',
					width: '50px',
					borderRadius: '25px',
					fontSize: '25px',
				}}
				onClick={() => setPos({ x: pos.x + CardBlockSize.x, y: pos.y })}>
				→
			</button>
			<button
				style={{
					position: 'absolute',
					top: '50%',
					left: '-100px',
					backgroundColor: 'salmon',
					height: '50px',
					width: '50px',
					borderRadius: '25px',
					fontSize: '25px',
				}}
				onClick={() => setPos({ x: pos.x - CardBlockSize.x, y: pos.y })}>
				←
			</button>
			<button
				style={{
					position: 'absolute',
					top: '-100px',
					left: 'calc(50% - 25px)',
					backgroundColor: 'salmon',
					height: '50px',
					width: '50px',
					borderRadius: '25px',
					fontSize: '25px',
				}}
				onClick={() => setPos({ x: pos.x, y: pos.y - CardBlockSize.y })}>
				↑
			</button>
			<button
				style={{
					position: 'absolute',
					bottom: '-100px',
					left: 'calc(50% - 25px)',
					backgroundColor: 'salmon',
					height: '50px',
					width: '50px',
					borderRadius: '25px',
					fontSize: '25px',
				}}
				onClick={() => setPos({ x: pos.x, y: pos.y + CardBlockSize.y })}>
				↓
			</button>
		</React.Fragment>
	);
};

export default Buttons;

import React from 'react';

import styled from '../util/Styled';

import Plus from '@bit/mui-org.material-ui-icons.add-rounded';
import Minus from '@bit/mui-org.material-ui-icons.remove-rounded';
import Cross from '@bit/mui-org.material-ui-icons.close-rounded';
import Search from '@bit/mui-org.material-ui-icons.search-rounded';

const Button = styled('button')({})`
	position: fixed;
	height: 3em;
	min-width: 3em;

	display: flex;
  align-items: center;
	justify-content: center;
	
	background-color: ${p => p.theme.offwhite};
	outline: none;
	border: none;
	border-radius: 0.75em;
	box-shadow: 0.125em 0.25em 0.5em salmon;
`;

export interface OverlayProps {
	transform: { scale: number; translation: { x: number; y: number } };
	setTransform: (transform: { scale: number; translation: { x: number; y: number } }) => void;
}

const Overlay: React.FC<OverlayProps> = ({ transform, setTransform }) => {
	return (
		<div style={{ position: 'fixed', right: 0, top: 0, zIndex: 3 }}>
			<Button
				// onClick={() => setTransform({ ...transform, scale: transform.scale + 0.1 })} // lerp this
				style={{ right: '10em', top: '2em' }}>
				<Search />
			</Button>
			<Button
				onClick={() => setTransform({ ...transform, scale: transform.scale + 0.1 })} // lerp this, also unbounded
				style={{ right: '6em', top: '2em' }}>
				<Plus />
			</Button>
			<Button
				onClick={() => setTransform({ ...transform, scale: transform.scale - 0.1 })} // lerp this, also unbounded
				style={{ right: '2em', top: '2em' }}>
				<Minus />
			</Button>
			{false && (
				<Button
					// onClick={() => setTransform({ ...transform, scale: transform.scale - 0.1 })} // lerp this
					style={{ position: 'fixed', left: '2em', top: '2em' }}>
					<Cross />
				</Button>
			)}
			<Button
				// onClick={() => setTransform({ ...transform, scale: transform.scale - 0.1 })} // lerp this
				style={{ right: '2em', bottom: '2em' }}>
				<h2>Credits</h2>
			</Button>
		</div>
	);
};

export default Overlay;

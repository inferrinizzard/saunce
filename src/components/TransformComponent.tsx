import React, { useState } from 'react';
import { MapInteraction, MapInteractionCSS } from 'react-map-interaction';
import { InferProps } from 'prop-types';

type MapInteractionProps = InferProps<typeof MapInteraction.propTypes>;

export class TransformComponentCore extends MapInteraction {
	constructor(props: MapInteractionProps) {
		super(props);
	}
}

interface TransformComponentProps {}

const TransformComponent: React.FC<TransformComponentProps | MapInteractionProps> = props => {
	return (
		<TransformComponentCore {...props}>
			{({ translation, scale }: { translation: Pos; scale: number }) => {
				// Translate first and then scale.  Otherwise, the scale would affect the translation.
				const transform = `translate(${translation.x}px, ${translation.y}px) scale(${scale})`;
				return (
					<div
						style={{
							height: '100%',
							width: '100%',
							position: 'relative', // for absolutely positioned children
							overflow: 'hidden',
							touchAction: 'none', // Not supported in Safari :(
							msTouchAction: 'none',
							cursor: 'all-scroll',
							WebkitUserSelect: 'none',
							MozUserSelect: 'none',
							msUserSelect: 'none',
						}}>
						<div
							style={{
								display: 'inline-block', // size to content
								transform: transform,
								transformOrigin: '0 0 ',
							}}>
							{props.children}
						</div>
					</div>
				);
			}}
		</TransformComponentCore>
	);
};

export default TransformComponent;

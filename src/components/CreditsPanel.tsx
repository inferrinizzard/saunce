import React from 'react';

import { Raised } from './Overlay';
import { Chip } from './ActivePanel';

import notes from '../data/notes.json';

export interface CreditsPanelProps {}

const CreditsPanel: React.FC<CreditsPanelProps> = () => {
	return (
		<Raised
			shadow={false}
			position="fixed"
			style={{
				left: 0,
				top: 0,
				width: 'calc(100% - 1rem)',
				height: 'calc(100% - 1rem)',
				zIndex: 4,
				borderStyle: 'solid',
				borderWidth: '0 1rem 1rem 0',
				borderRadius: '0 0 2rem 0',
			}}>
			<div
				style={{
					position: 'relative',
					padding: '4rem',
					width: 'calc(50% - 8rem)',
					height: 'calc(100% - 8rem)',
				}}>
				<div>
					<h1>{'Made with React + Gatsby'}</h1>
					<h2>{'By: inferrinizzard'}</h2>
					{notes.profile.map((link, i) => (
						<div key={i}>
							<a href={Object.keys(link)[0]}>
								<h2 style={{ display: 'inline' }}>{Object.keys(link)[0]}</h2>
							</a>
						</div>
					))}
					<h1>{'Credits:'}</h1>
					{notes.credits.map(({ name, link }, i) => (
						<div key={i} style={{ paddingBottom: '0.75rem' }}>
							<h2 style={{ display: 'inline' }}>{name}</h2>
							<h2 style={{ display: 'inline' }}>{' - '}</h2>
							<a href={link}>
								<h2 style={{ display: 'inline' }}>Link</h2>
							</a>
						</div>
					))}
				</div>
			</div>
			<div
				className="vr"
				style={{ borderLeft: '0.25rem solid salmon', height: 'calc(100vh - 4rem)' }}
			/>
			<div
				style={{
					position: 'relative',
					padding: '2rem',
					width: 'calc(50% - 8rem)',
					height: 'calc(100% - 8rem)',
				}}>
				<Raised style={{ flexWrap: 'wrap', justifyContent: 'left', padding: '1rem' }}>
					<h2>Unused Sauces:</h2>
					<div>
						{notes.neglected.map(sauce => (
							<Chip
								key={sauce}
								style={{
									cursor: 'default',
								}}>
								{sauce}
							</Chip>
						))}
					</div>
				</Raised>
			</div>
		</Raised>
	);
};

export default CreditsPanel;

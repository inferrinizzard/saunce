import React, { useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import notes from '../data/notes.json';

import { LangContext } from '../pages/App';
import { Raised, RaisedButton } from './Overlay';
import { Chip, Row } from './ActivePanel';

// * motion anim JSS
const animDuration = 0.35;
const expandingButtonAnim = {
	open: {
		width: '100vw',
		height: '100vh',
		left: '0rem',
		bottom: '0rem',
		transition: { ease: 'easeOut', duration: animDuration, when: 'beforeChildren' },
	},
	closed: {
		width: 'auto',
		height: 'auto',
		left: '2rem',
		bottom: '2rem',
		transition: { ease: 'easeIn', duration: animDuration, when: 'afterChildren' },
	},
};
const headerAnim = {
	open: {
		margin: '0rem',
		top: '2rem',
		left: '6rem',
		fontSize: '3rem',
		transition: { ease: 'easeOut', duration: animDuration },
	},
	closed: {
		margin: '0.5rem',
		top: 0,
		left: 0,
		fontSize: '1.5rem',
		transition: { ease: 'easeIn', duration: animDuration },
	},
};
const cardAnim = {
	open: {
		opacity: 1,
		transition: { ease: 'easeOut', duration: animDuration, delay: animDuration },
	},
	closed: {
		opacity: 0,
		transition: { ease: 'easeIn', duration: animDuration },
	},
};

export interface CreditsPanelProps {
	active: boolean;
	onClick: () => void;
}

const CreditsPanel: React.FC<CreditsPanelProps> = ({ active, onClick }) => {
	const lang = useContext(LangContext);

	return (
		<RaisedButton
			as={motion.button}
			disabled={active}
			position="fixed"
			onClick={onClick}
			style={{
				...(active ? {} : { cursor: 'pointer', minWidth: '6rem' }),
				zIndex: 3,
			}}
			initial="closed"
			animate={active ? 'open' : 'closed'}
			variants={expandingButtonAnim}>
			<motion.h1
				style={{ position: 'absolute' }}
				initial="closed"
				animate={active ? 'open' : 'closed'}
				variants={headerAnim}>
				{`Cr${lang === 'en' ? 'e' : 'é'}dits${active ? ':' : ''}`}
			</motion.h1>
			<AnimatePresence exitBeforeEnter>
				{active && (
					<>
						<div
							style={{
								position: 'relative',
								padding: '4rem',
								width: 'calc(50% - 8rem)',
								height: 'calc(100% - 8rem)',
							}}>
							<div>
								<Raised
									as={motion.div}
									initial="closed"
									animate={active ? 'open' : 'closed'}
									exit="closed"
									variants={cardAnim}
									position="relative"
									style={{
										display: 'block',
										width: 'calc(100% - 2rem)',
										padding: '2rem',
										marginTop: '2rem',
										marginBottom: '2rem',
									}}>
									<h1 style={{ marginTop: 0 }}>{`${
										lang === 'en' ? 'Made with' : 'Fais avec'
									} React + Gatsby`}</h1>
									<Row />
									<h2>{`${lang === 'en' ? 'By' : 'Fait par'}: inferrinizzard`}</h2>
									{notes.profile.map((link, i) => (
										<div key={i}>
											<a href={Object.keys(link)[0]}>
												<h2 style={{ display: 'inline' }}>{Object.keys(link)[0]}</h2>
											</a>
										</div>
									))}
								</Raised>
								<Raised
									as={motion.div}
									initial="closed"
									animate={active ? 'open' : 'closed'}
									exit="closed"
									variants={cardAnim}
									position="relative"
									style={{
										display: 'block',
										width: 'calc(100% - 2rem)',
										padding: '2rem',
										marginBottom: '2rem',
									}}>
									<h1 style={{ marginTop: 0 }}>Sources:</h1>
									<Row />
									<div>
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
								</Raised>
							</div>
						</div>
						<div style={{ borderLeft: '0.25rem solid salmon', height: 'calc(100vh - 4rem)' }} />
						<div
							style={{
								position: 'relative',
								padding: '2rem',
								width: 'calc(50% - 8rem)',
								height: 'calc(100% - 8rem)',
							}}>
							<Raised
								as={motion.div}
								initial="closed"
								animate={active ? 'open' : 'closed'}
								exit="closed"
								variants={cardAnim}
								style={{
									display: 'block',
									padding: '1rem',
									marginTop: '2rem',
								}}>
								<h1 style={{ marginTop: 0 }}>
									{lang === 'en' ? 'Unused Sauces not included:' : 'Autres Sauces pas inclus:'}
								</h1>
								<Row />
								<div>
									{notes.neglected.map(sauce => (
										<Chip key={sauce} style={{ cursor: 'default' }}>
											{sauce}
										</Chip>
									))}
								</div>
							</Raised>
						</div>
					</>
				)}
			</AnimatePresence>
		</RaisedButton>
	);
};

export default CreditsPanel;

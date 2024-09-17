import { TranslationShape, ClientPosShape } from './MapInteraction';

function clamp(min: number, value: number, max: number) {
	return Math.max(min, Math.min(value, max));
}

function distance(p1: TranslationShape, p2: TranslationShape) {
	const dx = p1.x - p2.x;
	const dy = p1.y - p2.y;
	return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
}

function midpoint(p1: TranslationShape, p2: TranslationShape) {
	return {
		x: (p1.x + p2.x) / 2,
		y: (p1.y + p2.y) / 2,
	};
}

function touchPt(touch: ClientPosShape) {
	return { x: touch.clientX, y: touch.clientY };
}

function touchDistance(t0: ClientPosShape, t1: ClientPosShape) {
	const p0 = touchPt(t0);
	const p1 = touchPt(t1);
	return distance(p0, p1);
}

export { clamp, distance, midpoint, touchPt, touchDistance };

/*
 * Borrowed from here: https://codepen.io/sosuke/pen/Pjoqqp?editors=0010
 * based on here: https://stackoverflow.com/questions/42966641/how-to-transform-black-into-any-given-color-using-only-css-filters/43960991#43960991
 * thanks to here: https://stackoverflow.com/users/2688027/multiplybyzer0 and https://stackoverflow.com/users/3776935/dave
 */

class Color {
	r!: number;
	g!: number;
	b!: number;
	constructor(r: number, g: number, b: number) {
		this.set(r, g, b);
	}

	triple = () => [this.r, this.g, this.b];
	set = (r: number, g: number, b: number) => ([this.r, this.g, this.b] = [r, g, b].map(x => this.clamp(x))); // prettier-ignore
	toString = () => `rgb(${Math.round(this.r)}, ${Math.round(this.g)}, ${Math.round(this.b)})`;

	hueRotate(angle = 0) {
		angle = (angle / 180) * Math.PI;
		const sin = Math.sin(angle);
		const cos = Math.cos(angle);

		this.multiply(
			((a, b, c) => a.map((x, i) => x + cos * b[i] + sin * c[i]))(
				[0.213, 0.715, 0.072, 0.213, 0.715, 0.072, 0.213, 0.715, 0.072],
				[+0.787, -0.715, -0.072, -0.213, +0.285, -0.072, -0.213, -0.715, +0.928],
				[-0.213, -0.715, +0.928, +0.143, +0.14, -0.283, -0.787, +0.715, +0.072]
			)
		);
	}

	grayscale = (value = 1) =>
		this.multiply(
			((a, b) => a.map((x, i) => x + b[i] * (1 - value)))(
				[0.2126, 0.7152, 0.0722, 0.2126, 0.7152, 0.0722, 0.2126, 0.7152, 0.0722],
				[+0.7874, -0.7152, -0.0722, -0.2126, +0.2848, -0.0722, -0.2126, -0.7152, +0.9278]
			)
		);

	sepia = (value = 1) =>
		this.multiply(
			((a, b) => a.map((x, i) => x + b[i] * (1 - value)))(
				[0.393, 0.769, 0.189, 0.349, 0.686, 0.168, 0.272, 0.534, 0.131],
				[+0.607, -0.769, -0.189, -0.349, +0.314, -0.168, -0.272, -0.534, +0.869]
			)
		);

	saturate = (value = 1) =>
		this.multiply(
			((a, b) => a.map((x, i) => x + b[i] * value))(
				[0.213, 0.715, 0.072, 0.213, 0.715, 0.072, 0.213, 0.715, 0.072],
				[+0.787, -0.715, -0.072, -0.213, +0.285, -0.072, -0.213, -0.715, +0.928]
			)
		);

	multiply = (matrix:number[]) =>
		this.set(...[0, 3, 6].map(j => this.triple().reduce((a, x, i) => a + x * matrix[i + j], 0)) as [number, number, number]); //prettier-ignore

	brightness = (value = 1) => this.linear(value);

	contrast = (value = 1) => this.linear(value, -(0.5 * value) + 0.5);

	linear = (slope = 1, intercept = 0) =>
		this.set(...(this.triple().map(x => x * slope + intercept * 255) as [number, number, number]));

	invert = (value = 1) =>
		this.set(...this.triple().map(x => (value + (x / 255) * (1 - 2 * value)) * 255) as [number, number, number]); //prettier-ignore

	hsl(): HSL {
		// Code taken from https://stackoverflow.com/a/9493060/2688027, licensed under CC BY-SA.
		const [r, g, b] = this.triple().map(x => x / 255);
		const maxPair = Object.entries({ r, g, b }).reduce((a, [k, v]) => (a.v > v ? a : { k, v }), { k: '', v: 0 }); // prettier-ignore
		const max = maxPair.v;
		const min = Math.min(r, g, b);
		let h, s, l;
		l = (max + min) / 2;

		if (max === min) {
			h = s = 0;
		} else {
			const d = max - min;
			s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
			h = ({
				r: (g - b) / d + (g < b ? 6 : 0),
				g: (b - r) / d + 2,
				b: (r - g) / d + 4,
			} as { [x: string]: number })[maxPair.k];
			h /= 6;
		}

		[h, s, l] = [h, s, l].map(x => x * 100);
		return { h, s, l };
	}

	clamp = (value: number) => (value > 255 && 255) || (value < 0 && 0) || value;
}

type HSL = { h: number; s: number; l: number };
type SPSALoss = { values: number[]; loss: number };

class Solver {
	target: Color;
	targetHSL: HSL;
	reusedColor: Color;
	constructor(target: Color) {
		this.target = target;
		this.targetHSL = target.hsl();
		this.reusedColor = new Color(0, 0, 0);
	}

	solve() {
		const result = this.solveNarrow(this.solveWide());
		return {
			values: result.values,
			loss: result.loss,
			filter: this.css(result.values),
		};
	}

	solveWide() {
		const [A, c] = [5, 15];
		const a = [60, 180, 18000, 600, 1.2, 1.2];

		const initial = [50, 20, 3750, 50, 100, 100];
		let best: SPSALoss = { values: initial, loss: Infinity };
		for (let i = 0; best.loss > 25 && i < 3; i++)
			best = [best, this.spsa(A, a, c, initial, 1000)].reduce((acc, res) =>
				acc.loss < res.loss ? acc : res
			);
		return best;
	}

	solveNarrow(wide: SPSALoss) {
		const [A, c] = [wide.loss, 2];
		const A1 = A + 1;
		const a = [0.25 * A1, 0.25 * A1, A1, 0.25 * A1, 0.2 * A1, 0.2 * A1];
		return this.spsa(A, a, c, wide.values, 500);
	}

	spsa(A: number, a: number[], c: number, values: number[], iters: number): SPSALoss {
		const [alpha, gamma] = [1, 1.0 / 6];

		let best: SPSALoss = { values: [], loss: Infinity };
		const [deltas, highArgs, lowArgs] = [0, 0, 0].map(_ => new Array(6));

		let fix = (value: number, i: number) => {
			let max = ({ 2: 7500, 4: 200, 5: 200 } as { [x: number]: number })[i] || 100;
			return (
				(value > max && max) || (value < 0 && (value = i === 3 ? max + (value % max) : 0)) || value
			);
		};

		for (let k = 0; k < iters; k++) {
			const ck = c / Math.pow(k + 1, gamma);
			for (let i = 0; i < 6; i++) {
				deltas[i] = Math.random() > 0.5 ? 1 : -1;
				highArgs[i] = values[i] + ck * deltas[i];
				lowArgs[i] = values[i] - ck * deltas[i];
			}

			const lossDiff = this.loss(highArgs) - this.loss(lowArgs);
			for (let i = 0; i < 6; i++) {
				const g = (lossDiff / (2 * ck)) * deltas[i];
				const ak = a[i] / Math.pow(A + k + 1, alpha);
				values[i] = fix(values[i] - ak * g, i);
			}

			const loss = this.loss(values);
			if (loss < best.loss) best = { values, loss };
		}
		return best;
	}

	loss(filters: number[]) {
		// Argument is array of percentages.
		const color = this.reusedColor;
		color.set(0, 0, 0);

		color.invert(filters[0] / 100);
		color.sepia(filters[1] / 100);
		color.saturate(filters[2] / 100);
		color.hueRotate(filters[3] * 3.6);
		color.brightness(filters[4] / 100);
		color.contrast(filters[5] / 100);

		const colorHSL = color.hsl();
		return (
			Math.abs(color.r - this.target.r) +
			Math.abs(color.g - this.target.g) +
			Math.abs(color.b - this.target.b) +
			Math.abs(colorHSL.h - this.targetHSL.h) +
			Math.abs(colorHSL.s - this.targetHSL.s) +
			Math.abs(colorHSL.l - this.targetHSL.l)
		);
	}

	css = (filters: number[]) =>
		['invert', 'sepia', 'saturate', 'hue-rotate', 'brightness', 'contrast'].reduce(
			(acc, f, i) =>
				` ${acc} ${f}(${Math.round(filters[i] * (i === 3 ? 3.6 : 1))}${i === 3 ? 'deg' : '%'})`,
			'filter:'
		) + ';';
}

const hexToRgb = (hex: string) => {
	// Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
	const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
	hex = hex.replace(shorthandRegex, (m, ...colour) => colour.reduce((a, x) => a + x + x, ''));

	const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result ? result.slice(1).map(x => parseInt(x, 16)) : null;
};

const ShiftColour = (colour: string) => {
	let solver = new Solver(new Color(...(hexToRgb(colour) as [number, number, number])));
	let result = { loss: Infinity, filter: '' };
	while (result.loss > 15) result = solver.solve();
	return result.filter;
};

export default ShiftColour;

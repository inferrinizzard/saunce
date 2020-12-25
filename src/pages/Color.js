/*
 * Borrowed from here: https://codepen.io/sosuke/pen/Pjoqqp?editors=0010
 * based on here: https://stackoverflow.com/questions/42966641/how-to-transform-black-into-any-given-color-using-only-css-filters/43960991#43960991
 * thanks to here: https://stackoverflow.com/users/2688027/multiplybyzer0 and https://stackoverflow.com/users/3776935/dave
 */

class Color {
	constructor(r, g, b) {
		this.set(r, g, b);
	}

	triple = () => [this.r, this.g, this.b];

	toString = () => `rgb(${Math.round(this.r)}, ${Math.round(this.g)}, ${Math.round(this.b)})`;

	set = (r, g, b) => ([this.r, this.g, this.b] = [r, g, b].map(x => this.clamp(x)));

	hueRotate(angle = 0) {
		angle = (angle / 180) * Math.PI;
		const sin = Math.sin(angle);
		const cos = Math.cos(angle);

		this.multiply([
			0.213 + cos * 0.787 - sin * 0.213,
			0.715 - cos * 0.715 - sin * 0.715,
			0.072 - cos * 0.072 + sin * 0.928,
			0.213 - cos * 0.213 + sin * 0.143,
			0.715 + cos * 0.285 + sin * 0.14,
			0.072 - cos * 0.072 - sin * 0.283,
			0.213 - cos * 0.213 - sin * 0.787,
			0.715 - cos * 0.715 + sin * 0.715,
			0.072 + cos * 0.928 + sin * 0.072,
		]);
	}

	grayscale(value = 1) {
		this.multiply([
			0.2126 + 0.7874 * (1 - value),
			0.7152 - 0.7152 * (1 - value),
			0.0722 - 0.0722 * (1 - value),
			0.2126 - 0.2126 * (1 - value),
			0.7152 + 0.2848 * (1 - value),
			0.0722 - 0.0722 * (1 - value),
			0.2126 - 0.2126 * (1 - value),
			0.7152 - 0.7152 * (1 - value),
			0.0722 + 0.9278 * (1 - value),
		]);
	}

	sepia(value = 1) {
		this.multiply([
			0.393 + 0.607 * (1 - value),
			0.769 - 0.769 * (1 - value),
			0.189 - 0.189 * (1 - value),
			0.349 - 0.349 * (1 - value),
			0.686 + 0.314 * (1 - value),
			0.168 - 0.168 * (1 - value),
			0.272 - 0.272 * (1 - value),
			0.534 - 0.534 * (1 - value),
			0.131 + 0.869 * (1 - value),
		]);
	}

	saturate(value = 1) {
		this.multiply([
			0.213 + 0.787 * value,
			0.715 - 0.715 * value,
			0.072 - 0.072 * value,
			0.213 - 0.213 * value,
			0.715 + 0.285 * value,
			0.072 - 0.072 * value,
			0.213 - 0.213 * value,
			0.715 - 0.715 * value,
			0.072 + 0.928 * value,
		]);
	}

	multiply = matrix =>
		this.set(...[0, 3, 6].map(j => this.triple().reduce((a, x, i) => a + x * matrix[i + j], 0)));

	brightness = (value = 1) => this.linear(value);
	contrast = (value = 1) => this.linear(value, -(0.5 * value) + 0.5);

	linear = (slope = 1, intercept = 0) =>
		this.set(...this.triple().map(x => x * slope + intercept * 255));

	invert = (value = 1) =>
		this.set(...this.triple().map(x => (value + (x / 255) * (1 - 2 * value)) * 255));

	hsl() {
		// Code taken from https://stackoverflow.com/a/9493060/2688027, licensed under CC BY-SA.
		const [r, g, b] = this.triple().map(x => x / 255);
		const max = Math.max(r, g, b);
		const min = Math.min(r, g, b);
		let h,
			s,
			l = (max + min) / 2;

		if (max === min) {
			h = s = 0;
		} else {
			const d = max - min;
			s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
			switch (max) {
				case r:
					h = (g - b) / d + (g < b ? 6 : 0);
					break;

				case g:
					h = (b - r) / d + 2;
					break;

				case b:
					h = (r - g) / d + 4;
					break;
				default:
					break;
			}
			h /= 6;
		}

		[h, s, l] = [h, s, l].map(x => x * 100);
		return { h, s, l };
	}

	clamp = value => (value > 255 && 255) || (value < 0 && 0) || value;
}

class Solver {
	constructor(target, baseColor) {
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
		const A = 5;
		const c = 15;
		const a = [60, 180, 18000, 600, 1.2, 1.2];

		let best = { loss: Infinity };
		for (let i = 0; best.loss > 25 && i < 3; i++) {
			const initial = [50, 20, 3750, 50, 100, 100];
			const result = this.spsa(A, a, c, initial, 1000);
			if (result.loss < best.loss) best = result;
		}
		return best;
	}

	solveNarrow(wide) {
		const A = wide.loss;
		const c = 2;
		const A1 = A + 1;
		const a = [0.25 * A1, 0.25 * A1, A1, 0.25 * A1, 0.2 * A1, 0.2 * A1];
		return this.spsa(A, a, c, wide.values, 500);
	}

	spsa(A, a, c, values, iters) {
		const alpha = 1;
		const gamma = 0.16666666666666666;

		let best = null;
		let bestLoss = Infinity;
		const [deltas, highArgs, lowArgs] = [0, 0, 0].map(_ => new Array(6));

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
			if (loss < bestLoss) {
				best = values.slice(0);
				bestLoss = loss;
			}
		}
		return { values: best, loss: bestLoss };

		function fix(value, idx) {
			let max = { 2: 7500, 4: 200, 5: 200 }[idx] || 100;
			return (
				(value > max && max) ||
				(value < 0 && (value = idx === 3 ? max + (value % max) : 0)) ||
				value
			);
		}
	}

	loss(filters) {
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

	css = filters =>
		['invert', 'sepia', 'saturate', 'hue-rotate', 'brightness', 'contrast'].reduce(
			(acc, f, i) =>
				` ${acc} ${f}(${Math.round(filters[i] * (i === 3 ? 3.6 : 1))}${i === 3 ? 'deg' : '%'})`,
			'filter:'
		) + ';';
}

const hexToRgb = hex => {
	// Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
	const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
	hex = hex.replace(shorthandRegex, (m, ...colour) => colour.reduce((a, x) => a + x + x, ''));

	const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result ? result.slice(1).map(x => parseInt(x, 16)) : null;
};

const ShiftColour = colour => new Solver(new Color(...hexToRgb(colour))).solve().filter;

export default ShiftColour;

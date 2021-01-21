import sauces from '../data/sauce.json';
// import ingredients from '../data/ingredients.json'

declare global {
	type SauceName = keyof typeof sauces;
	type Sauce = { nom: string; desc: string; ingredients: string[]; temp?: string };
	type SauceList = Record<SauceName, Sauce>;

	type Pos = { x: number; y: number };
}

// import { readFileSync } from 'fs';
let readFileSync = require('fs').readFileSync;
let writeFileSync = require('fs').writeFileSync;

let filles = JSON.parse(Buffer.from(readFileSync('src/data/filles.json')).toString());
let sauces = JSON.parse(Buffer.from(readFileSync('src/data/sauce.json')).toString());

console.log(
	Object.values(filles)
		.reduce((arr, v) => [...arr, ...v], [])
		.filter(sauce => !Object.keys(sauces).includes(sauce))
);

// sauces = Object.entries(sauces).reduce(
// 	(acc, [sauce, filles]) => ({
// 		...acc,
// 		[sauce]: filles.sort((a, b) =>
// 			sauces[a] || sauces[b]
// 				? ((sauces[a] && sauces[a].length) || 0) - ((sauces[b] && sauces[b].length) || 0)
// 				: a - b
// 		),
// 	}),
// 	{}
// );
// console.log(sauces);
// writeFileSync('src/data/filles.json', JSON.stringify(sauces));

// let mothers = sauces.mothers;
// console.log(sauces.dérivées);

// const getDérivées = sauce =>
// 	sauce.daughters &&
// 	sauce.daughters instanceof Array &&
// 	sauce.daughters.every(daughter => typeof daughter === 'string') &&
// 	(sauce.daughters = sauce.daughters.map(daughter =>
// 		sauces.dérivées.find(sauce => sauce.name === daughter)
// 	));

// let q = [...mothers];
// while (q.length) {
// 	let i = q.pop();
// 	getDérivées(i);
// 	if (i.daughters) q = [...q, ...i.daughters];
// }

// // writeFileSync('temp.json', JSON.stringify(mothers));

// let list = [];
// q = [...mothers, ...sauces.misc];
// while (q.length) (i => (list.push(i.name), (q = [...q, ...i.daughters])))(q.pop());
// list = list.filter((sauce, i) => list.indexOf(sauce) == i).sort();
// // console.log(list.length);

// let all = [...sauces.mothers, ...sauces.dérivées, ...sauces.misc].map(sauce => sauce.name).sort();
// // console.log(all.length);
// console.log(all.filter(sauce => !list.includes(sauce)));

import { navigate } from '@reach/router';
export const nav = (sauce: SauceName) => navigate(`/#${sauce.replace(/\s/g, '_')}`);
export const deaccent = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

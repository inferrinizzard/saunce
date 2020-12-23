import _styled, { AnyStyledComponent } from 'styled-components';

type StyledProps = {};

export const styled = (Element: AnyStyledComponent) => (props: StyledProps) => (
	[head, ...tail]: TemplateStringsArray,
	...tags: (keyof StyledProps | ((p: StyledProps) => string))[]
) =>
	_styled(Element)`${tail.reduce(
		(acc, curr, i) =>
			acc +
			(tags[i].toString() in props ? props[tags[i] as keyof StyledProps] : tags[i](props)) +
			curr,
		head
	)}`;

export const styledStrings = (Element: AnyStyledComponent) => (props: StyledProps) => (
	[head, ...tail]: TemplateStringsArray,
	...tags: (keyof StyledProps)[]
) => _styled(Element)`${tail.reduce((acc, curr, i) => acc + props[tags[i]] + curr, head)}`;

export const styledProps = (Element: AnyStyledComponent) => (props: StyledProps) => (
	[head, ...tail]: TemplateStringsArray,
	...tags: ((p: StyledProps) => string)[]
) => _styled(Element)`${tail.reduce((acc, curr, i) => acc + tags[i](props) + curr, head)}`;

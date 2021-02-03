import _styled, { AnyStyledComponent } from 'styled-components';

interface StyledProps {
	[key: string]: any;
}
type StyledPropFunc = (p: StyledProps) => string | number | null | undefined;

const styled = (
	Element: AnyStyledComponent | keyof JSX.IntrinsicElements | React.ComponentType<any>
) => (staticProps?: StyledProps) => (
	[head, ...tail]: TemplateStringsArray,
	...tags: (keyof StyledProps | StyledPropFunc)[]
) =>
	_styled(Element)<StyledProps>((componentProps: StyledProps) =>
		((props: StyledProps) =>
			`${tail.reduce(
				(acc, curr, i) =>
					acc +
					(((tags[i].toString() in props && props[tags[i] as keyof StyledProps]) ||
						(tags[i] instanceof Function && (tags[i] as StyledPropFunc)(props))) ??
						'') +
					curr,
				head
			)}`)({ ...staticProps, ...componentProps })
	);

export const styledStrings = (Element: AnyStyledComponent) => (props: StyledProps) => (
	[head, ...tail]: TemplateStringsArray,
	...tags: (keyof StyledProps)[]
) => _styled(Element)`${tail.reduce((acc, curr, i) => acc + props[tags[i]] + curr, head)}`;

export const styledProps = (Element: AnyStyledComponent) => (props: StyledProps) => (
	[head, ...tail]: TemplateStringsArray,
	...tags: ((p: StyledProps) => string)[]
) => _styled(Element)`${tail.reduce((acc, curr, i) => acc + tags[i](props) + curr, head)}`;

export default styled;

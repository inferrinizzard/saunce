import * as React from 'react';

function SvgRemoveRounded(props: React.SVGProps<SVGSVGElement>) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			className="RemoveRounded_svg__MuiSvgIcon-root RemoveRounded_svg__MuiSvgIcon-fontSizeMedium RemoveRounded_svg__MuiSvgIcon-fontSizeLarge RemoveRounded_svg__css-1shn170"
			viewBox="0 0 24 24"
			aria-hidden="true"
			data-testid="RemoveRoundedIcon"
			tabIndex={-1}
			width="1em"
			height="1em"
			{...props}>
			<path d="M18 13H6c-.55 0-1-.45-1-1s.45-1 1-1h12c.55 0 1 .45 1 1s-.45 1-1 1z" />
		</svg>
	);
}

export default SvgRemoveRounded;

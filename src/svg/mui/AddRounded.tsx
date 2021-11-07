import * as React from 'react';

function SvgAddRounded(props: React.SVGProps<SVGSVGElement>) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			className="AddRounded_svg__MuiSvgIcon-root AddRounded_svg__MuiSvgIcon-fontSizeMedium AddRounded_svg__MuiSvgIcon-fontSizeLarge AddRounded_svg__css-1shn170"
			viewBox="0 0 24 24"
			aria-hidden="true"
			data-testid="AddRoundedIcon"
			tabIndex={-1}
			width="1em"
			height="1em"
			{...props}>
			<path d="M18 13h-5v5c0 .55-.45 1-1 1s-1-.45-1-1v-5H6c-.55 0-1-.45-1-1s.45-1 1-1h5V6c0-.55.45-1 1-1s1 .45 1 1v5h5c.55 0 1 .45 1 1s-.45 1-1 1z" />
		</svg>
	);
}

export default SvgAddRounded;

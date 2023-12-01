import React from 'react';

interface ITestSvgIconProps {
	className?: string;
}
function TestSvgIcon(props: ITestSvgIconProps) {
	const { className } = props;
	return (
		<svg
			className={className}
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			width="1em"
			height="1em"
		>
			<circle
				cx="12"
				cy="12"
				r="10"
			/>
			<line
				x1="12"
				y1="16"
				x2="12"
				y2="12"
			/>
			<line
				x1="12"
				y1="8"
				x2="12"
				y2="8"
			/>
		</svg>
	);
}

export default TestSvgIcon;

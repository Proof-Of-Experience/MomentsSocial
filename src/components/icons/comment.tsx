import React from 'react';

interface ICommentIconProps extends React.SVGProps<SVGSVGElement> {
	color?: string;
	bgColor?: string;
	borderColor?: string;
	size?: number;
	className?: string;
	onClick?: () => void;
}

const CommentIcon = (props: ICommentIconProps) => {
	const {
		color = '#1C1B1F',
		// bgColor = 'white',
		// borderColor = '#D7D7D7',
		size = 40,
		className,
		onClick,
	} = props;

	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={size}
			height={size}
			viewBox={`0 0 ${size} ${size}`}
			fill="none"
			className={className}
			onClick={onClick}
		>
			<rect
				x="0.5"
				y="0.5"
				width="39"
				height="39"
				rx="19.5"
				fill="white"
			/>
			<rect
				x="0.5"
				y="0.5"
				width="39"
				height="39"
				rx="19.5"
				stroke="#D7D7D7"
			/>
			<mask
				id="mask0_110_1473"
				style={{ maskType: 'alpha' }}
				maskUnits="userSpaceOnUse"
				x="8"
				y="8"
				width="24"
				height="24"
			>
				<rect
					x="8"
					y="8"
					width="24"
					height="24"
					fill="#D9D9D9"
				/>
			</mask>
			<g mask="url(#mask0_110_1473)">
				<path
					d="M12 26C11.45 26 10.9792 25.8042 10.5875 25.4125C10.1958 25.0208 10 24.55 10 24V12C10 11.45 10.1958 10.9792 10.5875 10.5875C10.9792 10.1958 11.45 10 12 10H28C28.55 10 29.0208 10.1958 29.4125 10.5875C29.8042 10.9792 30 11.45 30 12V27.575C30 28.025 29.7958 28.3375 29.3875 28.5125C28.9792 28.6875 28.6167 28.6167 28.3 28.3L26 26H12ZM26.85 24L28 25.125V12H12V24H26.85Z"
					fill={color}
				/>
			</g>
		</svg>
	);
};

export default CommentIcon;

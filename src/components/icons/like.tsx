import React from 'react';

interface ILikeIconProps {
	color?: string;
	bgColor?: string;
	borderColor?: string;
	size?: number;
	className?: string;
	onClick?: () => void;
}

const LikeIcon = (props: ILikeIconProps) => {
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
				id="mask0_110_1453"
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
			<g mask="url(#mask0_110_1453)">
				<path
					d="M29 16C29.5333 16 30 16.2 30.4 16.6C30.8 17 31 17.4667 31 18V20C31 20.1167 30.9833 20.2417 30.95 20.375C30.9167 20.5083 30.8833 20.6333 30.85 20.75L27.85 27.8C27.7 28.1333 27.45 28.4167 27.1 28.65C26.75 28.8833 26.3833 29 26 29H15V16L21 10.05C21.25 9.8 21.5458 9.65417 21.8875 9.6125C22.2292 9.57083 22.5583 9.63333 22.875 9.8C23.1917 9.96667 23.425 10.2 23.575 10.5C23.725 10.8 23.7583 11.1083 23.675 11.425L22.55 16H29ZM17 16.85V27H26L29 20V18H20L21.35 12.5L17 16.85ZM12 29C11.45 29 10.9792 28.8042 10.5875 28.4125C10.1958 28.0208 10 27.55 10 27V18C10 17.45 10.1958 16.9792 10.5875 16.5875C10.9792 16.1958 11.45 16 12 16H15V18H12V27H15V29H12Z"
					fill={color}
				/>
			</g>
		</svg>
	);
};

export default LikeIcon;

import React from 'react';

interface IThreeDotMenuIconProps {
	color?: string;
	bgColor?: string;
	borderColor?: string;
	size?: number;
	className?: string;
	onClick?: () => void;
}

const ThreeDotMenuIcon = (props: IThreeDotMenuIconProps) => {
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
				id="mask0_110_1549"
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
			<g mask="url(#mask0_110_1549)">
				<path
					d="M14 22C13.45 22 12.9792 21.8042 12.5875 21.4125C12.1958 21.0208 12 20.55 12 20C12 19.45 12.1958 18.9792 12.5875 18.5875C12.9792 18.1958 13.45 18 14 18C14.55 18 15.0208 18.1958 15.4125 18.5875C15.8042 18.9792 16 19.45 16 20C16 20.55 15.8042 21.0208 15.4125 21.4125C15.0208 21.8042 14.55 22 14 22ZM20 22C19.45 22 18.9792 21.8042 18.5875 21.4125C18.1958 21.0208 18 20.55 18 20C18 19.45 18.1958 18.9792 18.5875 18.5875C18.9792 18.1958 19.45 18 20 18C20.55 18 21.0208 18.1958 21.4125 18.5875C21.8042 18.9792 22 19.45 22 20C22 20.55 21.8042 21.0208 21.4125 21.4125C21.0208 21.8042 20.55 22 20 22ZM26 22C25.45 22 24.9792 21.8042 24.5875 21.4125C24.1958 21.0208 24 20.55 24 20C24 19.45 24.1958 18.9792 24.5875 18.5875C24.9792 18.1958 25.45 18 26 18C26.55 18 27.0208 18.1958 27.4125 18.5875C27.8042 18.9792 28 19.45 28 20C28 20.55 27.8042 21.0208 27.4125 21.4125C27.0208 21.8042 26.55 22 26 22Z"
					fill={color}
				/>
			</g>
		</svg>
	);
};

export default ThreeDotMenuIcon;

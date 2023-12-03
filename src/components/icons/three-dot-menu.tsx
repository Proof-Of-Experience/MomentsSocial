import { cn } from '@/utils';
import React from 'react';

interface IThreeDotMenuIconProps extends React.SVGProps<SVGSVGElement> {
	className?: string;
	onClick?: () => void;
}

const ThreeDotMenuIcon = (props: IThreeDotMenuIconProps) => {
	const { className, onClick, ...rest } = props;

	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="currentColor"
			className={cn('text-[#1C1B1F] w-6', className)}
			onClick={onClick}
			{...rest}
		>
			<mask
				id="mask0_273_969"
				style={{ maskType: 'alpha' }}
				maskUnits="userSpaceOnUse"
				x="0"
				y="0"
				width="24"
				height="24"
			>
				<rect
					width="24"
					height="24"
					fill="#D9D9D9"
				/>
			</mask>
			<g mask="url(#mask0_273_969)">
				<path
					d="M6 14C5.45 14 4.97917 13.8042 4.5875 13.4125C4.19583 13.0208 4 12.55 4 12C4 11.45 4.19583 10.9792 4.5875 10.5875C4.97917 10.1958 5.45 10 6 10C6.55 10 7.02083 10.1958 7.4125 10.5875C7.80417 10.9792 8 11.45 8 12C8 12.55 7.80417 13.0208 7.4125 13.4125C7.02083 13.8042 6.55 14 6 14ZM12 14C11.45 14 10.9792 13.8042 10.5875 13.4125C10.1958 13.0208 10 12.55 10 12C10 11.45 10.1958 10.9792 10.5875 10.5875C10.9792 10.1958 11.45 10 12 10C12.55 10 13.0208 10.1958 13.4125 10.5875C13.8042 10.9792 14 11.45 14 12C14 12.55 13.8042 13.0208 13.4125 13.4125C13.0208 13.8042 12.55 14 12 14ZM18 14C17.45 14 16.9792 13.8042 16.5875 13.4125C16.1958 13.0208 16 12.55 16 12C16 11.45 16.1958 10.9792 16.5875 10.5875C16.9792 10.1958 17.45 10 18 10C18.55 10 19.0208 10.1958 19.4125 10.5875C19.8042 10.9792 20 11.45 20 12C20 12.55 19.8042 13.0208 19.4125 13.4125C19.0208 13.8042 18.55 14 18 14Z"
					// fill="#1C1B1F"
				/>
			</g>
		</svg>
	);
};

export default ThreeDotMenuIcon;
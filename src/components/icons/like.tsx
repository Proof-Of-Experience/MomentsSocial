import { cn } from '@/utils';
import React from 'react';

interface ILikeIconProps extends React.SVGProps<SVGSVGElement> {
	className?: string;
	onClick?: () => void;
}

const LikeIcon = (props: ILikeIconProps) => {
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
				id="mask0_273_960"
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
			<g mask="url(#mask0_273_960)">
				<path
					d="M21 8.00001C21.5333 8.00001 22 8.20001 22.4 8.60001C22.8 9.00001 23 9.46667 23 10V12C23 12.1167 22.9833 12.2417 22.95 12.375C22.9167 12.5083 22.8833 12.6333 22.85 12.75L19.85 19.8C19.7 20.1333 19.45 20.4167 19.1 20.65C18.75 20.8833 18.3833 21 18 21H7V8.00001L13 2.05001C13.25 1.80001 13.5458 1.65417 13.8875 1.61251C14.2292 1.57084 14.5583 1.63334 14.875 1.80001C15.1917 1.96667 15.425 2.20001 15.575 2.50001C15.725 2.80001 15.7583 3.10834 15.675 3.42501L14.55 8.00001H21ZM9 8.85001V19H18L21 12V10H12L13.35 4.50001L9 8.85001ZM4 21C3.45 21 2.97917 20.8042 2.5875 20.4125C2.19583 20.0208 2 19.55 2 19V10C2 9.45001 2.19583 8.97917 2.5875 8.58751C2.97917 8.19584 3.45 8.00001 4 8.00001H7V10H4V19H7V21H4Z"
					// fill="#1C1B1F"
				/>
			</g>
		</svg>
	);
};

export default LikeIcon;

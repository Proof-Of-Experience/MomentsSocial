import { cn } from '@/utils';
import React from 'react';

interface ICommentIconProps extends React.SVGProps<SVGSVGElement> {
	className?: string;
	onClick?: () => void;
}

const CommentIcon = (props: ICommentIconProps) => {
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
				id="mask0_273_963"
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
			<g mask="url(#mask0_273_963)">
				<path
					d="M4 18C3.45 18 2.97917 17.8042 2.5875 17.4125C2.19583 17.0208 2 16.55 2 16V4C2 3.45 2.19583 2.97917 2.5875 2.5875C2.97917 2.19583 3.45 2 4 2H20C20.55 2 21.0208 2.19583 21.4125 2.5875C21.8042 2.97917 22 3.45 22 4V19.575C22 20.025 21.7958 20.3375 21.3875 20.5125C20.9792 20.6875 20.6167 20.6167 20.3 20.3L18 18H4ZM18.85 16L20 17.125V4H4V16H18.85Z"
					// fill="#1C1B1F"
				/>
			</g>
		</svg>
	);
};

export default CommentIcon;

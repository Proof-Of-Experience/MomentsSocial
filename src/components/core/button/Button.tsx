import React from 'react';
import { PrimaryButtonProps } from '@/model/core';

interface ExtendedProps extends PrimaryButtonProps {
	color?: 'primary' | 'warning' | 'error';
}

const PrimaryButton: React.FC<ExtendedProps> = ({
	text = 'text',
	loader,
	disabled,
	color = 'primary',
	className = '',
	...rest
}) => {
	let bgColor;
	switch (color) {
		case 'primary':
			bgColor = 'bg-blue-500 hover:bg-blue-400';
			break;
		case 'warning':
			bgColor = 'bg-yellow-500 hover:bg-yellow-400';
			break;
		case 'error':
			bgColor = 'bg-red-500 hover:bg-red-400';
			break;
		default:
			bgColor = 'bg-blue-500 hover:bg-blue-400';
	}

	return (
		<button
			{...rest}
			disabled={disabled || loader ? true : false}
			className={`${bgColor} text-white transition-all rounded-lg px-10 py-2 font-inter font-semibold disabled:bg-gray-400
          ${className}
        `}
		>
			<span className={`${loader ? 'mr-3' : ''}`}>{text}</span>

			{loader && (
				<div
					className="inline-block h-4 w-4 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] text-primary motion-reduce:animate-[spin_1.5s_linear_infinite]"
					role="status"
				>
					<span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]" />
				</div>
			)}
		</button>
	);
};

export { PrimaryButton };

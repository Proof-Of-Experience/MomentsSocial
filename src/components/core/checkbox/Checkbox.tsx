import React, { FC, InputHTMLAttributes } from 'react';
import { cn } from '@/utils';

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
	label: string;
	id: string;
	className?: string;
	inputClassName?: string;
	labelClassName?: string;
}

const Checkbox: FC<CheckboxProps> = ({
	label,
	id,
	className = '',
	inputClassName = '',
	labelClassName = '',
	...props
}) => {
	return (
		<div className={cn('flex items-center', className)}>
			<input
				id={id}
				type="checkbox"
				className={cn('h-5 w-5 text-blue-600', inputClassName)}
				{...props}
			/>
			<label
				htmlFor={id}
				className={cn(
					'ml-3 text-gray-800 cursor-pointer text-base font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
					labelClassName
				)}
			>
				{label}
			</label>
		</div>
	);
};

export { Checkbox };

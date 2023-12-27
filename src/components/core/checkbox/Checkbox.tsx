import { CheckboxProps } from '@/model/core';

const Checkbox = (props: CheckboxProps) => {
	const {
		id = `checkbox_${Number(Math.random() * 100)}`,
		label = '',
		className,
		required = false,
		disabled = false,
		children,
		error = false,
		errorMessage = '',
		...rest
	} = props;

	return (
		<div className={`relative w-fit ${className}`}>
			<input
				id={id}
				type="checkbox"
				required={required}
				disabled={disabled}
				className="peer hidden"
				{...rest}
			/>
			<label
				htmlFor={id}
				className="w-fit flex items-center font-normal text-base text-dark leading-none m-0 pl-7 relative before:absolute before:left-0 before:content-['\F0131'] before:font-mdi before:text-2xl before:text-gray-500 peer-checked:before:content-['\F0C52'] peer-checked:before:text-primary cursor-pointer"
			>
				{label}
			</label>
			{error && errorMessage && (
				<span className="absolute text-xs mt-[2px] text-red-500">{errorMessage}</span>
			)}

			{children}
		</div>
	);
};

export { Checkbox };

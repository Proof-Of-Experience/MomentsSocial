export interface PrimaryButtonProps {
	text: string;
	className?: string;
	[rest: string]: any;
}

export interface PrimaryInputProps {
	id?: string;
	className?: string;
	label?: string;
	hasLeftDropdown?: boolean;
	dropdownOptions?: any;
	[rest: string]: any;
}

export interface CheckboxProps {
	children?: string | React.ReactNode;
	id?: string;
	label?: string;
	required?: boolean;
	disabled?: boolean;
	className?: string;
	error?: boolean;
	errorMessage?: string;
	[rest: string]: any;
}

export interface PlaceholderProps {
	text?: string;
	className?: string;
}

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

export interface PlaceholderProps {
	text?: string;
	className?: string;
}

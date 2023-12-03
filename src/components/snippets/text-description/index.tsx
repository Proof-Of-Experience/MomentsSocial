import { cn } from '@/utils';
import { useEffect, useState } from 'react';

interface IDescriptionTextProps {
	description: string;
	onChangeExpandDesc?: (value: boolean) => void;
	initialDisplayLength?: number;
	className?: string;
	readMoreBtnClassName?: string;
	readMoreBtnText?: string;
	readLessBtnText?: string;
}

const DescriptionText = (props: IDescriptionTextProps) => {
	const {
		description,
		onChangeExpandDesc,
		initialDisplayLength = 160,
		className,
		readMoreBtnClassName,
		readMoreBtnText = 'Read More',
		readLessBtnText = 'Read Less',
	} = props;
	const [isExpanded, setIsExpanded] = useState(false);

	const displayText = isExpanded
		? description
		: description.slice(0, initialDisplayLength).trim();

	useEffect(() => {
		if (onChangeExpandDesc) onChangeExpandDesc(isExpanded);
	}, [isExpanded, onChangeExpandDesc]);

	const toggleExpansion = () => {
		setIsExpanded(!isExpanded);
	};

	return (
		<p className={cn('text-[#47474A] text-base leading-6 font-normal', className)}>
			{displayText}
			{description.length > initialDisplayLength && !isExpanded && '...'}
			{description.length > initialDisplayLength && (
				<span
					className={cn(
						'mx-2 hover:underline text-[#00A1D4] text-base font-semibold cursor-pointer transition-all',
						readMoreBtnClassName
					)}
					onClick={toggleExpansion}
				>
					{isExpanded ? readLessBtnText : readMoreBtnText}
				</span>
			)}
		</p>
	);
};

export default DescriptionText;

import { cn } from '@/utils';
import { XMarkIcon } from '@heroicons/react/24/outline';
import React, { ReactNode } from 'react';

interface IMomentSideBoxProps {
	open: boolean;
	onClose: () => void;
	children: ReactNode;
}
const MomentSideBox = (props: IMomentSideBoxProps) => {
	const { open, onClose, children } = props;

	return (
		<div
			className={cn(
				'absolute bottom-0 -right-0 py-6 rounded-2xl w-[435px] h-full border border-[#EBEBEB] bg-white opacity-0 overflow-hidden transition-all',
				open
					? 'rounded-tl-none rounded-bl-none opacity-100 z-10 -right-[calc(100%_-_870px)]'
					: ''
			)}
		>
			<div
				className="flex items-center justify-center w-8 h-8 bg-transparent hover:bg-slate-200 translate-all absolute top-2.5 right-2.5 cursor-pointer rounded-full"
				onClick={onClose}
			>
				<XMarkIcon className="w-5 h-5" />
			</div>
			{children}
		</div>
	);
};

export default MomentSideBox;

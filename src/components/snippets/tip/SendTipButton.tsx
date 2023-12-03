import { DonateIcon } from '@/components/icons';
import { DiamonLevel, sendTip } from '@/services/tip';
import { cn } from '@/utils';
import { CurrencyDollarIcon } from '@heroicons/react/24/outline';
import { memo, useState } from 'react';

export enum SendTipButtonUI {
	ICON,
	BUTTON,
}

interface SendTipButtonProps {
	userId: string;
	postId: string;
	receiverId: string;
	diamonLevel: DiamonLevel;
	ui: SendTipButtonUI;
	buttonMiniClassName?: string;
	buttonLgClassName?: string;
}

const SendTipButtonText = 'Send tip';
const SentText = 'Sent !';

const SendTipButton = (props: SendTipButtonProps) => {
	const { userId, postId, receiverId, diamonLevel, ui, buttonMiniClassName, buttonLgClassName } =
		props;
	const [buttonText, setButtonText] = useState<string>(SendTipButtonText);

	const handleClick = async () => {
		try {
			await sendTip(userId, receiverId, postId, diamonLevel);

			setButtonText(SentText);

			setTimeout(() => setButtonText(SendTipButtonText), 2000);
		} catch (err: any) {
			alert(err.message);
		}
	};

	if (ui === SendTipButtonUI.ICON) {
		return (
			<>
				<CurrencyDollarIcon
					className={cn('cursor-pointer', buttonMiniClassName)}
					onClick={handleClick}
				/>
				<span className="text-[#939393] text-[10px] font-normal leading-none mt-[6px]">
					{buttonText}
				</span>
			</>
		);
	}

	return (
		<div>
			<button
				onClick={handleClick}
				className={cn(
					'px-3 pl-2 py-1 flex items-center gap-x-2 bg-[#EBFAFF] hover:bg-[#00A1D4] rounded-2xl cursor-pointer group transition-all',
					buttonLgClassName
				)}
			>
				<DonateIcon className="group-hover:text-white transition-all" />
				<span className="text-sm text-[#47474A] group-hover:text-white transition-all">
					{buttonText}
				</span>
			</button>
		</div>
	);
};

export default memo(SendTipButton);

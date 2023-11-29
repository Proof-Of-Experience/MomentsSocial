import { DiamonLevel, sendTip } from '@/services/tip';
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
}

const SendTipButtonText = "Send tip";
const SentText = "Sent !";

const SendTipButton = ({ userId, postId, receiverId, diamonLevel, ui }: SendTipButtonProps) => {
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
					className="cursor-pointer"
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
				className="flex flex-row items-center text-sm px-4 py-2 rounded-md bg-blue-400 text-white my-2"
			>
				<CurrencyDollarIcon className="w-4 h-4 mr-1" />
				{buttonText}
			</button>
		</div>
	);
};

export default memo(SendTipButton);

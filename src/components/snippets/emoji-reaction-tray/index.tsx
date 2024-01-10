import { EMOJI_ITEMS, IEMOJIITEM } from '@/enums/emojis';
import { cn } from '@/utils';
import { useMomentReaction } from '@/utils/hooks';
import React from 'react';
import { toast } from 'react-toastify';

interface IEmojiReactionTray {
	postHashHex: string;
	className: string;
}

const EmojiReactionTray = (props: IEmojiReactionTray) => {
	const { postHashHex, className } = props;
	const { handleReactionSelect } = useMomentReaction({ postHashHex });

	return (
		<div
			className={cn(
				'bg-white font-[16px] text-[#1C1B1F] rounded-3xl shadow px-3 py-1 z-20 absolute',
				className
			)}
		>
			<div className="relative flex items-center justify-between gap-x-1.5">
				{EMOJI_ITEMS.map((emojiItem: IEMOJIITEM) => (
					<button
						key={emojiItem?.name}
						className="w-10 h-10 rounded-full transition duration-200 ease-in-out hover:bg-gray-200 flex items-center justify-center"
						onClick={async () => {
							const response = await handleReactionSelect(emojiItem);
							if (response?.error) {
								toast.error('Failed to react, something went wrong!');
							}
							if (response?.result) {
								/* empty */
							}
						}}
						title={emojiItem?.name}
					>
						{/* {emojiItem.emoji} */}
						<img
							src={emojiItem?.icon}
							alt={emojiItem?.emoji}
							className="w-6 h-6"
						/>
					</button>
				))}
			</div>
		</div>
	);
};

export default EmojiReactionTray;

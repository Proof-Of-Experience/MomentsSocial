import React, { useEffect, memo, useState } from 'react';
import { emojiList } from '@/enums/emojis';
import { useSelector } from 'react-redux';
import { selectAuthUser } from '@/slices/authSlice';

const EmojiReaction = memo(({ onReactionClick, postHashHex }: any) => {
	const authUser = useSelector(selectAuthUser);
	const [selectedReaction, setSelectedReaction] = useState<string>('');
	const [currentReaction, setCurrentReaction] = useState<string>('');
	const [isReactionHovered, setIsReactionHovered] = useState<boolean>(false);
	const [totalReaction, setTotalReaction] = useState<any>({});

	const getReactions = async () => {
		const { countPostAssociations } = await import('deso-protocol');
		const reactionParams = {
			AssociationType: 'REACTION',
			AssociationValues: ['LIKE', 'DISLIKE', 'LOVE', 'LAUGH', 'ASTONISHED', 'SAD', 'ANGRY'],
			PostHashHex: postHashHex,
		};

		const result = await countPostAssociations(reactionParams);

		const modifiedEmojiList = emojiList.filter(({ name }) => result?.Counts[name] > 0);
		modifiedEmojiList.sort((a, b) => result?.Counts[b.name] - result?.Counts[a.name]);
		const appendedString = modifiedEmojiList.reduce(
			(accumulator, emojiItem) => accumulator + emojiItem.emoji,
			''
		);
		const uniqueEmojis = Array.from(new Set(appendedString)).join('');
		setCurrentReaction(uniqueEmojis);
		setSelectedReaction(uniqueEmojis);
		setTotalReaction(result);
	};

	useEffect(() => {
		getReactions();
	}, []);

	const handleButtonHover = () => {
		setIsReactionHovered(true);
	};

	const handleButtonMouseLeave = () => {
		setIsReactionHovered(false);
	};

	const handleReactionSelect = async (reactionName: string, selectedReaction: string) => {
		setSelectedReaction([...new Set(selectedReaction + currentReaction)].join(''));
		const { createPostAssociation } = await import('deso-protocol');
		try {
			const reactionParams = {
				// AppPublicKeyBase58Check: 'BC1YLgTKfwSeHuNWtuqQmwduJM2QZ7ZQ9C7HFuLpyXuunUN7zTEr5WL',
				AssociationType: 'REACTION',
				MinFeeRateNanosPerKB: 1000,
				AssociationValue: reactionName,
				PostHashHex: postHashHex,
				TransactorPublicKeyBase58Check: authUser?.publicKeyBase58Check,
			};
			// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
			const result = await createPostAssociation(reactionParams);
			if (onReactionClick) {
				onReactionClick();
			}
			getReactions();
		} catch (error) {
			console.error('reaction error', error);
		}
	};

	return (
		<div
			className="flex items-center  text-lg font-semibold text-gray-700"
			onMouseEnter={handleButtonHover}
			onMouseLeave={handleButtonMouseLeave}
		>
			<span className="w-[26px] h-[25px]">{selectedReaction ? selectedReaction : '👍'}</span>
			<span className="ml-1 text-[#7B7788] leading-trim text-capitalize font-inter text-base font-normal leading-normal">
				{totalReaction?.Total} {totalReaction?.Total > 1 ? 'reactions' : 'reaction'}
			</span>

			{isReactionHovered && (
				<div
					className={`absolute bottom-7 left-0 bg-white font-[16px] text-[#1C1B1F] rounded-3xl border-2 shadow px-3`}
				>
					<div className="relative inline-flex items-center">
						{emojiList.map((emojiItem) => (
							<button
								key={emojiItem.name}
								className="p-1 rounded-full transition duration-200 ease-in-out hover:bg-gray-200"
								onClick={() =>
									handleReactionSelect(emojiItem.name, emojiItem.emoji)
								}
								title={emojiItem.name}
							>
								{emojiItem.emoji}
							</button>
						))}
					</div>
				</div>
			)}
		</div>
	);
});

export default EmojiReaction;

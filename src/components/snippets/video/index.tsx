import React, { memo, useEffect, useState } from 'react'
import { VideoItemProps } from '@/model/video'
import { useSelector } from 'react-redux';
import { selectAuthUser } from '@/slices/authSlice';

const emojiList = [
	{
		name: 'LIKE',
		emoji: '👍',
	},
	{
		name: 'DISLIKE',
		emoji: '👎',
	},
	{
		name: 'LOVE',
		emoji: '❤️',
	},
	{
		name: 'LAUGH',
		emoji: '😀',
	},
	{
		name: 'ASTONISHED',
		emoji: '😲',
	},
	{
		name: 'SAD',
		emoji: '😢',
	},
	{
		name: 'ANGRY',
		emoji: '😡',
	},
];

const VideoItem = ({ item, onReactionClick, ...rest }: VideoItemProps) => {
	const authUser = useSelector(selectAuthUser);
	const [selectedReaction, setSelectedReaction] = useState<string>('')
	const [currentReaction, setCurrentReaction] = useState<string>('')
	const [isReactionHovered, setIsReactionHovered] = useState<boolean>(false)
	const [totalReaction, setTotalReaction] = useState<any>({})


	const getReactions = async () => {
		const { countPostAssociations } = await import('deso-protocol')
		const reactionParams = {
			AssociationType: 'REACTION',
			AssociationValues: ["LIKE", "DISLIKE", "LOVE", "LAUGH", "ASTONISHED", "SAD", "ANGRY"],
			PostHashHex: item?.PostHashHex,
		}

		const result = await countPostAssociations(reactionParams)
		const modifiedEmojiList = emojiList.filter(({ name }) => result?.Counts[name] > 0);
		modifiedEmojiList.sort((a, b) => result?.Counts[b.name] - result?.Counts[a.name]);
		const appendedString = modifiedEmojiList.reduce((accumulator, emojiItem) => accumulator + emojiItem.emoji, '');
		const uniqueEmojis = Array.from(new Set(appendedString)).join('');
		setCurrentReaction(uniqueEmojis)
		setSelectedReaction(uniqueEmojis)
		setTotalReaction(result)
	}

	useEffect(() => {
		getReactions()
	}, [])

	const handleButtonHover = () => {
		setIsReactionHovered(true)
	}

	const handleButtonMouseLeave = () => {
		setIsReactionHovered(false)
	}

	const handleReactionSelect = async (reactionName: string, selectedReaction: string) => {
		setSelectedReaction([...new Set(selectedReaction + currentReaction)].join(''))
		const { createPostAssociation } = await import('deso-protocol')
		try {
			const reactionParams = {
				// AppPublicKeyBase58Check: 'BC1YLgTKfwSeHuNWtuqQmwduJM2QZ7ZQ9C7HFuLpyXuunUN7zTEr5WL',
				AssociationType: 'REACTION',
				MinFeeRateNanosPerKB: 1000,
				AssociationValue: reactionName,
				PostHashHex: item?.PostHashHex,
				TransactorPublicKeyBase58Check: authUser?.currentUser?.PublicKeyBase58Check
			}
			const result = await createPostAssociation(reactionParams)
			if (onReactionClick) {
				onReactionClick();
			}
			getReactions()
		} catch (error) {
			console.log('reaction error', error);
		}

	}

	return (
		<div className="relative">

			<div className="relative overflow-hidden w-full pt-[75%]">
				<iframe
					{...rest}
					className="absolute top-0 left-0 right-0 bottom-0 w-full h-full"
					src={`${item?.VideoURLs[0]}`}
					title="YouTube video player"
					allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
					allowFullScreen>
				</iframe>
			</div>

			<h4 className="mt-2 text-md font-bold capitalize">{item?.ProfileEntryResponse?.Username}</h4>
			<p className="text-sm line-clamp-2 text-left min-h-[40px]">{item?.Body}</p>

			<div className="flex justify-between mt-2">
				<div
					className="flex items-center text-lg font-bold text-gray-700"
					onMouseEnter={handleButtonHover}
					onMouseLeave={handleButtonMouseLeave}>
					{selectedReaction ? selectedReaction : '👍'}
					<span className="ml-1">{totalReaction?.Total}</span>

					{isReactionHovered && (
						<div className={`absolute bottom-7 left-0 bg-white rounded-3xl border-2 shadow px-3`}>
							<div
								className="relative inline-flex items-center"
							>
								{emojiList.map((emojiItem) => (
									<button
										key={emojiItem.name}
										className="p-1 rounded-full transition duration-200 ease-in-out hover:bg-gray-200"
										onClick={() => handleReactionSelect(emojiItem.name, emojiItem.emoji)}
										title={emojiItem.name}>
										{emojiItem.emoji}
									</button>
								))}
							</div>
						</div>
					)}
				</div>

				<button className="flex items-center text-lg font-bold text-gray-700">
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
						<path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.068.157 2.148.279 3.238.364.466.037.893.281 1.153.671L12 21l2.652-3.978c.26-.39.687-.634 1.153-.67 1.09-.086 2.17-.208 3.238-.365 1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
					</svg>
					<span className="ml-1">{item?.CommentCount}</span>
				</button>
			</div>
		</div>
	)
}

export default memo(VideoItem)
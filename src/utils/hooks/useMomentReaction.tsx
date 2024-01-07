import { useEffect, useState } from 'react';
import { IEMOJIITEM, emojiList } from '@/enums/emojis';
import { useSelector } from 'react-redux';
import { selectAuthUser } from '@/slices/authSlice';

interface IProps {
	postHashHex: string | undefined;
}

const useMomentReaction = (props: IProps) => {
	const postHashHex = props?.postHashHex;
	const authUser = useSelector(selectAuthUser);

	const initReaction = {
		currentReaction: '',
		totalReaction: 0,
	};
	const [currentReaction, setCurrentReaction] = useState<string>(initReaction?.currentReaction);
	const [totalReaction, setTotalReaction] = useState<any>(initReaction?.totalReaction);
	const [selectedReaction, setSelectedReaction] = useState<string | null>(null);

	useEffect(() => {
		getReactions();
	}, [postHashHex]);

	let resultOnReact = null;

	const getReactions = async () => {
		// if (!postHashHex) return initReaction; // TODO:: Check this line is working
		if (!postHashHex) return;

		const { countPostAssociations } = await import('deso-protocol');
		const reactionParams: any = {
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
		setTotalReaction(result?.Total);
		return result;
	};

	const handleReactionSelect = async (selectedItem: IEMOJIITEM) => {
		if (!postHashHex) return { error: 'Post ID is not defined!', result: null };
		if (!selectedItem) return { error: 'Please select a reaction emoji!', result: null };
		if (!authUser) return { error: 'Please login to react!', result: null };

		setSelectedReaction([...new Set(selectedItem?.emoji + currentReaction)].join(''));
		const { createPostAssociation } = await import('deso-protocol');
		try {
			const reactionParams = {
				// AppPublicKeyBase58Check: 'BC1YLgTKfwSeHuNWtuqQmwduJM2QZ7ZQ9C7HFuLpyXuunUN7zTEr5WL',
				AssociationType: 'REACTION',
				MinFeeRateNanosPerKB: 1000,
				AssociationValue: selectedItem?.name,
				PostHashHex: postHashHex,
				TransactorPublicKeyBase58Check: authUser?.publicKeyBase58Check,
			};

			resultOnReact = await createPostAssociation(reactionParams);

			// if (onReactionClick) {
			// 	onReactionClick();
			// }
			getReactions();
			return { error: null, result: resultOnReact };
		} catch (error) {
			console.error('reaction error', error);
		}
	};

	if (!postHashHex)
		return {
			currentReaction: initReaction?.currentReaction,
			totalReaction: initReaction?.totalReaction,
			selectedReaction: null,
			resultOnReact,
			handleReactionSelect: () => {},
		};

	return {
		currentReaction,
		totalReaction,
		selectedReaction,
		resultOnReact,
		handleReactionSelect,
	};
};

export default useMomentReaction;

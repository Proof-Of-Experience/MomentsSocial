import { useEffect, useState } from 'react';
import { emojiList } from '@/enums/emojis';

const useMomentReaction = (postHashHex: { postHashHex: string }) => {
	const initReaction = {
		currentReaction: '',
		totalReaction: 0,
	};
	const [currentReaction, setCurrentReaction] = useState<string>(initReaction?.currentReaction);
	const [totalReaction, setTotalReaction] = useState<any>(initReaction?.totalReaction);

	useEffect(() => {
		getReactions();
	}, []);

	const getReactions = async () => {
		if (!postHashHex) return initReaction;

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
	};

	return {
		currentReaction,
		totalReaction,
	};
};

export default useMomentReaction;

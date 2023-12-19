export const emojiList = [
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

export interface IEMOJIITEM {
	name: string;
	emoji: string;
	icon: string;
}

export const EMOJI_ITEMS: IEMOJIITEM[] = [
	{
		name: 'LIKE',
		emoji: '👍',
		icon: '/images/emojis/like.svg',
	},
	{
		name: 'DISLIKE',
		emoji: '👎',
		icon: '/images/emojis/dislike.svg',
	},
	{
		name: 'LOVE',
		emoji: '❤️',
		icon: '/images/emojis/heart.svg',
	},
	{
		name: 'LAUGH',
		emoji: '😀',
		icon: '/images/emojis/laugh.svg',
	},
	{
		name: 'ASTONISHED',
		emoji: '😲',
		icon: '/images/emojis/astonished.svg',
	},
	{
		name: 'SAD',
		emoji: '😢',
		icon: '/images/emojis/sad.svg',
	},
	{
		name: 'ANGRY',
		emoji: '😡',
		icon: '/images/emojis/angry.svg',
	},
];

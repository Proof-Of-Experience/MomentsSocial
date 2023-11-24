import { api } from '../deso/apiClient';

export const makeReaction = async (
	reactionType: string,
	postHashHex: string,
	userPublicKey: string
) => {
	const endpoint = 'api/v0/post-associations/create';

	const params: any = {
		TransactorPublicKeyBase58Check: userPublicKey,
		PostHashHex: postHashHex,
		AppPublicKeyBase58Check: 'BC1YLgTKfwSeHuNWtuqQmwduJM2QZ7ZQ9C7HFuLpyXuunUN7zTEr5WL',
		AssociationType: 'REACTION',
		AssociationValue: reactionType,
		MinFeeRateNanosPerKB: 1000,
	};

	return api.post(endpoint, params);
};

export const getReactionsCount = async (postHashHex: string, userPublicKey: string) => {
	const endpoint = 'api/v0/post-associations/count';

	const params: any = {
		TransactorPublicKeyBase58Check: userPublicKey,
		PostHashHex: postHashHex,
		AssociationType: 'REACTION',
		AssociationValue: ['LIKE', 'DISLIKE', 'LOVE', 'LAUGH', 'ASTONISHED', 'SAD', 'ANGRY'],
		MinFeeRateNanosPerKB: 1000,
	};

	return api.post(endpoint, params);
};

import {
	AffectedPublicKey,
	PostEntryResponse,
	ProfileEntryResponse,
	TransactionMetadataResponse,
	getNotifications,
} from 'deso-protocol';

interface Profile {
	Username: string;
}

interface ConstructedTransaction {
	txnType: string;
	transactorPublicKey: string;
	transactorUsername: string;
}

export interface MomentNotification {
	render(): string;
	data: Record<string, any>;
}

const constructNotification = (
	notification: TransactionMetadataResponse,
	profiles: Record<string, Profile | null>,
	posts: {
		[key: string]: PostEntryResponse;
	}
): MomentNotification | null => {
	const { txnType, transactorUsername } = getTransaction(notification, profiles);
	if (txnType === 'BASIC_TRANSFER') {
		return constructBasicTransfer(notification, transactorUsername);
	}

	if (txnType === 'LIKE') {
		return constructLikedNotification(notification, profiles);
	}

	if (txnType === 'SUBMIT_POST') {
		return constructSubmitPostNotification(notification, profiles, posts);
	}

	return null;
};

const constructSubmitPostNotification = (
	notification: TransactionMetadataResponse,
	profiles: Record<string, Profile | null>,
	posts: {
		[key: string]: PostEntryResponse;
	}
): MomentNotification | null => {
	if (notification.Metadata.SubmitPostTxindexMetadata === null) {
		return null;
	}

	const postId = notification.Metadata.SubmitPostTxindexMetadata.PostHashBeingModifiedHex;

	let actor: string | null = null;

	let isMention = false;

	notification.Metadata.AffectedPublicKeys?.forEach((key: AffectedPublicKey) => {
		if (key.Metadata === 'TransactorPublicKeyBase58Check') {
			actor = getProfileUsername(key.PublicKeyBase58Check, profiles); // who made the comment
		}

		// @note : This is a hacky way of handling mentions.
		if(isMention === false && key.Metadata === 'MentionedPublicKeyBase58Check') {
			isMention = true
		}
	});

	if (actor === null) {
		return null;
	}

	if(isMention) {
		return {
			data: {},
			render: () => `<strong>@${actor}</strong> mentioned you in a post.`,
		};
	}

	const message = posts[postId].Body;

	return {
		data: {},
		render: () => `<strong>@${actor}</strong> ${message}`,
	};
};

const constructLikedNotification = (
	notification: TransactionMetadataResponse,
	profiles: Record<string, Profile | null>
): MomentNotification | null => {
	if (notification.Metadata === null) {
		return null;
	}

	let actor: string | null = null;
	let receiver: string | null = null;

	notification.Metadata.AffectedPublicKeys?.forEach((key: AffectedPublicKey) => {
		if (key.Metadata === 'PosterPublicKeyBase58Check') {
			receiver = getProfileUsername(key.PublicKeyBase58Check, profiles);
		} else {
			actor = getProfileUsername(key.PublicKeyBase58Check, profiles);
		}
	});

	if (actor === null || receiver === null) {
		return null;
	}

	const isUnlike = notification.Metadata?.LikeTxindexMetadata?.IsUnlike;

	return {
		data: {},
		render: () => `<strong>${actor}</strong> ${isUnlike ? 'unliked' : 'liked'} ${receiver}`,
	};
};

const getProfileUsername = (
	hashHex: string,
	profiles: Record<string, Profile | null>
): string | null => {
	return profiles[hashHex]?.Username || null;
};

const getTransaction = (
	notification: TransactionMetadataResponse,
	profiles: Record<string, Profile | null>
): ConstructedTransaction => {
	const txnType = notification.Metadata.TxnType;
	const transactorPublicKey = notification.Metadata.TransactorPublicKeyBase58Check;
	const transactorUsername = profiles[transactorPublicKey]?.Username || 'Unknown User';

	return { txnType, transactorPublicKey, transactorUsername };
};

const constructBasicTransfer = (
	notification: TransactionMetadataResponse,
	transactorUsername: string
): MomentNotification | null => {
	if (!notification.TxnOutputResponses || notification.TxnOutputResponses.length === 0) {
		return null;
	}

	const amountNanos = notification.TxnOutputResponses[0].AmountNanos;
	return {
		data: {},
		render: () =>
			`<strong>${transactorUsername}</strong> sent you ${amountNanos} $DESO! (~$${amountNanos / 1e9})`,
	};
};

export const getUserNotifications = async (
	userHashKey: string,
	numbersToFetch: number = 100,
	fetchStartIndex: number = -1
): Promise<MomentNotification[]> => {
	const params = {
		NumToFetch: numbersToFetch,
		PublicKeyBase58Check: userHashKey,
		FetchStartIndex: fetchStartIndex,
	};

	let response = await getNotifications(params);

	let notifications: MomentNotification[] = [];
	const profiles = response.ProfilesByPublicKey;
	const posts = response.PostsByHash;
	// const lastSeenIndex = response.LastSeenIndex

	response.Notifications?.forEach((not: TransactionMetadataResponse) => {
		const constructed = constructNotification(not, profiles, posts);
		if (constructed) {
			notifications.push(constructed as unknown as MomentNotification);
		}
	});

	return notifications;
};

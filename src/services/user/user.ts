// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import { ApiDataType, RequestParams, __fetch, __patch, apiService } from '@/utils/request';
// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import { UserProfileResponse } from './data/user';
import { IsUserBlocked } from './api/profile';

export const getUserProfile = async (username: string) => {
	const { getSingleProfile } = await import('deso-protocol');
	const params = {
		Username: username,
		PublicKeyBase58Check: '',
	};

	return await getSingleProfile(params);
};

export const userLogin = async () => {
	const { identity, getUsersStateless } = await import('deso-protocol');
	const loggedInInfo: any = await identity.login();

	const api_user = await getUserInfoFromUtils(loggedInInfo.publicKeyBase58Check);

	const userParams = {
		PublicKeysBase58Check: [loggedInInfo?.publicKeyBase58Check],
		SkipForLeaderboard: true,
	};
	const userInfo: any = await getUsersStateless(userParams);

	return { ...loggedInInfo, ...userInfo?.UserList[0], api_user };
};

export const getUserInfoFromUtils = async (userId: number) => {
	const apiUrl = `/api/user`;
	const data = {
		userId,
	};
	const apiData: ApiDataType = {
		method: 'post',
		data,
		url: apiUrl,
		customUrl: process.env.NEXT_PUBLIC_MOMENTS_UTIL_URL,
	};

	try {
		await apiService(apiData, (res: any, err: any) => {
			if (err) return err.response;

			return res;
		});
	} catch (error: any) {
		console.error('error', error.response);
	}
};

export const isUserAdmin = (user: any): boolean => {
	if (!user) {
		return false;
	}

	return user.api_user.roles.includes('admin');
};

export const getUserDBId = (user: any) => {
	if (!user) {
		return null;
	}

	return user.api_user?._id;
};

export const blockPermanently = async (
	userId: string,
	userToBeBlockedId: string,
	reason: string
) => {
	const data = {
		bannedBy: userId,
		userId: userToBeBlockedId,
		reason: reason,
		banType: 'permanent',
	};

	const apiUrl = `/api/ban-user`;

	const apiData: ApiDataType = {
		method: 'post',
		data,
		url: apiUrl,
		customUrl: process.env.NEXT_PUBLIC_MOMENTS_UTIL_URL,
	};

	try {
		await apiService(apiData, (res: any, err: any) => {
			if (err) return err.response;

			return res;
		});
	} catch (error: any) {
		return error;
	}
};

export const liftBan = async (bannedUserId: string, authUserId: string) => {
	const params: RequestParams = {
		path: `api/ban-user/lift-ban`,
		body: {
			userId: bannedUserId,
			bannedBy: authUserId,
		},
	};
	return __patch(params);
};

export const isUserBanned = async (userId: string): Promise<boolean> => {
	try {
		const blockedResponse = await IsUserBlocked(userId);

		return blockedResponse.is_banned;
	} catch (err) {
		throw err;
	}
};

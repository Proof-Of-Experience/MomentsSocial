// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import { RequestParams, __fetch, __get } from '@/utils/request';
import { UserProfileResponse } from '../data/user';

export const GetUserProfile = (userId: string): Promise<UserProfileResponse> => {
	const params: RequestParams = {
		path: `api/users/${userId}`,
	};
	return __get<UserProfileResponse>(params);
};

export const IsUserBlocked = (userId: string): Promise<any> => {
	const params: RequestParams = {
		path: `api/ban-user/${userId}/is-banned`,
	};
	return __get<UserProfileResponse>(params);
};

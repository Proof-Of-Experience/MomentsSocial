// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import { ApiDataType, RequestParams, __fetch, apiService } from '@/utils/request';
// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import { UserProfileResponse } from './data/user';

export const getUserProfile = async (username: string) => {
	const { getSingleProfile } = await import('deso-protocol');
	const params = {
		Username: username,
		PublicKeyBase58Check: '',
	};

	return await getSingleProfile(params);
};

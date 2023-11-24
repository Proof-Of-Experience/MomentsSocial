import { ApiDataType, apiService } from '@/utils/request';
import moment from 'moment';

// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
export const fetchHashtags = async (page: number = 1): Promise<any> => {
	return new Promise((resolve, reject) => {
		const apiData: ApiDataType = {
			method: 'get',
			url: `/api/hashtags`,
			customUrl: process.env.NEXT_PUBLIC_MOMENTS_UTIL_URL,
		};

		apiService(apiData, (res: any, err: any) => {
			if (err) {
				reject(err.response);
			} else {
				resolve(res);
			}
		});
	});
};

// this is the endpoint that gets user preferences
export const fetchUserHashtags = async (userId: string): Promise<any> => {
	return new Promise((resolve, reject) => {
		const apiData: ApiDataType = {
			method: 'get',
			url: `/api/users/${userId}/preferences`,
			customUrl: process.env.NEXT_PUBLIC_MOMENTS_UTIL_URL,
		};

		apiService(apiData, (res: any, err: any) => {
			if (err) {
				reject(err.response);
			} else {
				resolve(res);
			}
		});
	});
};

export const updateUserHashtags = async (
	userId: string,
	data: { preferences: string[] }
): Promise<any> => {
	return new Promise((resolve, reject) => {
		const apiData: ApiDataType = {
			method: 'PATCH',
			url: `/api/users/${userId}/preferences`,
			customUrl: process.env.NEXT_PUBLIC_MOMENTS_UTIL_URL,
			data: data,
		};

		apiService(apiData, (res: any, err: any) => {
			if (err) {
				reject(err.response);
			} else {
				resolve(res);
			}
		});
	});
};

export const setPreferenceUpdateTime = (userId: string) => {
	localStorage.setItem('preference_updated_at__' + userId, moment().unix().toString());
};

export const getPreferenceUpdateTime = (userId: string) => {
	return localStorage.getItem('preference_updated_at__' + userId);
};

export const wasPreferenceSavedWithInLastXMinutes = (userId: string, minutes: number): boolean => {
	const savedAt = getPreferenceUpdateTime(userId);

	if (!savedAt) {
		return false;
	}

	const currentTimestamp = moment.unix(savedAt as unknown as number);

	// Calculate the difference in minutes between the current time and the given timestamp
	const differenceInMinutes = moment().diff(currentTimestamp, 'minutes');

	// Check if the difference is within the last 10 minutes
	return differenceInMinutes <= minutes;
};

export const wasPreferenceSavedBeforeLastXMinutes = (userId: string, minutes: number) => {
	return !wasPreferenceSavedWithInLastXMinutes(userId, minutes);
};

export const getPreferencePopupRandomInterval = (): number => {
	const intervals = [10, 15, 20, 25, 30];

	const randomIndex = Math.floor(Math.random() * intervals.length);

	return intervals[randomIndex];
};

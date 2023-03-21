import axios, { AxiosResponse } from 'axios';
// import { getSession } from 'next-auth/react';

const defaultInstance = axios.create({
	baseURL: process.env.NEXT_PUBLIC_BASE_URL,
});

defaultInstance.interceptors.request.use(
	async (config: any) => {
		config.headers = {
			...config.headers,
		};
		return config;
	},
	(error) => {
		console.error('response in interceptor line number 27', JSON.stringify(error));
		return Promise.reject(error);
	}
);

export interface ApiDataType {
	instance?: 'default' | 'productAi' | 'chatBotAi';
	method: 'get' | 'post' | 'put' | 'patch' | 'delete';
	url: string;
	data?: any;
	token?: boolean;
	context?: any;
	config?: any;
	headers?: any;
}

const httpRequest = async (apiData: ApiDataType) => {
	const {
		instance: instanceName = 'default',
		method,
		url,
		data,
		// token = false,
		// context,
		config,
		headers,
	} = apiData;

	const instance =
		instanceName === 'default'
			? defaultInstance
			: defaultInstance;

	const defaultConfig = {
		headers: {
			Authorization: '',
			...headers,
		},
	};

	// if (token) {
	// 	const session = await getSession(context);

	// 	if (session?.user?.access) {
	// 		defaultConfig.headers.Authorization = `Bearer ${session?.user?.access}`;
	// 	}
	// }

	switch (method) {
		case 'get':
			return instance.get(url, { ...defaultConfig, ...config });

		case 'post':
			return instance.post(url, data, { ...defaultConfig, ...config });

		case 'put':
			return instance.put(url, data, { ...defaultConfig, ...config });

		case 'patch':
			return instance.patch(url, data, { ...defaultConfig, ...config });

		case 'delete':
			return instance.delete(url, { ...defaultConfig, ...config });

		default:
			break;
	}
};

/*
	-----------------------------------------------------------------------------
	'apiService' Function accepts two parameters, 'apiData' and 'callback':
	1. 'apiData' parameter accepts an object which has four properties 'method', 'url', 'data' & 'config'.
		1.1. 'method' (required) is the type of API endpoind and accepts only 'get' | 'post' | 'put' | 'patch' | 'delete'.
		1.2. 'url' (required) is the string of API url, excluded the baseUrl part (e.g. '/blog').
		1.3. 'data' is a payload for passing to the post, put and patch request.
		1.4. 'token' is the access token from session
		1.5. 'context' is the context of ssr
		1.6. 'config' is for passing config to any requestType.
	2. 'callback' parameter is a callback function that determines, what we will do with the API response either it is resolved or rejected.
	-----------------------------------------------------------------------------
*/
export const apiService = async (apiData: ApiDataType, callback: any) => {
	try {
		const data: AxiosResponse | undefined = await httpRequest(apiData);
		// console.log('SUCCESS FROM API_SERVICE-----', data)
		callback(data, null);
	} catch (error: any) {
		// Uncomment console.log for debugging
		// console.log(`___________ERROR 👀 👀 FROM API_SERVICE__________`)
		// console.log('err', error.response)
		// console.groupCollapsed('Where Error Happened')
		// console.table(apiData)
		// console.groupEnd()
		// console.log(`_____________________🐒________________________`)

		callback(null, error);
	}
};

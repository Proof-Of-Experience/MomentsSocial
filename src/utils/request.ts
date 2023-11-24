const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

export interface ApiDataType {
	method: 'get' | 'post' | 'put' | 'patch' | 'delete' | 'PATCH';
	url?: string;
	data?: any;
	token?: boolean;
	headers?: any;
	customUrl?: any;
}

/*
	-----------------------------------------------------------------------------
	'apiService' Function accepts two parameters, 'apiData' and 'callback':
	1. 'apiData' parameter accepts an object which has four properties 'method', 'url', 'data'.
		1.1. 'method' (required) is the type of API endpoind and accepts only 'get' | 'post' | 'put' | 'patch' | 'delete'.
		1.2. 'url' (required) is the string of API url, excluded the baseUrl part (e.g. '/blog').
		1.3. 'data' is a payload for passing to the post, put and patch request.
		1.4. 'token' is the access token from session
		1.5. 'headers' is based on different data type
	2. 'callback' parameter is a callback function that determines, what we will do with the API response either it is resolved or rejected.
	-----------------------------------------------------------------------------
*/
export const apiService = async (apiData: ApiDataType, callback: any) => {
	try {
		const res = await fetch(`${apiData.customUrl ?? baseURL}${apiData.url}`, {
			method: apiData.method,
			headers: {
				...apiData.headers,
				'Content-Type': 'application/json',
			},
			...(apiData.data && { body: JSON.stringify(apiData.data) }),
		});

		const data = await res.json();

		callback(data, null);
	} catch (error: any) {
		// Uncomment console.error for debugging
		// console.error(`___________ERROR 👀 👀 FROM API_SERVICE__________`)
		// console.error('err', error.response)
		// console.groupCollapsed('Where Error Happened')
		// console.table(apiData)
		// console.groupEnd()
		// console.error(`_____________________🐒________________________`)

		callback(null, error);
	}
};

export interface _RequestParams {
	method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
	path: string;
	body?: Record<string, any>; // Allow any JSON-serializable object as the body
	headers?: Record<string, string>; // Key-value pairs where both keys and values are strings
}

export interface RequestParams {
	path: string;
	body?: Record<string, any>; // Allow any JSON-serializable object as the body
	headers?: Record<string, string>; // Key-value pairs where both keys and values are strings
}

const BASE_API_URL = process.env.NEXT_PUBLIC_MOMENTS_UTIL_URL;

export const __fetch = async <T>(params: _RequestParams): Promise<T> => {
	const url = `${BASE_API_URL}/${params.path}`;

	const options = {
		method: params.method,
		headers: {
			...params.headers,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(params.body),
	};

	// eslint-disable-next-line no-async-promise-executor
	return new Promise(async (resolve, reject) => {
		try {
			const res = await fetch(url, options);
			const data = await res.json();

			resolve(data as T);
		} catch (error: any) {
			reject(error);
		}
	});
};

export const __get = async <T>(p: RequestParams): Promise<T> => {
	const params: _RequestParams = {
		...p,
		method: 'GET',
	};

	return __fetch<T>(params);
};

const baseURL = process.env.NEXT_PUBLIC_BASE_URL

export interface ApiDataType {
	method: 'get' | 'post' | 'put' | 'patch' | 'delete';
	url: string;
	data?: any;
	token?: boolean;
	headers?: any;
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
		const res = await fetch(`${baseURL}${apiData.url}`, {
			method: apiData.method,
			headers: {
				...apiData.headers,
				'Content-Type': 'application/json',
			},
			...apiData.data && { body: JSON.stringify(apiData.data) },
		});

		const data = await res.json()
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

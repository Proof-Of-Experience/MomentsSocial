import { ApiDataType, apiService } from "@/utils/request";

export const getFeedData = async () => {
	let result: any = [];
	const apiData: ApiDataType = {
		method: 'get',
		url: '/get-hot-feed',
	};

	await apiService(apiData, (res: any) => {
        // console.log('res', res);
        
		// if (res) result = res?.data?.results || [];
		if (res) result = res
		// console.log('error---', err)
	});
	return result;
};
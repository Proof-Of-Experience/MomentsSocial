import { ApiDataType, apiService } from "@/utils/request";

interface FeedParamProps {
	Tag?: string
}

export const getFeedData = async (data: FeedParamProps) => {
	let result: any = [];
	const body = {
		ReaderPublicKeyBase58Check: '',
		ResponseLimit: 100,
		SeenPosts: [],
		SortByNew: false,
		Tag: `#${data?.Tag}`
	}
	const apiData: ApiDataType = {
		method: 'post',
		url: '/api/v0/get-hot-feed',
		data: body,
	};

	await apiService(apiData, (res: any, err: any) => {
		if (err) return err.response
		if (res) result = res
	});

	return result;
};
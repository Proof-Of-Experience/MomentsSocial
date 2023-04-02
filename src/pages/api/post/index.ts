import { PublicPostProps } from "@/model/post";
import { ApiDataType, apiService } from "@/utils/request";

export const getStatelessPostData = async () => {
	let result: any = [];
	const body = {
		NumToFetch: 100,
		OrderBy: 'VideoURLs'
	}
	const apiData: ApiDataType = {
		method: 'post',
		url: '/api/v0/get-posts-stateless',
		data: body,
	};

	await apiService(apiData, (res: any, err: any) => {
		if (err) return err.response
		if (res) result = res
	});

	return result;
};


export const getPublicPostData = async (data: PublicPostProps) => {
	let result: any = [];
	const body = {
		MediaRequired: data.MediaRequired,
		NumToFetch: data.NumToFetch,
		ReaderPublicKeyBase58Check: data.ReaderPublicKeyBase58Check,
		Username: data.Username
	}
	const apiData: ApiDataType = {
		method: 'post',
		url: '/api/v0/get-posts-for-public-key',
		data: body,
	};

	await apiService(apiData, (res: any, err: any) => {
		if (err) return err.response
		if (res) result = res
	});

	return result;
};
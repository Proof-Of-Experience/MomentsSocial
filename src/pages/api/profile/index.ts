import { ApiDataType, apiService } from "@/utils/request";

interface SearchProfileProps {
	UsernamePrefix?: string
}

export const getSearchProfileData = async (data: SearchProfileProps) => {
	let result: any = [];
	const body = {
		NumToFetch: 20,
		UsernamePrefix: data?.UsernamePrefix
	}
	const apiData: ApiDataType = {
		method: 'post',
		url: '/api/v0/get-profiles',
		data: body,
	};

	await apiService(apiData, (res: any, err: any) => {
		if (err) return err.response
		if (res) result = res
	});

	return result;
};
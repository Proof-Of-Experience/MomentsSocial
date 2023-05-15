import { StatelessPostProps } from "@/model/post";
import { ApiDataType, apiService } from "@/utils/request";

export const getStatelessPostData = async (data: StatelessPostProps) => {
	let result: any = [];
	const body = {
		NumToFetch: data.NumToFetch,
		OrderBy: data.OrderBy
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


import { PostTransactionProps, PublicPostProps, StatelessPostProps, SubmitPostProps } from "@/model/post";
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


export const fetchtSubmitPost = async (data: SubmitPostProps) => {
	let result: any = [];
	const body = {
		BodyObj: data.BodyObj,
		IsHidden: data.IsHidden,
		MinFeeRateNanosPerKB: data.MinFeeRateNanosPerKB,
		ParentStakeID: data.ParentStakeID,
		PostExtraData: data.PostExtraData,
		RepostedPostHashHex: data.RepostedPostHashHex,
		UpdaterPublicKeyBase58Check: data.UpdaterPublicKeyBase58Check,
	}
	const apiData: ApiDataType = {
		method: 'post',
		url: '/api/v0/submit-post',
		data: body,
	};

	await apiService(apiData, (res: any, err: any) => {
		if (err) return err.response
		if (res) result = res
	});

	return result;
};


export const fetchPostTransaction = async (data: PostTransactionProps) => {
	let result: any = [];
	const body = {
		TransactionHex: data.TransactionHex,
	}
	const apiData: ApiDataType = {
		method: 'post',
		url: '/api/v0/submit-transaction',
		data: body,
	};

	await apiService(apiData, (res: any, err: any) => {
		if (err) return err.response
		if (res) result = res
	});

	return result;
};


import { FollowersOrFollowingProps, SearchProfileProps } from "@/model/profile";
import { ApiDataType, apiService } from "@/utils/request";

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


export const getFollowersOrFollowing = async (data: FollowersOrFollowingProps) => {
	let result: any = [];

	// Get followers or following data
	// if GetEntriesFollowingUsername == true ; NumFollowers == Followers
	// if GetEntriesFollowingUsername == fasle ; NumFollowers == Following
	
	const body = {
		GetEntriesFollowingUsername: data?.GetEntriesFollowingUsername,
		Username: data?.Username,
	}
	const apiData: ApiDataType = {
		method: 'post',
		url: '/api/v0/get-follows-stateless',
		data: body,
	};

	await apiService(apiData, (res: any, err: any) => {
		if (err) return err.response
		if (res) result = res
	});

	return result;
};
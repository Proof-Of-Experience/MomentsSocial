export interface SearchProfileProps {
    UsernamePrefix?: string
}

export interface FollowersOrFollowingProps {
	GetEntriesFollowingUsername: boolean,
	Username: string,
}

export interface EditProfileProps {
	userName: string,
	description: string,
	updatedPhoto: string,
	reward: any,
}
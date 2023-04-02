export interface SearchProfileProps {
    UsernamePrefix?: string
}

export interface SingleProfileProps {
	Username: string
}

export interface FollowersOrFollowingProps {
	GetEntriesFollowingUsername: boolean,
	Username: string,
}
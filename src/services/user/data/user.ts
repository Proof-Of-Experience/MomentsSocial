export type UserProfileResponse = {
	userId: string;
	accounts: Account[];
	preferences: Preference[];
	updatedAt: string | null; // @note: string for now ?
};

export type Account = {
	accountType: string;
	isSynced: boolean;
	username: string;
	_id: string;
};

export type Preference = {
	_id: string;
	name: string;
	postCount: number | null;
};

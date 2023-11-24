const TIKTOK_AUTHORIZATION_URL = 'https://www.tiktok.com/v2/auth/authorize/';

type TiktokRedirectOptions = {
	csrf: string;
	url: string;
};

// the params need to be in `application/x-www-form-urlencoded` format.
export const GetTiktokRedirectOptions = (): TiktokRedirectOptions => {
	const csrf = Math.random().toString(36).substring(2);

	const clientKey = process.env.NEXT_PUBLIC_TIKTOK_CLIENT_KEY;
	const redirectUri = process.env.NEXT_PUBLIC_TIKTOK_REDIRECT_URI;

	let url = TIKTOK_AUTHORIZATION_URL;

	url += '?client_key=' + clientKey;
	url += '&scope=user.info.basic';
	url += '&response_type=code';
	url += '&redirect_uri=' + redirectUri;
	url += '&state=' + csrf;

	return {
		csrf,
		url,
	};
};

/* eslint-disable no-useless-escape */
import axios, { AxiosResponse } from 'axios';

interface ChannelResponse {
	items: {
		id: string;
	}[];
}

interface VideoResponse {
	items: {
		snippet: {
			channelId: string;
		};
	}[];
}

export const extractVideoIdFromUrl = (youtubeUrl: string): string | null => {
	const regex =
		/(?:youtu\.be\/|\/video\/|\/embed\/|\/v\/|\/e\/|\/shorts\/|watch\?v=|\/videos\/|\/uploads\/|%2Fvideos%2F)([^#&?\/\n]+?)(?:$|&|\?|#|\/)/;
	const matches = youtubeUrl.match(regex);
	return matches && matches[1] ? matches[1] : null;
};

export const checkIfYoutubeUrlExists = async (youtubeUrl: string, accessToken: string) => {
	const videoId = extractVideoIdFromUrl(youtubeUrl);

	if (!videoId) {
		return false; // not a valid youtube URL
	}

	const endpoint = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=id`;
	const headers = {
		Authorization: `Bearer ${accessToken}`,
	};

	const response = await fetch(endpoint, { headers });
	if (!response.ok) {
		// Handle potential errors, such as token expiration or insufficient permissions
		console.error('API request failed:', response.statusText);
		return false;
	}

	const data = await response.json();
	return data.items && data.items.length > 0;
};

export const checkVideoOwnership = async (
	accessToken: string,
	videoId: string | null
): Promise<boolean> => {
	// Configure common headers
	const headers = {
		Authorization: `Bearer ${accessToken}`,
	};

	// 1. Retrieve user's channel ID
	const userChannelResponse: AxiosResponse<ChannelResponse> = await axios.get(
		'https://www.googleapis.com/youtube/v3/channels?part=id&mine=true',
		{ headers }
	);
	const userChannelId = userChannelResponse.data.items[0].id;

	// 2. Retrieve video details
	const videoResponse: AxiosResponse<VideoResponse> = await axios.get(
		`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}`,
		{ headers }
	);

	const videoChannelId = videoResponse.data.items[0].snippet.channelId;

	// 3. Compare channel IDs
	return userChannelId === videoChannelId;
};

export const handleYoutubeAuthentication = async () => {
	const currentUrl = encodeURIComponent(window.location.href);
	const redirectUri = `${window.location.origin}/api/auth/callback`;
	const scope = 'https://www.googleapis.com/auth/youtube.readonly';
	const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.NEXT_PUBLIC_YOUTUBE_CLIENT_ID}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&access_type=offline&state=${currentUrl}`;

	window.location.href = authUrl;
};

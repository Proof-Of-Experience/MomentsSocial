export const isVideoIdInVideoData = (videoId: string, videoDataArray: any[]): boolean => {
	for (const videoUrl of videoDataArray) {
		const urlObj = new URL(videoUrl.VideoURLs[0]);
		const params = new URLSearchParams(urlObj.search);
		const idFromUrl = params.get('v');
		if (videoId === idFromUrl) {
			return true;
		}
	}
	return false;
};

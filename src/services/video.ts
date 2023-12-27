export const getVideoPosterPublicKey = (video: any) => {
	return video?.ProfileEntryResponse?.PublicKeyBase58Check;
};


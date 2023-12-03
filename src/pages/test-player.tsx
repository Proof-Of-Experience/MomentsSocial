import MainLayout from '@/layouts/main-layout';
import React, { useEffect, useState } from 'react';

const TestPlayer = () => {
	const desoResponse = null;
	const item = {
		VideoURLs: [],
		PostHashHex: 'f7738b4584b2dd8dee86903568efe6b93099d00d97fd771af5a7511d040d25b7',
		PublicKeyBase58Check: 'BC1YLhGr7TH5s1bipZKUWzK3X3Y1ur45RNbAPbpYfAboFwhndDaE56g',
		Username: 'BenjeSkinny',
		VideoURL: 'https://lvpr.tv/?v=7fe74ep9s5ocnldd',
		createdAt: '2023-12-01T14:10:14.460Z',
		hashtags: [],
		moment: false,
		screenshot: '/images/1701439814315.png',
	};
	const [isVideoHovered, setIsVideoHovered] = useState<boolean>(false);
	const [videoUrl, setVideoUrl] = useState<string>('');

	useEffect(() => {
		setVideoUrl(
			// sanitizeURL(desoResponse ? item?.VideoURLs[0] : item?.VideoURL, isVideoHovered, false)
			sanitizeURL(desoResponse ? item?.VideoURLs[0] : item?.VideoURL, isVideoHovered, false)
		);
	}, [isVideoHovered, desoResponse, item?.VideoURL, item?.VideoURLs]);

	const sanitizeURL = (url: any, isAutoPlay = false, isMuted = false) => {
		let parsedUrl;
		try {
			parsedUrl = new URL(url);

			// For YouTube
			if (parsedUrl.hostname.includes('youtube.com')) {
				const videoId = parsedUrl.searchParams.get('v');
				return `https://www.youtube.com/embed/${videoId}?autoplay=${
					isAutoPlay ? '1' : '0'
				}&mute=${isMuted ? '1' : '0'}`;
			}

			// For lvpr.tv
			if (parsedUrl.hostname.includes('lvpr.tv')) {
				if (!isVideoHovered) {
					parsedUrl.searchParams.set('autoplay', isAutoPlay ? '1' : '0');
					parsedUrl.searchParams.set('mute', isMuted ? '1' : '0');
				}
				return parsedUrl.toString();
			}
			return parsedUrl.toString();
		} catch (error) {
			console.error('Invalid URL:', url);
			return '';
		}
	};
	// const videoUrl = sanitizeURL(desoResponse ? item?.VideoURLs[0] : item?.VideoURL);
	const thumbnailUrl = `${process.env.NEXT_PUBLIC_MOMENTS_UTIL_URL}${item?.screenshot}`;

	return (
		<MainLayout
			title="Home"
			mainWrapClass="p-7"
		>
			<div className="flex gap-x-7">
				<div className="w-1/2">
					<div
						className="relative overflow-hidden w-full h-[405px] group"
						onMouseOver={() => setIsVideoHovered(true)}
						onMouseOut={() => setIsVideoHovered(false)}
					>
						<iframe
							// {...rest}
							className="absolute top-0 left-0 right-0 bottom-0 w-full h-full rounded-[8px] bg-gradient-to-br from-lightgray via-transparent to-#BABABA opacity-0 group-hover:opacity-100 transition-opacity duration-500"
							src={videoUrl}
							title="Moment video player"
							allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
							// allowFullScreen
						></iframe>
						<img
							src={thumbnailUrl}
							alt="Video thumbnail"
							className="absolute top-0 left-0 right-0 bottom-0 w-full h-full rounded-[8px] bg-gradient-to-br from-lightgray via-transparent to-#BABABA object-cover group-hover:opacity-0 transition-opacity duration-500"
						/>
					</div>
				</div>

				{/* <div className="w-1/2">
					<div
						className="relative overflow-hidden w-full h-[405px] group"
						// onMouseOver={() => setIsVideoHovered(true)}
						// onMouseOut={() => setIsVideoHovered(false)}
					>
						<iframe
							// {...rest}
							className="absolute top-0 left-0 right-0 bottom-0 w-full h-full rounded-[8px] bg-gradient-to-br from-lightgray via-transparent to-#BABABA"
							src={videoUrl}
							title="Moment video player"
							allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
							// allowFullScreen
						></iframe>
						<img
                            src={thumbnailUrl}
                            alt="Video thumbnail"
                            className="absolute top-0 left-0 right-0 bottom-0 w-full h-full rounded-[8px] bg-gradient-to-br from-lightgray via-transparent to-#BABABA object-cover group-hover:opacity-0 transition-opacity duration-500"
                        />
					</div>
				</div> */}
			</div>
		</MainLayout>
	);
};

export default TestPlayer;

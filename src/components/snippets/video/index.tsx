import React, { memo, useEffect, useState } from 'react';
import { VideoItemProps } from '@/model/video';
import EmojiReaction from '../emoji-reaction';
import { useRouter } from 'next/router';
import { cn } from '@/utils';

const VideoItem = memo((props: VideoItemProps) => {
	const {
		desoResponse,
		item,
		onReactionClick,
		isHorizontal,
		hideUserProfilePhoto = false,
		...rest
	} = props;

	// console.log('Video Item: ', item);
	// console.log('Video Item Props: ', props);
	const [isVideoHovered, setIsVideoHovered] = useState<boolean>(false);
	const [videoUrl, setVideoUrl] = useState<string>('');
	const router = useRouter();

	useEffect(() => {
		setVideoUrl(
			sanitizeURL(desoResponse ? item?.VideoURLs[0] : item?.VideoURL, isVideoHovered, true)
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

	console.log('videoUrl', videoUrl);

	return (
		<div
			className={cn('relative cursor-pointer', {
				'flex items-start justify-between gap-x-4': isHorizontal,
			})}
		>
			<div
				className={cn(
					'relative overflow-hidden w-full h-[205px] rounded-lg bg-gradient-to-br from-gray-300 via-transparent to-[#BABABA] group',
					{
						'w-[170px] h-[100px]': isHorizontal,
					}
				)}
				onClick={() => {
					router.push(`/video/${item?.PostHashHex}`);
				}}
				onMouseOver={() => setIsVideoHovered(true)}
				onMouseOut={() => setIsVideoHovered(false)}
			>
				<iframe
					{...rest}
					className="absolute top-0 left-0 right-0 bottom-0 w-full h-full rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"
					src={videoUrl}
					title="Moment video player"
					allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
					allowFullScreen
				></iframe>
				<div
					className={cn(
						'absolute top-0 left-0 right-0 bottom-0 group-hover:-top-[55px] w-full h-full rounded-[8px] object-cover group-hover:opacity-0 transition-opacity duration-500',
						{
							'top-[20px]': isHorizontal,
						}
					)}
				></div>
				<img
					src={thumbnailUrl}
					alt="Video thumbnail"
					className="absolute top-0 left-0 right-0 bottom-0 w-full h-full rounded-[8px] object-cover group-hover:opacity-0 group-hover:-z-10 transition-opacity duration-500"
				/>
			</div>
			<div
				className={cn('flex flex-row justify-start mt-4', {
					'flex-1 mt-0': isHorizontal,
				})}
			>
				{!isHorizontal && !hideUserProfilePhoto && (
					<img
						className="w-14 h-14 object-cover rounded-full bg-gradient-to-br from-lightgray via-transparent to-transparent mr-4"
						src={`https://diamondapp.com/api/v0/get-single-profile-picture/${item?.PublicKeyBase58Check}?fallback=https://diamondapp.com/assets/img/default-profile-pic.png`}
						alt=""
						onClick={() => {
							router.push(`/user/${item?.Username}`);
						}}
					/>
				)}
				<div
					className={cn(
						'flex-1',
						!isHorizontal ? 'min-h-[112px]' : 'h-[100px] overflow-hidden'
					)}
				>
					<div>
						<p
							className={cn(
								'text-[#1C1B1F] leading-6 font-inter font-medium text-lg break-all	 line-clamp-2',
								{
									'text-base -mt-1': isHorizontal,
									'h-[56px]': !isHorizontal,
								}
							)}
							onClick={() => {
								router.push(`/video/${item?.PostHashHex}`);
							}}
						>
							{item?.Body}
						</p>
						<p
							className={cn(
								'text-[#7B7788] leading-trim capitalize font-inter font-normal text-base mt-3',
								{ 'text-sm mt-2': isHorizontal }
							)}
							onClick={() => {
								router.push(`/user/${item?.Username}`);
							}}
						>
							{item?.Username}
						</p>
					</div>

					<div
						className={cn('flex justify-between mt-3', {
							'mt-1.5 text-sm': isHorizontal,
						})}
					>
						<EmojiReaction
							onReactionClick={onReactionClick}
							postHashHex={item?.PostHashHex}
						/>

						<button className="flex items-center font-semibold text-gray-700">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth={1.5}
								stroke="currentColor"
								className="w-5 h-5"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.068.157 2.148.279 3.238.364.466.037.893.281 1.153.671L12 21l2.652-3.978c.26-.39.687-.634 1.153-.67 1.09-.086 2.17-.208 3.238-.365 1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
								/>
							</svg>
							<span className="ml-1 text-[#7E7E7E] leading-trim font-inter font-normal leading-normal">
								{item?.CommentCount || ''}{' '}
							</span>
							<span className="ml-1 text-[#7E7E7E] leading-trim text-[13px] font-inter font-normal leading-normal">
								{item?.CommentCount > 0 ? '' : 'No Comment'}
							</span>
						</button>
					</div>
				</div>
			</div>
		</div>
	);
});

export default VideoItem;

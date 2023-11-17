import React, { memo } from 'react'
import { VideoItemProps } from '@/model/video'
import EmojiReaction from '../emoji-reaction';
import { useRouter } from 'next/router';


const VideoItem = memo(({ desoResponse, item, onReactionClick, ...rest }: VideoItemProps) => {
	const router = useRouter();

	const sanitizeURL = (url: any) => {
		let parsedUrl;
		try {
			parsedUrl = new URL(url);

			// For YouTube
			if (parsedUrl.hostname.includes("youtube.com")) {
				const videoId = parsedUrl.searchParams.get('v');
				return `https://www.youtube.com/embed/${videoId}?autoplay=0`;
			}

			// For lvpr.tv
			if (parsedUrl.hostname.includes("lvpr.tv")) {
				parsedUrl.searchParams.set('autoplay', '0');
				return parsedUrl.toString();
			}

			return parsedUrl.toString();
		} catch (error) {
			console.error('Invalid URL:', url);
			return "";
		}
	};

	const videoUrl = sanitizeURL(desoResponse ? item?.VideoURLs[0] : item?.VideoURL);

	return (
		<div
			className="relative cursor-pointer"
			onClick={(e: any) => {
				router.push({
					pathname: `video/${item?.PostHashHex}`,
				})
			}}>


			<div className="relative overflow-hidden w-full pt-[55%]">
				<iframe
					{...rest}
					className="absolute top-0 left-0 right-0 bottom-0 w-full h-[205px] rounded-[8px] bg-gradient-to-br from-lightgray via-transparent to-#BABABA"
					src={videoUrl}
					title="YouTube video player"
					allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
					allowFullScreen>
				</iframe>
			</div>
			<div className='flex flex-row justify-start'>
				<img
					className='w-[56px] h-[56px] rounded-[28px] bg-gradient-to-br from-lightgray via-transparent to-transparent mr-[16px]'
					src={`https://diamondapp.com/api/v0/get-single-profile-picture/${item?.PublicKeyBase58Check}?fallback=https://diamondapp.com/assets/img/default-profile-pic.png`}
					alt=''
				/>
				<div>
					<p className="text-[#1C1B1F] dark:text-white leading-6 font-inter font-medium text-lg line-clamp-2">{item?.Body}</p>
					<p className="text-[#7B7788] leading-trim capitalize font-inter text-base font-normal mt-[12px]">{item?.Username}</p>

					<div className="flex justify-between mt-4">

						<EmojiReaction
							onReactionClick={onReactionClick}
							postHashHex={item?.PostHashHex}
						/>

						<button className="flex items-center text-lg font-semibold text-gray-700">
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
								<path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.068.157 2.148.279 3.238.364.466.037.893.281 1.153.671L12 21l2.652-3.978c.26-.39.687-.634 1.153-.67 1.09-.086 2.17-.208 3.238-.365 1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
							</svg>
							<span className="ml-1 text-[#7E7E7E] leading-trim text-capitalize font-inter text-base font-normal leading-normal">{item?.CommentCount} {item?.CommentCount > 1 ? 'Comments' : 'Comment'}</span>
						</button>
					</div>
				</div>
			</div>


		</div>
	)
})

export default VideoItem

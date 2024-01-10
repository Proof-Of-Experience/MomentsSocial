import React, { memo, Fragment } from 'react';
import { MomentProps } from '@/model/moment';
import MomentSkeleton from '@/components/skeletons/moment';
import EmojiReaction from '../emoji-reaction';
import { useRouter } from 'next/router';

const Moment = memo(({ className, onClick, item, isLoading }: MomentProps) => {
	const router = useRouter();

	return isLoading ? (
		<MomentSkeleton />
	) : (
		<div className={`block cursor-pointer h-[474px] ${className ? className : ''}`}>
			<Fragment>
				<div
					className="flex flex-wrap w-full h-[370px] relative rounded-lg overflow-hidden bg-gradient-to-br from-gray-300 via-transparent to-[#BABABA]"
					onClick={() => router.push(`/moment/${item?.PostHashHex}`)}
				>
					<img
						src={`${process.env.NEXT_PUBLIC_MOMENTS_UTIL_URL}${item?.screenshot}`}
						// src={item?.ImageURLs?.[0]}
						alt={item?.Username}
						className="absolute top-0 right-0 w-[110%] h-[110%] rounded-lg overflow-hidden object-cover object-center"
						onClick={onClick}
					/>
				</div>

				<div className="mt-4">
					<p
						className="text-[#1C1B1F] leading-6 font-inter font-medium text-lg line-clamp-2 h-[48px]"
						onClick={() => router.push(`/moment/${item?.PostHashHex}`)}
					>
						{item?.Body}
					</p>
					{/* <div className="mt-[16px] flex flex-row justify-between">
                <p className="text-[#7E7E7E] leading-trim text-capitalize font-inter text-base font-normal leading-normal">12M views</p>
                <p className="text-[#7E7E7E] leading-trim text-capitalize font-inter text-base font-normal leading-normal">12K reaction</p>
              </div> */}

					<div className="flex justify-between mt-4">
						<EmojiReaction
							// onReactionClick={onReactionClick}
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
			</Fragment>
		</div>
	);
});

export default Moment;

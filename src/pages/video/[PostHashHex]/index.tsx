import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import MainLayout from '@/layouts/main-layout';
import { ApiDataType, apiService } from '@/utils/request';
import { cn, numerify, toCapitalize } from '@/utils';
import { selectAuthUser } from '@/slices/authSlice';
import { useSelector } from 'react-redux';
import { getNFakeComments } from '@/data/comments';
import SendTipButton, { SendTipButtonUI } from '@/components/snippets/tip/SendTipButton';
import { DiamonLevel } from '@/services/tip';
import { CommentIcon, ReactIcon, ShareIcon } from '@/components/icons';
import { useMomentReaction, useSidebar } from '@/utils/hooks';
import TextDescription from '@/components/snippets/text-description';
import CommentBox from '@/components/snippets/comments/commentBox';
import RelatedVideoList from '@/components/snippets/video-details/relatedVideoList';
import VideoPlayerSkeleton from '@/components/skeletons/video-details/videoPlayer';
import RelatedVideosSkeleton from '@/components/skeletons/video-details/relatedVideos';
import SocialSharePopup from '@/components/snippets/social-share-popup';
import EmojiReactionTray from '@/components/snippets/emoji-reaction-tray';
import { SquaresPlusIcon } from '@heroicons/react/24/outline';
import PlaylistPopup from '@/components/snippets/playlist-popup';
import { isUserBanned, isUserAdmin } from '@/services/user/user';
import { BlockButton } from '@/components/snippets/block/block';
import { getVideoPosterPublicKey } from '@/services/video';
import { ContnetIsBlocked } from '@/components/snippets/block/contentIsblocked';

const VideoDetailsPage = () => {
	const router = useRouter();
	const authUser = useSelector(selectAuthUser);
	const { setCollapseSidebar } = useSidebar();

	const videoUrl = process.env.NEXT_PUBLIC_MOMENTS_DOMAIN_URL + router.asPath;
	const isAdmin = isUserAdmin(authUser);
	// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
	const { PostHashHex, Tag }: any = router.query;
	const { currentReaction, totalReaction } = useMomentReaction(PostHashHex);
	const tagParam: any = router.query.tag;
	const [hasLoaded, setHasLoaded] = useState<boolean>(false);
	const [videoData, setVideoData] = useState<any>([]);
	const [videoTotalPages, setVideoTotalPages] = useState<number>(Infinity);
	const [isRelatedVideosLoading, setIsRelatedVideosLoading] = useState<boolean>(false);
	const [relatedVideos, setRelatedVideos] = useState<any>([]);
	const [showShareModal, setShowShareModal] = useState<boolean>(false);
	const [showReactTray, setShowReactTray] = useState<boolean>(false);
	const [showPlaylistModal, setShowPlaylistModal] = useState<boolean>(false);
	const [isBlocked, setIsBlocked] = useState<boolean>(false);

	useEffect(() => {
		setCollapseSidebar(true);
	}, []);

	useEffect(() => {
		if (!router.isReady) return;
		fetchSingleProfile();
		fetchRelatedVideos();
	}, [router.isReady, PostHashHex]);

	const fetchSingleProfile = async () => {
		setHasLoaded(true);

		const { getSinglePost } = await import('deso-protocol');

		const params = {
			PostHashHex,
		};

		const singlePost: any = await getSinglePost(params);

		const isUserBlocked = await isUserBanned(
			singlePost?.PostFound.ProfileEntryResponse?.PublicKeyBase58Check
		);

		setIsBlocked(isUserBlocked);

		setVideoData(singlePost?.PostFound);

		setHasLoaded(false);
	};

	const fetchRelatedVideos = async () => {
		setIsRelatedVideosLoading(true); // Set to loading state

		try {
			let apiUrl = `/api/posts?limit=10&moment=false`;
			if (tagParam) {
				const tagWithHash = tagParam.startsWith('#') ? tagParam.splice(1) : tagParam; // : `#${tagParam}`;
				apiUrl += `&hashtag=${tagWithHash}`;
			}

			const apiData: ApiDataType = {
				method: 'get',
				url: apiUrl,
				customUrl: process.env.NEXT_PUBLIC_MOMENTS_UTIL_URL,
			};

			await apiService(apiData, (res: any, err: any) => {
				if (err) return err.response;

				if (res?.totalPages && videoTotalPages !== res.totalPages) {
					setVideoTotalPages(res.totalPages);
				}

				if (res?.posts.length > 0) {
					// Filter out duplicates
					const uniquePosts = res.posts.filter((post: any) => {
						return post.PostHashHex !== videoData?.PostHashHex;
					});
					setRelatedVideos(uniquePosts);
				}

				setIsRelatedVideosLoading(false);
			});
		} catch (error: any) {
			console.error('error', error.response);
		} finally {
			setIsRelatedVideosLoading(false);
		}
	};

	const videoComments = (comments: any) => {
		if (!comments) {
			// return [];
			return getNFakeComments(7);
		}

		return comments;
	};

	const handleClickComments = () => {
		const element = document.getElementById('video-comments');
		if (element) {
			const rect = element.getBoundingClientRect();
			// element.scrollIntoView({ behavior: 'smooth' });
			window.scrollTo({ top: rect.top + window.scrollY - 100, behavior: 'smooth' });
		}
	};

	const handleClickPlaylist = () => {
		setShowPlaylistModal(true);
		console.log('handleClickPlaylist');
	};

	console.log('videoData: ', videoData);

	return (
		<MainLayout title="Video Details">
			<div className="min-h-[calc(100vh_-_72px)] grid grid-cols-3 gap-7">
				{/* 1. Post Videos and Details Section ------------------- */}
				<div className="col-span-2">
					{hasLoaded ? (
						<VideoPlayerSkeleton />
					) : (
						<div className="flex flex-col gap-y-6">
							{isBlocked ? (
								<ContnetIsBlocked
									bannedUserId={
										videoData?.ProfileEntryResponse?.PublicKeyBase58Check
									}
								/>
							) : (
								<>
									<iframe
										width="100%"
										height="483"
										className="rounded-2xl bg-gradient-to-br from-gray-300 via-transparent to-[#BABABA]"
										src={
											`${videoData?.VideoURLs?.[0]}&loop=1` ??
											'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
										}
										allowFullScreen
									></iframe>

									{/* 1.2. Post title and reactions ------------------- */}
									<div className="flex flex-col items-start gap-y-4">
										<h2 className="text-[#1C1B1F] text-xl line-clamp-1">
											{toCapitalize(videoData?.Body)}
										</h2>
										<div className="flex items-center justify-start">
											<span className="flex items-center justify-start gap-x-2">
												{currentReaction && (
													<span className="">{currentReaction}</span>
												)}
												<span className="text-base text-[#7B7788]">
													{totalReaction > 1
														? `${numerify(totalReaction)} reactions`
														: 'No reaction'}
												</span>
											</span>
										</div>
									</div>

									{/* 1.3. User Info and Actions ------------------- */}
									<div className="flex items-center justify-between flex-wrap gap-y-4 gap-x-7 flex-1">
										<div className="flex items-center justify-start gap-x-4">
											<img
												className="w-12 h-12 object-cover rounded-full bg-gradient-to-br from-slate-200 to-slate-100 border border-slate-100 cursor-pointer"
												src={`https://diamondapp.com/api/v0/get-single-profile-picture/${videoData?.ProfileEntryResponse?.PublicKeyBase58Check}?fallback=https://diamondapp.com/assets/img/default-profile-pic.png`}
												alt={
													videoData?.ProfileEntryResponse?.Username ||
													'username'
												}
												onClick={() => {
													router.push(
														`/user/${videoData?.ProfileEntryResponse?.Username}`
													);
												}}
											/>
											<h1
												className="text-2xl text-[#1C1B1F] font-medium cursor-pointer"
												onClick={() => {
													router.push(
														`/user/${videoData?.ProfileEntryResponse?.Username}`
													);
												}}
											>
												{videoData?.ProfileEntryResponse?.Username}
											</h1>
										</div>
										<div className="flex items-center justify-start gap-x-4">
											<div
												className="relative"
												onMouseEnter={() => {
													setShowReactTray(true);
												}}
												onMouseLeave={() => {
													setShowReactTray(false);
												}}
											>
												<button
													className="px-3 pl-2 py-1 flex items-center gap-x-2 bg-[#EBFAFF] hover:bg-[#00A1D4] rounded-2xl cursor-pointer group transition-all"
													onClick={() =>
														console.log('on Clicked React Icon')
													}
												>
													<ReactIcon className="group-hover:text-white transition-all" />
													<span className="text-sm text-[#47474A] group-hover:text-white transition-all">
														React
													</span>
												</button>
												{showReactTray && (
													<EmojiReactionTray
														postHashHex={videoData?.PostHashHex}
														className="absolute -top-12 -right-10"
													/>
												)}
											</div>
											<button
												className="px-3 pl-2 py-1 flex items-center gap-x-2 bg-[#EBFAFF] hover:bg-[#00A1D4] rounded-2xl cursor-pointer group transition-all"
												onClick={handleClickComments}
											>
												<CommentIcon className="group-hover:text-white transition-all" />
												<span className="text-sm text-[#47474A] group-hover:text-white transition-all">
													Comment
												</span>
											</button>
											<button
												className="px-3 pl-2 py-1 flex items-center gap-x-2 bg-[#EBFAFF] hover:bg-[#00A1D4] rounded-2xl cursor-pointer group transition-all" // TODO:: Replace the class hidden to flex to show the save button in the UI
												onClick={handleClickPlaylist}
											>
												{/* <CommentIcon className="group-hover:text-white transition-all" /> */}
												<SquaresPlusIcon className="group-hover:text-white transition-all h-6 w-6" />
												<span className="text-sm text-[#47474A] group-hover:text-white transition-all">
													Save
												</span>
											</button>
											<button
												className="px-3 pl-2 py-1 flex items-center gap-x-2 bg-[#EBFAFF] hover:bg-[#00A1D4] rounded-2xl cursor-pointer group transition-all"
												onClick={() => setShowShareModal(true)}
											>
												<ShareIcon className="group-hover:text-white transition-all" />
												<span className="text-sm text-[#47474A] group-hover:text-white transition-all">
													Share
												</span>
											</button>
											{authUser && (
												<SendTipButton
													userId={authUser?.PublicKeyBase58Check}
													postId={videoData.PostHashHex}
													receiverId={
														videoData.PosterPublicKeyBase58Check
													}
													diamonLevel={DiamonLevel.ONE}
													ui={SendTipButtonUI.BUTTON}
												/>
											)}
										</div>
									</div>

									{isAdmin && (
										<BlockButton
											userToBeBannedId={getVideoPosterPublicKey(videoData)}
										/>
									)}

									{/* 1.4. Post Description ------------------- */}
									{videoData?.Body && (
										<div className="">
											<TextDescription description={videoData?.Body} />
										</div>
									)}

									{/* 1.5. Post's CommentBox ------------------- */}
									<div
										id="video-comments"
										className="py-6 rounded-lg w-full border border-[#EBEBEB]"
									>
										<CommentBox
											PostHashHex={videoData?.PostHashHex}
											commentCount={videoData?.CommentCount}
											comments={videoComments(videoData?.Comments)}
											authUser={authUser}
										/>
									</div>
								</>
							)}
							{/* 1.1. Video Player ------------------- */}
						</div>
					)}

					{/* TODO:: Check, discuss and If necessary remove ------------------- */}
					<div className={cn('mt-4 flex space-x-2', 'hidden')}>
						<div className="likes-count flex space-x-2">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth={1.5}
								stroke="currentColor"
								className="w-6 h-6"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z"
								/>
							</svg>
							<div>{videoData.LikeCount}</div>
						</div>

						<div className="comments-count flex space-x-2">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth={1.5}
								stroke="currentColor"
								className="w-6 h-6"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
								/>
							</svg>

							<div>{videoData.CommentCount}</div>
						</div>

						<div className="reposted-count flex space-x-2">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth={1.5}
								stroke="currentColor"
								className="w-6 h-6"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M7.5 7.5h-.75A2.25 2.25 0 004.5 9.75v7.5a2.25 2.25 0 002.25 2.25h7.5a2.25 2.25 0 002.25-2.25v-7.5a2.25 2.25 0 00-2.25-2.25h-.75m0-3l-3-3m0 0l-3 3m3-3v11.25m6-2.25h.75a2.25 2.25 0 012.25 2.25v7.5a2.25 2.25 0 01-2.25 2.25h-7.5a2.25 2.25 0 01-2.25-2.25v-.75"
								/>
							</svg>

							<div>{videoData.RepostCount}</div>
						</div>
					</div>
				</div>

				{/* 2. More Videos Section ------------------- */}
				<div className="col-span-1">
					{relatedVideos.length > 0 && !isRelatedVideosLoading ? (
						<div className="flex flex-col gap-y-4">
							<RelatedVideoList videos={relatedVideos} />
						</div>
					) : (
						<RelatedVideosSkeleton />
					)}
				</div>

				{/* Playlist Popup Section ------------------- */}
				<PlaylistPopup
					open={showPlaylistModal}
					onClose={() => setShowPlaylistModal(false)}
					videoData={undefined}
					type={'VIDEO'}
				/>

				{/* Socail Share Section ------------------- */}
				<SocialSharePopup
					open={showShareModal}
					onClose={() => setShowShareModal(false)}
					videoData={videoData}
					type={'VIDEO'}
				/>
			</div>
		</MainLayout>
	);
};

export default VideoDetailsPage;

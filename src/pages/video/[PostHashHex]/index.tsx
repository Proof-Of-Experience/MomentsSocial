import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import MainLayout from '@/layouts/main-layout';
import { ApiDataType, apiService } from '@/utils/request';
import { cn, numerify, toCapitalize } from '@/utils';
import { selectAuthUser } from '@/slices/authSlice';
import { useSelector } from 'react-redux';
// import { getNFakeComments } from '@/data/comments';
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
	// console.log('authUser----', authUser);
	const { setCollapseSidebar } = useSidebar();

	// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
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
	};

	const onSuccessUserBlock = () => {
		if (!router.isReady) return;
		fetchSingleProfile();
		fetchRelatedVideos();
	};

	return (
		<MainLayout title="Video Details">
			<div className="min-h-[calc(100vh_-_72px)] grid grid-cols-3 gap-7">
				{/* 1. Post Videos and Details Section ------------------- */}
				<div className="col-span-2">
					{hasLoaded ? (
						<VideoPlayerSkeleton />
					) : (
						<div className="flex flex-col gap-y-6">
							<>
								{isBlocked ? (
									<div className="w-full h-[483px] rounded-2xl bg-gradient-to-br from-gray-300 via-transparent to-[#BABABA] flex item-center justify-center">
										<ContnetIsBlocked
											bannedUserId={
												videoData?.ProfileEntryResponse
													?.PublicKeyBase58Check
											}
										/>
									</div>
								) : (
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
								)}

								{/* 1.2. Post title and reactions ------------------- */}
								<div
									className={cn(
										'flex flex-col items-start gap-y-4',
										isBlocked ? 'blur-sm grayscale pointer-events-none' : ''
									)}
								>
									<h2 className="text-[#1C1B1F] text-xl line-clamp-1">
										{isBlocked
											? 'Video Content is blocked!'
											: toCapitalize(videoData?.Body)}
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
									<div
										className={cn(
											'flex items-center justify-start gap-x-4',
											isBlocked ? 'blur-sm grayscale pointer-events-none' : ''
										)}
									>
										<img
											className="w-12 h-12 object-cover rounded-full bg-gradient-to-br from-slate-200 to-slate-100 border border-slate-100 cursor-pointer"
											src={`https://diamondapp.com/api/v0/get-single-profile-picture/${videoData?.ProfileEntryResponse?.PublicKeyBase58Check}?fallback=https://diamondapp.com/assets/img/default-profile-pic.png`}
											alt={
												videoData?.ProfileEntryResponse?.Username ||
												'username'
											}
											onClick={() => {
												if (!isBlocked) {
													router.push(
														`/user/${videoData?.ProfileEntryResponse?.Username}`
													);
												}
											}}
										/>
										<h1
											className="text-2xl text-[#1C1B1F] font-medium cursor-pointer"
											onClick={() => {
												if (!isBlocked) {
													router.push(
														`/user/${videoData?.ProfileEntryResponse?.Username}`
													);
												}
											}}
										>
											{videoData?.ProfileEntryResponse?.Username}
										</h1>
									</div>
									{!isBlocked && (
										<div className="flex items-center justify-start flex-wrap gap-4">
											<div
												className="relative"
												onMouseEnter={() => {
													setShowReactTray(true);
												}}
												onMouseLeave={() => {
													setShowReactTray(false);
												}}
											>
												<button className="px-3 pl-2 py-1 flex items-center gap-x-2 bg-[#EBFAFF] hover:bg-[#00A1D4] rounded-2xl cursor-pointer group transition-all">
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
											{isAdmin && (
												<BlockButton
													userToBeBannedId={getVideoPosterPublicKey(
														videoData
													)}
													onSuccessBlock={() => onSuccessUserBlock()}
												/>
											)}
										</div>
									)}
								</div>

								{/* 1.4. Post Description ------------------- */}
								{videoData?.Body && !isBlocked && (
									<div className="">
										<TextDescription description={videoData?.Body} />
									</div>
								)}

								{/* 1.5. Post's CommentBox ------------------- */}
								{!isBlocked && (
									<div
										id="video-comments"
										className="py-6 rounded-lg w-full border border-[#EBEBEB]"
									>
										<CommentBox
											PostHashHex={videoData?.PostHashHex}
											authUser={authUser}
										/>
									</div>
								)}
							</>
							{/* 1.1. Video Player ------------------- */}
						</div>
					)}
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
				{showPlaylistModal && (
					<PlaylistPopup
						open={showPlaylistModal}
						onClose={() => setShowPlaylistModal(false)}
						userId={authUser?.api_user?._id}
						videoData={videoData}
						type={'VIDEO'}
					/>
				)}

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

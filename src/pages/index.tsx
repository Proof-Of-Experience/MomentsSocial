import MainLayout from '@/layouts/main-layout';
import VideoLayoutContext, { VideoLayoutProvider } from '@/contexts/VideosContext';
// import Layout from '@/features/home/layout';
import Tags from '@/features/home/tags';
import { NextPage } from 'next';
import { useContext, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import VideoItem from '@/components/snippets/video';
import VideoSkeleton from '@/components/skeletons/video';
import MomentsSlider from '@/features/home/slider/Slider';
import { ApiDataType, apiService } from '@/utils/request';
import {
	getPreferencePopupRandomInterval,
	wasPreferenceSavedBeforeLastXMinutes,
} from '@/services/tag/tag';
import { useSelector } from 'react-redux';
import { selectAuthUser } from '@/slices/authSlice';
import AllPreferences from '@/components/snippets/preferences/AllPreferences';
import { PostSort } from '@/services/post';
import { cn } from '@/utils';
import { VideoCameraSlashIcon } from '@heroicons/react/24/outline';

type videoSort = {
	key: string;
	value: string;
};

const Home: NextPage = () => {
	const router = useRouter();
	const tagParam: any = router.query.tag;
	const SKELETON_COUNT = 8;
	const { gridView }: any = useContext(VideoLayoutContext);
	const loadMoreRef = useRef(null);
	const authUser = useSelector(selectAuthUser);

	const [isVideoPaginating, setIsVideoPaginating] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [initialLoadComplete, setInitialLoadComplete] = useState(false);
	const [videoData, setVideoData] = useState<string[]>([]);
	const [momentsData, setMomentsData] = useState<string[]>([]);
	const [videoCurrentPage, setVideoCurrentPage] = useState(1);
	const [videoTotalPages, setVideoTotalPages] = useState<number>(Infinity);
	const [currentTag, setCurrentTag] = useState<string>('');
	const [momentsCurrentPage, setMomentsCurrentPage] = useState(1);
	const [momentsTotalPages, setMomentsTotalPages] = useState<number>(Infinity);
	const [displayPreference, setDisplayPreference] = useState<boolean>(false);
	const [authUserId, setAuthUserId] = useState<string | null>(null);
	const [postSort, setPostSort] = useState<PostSort|string>(PostSort.LATEST);

	const videoSortOptions: videoSort[] = [
		{
			key: PostSort.MOST_LIKED,
			value: 'Most Liked',
		},
		{
			key: PostSort.MOST_COMMENTED,
			value: 'Most Commented',
		},
		{
			key: PostSort.LATEST,
			value: 'Latest',
		},
	];

	const setSortAndFetch = async (sortOption: PostSort|string, pageNumber: number) => {
		setPostSort(() => sortOption);

		fetchVideos(pageNumber, sortOption);
	};

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const fetchVideos = async (page: number, sortBy: PostSort|string = PostSort.LATEST) => {
		if (page > videoTotalPages || isVideoPaginating) {
			setIsVideoPaginating(false);
			return; // Exit early if already fetching or if current page is beyond videoTotalPages.
		}
		setIsVideoPaginating(true); // Set to loading state

		try {
			let apiUrl = `/api/posts?page=${page}&limit=8&moment=false&sort_by=${sortBy.toString()}`;

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
					const uniquePosts = res.posts.filter(
						(post: any) =>
							!videoData.some(
								(existingPost: any) => existingPost.PostHashHex === post.PostHashHex
							)
					);
					setVideoData((prevData) => {
						const mergedData = [...prevData, ...uniquePosts];
						return Array.from(new Set(mergedData.map((post) => post.PostHashHex))).map(
							(hash) => mergedData.find((post) => post.PostHashHex === hash)
						);
					});
					setVideoCurrentPage(page);
				}

				if (!initialLoadComplete) {
					setInitialLoadComplete(true);
				}

				setIsVideoPaginating(false);
			});
		} catch (error: any) {
			console.error('error', error.response);
		} finally {
			setIsLoading(false);
		}
	};

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const fetchMoments = async (page: number = 1) => {
		let apiUrl = `/api/posts?page=${page}&limit=6&moment=true`;
		if (tagParam) {
			const tagWithHash = tagParam.startsWith('#') ? tagParam.splice(1) : tagParam; // : `#${tagParam}`;
			apiUrl += `&hashtag=${tagWithHash}`;
		}

		const apiData: ApiDataType = {
			method: 'get',
			url: apiUrl,
			customUrl: process.env.NEXT_PUBLIC_MOMENTS_UTIL_URL,
		};

		try {
			await apiService(apiData, (res: any, err: any) => {
				if (err) return err.response;

				if (res?.totalPages && momentsTotalPages !== res.totalPages) {
					setMomentsTotalPages(res.totalPages);
				}

				if (res?.posts.length > 0) {
					setMomentsData((prevData) => [...prevData, ...res.posts]);
				}
			});
		} catch (error: any) {
			console.error('error', error.response);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		if (!router.isReady) return;
		fetchVideos(videoCurrentPage);

		if (!authUser) {
			setDisplayPreference(true); // we still show the list
			console.log("we are still showing it")
			return;
		}
		setAuthUserId(authUser.PublicKeyBase58Check);
		// user is logged in

		if (
			wasPreferenceSavedBeforeLastXMinutes(
				authUser.PublicKeyBase58Check,
				getPreferencePopupRandomInterval()
			)
		) {
			// the preference have been saved current time - randomInterval minutes at least
			// display preference
			setDisplayPreference(true);
		}
	}, [tagParam, initialLoadComplete, router.isReady, videoCurrentPage, authUser]);

	useEffect(() => {
		if (!router.isReady) return;
		fetchMoments(momentsCurrentPage);
	}, [tagParam, router.isReady, momentsCurrentPage]);

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && !isVideoPaginating) {
					const nextPage = videoCurrentPage + 1;
					fetchVideos(nextPage);
				}
			},
			{
				threshold: 1.0, // Only trigger if the entire element is in view
			}
		);

		if (loadMoreRef.current) {
			observer.observe(loadMoreRef.current);
		}

		// Cleanup observer on unmount
		return () => {
			if (loadMoreRef.current) {
				// eslint-disable-next-line react-hooks/exhaustive-deps
				observer.unobserve(loadMoreRef.current);
			}
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [loadMoreRef.current, isVideoPaginating]);

	const onClickTag = async (value: string) => {
		setIsLoading(true);
		setVideoCurrentPage(1);
		setVideoTotalPages(1);
		setMomentsCurrentPage(1);
		setMomentsTotalPages(1);
		setVideoData([]);
		setMomentsData([]);

		if (value === 'all') {
			router.replace('/', undefined, { shallow: true });
		} else {
			router.replace({
				pathname: router.pathname,
				query: { ...router.query, tag: value },
			});
		}
		if (currentTag) setCurrentTag('');
	};

	const onPressTagSearch = () => {
		setIsLoading(true);
		setVideoCurrentPage(1);
		setVideoTotalPages(1);
		setMomentsCurrentPage(1);
		setMomentsTotalPages(1);
		setVideoData([]);
		setMomentsData([]);

		if (currentTag === 'all') {
			router.replace('/', undefined, { shallow: true });
		} else {
			router.replace({
				pathname: router.pathname,
				query: { ...router.query, tag: currentTag },
			});
		}
	};

	const showGridCol = () => {
		if (gridView === 'grid') {
			// 4 columns for desktop, 2 columns for tablet, 1 column for mobile
			return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4';
		} else {
			// 2 columns for desktop & tablet, 1 column for mobile
			return 'grid-cols-1 md:grid-cols-2';
		}
	};

	const loadMoreMoments = () => {
		if (momentsCurrentPage < momentsTotalPages) {
			setMomentsCurrentPage(momentsCurrentPage + 1);
		}
	};

	// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
	const renderVideoItems = () => {
		if (isLoading) {
			// Display skeletons when video is not loaded
			return Array(SKELETON_COUNT)
				.fill(null)
				.map((_, idx) => (
					<div
						key={`skeleton-${idx}`}
						className="overflow-hidden"
					>
						<VideoSkeleton />
					</div>
				));
		}

		// Display video items when loaded
		if (videoData?.length <= 0) {
			return (
				<div className="flex flex-col items-center justify-center h-80">
					<VideoCameraSlashIcon className="group-hover:text-white transition-all h-10 w-10" />
					<p className="text-lg mt-5">No video found</p>
				</div>
			);
		}
		return videoData.map((item: any, index: any) => (
			<div
				key={`moment-${index}`}
				className="overflow-hidden"
			>
				<VideoItem item={item} />
			</div>
		));
	};

	const LoaderBottom = () => <div className="loader">Loading...</div>;

	return (
		<MainLayout
			title="Home"
			mainWrapClass="p-7"
		>
			<VideoLayoutProvider>
				<div className={`pb-6 mb-6 border-b border-[#E8E8E8]`}>
					<Tags
						tagParam={tagParam}
						onClick={onClickTag}
						tagSearch={currentTag}
						onChangeTagSearch={(e) => setCurrentTag(e.target.value)}
						onPressTagSearch={onPressTagSearch}
					/>
				</div>

				{momentsData.length > 0 && (
					<div className="mb-12">
						<MomentsSlider
							momentsData={momentsData}
							loadMoreMoments={loadMoreMoments}
							onClickMoment={(item: any) => {
								setIsLoading(true);
								const queryParams = tagParam ? { Tag: tagParam } : {};
								router.push({
									pathname: `moment/${item?.PostHashHex}`,
									query: queryParams,
								});
							}}
						/>
					</div>
				)}

				<h2 className="space-x-2 text-[#1C1B1F] leading-none capitalize font-inter text-xl font-semibold mb-8">
					<span>Explore</span>
					{videoSortOptions.map((option: videoSort, i: number) => (
						<span
							key={i}
							onClick={() => setSortAndFetch(option?.key, videoCurrentPage)}
							className={cn(
								'rounded-md px-3 py-2 text-base cursor-pointer',
								option.key.toString() === postSort
									? 'text-blue-500 bg-blue-100/50'
									: 'text-blue-400 bg-gray-50 font-medium'
							)}
						>
							{option.value}
						</span>
					))}
				</h2>


				<div
					className={cn(
						'grid gap-x-7 gap-y-12',
						videoData?.length > 0 ? showGridCol() : ''
					)}
				>
					{renderVideoItems()}

					{/* Loader and Intersection Observer trigger */}
					{isLoading && <LoaderBottom />}
					<div ref={loadMoreRef}></div>
				</div>

				{displayPreference && <AllPreferences userId={authUserId ? authUserId : null} />}

			</VideoLayoutProvider>
		</MainLayout>
	);
};

export default Home;

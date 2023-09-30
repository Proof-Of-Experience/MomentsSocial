import MainLayout from '@/layouts/main-layout'
import VideoLayoutContext, { VideoLayoutProvider } from '@/contexts/VideosContext';
import Layout from '@/features/home/layout';
import Tags from '@/features/home/tags';
import { NextPage } from 'next';
import { useContext, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import VideoItem from '@/components/snippets/video';
import VideoSkeleton from '@/components/skeletons/video';
import MomentsSlider from '@/features/home/slider/Slider';
import { ApiDataType, apiService } from '@/utils/request';

const Home: NextPage = () => {
	const router = useRouter();
	const tagParam: any = router.query.tag
	const SKELETON_COUNT = 5;
	const { gridView }: any = useContext(VideoLayoutContext)
	const loadMoreRef = useRef(null);

	const [isVideoPaginating, setIsVideoPaginating] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [initialLoadComplete, setInitialLoadComplete] = useState(false);
	const [videoData, setVideoData] = useState<string[]>([]);
	const [momentsData, setMomentsData] = useState<string[]>([]);
	const [videoCurrentPage, setVideoCurrentPage] = useState(1);
	const [videoTotalPages, setVideoTotalPages] = useState<number>(Infinity);
	const [currentTag, setCurrentTag] = useState<string>('');

	const fetchVideos = async (page: number) => {

		if (page > videoTotalPages || isVideoPaginating) {
			setIsVideoPaginating(false);
			return;  // Exit early if already fetching or if current page is beyond videoTotalPages.
		}

		setIsVideoPaginating(true);  // Set to loading state

		try {
			let apiUrl = `/api/posts?page=${page}&limit=10&moment=false`;
			if (tagParam) {
				const tagWithHash = tagParam.startsWith('#') ? tagParam : `#${tagParam}`;
				apiUrl += `&hashtag=${encodeURIComponent(tagWithHash)}`;
			}

			const apiData: ApiDataType = {
				method: 'get',
				url: apiUrl,
				customUrl: process.env.NEXT_PUBLIC_MOMENTS_UTIL_URL,
			};

			await apiService(apiData, (res: any, err: any) => {
				if (err) return err.response

				if (res?.videoTotalPages && videoTotalPages !== res.videoTotalPages) {
					setVideoTotalPages(res.videoTotalPages);
				}

				if (res?.posts.length > 0) {
					// Filter out duplicates
					const uniquePosts = res.posts.filter((post: any) =>
						!videoData.some((existingPost: any) => existingPost.PostHashHex === post.PostHashHex)
					);
					setVideoData(prevData => {
						const mergedData = [...prevData, ...uniquePosts];
						return Array.from(new Set(mergedData.map(post => post.PostHashHex)))
							.map(hash => mergedData.find(post => post.PostHashHex === hash));
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
	}

	const fetchMoments = async (page: number = 1) => {
		let apiUrl = `/api/posts?page=${page}&limit=10&moment=true`;
		if (tagParam) {
			const tagWithHash = tagParam.startsWith('#') ? tagParam : `#${tagParam}`;
			apiUrl += `&hashtag=${encodeURIComponent(tagWithHash)}`;
		}

		const apiData: ApiDataType = {
			method: 'get',
			url: apiUrl,
			customUrl: process.env.NEXT_PUBLIC_MOMENTS_UTIL_URL,
		};

		try {
			await apiService(apiData, (res: any, err: any) => {
				if (err) return err.response

				if (res?.posts.length > 0) {
					setMomentsData(res.posts);
				}
			});
		} catch (error: any) {
			console.error('error', error.response);
		} finally {
			setIsLoading(false);
		}
	}


	useEffect(() => {
		if (!router.isReady) return;

		fetchVideos(1);
		fetchMoments();
	}, [tagParam, initialLoadComplete]);

	useEffect(() => {
		const observer = new IntersectionObserver(entries => {
			if (entries[0].isIntersecting && !isVideoPaginating) {
				console.log("Load More Triggered!");
				const nextPage = videoCurrentPage + 1;
				fetchVideos(nextPage);
			}
		}, {
			threshold: 1.0  // Only trigger if the entire element is in view
		});

		if (loadMoreRef.current) {
			observer.observe(loadMoreRef.current);
		}

		// Cleanup observer on unmount
		return () => {
			if (loadMoreRef.current) {
				observer.unobserve(loadMoreRef.current);
			}
		};
	}, [loadMoreRef.current, isVideoPaginating]);

	const onClickTag = (value: string) => {
		setVideoCurrentPage(1);

		if (value === 'all') {
			router.replace('/', undefined, { shallow: true });
			// fetchVideos()

		} else {
			router.replace({
				pathname: router.pathname,
				query: { ...router.query, tag: value },
			})
			// fetchFeedData(value)
		}
	}

	const onPressTagSearch = () => {

		setVideoCurrentPage(1);
		if (currentTag === 'all') {
			router.replace('/', undefined, { shallow: true });
			// fetchVideos()
		} else {
			router.replace({
				pathname: router.pathname,
				query: { ...router.query, tag: currentTag },
			})
			// fetchFeedData(currentTag)
		}
	}


	const showGridCol = () => {
		if (gridView === 'grid') {
			return 'grid-cols-5'
		} else {
			return 'grid-cols-3'
		}
	}

	const renderVideoItems = () => {
		if (isLoading) {
			// Display skeletons when video is not loaded
			return Array(SKELETON_COUNT).fill(null).map((_, idx) => (
				<div key={`skeleton-${idx}`} className="overflow-hidden">
					<VideoSkeleton />
				</div>
			));
		}

		// Display video items when loaded
		return videoData.map((item: any, index: any) => (
			<div key={`moment-${index}`} className="overflow-hidden">
				<VideoItem item={item} />
			</div>
		));
	}

	const LoaderBottom = () => (
		<div className="loader">
			Loading...
		</div>
	);


	return (
		<MainLayout title='Moments' mainWrapClass='p-5'>

			<VideoLayoutProvider>

				<div className={`flex justify-between items-center ${videoData.length > 0 ? 'mb-4' : 'mb-4'}`}>
					<Tags
						tagParam={tagParam}
						onClick={onClickTag}
						tagSearch={currentTag}
						onChangeTagSearch={e => setCurrentTag(e.target.value)}
						onPressTagSearch={onPressTagSearch}
					/>
					<Layout />
				</div >

				{
					momentsData.length > 0 &&
					<MomentsSlider
						momentsData={momentsData}
						onClickMoment={(item: any) => {
							setIsLoading(true)
							const queryParams = tagParam ? { Tag: tagParam } : {};

							router.push({
								pathname: `moment/${item?.PostHashHex}`,
								query: queryParams
							})
						}}
					/>
				}

				<div className={`grid ${showGridCol()} gap-x-5 gap-y-10`}>
					{renderVideoItems()}

					{/* Loader and Intersection Observer trigger */}
					{isLoading && <LoaderBottom />}
					<div ref={loadMoreRef}></div>

				</div>

			</VideoLayoutProvider >
		</MainLayout >
	)
}

export default Home


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

const Home: NextPage = () => {
	const router = useRouter();
	const tagParam: any = router.query.tag
	const SKELETON_COUNT = 5;
	const { gridView }: any = useContext(VideoLayoutContext)
	const loadMoreRef = useRef(null);

	const [isPaginating, setIsPaginating] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [initialLoadComplete, setInitialLoadComplete] = useState(false);
	const [videoData, setVideoData] = useState<string[]>([]);
	const [momentsData, setMomentsData] = useState<string[]>([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState<number>(Infinity);
	const [currentTag, setCurrentTag] = useState<string>('');

	console.log('momentsData', momentsData);
	console.log('videoData', videoData);


	const fetchVideos = async (page: number) => {

		if (page > totalPages || isPaginating) {
			setIsPaginating(false);
			return;  // Exit early if already fetching or if current page is beyond totalPages.
		}

		setIsPaginating(true);  // Set to loading state

		try {
			const { data } = await axios.get(`http://localhost:3011/api/posts?page=${page}&limit=10&moment=false`);

			if (data.totalPages && totalPages !== data.totalPages) {
				setTotalPages(data.totalPages);
			}

			if (data?.posts.length > 0) {
				// Filter out duplicates
				const uniquePosts = data.posts.filter((post: any) =>
					!videoData.some((existingPost: any) => existingPost.PostHashHex === post.PostHashHex)
				);
				setVideoData(prevData => [...prevData, ...uniquePosts]);
				setCurrentPage(page);
			}

			if (!initialLoadComplete) {
				setInitialLoadComplete(true);
			}

			setIsPaginating(false);
		} catch (error: any) {
			console.log('error', error.response);
		} finally {
			setIsLoading(false);
		}
	}

	const fetchMoments = async (page: number = 1) => {

		try {
			const { data } = await axios.get('http://localhost:3011/api/posts?page=1&limit=10&moment=true');
			if (data?.posts.length > 0) {
				setMomentsData(data.posts);
			}
		} catch (error: any) {
			console.log('error', error.response);
		} finally {
			setIsLoading(false);
		}
	}


	useEffect(() => {
		if (!router.isReady || initialLoadComplete) return;

		if (tagParam) {
			// fetchFeedData(tagParam);
		} else {
			fetchVideos(1);  // Start with the first page
			fetchMoments();
		}
	}, [tagParam]);

	useEffect(() => {
		const observer = new IntersectionObserver(entries => {
			if (entries[0].isIntersecting && !isPaginating) {
				console.log("Load More Triggered!");
				const nextPage = currentPage + 1;
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
	}, [loadMoreRef.current, isPaginating]);


	const onClickTag = (value: string) => {
		setCurrentPage(1);

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

		setCurrentPage(1);
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
						onClick={(item: any) => {
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


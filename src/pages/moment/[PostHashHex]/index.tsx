import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import MainLayout from '@/layouts/main-layout';
import { LoadingSpinner } from '@/components/core/loader';
import { debounce, mergeVideoData } from '@/utils';
import { selectAuthUser } from '@/slices/authSlice';
import { useSelector } from 'react-redux';
import { ApiDataType, apiService } from '@/utils/request';
import { useSidebar } from '@/utils/hooks';
import MomentDetailsSingleItem from '@/components/snippets/moment-details/SingleItem';

const MomentDetailsPage = () => {
	const router = useRouter();
	const { PostHashHex, Tag }: any = router.query;
	// const videoUrl = process.env.NEXT_PUBLIC_MOMENTS_DOMAIN_URL + router.asPath;

	const authUser = useSelector(selectAuthUser);
	const { setCollapseSidebar } = useSidebar();
	const [activeVideoIndex, setActiveVideoIndex] = useState(0);
	const [hasLoaded, setHasLoaded] = useState<boolean>(true);
	const [videoData, setVideoData] = useState<any>([]);
	const [currentPage, setCurrentPage] = useState<number>(1);

	const wheelDivRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		setCollapseSidebar(true);
	}, []);

	useEffect(() => {
		if (!router.isReady) return;
		fetchSingleProfile();
		if (Tag) {
			fetchFeedData();
		} else {
			fetchStatelessPostData();
		}
	}, [router.isReady]);

	useEffect(() => {
		const handleRouteChange = () => {
			const videoIndex = videoData.findIndex(
				(video: any) => video.PostHashHex === PostHashHex
			);
			if (videoIndex !== -1) {
				setActiveVideoIndex(videoIndex);
			}
		};
		router.events.on('routeChangeComplete', handleRouteChange);
		return () => {
			router.events.off('routeChangeComplete', handleRouteChange);
		};
	}, []);

	useEffect(() => {
		const wheelDiv = wheelDivRef.current;

		const handleWheel = debounce((event: globalThis.WheelEvent) => {
			if (videoData.length <= 1) {
				return;
			}

			event.preventDefault();

			const delta = event.deltaY > 0 ? 1 : -1;
			const newIndex = (activeVideoIndex + delta + videoData.length) % videoData.length;

			setActiveVideoIndex(newIndex);
			const videoId = videoData?.length > 0 && videoData[newIndex].PostHashHex;

			if (newIndex + 5 >= videoData.length) {
				setCurrentPage((prev) => prev++);
				fetchMoments(currentPage);
			}

			router.push(`/moment/${videoId}${Tag ? `?Tag=${Tag}` : ''}`, undefined, {
				shallow: true,
			});
		}, 100); // delay handler

		if (wheelDiv) {
			wheelDiv.addEventListener('wheel', handleWheel, { passive: false });
		}

		return () => {
			if (wheelDiv) {
				wheelDiv.removeEventListener('wheel', handleWheel);
			}
		};
	}, [videoData, activeVideoIndex]);

	const fetchSingleProfile = async () => {
		const { getSinglePost } = await import('deso-protocol');
		const params = {
			PostHashHex,
		};

		const singlePost: any = await getSinglePost(params);

		setVideoData((prevVideoData: any) =>
			mergeVideoData(prevVideoData, [singlePost?.PostFound])
		);

		setHasLoaded(false);
	};

	const fetchMoments = async (page: number = 1) => {
		let apiUrl = `/api/posts?page=${page}&limit=5&moment=true`;

		if (Tag) {
			const tagWithHash = Tag.startsWith('#') ? Tag : `#${Tag}`;
			apiUrl += `&hashtag=${encodeURIComponent(tagWithHash)}`;
		}

		const apiData: ApiDataType = {
			method: 'get',
			url: apiUrl,
			customUrl: process.env.NEXT_PUBLIC_MOMENTS_UTIL_URL,
		};

		try {
			await apiService(apiData, (res: any, err: any) => {
				if (err) return err.response;

				let data: any = [];

				res.posts.forEach((post: any) => {
					if (post.PostHashHex !== videoData?.PostHashHex) {
						post.VideoURLs = [post.VideoURL];
						data.push(post);
					}
				});

				data = mergeVideoData(data, videoData);

				setVideoData(data);
			});
		} catch (error: any) {
			console.error('error', error.response);
		} finally {
			setCurrentPage((prev) => prev++);
		}
	};

	const fetchStatelessPostData = async () => {
		const { getPostsStateless } = await import('deso-protocol');
		const formData = {
			NumToFetch: 100,
			OrderBy: 'VideoURLs',
		};
		const postData = await getPostsStateless(formData);

		if (postData?.PostsFound && postData?.PostsFound.length > 0) {
			const filteredData: any = postData?.PostsFound.filter(
				(item: any) => item.VideoURLs && item.VideoURLs.some((videoURL: any) => videoURL)
			);
			setVideoData((prevVideoData: any) => mergeVideoData(prevVideoData, filteredData));
		}
	};

	const fetchFeedData = async () => {
		const { getHotFeed } = await import('deso-protocol');

		const data = {
			Tag: `#${Tag}`,
		};
		const feedData = await getHotFeed(data);

		if (feedData?.HotFeedPage && feedData?.HotFeedPage.length > 0) {
			const filteredData: any = feedData?.HotFeedPage.filter(
				(item: any) => item.VideoURLs && item.VideoURLs.some((videoURL: any) => videoURL)
			);
			setVideoData((prevVideoData: any) => mergeVideoData(prevVideoData, filteredData));
		}
	};

	return (
		<MainLayout>
			<div
				className="flex flex-col items-center justify-center"
				ref={wheelDivRef}
			>
				{hasLoaded ? (
					<LoadingSpinner isLoading={hasLoaded} />
				) : (
					videoData.length > 0 &&
					videoData.map((video: any, index: number) => {
						return (
							<div
								key={index}
								className={`${activeVideoIndex !== index ? 'hidden' : ''}`}
							>
								<MomentDetailsSingleItem
									item={video}
									videoData={videoData}
									authUser={authUser}
									videoUrl={video?.VideoURLs?.[0]}
								/>
							</div>
						);
					})
				)}
			</div>
		</MainLayout>
	);
};

export default MomentDetailsPage;

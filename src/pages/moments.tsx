import MainLayout from '@/layouts/main-layout'
import VideoLayoutContext, { VideoLayoutProvider } from '@/contexts/VideosContext';
import Layout from '@/features/home/layout';
import Tags from '@/features/home/tags';
import { NextPage } from 'next';
import { useContext, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { ApiDataType, apiService } from '@/utils/request';
import Moment from '@/components/snippets/moment';
import MomentSkeleton from '@/components/skeletons/moment';

const Moments: NextPage = () => {
	const router = useRouter();
	const tagParam: any = router.query.tag
	const SKELETON_COUNT = 8;
	const { gridView }: any = useContext(VideoLayoutContext)
	const loadMoreRef = useRef(null);

	const [isMomentPaginating, setIsMomentsPaginating] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [initialLoadComplete, setInitialLoadComplete] = useState(false);
	const [momentsData, setMomentsData] = useState<string[]>([]);
	const [currentTag, setCurrentTag] = useState<string>('');
	const [momentsCurrentPage, setMomentsCurrentPage] = useState(1);
	const [momentsTotalPages, setMomentsTotalPages] = useState<number>(Infinity);

	console.log('momentsData', momentsData);


	const fetchMoments = async (page: number) => {
		console.log('page', page);
		console.log('momentsTotalPages', momentsTotalPages);


		if (page > momentsTotalPages || isMomentPaginating) {
			setIsMomentsPaginating(false);
			return;  // Exit early if already fetching or if current page is beyond momentsTotalPages.
		}

		setIsMomentsPaginating(true);  // Set to loading state

		try {
			let apiUrl = `/api/posts?page=${page}&limit=8&moment=true`;
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

				if (res?.totalPages && momentsTotalPages !== res.totalPages) {
					setMomentsTotalPages(res.totalPages);
				}

				if (res?.posts.length > 0) {
					// Filter out duplicates
					const uniquePosts = res.posts.filter((post: any) =>
						!momentsData.some((existingPost: any) => existingPost.PostHashHex === post.PostHashHex)
					);
					setMomentsData(prevData => {
						const mergedData = [...prevData, ...uniquePosts];
						return Array.from(new Set(mergedData.map(post => post.PostHashHex)))
							.map(hash => mergedData.find(post => post.PostHashHex === hash));
					});
					setMomentsCurrentPage(page);
				}

				if (!initialLoadComplete) {
					setInitialLoadComplete(true);
				}

				setIsMomentsPaginating(false);
			});
		} catch (error: any) {
			console.error('error', error.response);
		} finally {
			setIsLoading(false);
		}
	}


	useEffect(() => {
		if (!router.isReady) return;
		fetchMoments(momentsCurrentPage);
	}, [tagParam, initialLoadComplete, router.isReady]);


	useEffect(() => {
		const observer = new IntersectionObserver(entries => {
			if (entries[0].isIntersecting && !isMomentPaginating) {
				console.log("Load More Triggered!");
				const nextPage = momentsCurrentPage + 1;
				console.log('nextPage', nextPage);

				fetchMoments(nextPage);
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
	}, [loadMoreRef.current, isMomentPaginating]);

	const onClickTag = async (value: string) => {
		setMomentsCurrentPage(1);
		setMomentsTotalPages(1)
		setMomentsCurrentPage(1);
		setMomentsData([])
		setMomentsData([])

		if (value === 'all') {
			router.replace('/', undefined, { shallow: true });
		} else {
			router.replace({
				pathname: router.pathname,
				query: { ...router.query, tag: value },
			})
		}
	}

	const onPressTagSearch = () => {

		setMomentsCurrentPage(1);
		setMomentsCurrentPage(1);
		if (currentTag === 'all') {
			router.replace('/', undefined, { shallow: true });
		} else {
			router.replace({
				pathname: router.pathname,
				query: { ...router.query, tag: currentTag },
			})
		}
	}

	const showGridCol = () => {
		if (gridView === 'grid') {
			return 'grid-cols-4'
		} else {
			return 'grid-cols-2'
		}
	}

	const renderMomentItems = () => {
		if (isLoading) {
			// Display skeletons when moment is not loaded
			return Array(SKELETON_COUNT).fill(null).map((_, idx) => (
				<div key={`skeleton-${idx}`} className="overflow-hidden">
					<MomentSkeleton />
				</div>
			));
		}

		// Display moment items when loaded
		return momentsData.map((item: any, index: any) => (
			<div key={`moment-${index}`} className="overflow-hidden">
				<Moment
					key={item.PostHashHex}
					className="mr-6"
					item={item}
					isLoading={isLoading}
					onClick={(item: any) => {
						setIsLoading(true)
						const queryParams = tagParam ? { Tag: tagParam } : {};

						router.push({
							pathname: `moment/${item?.PostHashHex}`,
							query: queryParams
						})
					}}
				/>
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

				<div className={`flex justify-between items-center ${momentsData.length > 0 ? 'mb-4' : 'mb-4'}`}>
					<Tags
						tagParam={tagParam}
						onClick={onClickTag}
						tagSearch={currentTag}
						onChangeTagSearch={e => setCurrentTag(e.target.value)}
						onPressTagSearch={onPressTagSearch}
					/>
					<Layout />
				</div >

				<div className={`grid ${showGridCol()} gap-x-5 gap-y-10`}>
					{renderMomentItems()}

					{/* Loader and Intersection Observer trigger */}
					{isLoading && <LoaderBottom />}
					<div ref={loadMoreRef}></div>

				</div>

			</VideoLayoutProvider >
		</MainLayout >
	)
}

export default Moments


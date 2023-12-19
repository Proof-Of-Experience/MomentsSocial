import MainLayout from '@/layouts/main-layout';
import VideoLayoutContext, { VideoLayoutProvider } from '@/contexts/VideosContext';
// import Layout from '@/features/home/layout';
import Tags from '@/features/home/tags';
import { NextPage } from 'next';
import { useContext, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { ApiDataType, apiService } from '@/utils/request';
import Moment from '@/components/snippets/moment';
import MomentSkeleton from '@/components/skeletons/moment';

type Post = {
	PostHashHex: string;
	// ... other properties of a post
};

const Moments: NextPage = () => {
	const router = useRouter();
	const tagParam = router.query.tag as string;
	const { gridView }: any = useContext(VideoLayoutContext);
	const loadMoreRef = useRef(null);

	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [initialLoadComplete, setInitialLoadComplete] = useState(false);
	const [momentsData, setMomentsData] = useState<Post[]>([]);
	const [currentTag, setCurrentTag] = useState<string>('');
	const [paginationInfo, setPaginationInfo] = useState({
		isPaginating: false,
		currentPage: 1,
		totalPages: Infinity,
	});

	const fetchMoments = async (page: number) => {
		if (page > paginationInfo.totalPages || paginationInfo.isPaginating) {
			return;
		}

		setPaginationInfo((prev) => ({ ...prev, isPaginating: true }));

		try {
			let apiUrl = `/api/posts?page=${page}&limit=8&moment=true`;
			if (tagParam) {
				const tagWithHash = tagParam.startsWith('#') ? tagParam.slice(1) : tagParam; // : `#${tagParam}`;
				apiUrl += `&hashtag=${tagWithHash}`;
			}

			const apiData: ApiDataType = {
				method: 'get',
				url: apiUrl,
				customUrl: process.env.NEXT_PUBLIC_MOMENTS_UTIL_URL,
			};

			await apiService(apiData, (res: any, err: any) => {
				if (err) return err.response;

				if (res?.totalPages && paginationInfo.totalPages !== res.totalPages) {
					setPaginationInfo((prev) => ({ ...prev, totalPages: res.totalPages }));
				}

				if (res?.posts.length > 0) {
					const uniquePosts = res.posts.filter(
						(post: Post) =>
							!momentsData.some(
								(existingPost) => existingPost.PostHashHex === post.PostHashHex
							)
					);

					setMomentsData((prevData) => {
						const mergedData = [...prevData, ...uniquePosts];
						return Array.from(new Set(mergedData.map((post) => post.PostHashHex))).map(
							(hash) => mergedData.find((post) => post.PostHashHex === hash)
						);
					});
					setPaginationInfo((prev) => ({ ...prev, currentPage: page }));
				}

				if (!initialLoadComplete) {
					setInitialLoadComplete(true);
				}

				setPaginationInfo((prev) => ({ ...prev, isPaginating: false }));
			});
		} catch (error: any) {
			console.error('error', error.response);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		if (!router.isReady) return;
		fetchMoments(paginationInfo.currentPage);
	}, [tagParam, initialLoadComplete, router.isReady]);

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && !paginationInfo.isPaginating) {
					fetchMoments(paginationInfo.currentPage + 1);
				}
			},
			{
				threshold: 1.0,
			}
		);

		if (loadMoreRef.current) {
			observer.observe(loadMoreRef.current);
		}

		return () => {
			if (loadMoreRef.current) {
				observer.unobserve(loadMoreRef.current);
			}
		};
	}, [loadMoreRef.current, paginationInfo.isPaginating]);

	const handleTagClick = (value: string) => {
		setIsLoading(true);
		setMomentsData([]);
		setPaginationInfo({ isPaginating: false, currentPage: 1, totalPages: Infinity });

		const newRoute =
			value === 'all'
				? '/'
				: {
						pathname: router.pathname,
						query: { ...router.query, tag: value },
				  };

		router.replace(newRoute, undefined, { shallow: true });
	};

	const showGridCol = () => (gridView === 'grid' ? 'grid-cols-4' : 'grid-cols-2');

	const renderMomentItems = () => {
		if (isLoading) {
			return Array(8)
				.fill(null)
				.map((_, idx) => (
					<div
						key={`skeleton-${idx}`}
						className="overflow-hidden"
					>
						<MomentSkeleton />
					</div>
				));
		}

		return momentsData.map((item: Post) => (
			<div
				key={item.PostHashHex}
				className="overflow-hidden"
			>
				<Moment
					item={item}
					isLoading={isLoading}
					onClick={() => {
						setIsLoading(true);
						const queryParams = tagParam ? { Tag: tagParam } : {};
						router.push({
							pathname: `moment/${item?.PostHashHex}`,
							query: queryParams,
						});
					}}
				/>
			</div>
		));
	};

	return (
		<MainLayout
			title="Moments"
			mainWrapClass="p-5"
		>
			<VideoLayoutProvider>
				<div className={`pb-6 mb-6 border-b border-[#E8E8E8]`}>
					<Tags
						tagParam={tagParam}
						onClick={handleTagClick}
						tagSearch={currentTag}
						onChangeTagSearch={(e) => setCurrentTag(e.target.value)}
						onPressTagSearch={() => handleTagClick(currentTag)}
					/>
					{/* <Layout /> */}
				</div>

				<div className={`grid ${showGridCol()} gap-x-7 gap-y-12`}>
					{renderMomentItems()}
					<div ref={loadMoreRef}></div>
				</div>
			</VideoLayoutProvider>
		</MainLayout>
	);
};

export default Moments;

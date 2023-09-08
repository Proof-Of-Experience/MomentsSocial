import MainLayout from '@/layouts/main-layout'
import { VideoLayoutProvider } from '@/contexts/VideosContext';
import Videos from '@/components/snippets/videos';
import Layout from '@/features/home/layout';
import { getFeedData } from '@/pages/api/feed';
import Tags from '@/features/home/tags';
import { NextPage } from 'next';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import Moment from '@/components/snippets/moment';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const Home: NextPage = () => {
	const router = useRouter();
	const tagParam: any = router.query.tag

	const [videoLoaded, setVideoLoaded] = useState<boolean>(true);
	const [videoData, setVideoData] = useState<string[]>([]);
	const [momentsData, setMomentsData] = useState<string[]>([]);
	const [cachedData, setCachedData] = useState<string[]>([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [currentTag, setCurrentTag] = useState<string>('');

	const itemsPerPage = 5;

	const slider: any = useRef(null);

	const dynamicSlidesToShow = useMemo(() => {
		if (momentsData.length > 4) {
			return 5;
		} else if (momentsData.length < 3) {
			return 4;
		} else if (momentsData.length < 1) {
			return 1;
		} else {
			return momentsData.length;
		}
	}, [momentsData]);

	const momentSliderSettings = {
		dots: false,
		infinite: true,
		loop: false,
		arrows: false,
		speed: 500,
		slidesToShow: dynamicSlidesToShow,
		slidesToScroll: 3,
		responsive: [
			{
				breakpoint: 1200,
				settings: {
					slidesToShow: 5,
					slidesToScroll: 3,
				}
			},
			{
				breakpoint: 991,
				settings: {
					slidesToShow: 3,
					slidesToScroll: 2,
				}
			},
			{
				breakpoint: 700,
				settings: {
					slidesToShow: 2,
					slidesToScroll: 1
				}
			},
			{
				breakpoint: 575,
				settings: {
					slidesToShow: 1,
				}
			}
		]
	};

	const fetchStatelessPostData = async (page: number = 1) => {
		if (cachedData.length >= page * itemsPerPage) {
			// If we already have the data, don't call the API again.
			const newData = cachedData.slice((page - 1) * itemsPerPage, page * itemsPerPage);
			setMomentsData(newData);
			return;
		}

		const { getPostsStateless } = await import('deso-protocol')
		setVideoLoaded(true)
		const formData = {
			NumToFetch: 100,
			OrderBy: 'VideoURLs',
		}
		const postData = await getPostsStateless(formData)
		setVideoLoaded(false)

		if (postData && postData.PostsFound && postData.PostsFound.length > 0) {
			const newVideoData: any = postData?.PostsFound.filter((item: any) =>
				item.VideoURLs && item.VideoURLs.some((videoURL: any) => videoURL)
			);
			setVideoData(newVideoData);
			setCachedData(newVideoData);
			const displayData = newVideoData.slice(0, itemsPerPage);
			setMomentsData(displayData);
		}
	}

	const fetchFeedData = async (tag: string, page: number = 1) => {
		if (currentTag !== tag) {
			setCachedData([]); // Reset cached data
			setCurrentTag(tag); // Update the current tag
		}

		if (cachedData.length >= page * itemsPerPage) {
			// If we already have the data, don't call the API again.
			const newData = cachedData.slice((page - 1) * itemsPerPage, page * itemsPerPage);
			setMomentsData(newData);
			return;
		}

		setVideoLoaded(true)

		const data = {
			Tag: `#${tag}`,
		}
		const feedData = await getFeedData(data);
		setVideoLoaded(false)

		if (feedData && feedData.HotFeedPage && feedData.HotFeedPage.length > 0) {
			const newVideoData: any = feedData?.HotFeedPage.filter((item: any) =>
				item.VideoURLs && item.VideoURLs.some((videoURL: any) => videoURL)
			);
			setVideoData(newVideoData);
			setCachedData(newVideoData);
			const displayData = newVideoData.slice(0, itemsPerPage);
			setMomentsData(displayData)
		} else {
			setVideoData([]);
			setCachedData([]);
			setMomentsData([]);
		}
	}

	const loadMoreMoments = () => {
		const nextPage = currentPage + 1;
		const startIndex = (nextPage - 1) * itemsPerPage;
		const endIndex = nextPage * itemsPerPage;

		const nextDataSlice = cachedData.slice(startIndex, endIndex);

		if (nextDataSlice.length === itemsPerPage) {
			// We have all the data for the next page in cache.
			setMomentsData(nextDataSlice);
			setCurrentPage(nextPage);
		} else {
			// We don't have all the data for the next page, fetch it.
			setCurrentPage(nextPage);
			fetchStatelessPostData(nextPage);
		}
	}


	useEffect(() => {

		if (!router.isReady) return;

		if (tagParam) {
			fetchFeedData(tagParam);
		} else {
			fetchStatelessPostData();
		}
	}, [router.isReady, tagParam]);

	const onClickTag = (value: string) => {
		setCurrentPage(1);

		if (value === 'all') {
			router.replace('/', undefined, { shallow: true });
			fetchStatelessPostData()

		} else {
			router.replace({
				pathname: router.pathname,
				query: { ...router.query, tag: value },
			})
			fetchFeedData(value)
		}
	}

	const onPressTagSearch = () => {

		setCurrentPage(1);
		setCachedData([]);
		if (currentTag === 'all') {
			router.replace('/', undefined, { shallow: true });
			fetchStatelessPostData()
		} else {
			router.replace({
				pathname: router.pathname,
				query: { ...router.query, tag: currentTag },
			})
			fetchFeedData(currentTag)
		}
	}


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

				{/* {
					videoData.length > 0 &&
					<>
						<Videos videoData={videoData} videoLoaded={videoLoaded} />
						<hr className="border-t-2 my-10" />
					</>
				} */}

				{
					momentsData.length > 0 &&
					<>
						<div className="flex justify-between items-center mr-10 mb-3">
							<h3 className="font-semibold text-3xl">Moments</h3>
							{
								momentsData.length > 4 && (
									<div>
										<button
											className="mr-4"
											onClick={() => slider?.current?.slickPrev()}>
											<ChevronLeftIcon className="h-5 w-5" />
										</button>
										<button
											onClick={() => {
												slider?.current?.slickNext();
												loadMoreMoments();
											}}>
											<ChevronRightIcon className="h-5 w-5" />
										</button>
									</div>
								)
							}
						</div>

						<Slider ref={slider}  {...momentSliderSettings}>
							{
								momentsData.map((item: any) => {
									return (
										<Moment
											key={item.PostHashHex} // use unique identifier as key
											className="mr-6"
											item={item}
											onClick={() => {
												setVideoLoaded(true)
												const queryParams = tagParam ? { Tag: tagParam } : {};

												router.push({
													pathname: `moment/${item?.PostHashHex}`,
													query: queryParams
												})
											}}
										/>
									)
								})
							}
						</Slider>

						{
							momentsData.length > 0 &&
							<hr className="border-t-2 my-10" />
						}
					</>
				}

				{
					videoData.length > 0 &&
					<div className="mb-20">
						<Videos videoData={videoData} videoLoaded={videoLoaded} />
					</div>
				}

			</VideoLayoutProvider >
		</MainLayout >
	)
}

export default Home


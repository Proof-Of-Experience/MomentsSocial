import MainLayout from '@/layouts/main-layout'
import { VideoLayoutProvider } from '@/contexts/VideosContext';
import Videos from '@/components/snippets/videos';
import Layout from '@/features/home/layout';
import { getFeedData } from '@/pages/api/feed';
import Tags from '@/features/home/tags';
import { NextPage } from 'next';
import { useEffect, useRef, useState } from 'react';
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
	const [loadedVideoData, setLoadedVideoData] = useState<string[]>([]);
	const [cachedData, setCachedData] = useState<string[]>([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [currentTag, setCurrentTag] = useState<string | null>(null);

	const itemsPerPage = 5;

	const slider: any = useRef(null);

	const momentSliderSettings = {
		dots: false,
		infinite: true,
		loop: true,
		arrows: false,
		speed: 500,
		slidesToShow: videoData.length > 5 ? 6 : videoData.length,
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

	console.log('momentsData', momentsData);


	return (
		<MainLayout title='Moments'>

			<VideoLayoutProvider>

				<div className={`flex justify-between items-center ${videoData.length > 0 ? 'mb-4' : 'mb-4'}`}>
					<Tags tagParam={tagParam} onClick={onClickTag} />
					<Layout />
				</div >

				{
					videoData.length > 0 &&
					<>
						<Videos videoData={videoData} videoLoaded={videoLoaded} />
						<hr className="border-t-2 my-10" />
					</>
				}

				{
					momentsData.length > 0 &&
					<>
						<div className="flex justify-between items-center mr-10 mb-3">
							<h3 className="font-semibold text-3xl">Moments</h3>
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
												router.push({
													pathname: `moment/${item?.PostHashHex}`,
													query: { Tag: tagParam }
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
					<Videos videoData={videoData} />
				}

			</VideoLayoutProvider >
		</MainLayout >
	)
}

export default Home


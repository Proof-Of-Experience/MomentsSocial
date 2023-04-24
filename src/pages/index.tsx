import MainLayout from '@/layouts/main-layout'
import { VideoLayoutProvider } from '@/contexts/VideosContext';
import Videos from '@/components/snippets/videos';
import Layout from '@/features/home/layout';
import { getFeedData } from '@/pages/api/feed';
import { getStatelessPostData } from '@/pages/api/post';
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
  const [imageData, setImageData] = useState<string[]>([]);
  const slider: any = useRef(null);

  const momentSliderSettings = {
    dots: false,
    infinite: true,
    arrows: true,
    // centerPadding: true,
    speed: 500,
    slidesToShow: imageData.length > 7 ? 8 : imageData.length,
    slidesToScroll: 3
  };

  const fetchStatelessPostData = async () => {
    setVideoLoaded(true)
    const formData = {
      NumToFetch: 50,
      OrderBy: 'VideoURLs',
    }
    const postData = await getStatelessPostData(formData)
    setVideoLoaded(false)

    if (postData?.PostsFound) {
      const newVideoData: any = postData?.PostsFound.filter((item: any) => item.VideoURLs)
      const newImageData: any = postData?.PostsFound.filter((item: any) => item.ImageURLs)
      setVideoData(newVideoData)
      setImageData(newImageData)
    }
  }

  const fetchFeedData = async (tag: string) => {
    setVideoLoaded(true)

    const data = {
      Tag: `#${tag}`,
    }
    const feedData = await getFeedData(data);
    setVideoLoaded(false)

    if (feedData?.HotFeedPage) {
      const newVideoData: any = feedData?.HotFeedPage.filter((item: any) => item.VideoURLs)
      const newImageData: any = feedData?.HotFeedPage.filter((item: any) => item.ImageURLs)
      setVideoData(newVideoData)
      setImageData(newImageData)
    }
  }

  useEffect(() => {
    if (!router.isReady) return


    if (tagParam) {
      fetchFeedData(tagParam)
    } else {
      fetchStatelessPostData()
    }
  }, [router.isReady])

  const onClickTag = (value: string) => {
    if (value === 'all') {
      router.replace('/', undefined, { shallow: true });
      fetchStatelessPostData()

    } else {
      router.replace({
        query: { ...router.query, tag: value },
      })
      fetchFeedData(value)
    }
  }

  const onClickMoment = (item: any) => {
    console.log('item', item);

  }

  return (
    <MainLayout title='Moments' isLoading={videoLoaded}>

      <VideoLayoutProvider>

        <div className={`flex justify-between items-center ${videoData.length > 0 ? 'mb-4' : 'mb-4'}`}>
          <Tags tagParam={tagParam} onClick={onClickTag} />
          <Layout />
        </div >

        {
          videoData.length > 0 &&
          <>
            <Videos videoData={videoData} />
            <hr className="border-t-2 my-10" />
          </>
        }

        {
          imageData.length > 0 &&
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
                  onClick={() => slider?.current?.slickNext()}>
                  <ChevronRightIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            <Slider ref={slider}  {...momentSliderSettings}>
              {
                imageData.map((item: any, index: any) => {
                  return (
                    <Moment
                      key={`moment-${index} overflow-hidden`}
                      className="mr-6"
                      item={item}
                      onClick={() => onClickMoment(item)}
                    />
                  )
                })
              }
            </Slider>

            {
              videoData.length > 0 &&
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


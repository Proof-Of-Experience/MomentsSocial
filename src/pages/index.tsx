import MainLayout from '@/layouts/main-layout'
import { VideoLayoutProvider } from '@/contexts/VideosContext';
import Moments from '@/features/home/moments';
import Videos from '@/features/home/videos';
import Layout from '@/features/home/layout';
import { getFeedData } from '@/pages/api/feed';
import { getStatelessPostData } from '@/pages/api/post';
import Tags from '@/features/home/tags';
import { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const Home: NextPage = () => {
  const router = useRouter();
  const tagParam: any = router.query.tag

  const [videoLoaded, setVideoLoaded] = useState<boolean>(true);
  const [videoData, setVideoData] = useState<string[]>([]);
  const [imageData, setImageData] = useState<string[]>([]);

  const fetchStatelessPostData = async () => {
    setVideoLoaded(true)
    const postData = await getStatelessPostData()
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

  return (
    <MainLayout title='Moments' isLoading={videoLoaded}>

      <VideoLayoutProvider>
        <div className="flex justify-between items-center">
          <div className="mb-3">
            <Tags tagParam={tagParam} onClick={onClickTag} />
          </div>
          <Layout />
        </div >

        <Moments imageData={imageData} />

        <hr className="my-10" />

        <Videos videoData={videoData} />

      </VideoLayoutProvider >
    </MainLayout >
  )
}

export default Home


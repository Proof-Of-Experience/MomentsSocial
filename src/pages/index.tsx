import MainLayout from '@/layouts/MainLayout'
import { VideoLayoutProvider } from '@/contexts/VideosContext';
import Reals from '@/features/home/Reals';
import Videos from '@/features/home/Videos';
import Layout from '@/features/home/Layout';
import { getFeedData, getStatelessPostData } from '@/pages/api/feed';
import Tags from '@/features/home/Tags';
import { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const Home: NextPage = () => {
  const router = useRouter();
  const tagParam: any = router.query.tag

  const [videoData, setVideoData] = useState<string[]>([]);
  const [imageData, setImageData] = useState<string[]>([]);

  const fetchStatelessPostData = async () => {
    const postData = await getStatelessPostData()
    if (postData?.PostsFound) {
      const newVideoData: any = postData?.PostsFound.filter((item: any) => item.VideoURLs)
      const newImageData: any = postData?.PostsFound.filter((item: any) => item.ImageURLs)
      setVideoData(newVideoData)
      setImageData(newImageData)
    }
  }

  const fetchFeedData = async (tag: string) => {
    const data = {
      Tag: `#${tag}`,
    }
    const feedData = await getFeedData(data);
    if (feedData?.HotFeedPage) {
      const newVideoData: any = feedData?.HotFeedPage.filter((item: any) => item.VideoURLs)
      const newImageData: any = feedData?.HotFeedPage.filter((item: any) => item.ImageURLs)
      setVideoData(newVideoData)
      setImageData(newImageData)
    }
  }

  useEffect(() => {
    if(!router.isReady) return
    

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
    <MainLayout title='Moments'>
      <VideoLayoutProvider>
        <div className="flex justify-between items-center">
          <div className="mb-3">
            <Tags tagParam={tagParam} onClick={onClickTag} />
          </div>
          <Layout />
        </div>

        <Reals imageData={imageData} />

        <hr className="my-10" />

        <Videos videoData={videoData} />

      </VideoLayoutProvider>
    </MainLayout>
  )
}

export default Home


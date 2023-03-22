import MainLayout from '@/layouts/MainLayout'
import { VideoLayoutProvider } from '@/contexts/VideosContext';
import Reals from '@/features/home/Reals';
import Videos from '@/features/home/Videos';
import Layout from '@/features/home/Layout';
import { getFeedData } from '@/features/home/API';
import Tags from '@/features/home/Tags';
import { NextPage } from 'next';
import { useEffect, useState } from 'react';

const Home: NextPage = () => {
  const [videoData, setVideoData] = useState<string[]>([]);
  const [imageData, setImageData] = useState<string[]>([]);
  const [tag, seTtag] = useState<string>('technology');

  const fetchFeetData = async () => {
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
    fetchFeetData()
  }, [tag])


  const onClickTag = (value: string) => {
    seTtag(value)
  }

  return (
    <MainLayout title='Moments'>
      <VideoLayoutProvider>
        <div className="flex justify-between items-center">
          <div className="mb-3">
            <Tags onClick={onClickTag} />
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


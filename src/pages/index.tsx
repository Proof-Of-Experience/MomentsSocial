import MainLayout from '@/layouts/MainLayout'
import { VideoLayoutProvider } from '@/contexts/VideosContext';
import Reals from '@/features/home/Reals';
import Videos from '@/features/home/Videos';
import Layout from '@/features/home/Layout';
import { getFeedData } from '@/features/home/API';
import Tags from '@/features/home/Tags';
import { NextPage } from 'next';
import { useEffect } from 'react';

const Home: NextPage = () => {

  const fetchFeetData = async () => {
    const data = {
        Tag: '',
    }
    const feedData = await getFeedData(data);

    console.log('feedData', feedData?.HotFeedPage);

    const newData = feedData?.HotFeedPage.filter((item: any) => item.VideoURLs)
    console.log('newData', newData);
  
  }

  useEffect(() => {
    fetchFeetData()
  }, [])

  return (
    <MainLayout title='Moments'>
      <VideoLayoutProvider>
        <div className="flex justify-between items-center">
          <div className="mb-3">
            <Tags />
          </div>
          <Layout />
        </div>

        <Reals />

        <hr className="my-10" />

        <Videos />

      </VideoLayoutProvider>
    </MainLayout>
  )
}

export default Home


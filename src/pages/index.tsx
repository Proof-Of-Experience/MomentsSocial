import MainLayout from '@/layouts/MainLayout'
import { VideoLayoutProvider } from '@/contexts/VideosContext';
import Reals from '@/features/home/Reals';
import Videos from '@/features/home/Videos';
import Layout from '@/features/home/Layout';
import { getFeedData } from '@/features/home/API';
import Tags from '@/features/home/Tags';
import { NextPage } from 'next';
import { useEffect } from 'react';
import axios from 'axios';

const Home: NextPage = () => {

  const fetchFeetData = async () => {
    const data = {
        Tag: '#game',
    }
    const feedData = await getFeedData(data);

    console.log('feedData', feedData);
  
  }

  useEffect(() => {
    fetchFeetData()
    
    // async function getData() {
    //   const res = await fetch('https://api.bitclout.com/api/v0/get-hot-feed', {
    //     method: 'POST',
    //     body: JSON.stringify(body),
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //   });
    //   const data = await res.json()

    //   console.log('res.json()', data);
    // }

    // getData();

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


import MainLayout from '@/layouts/MainLayout'
import { SessionProvider } from 'next-auth/react'
import { VideoLayoutProvider } from '@/contexts/VideosContext';
import Reals from '@/features/home/Reals';
import Videos from '@/features/home/Videos';
import Layout from '@/features/home/Layout';
import { getFeedData } from '@/features/home/API';
import Tags from '@/features/home/Tags';

 const Home = ({ session }: any) => {

  return (
    <SessionProvider session={session} refetchInterval={60}>
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
    </SessionProvider>
  )
}

export default Home

export const getServerSideProps = async (_context: any) => {
  const feedData = await getFeedData();

  return {
    props: {
      feedData,
    },
  };
};

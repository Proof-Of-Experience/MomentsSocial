import MainLayout from '@/layouts/MainLayout'
import { getSession, SessionProvider } from 'next-auth/react'
import { VideoLayoutProvider } from '@/contexts/VideosContext';
import Reals from '@/features/home/Reals';
import Videos from '@/features/home/Videos';
import Layout from '@/features/home/Layout';

export default function Home({ session }: any) {

  return (
    <SessionProvider session={session} refetchInterval={60}>
      <MainLayout title='Moments'>
        <VideoLayoutProvider>
          <div className="flex justify-between items-center">
            <div>Tags</div>
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

export async function getServerSideProps(context: any) {
  const session = await getSession(context);
  return {
    props: { session: session }
  };
}

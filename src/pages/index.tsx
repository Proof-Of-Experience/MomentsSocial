import MainLayout from '@/layouts/MainLayout'
import { getSession, SessionProvider } from 'next-auth/react'
import { Real } from '@/components/snippets';
import VideoItem from '@/components/snippets/VideoItem';
import { LayoutViewContext, useVideoLayoutContext } from '@/contexts/videosContext';
import { useContext } from 'react';

export default function Home({ session }: any) {

  const mockData = [
    'https://www.w3schools.com/tags/img_girl.jpg',
    'https://www.w3schools.com/tags/img_girl.jpg',
    'https://www.w3schools.com/tags/img_girl.jpg',
    'https://www.w3schools.com/tags/img_girl.jpg',
    'https://www.w3schools.com/tags/img_girl.jpg',
    'https://www.w3schools.com/tags/img_girl.jpg',
    'https://www.w3schools.com/tags/img_girl.jpg',
    'https://www.w3schools.com/tags/img_girl.jpg',
    'https://www.w3schools.com/tags/img_girl.jpg',
    'https://www.w3schools.com/tags/img_girl.jpg',
    'https://www.w3schools.com/tags/img_girl.jpg',
    'https://www.w3schools.com/tags/img_girl.jpg',
  ]

  const test = useVideoLayoutContext();

  console.log('test', test);
  


  return (
    <SessionProvider session={session} refetchInterval={60}>
      <MainLayout title='Moments'>
        <div className='grid lg:grid-cols-8 md:grid-cols-6 gap-4'>
          {
            mockData.slice(0, 8).map((item, index) => {
              return (
                <div key={`real-${index}`} className="overflow-hidden">
                  <Real imgUrl={item} />
                </div>
              )
            })
          }
        </div>

        <div className="mt-8">
          <div className="grid">
            <VideoItem />
          </div>
        </div>
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

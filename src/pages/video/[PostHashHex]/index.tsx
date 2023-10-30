import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import MainLayout from '@/layouts/main-layout';
import { LoadingSpinner } from '@/components/core/loader';


const VideoDetailsPage = () => {
  const router = useRouter()

  const { PostHashHex, Tag }: any = router.query

  const [hasLoaded, setHasLoaded] = useState<boolean>(true)
  const [videoData, setVideoData] = useState<any>([])

  console.log('videoData', videoData);

  useEffect(() => {
    if (!router.isReady) return
    fetchSingleProfile()
  }, [router.isReady])


  const fetchSingleProfile = async () => {
    const { getSinglePost } = await import('deso-protocol')
    const params = {
      PostHashHex,
    }

    const singlePost: any = await getSinglePost(params)
    console.log('singlePost', singlePost);

    setVideoData(singlePost?.PostFound);

    setHasLoaded(false)
  }


  return (
    <MainLayout title='Video Details'>
      <div className="min-h-[calc(100vh_-_72px)] grid grid-cols-3 p-5 gap-5 bg-[#ddd]">
        {
          hasLoaded ? <LoadingSpinner isLoading={hasLoaded} /> :
            <div className="col-span-2">
              <div
                className=''>
                <h1 className="text-4xl font-bold mb-4">{videoData?.ProfileEntryResponse?.Username}</h1>
                <iframe
                  width="100%"
                  height="500"
                  src={videoData.VideoURLs[0] ?? 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'}
                  allowFullScreen>
                </iframe>

                {/* <video width="320" height="240" controls>
                <source src={videoData.VideoURLs[0]} type="video/mp4" />
                Your browser does not support the video tag.
              </video> */}
                <p className="mt-4 max-h-[74px] overflow-y-auto">{videoData.Body}</p>
              </div>
            </div>
        }
      </div>
    </MainLayout>
  );
};

export default VideoDetailsPage;
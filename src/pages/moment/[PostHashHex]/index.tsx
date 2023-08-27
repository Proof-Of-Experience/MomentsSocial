import { useState, useEffect, WheelEvent } from 'react';
import { useRouter } from 'next/router';
import MainLayout from '@/layouts/main-layout';
import { LoadingSpinner } from '@/components/core/loader';

const MomentDetailsPage = () => {
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const router = useRouter()
  const { PostHashHex }: any = router.query

  const [hasLoaded, setHasLoaded] = useState<boolean>(true)
  const [videoData, setVideoData] = useState<any>([])
  console.log('videoData', videoData);

  useEffect(() => {
    if (!router.isReady) return
    fetchSingleProfile()
    fetchStatelessPostData()
  }, [router.isReady])


  useEffect(() => {
    const handleRouteChange = (url: string) => {
      const videoIndex = videoData.findIndex((video: any) => video.PostHashHex === PostHashHex);
      if (videoIndex !== -1) {
        setActiveVideoIndex(videoIndex);
      }
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, []);

  const fetchSingleProfile = async () => {
    const { getSinglePost } = await import('deso-protocol')
    const params = {
      PostHashHex,
    }

    const singlePost: any = await getSinglePost(params)
    setVideoData([singlePost?.PostFound])
    setHasLoaded(false)
  }

  const fetchStatelessPostData = async () => {
    const { getPostsStateless } = await import('deso-protocol')
    const formData = {
      NumToFetch: 100,
      OrderBy: 'VideoURLs',
    }
    const postData = await getPostsStateless(formData)

    if (postData?.PostsFound) {
      const newVideoData: any = postData?.PostsFound.filter((item: any) => item.VideoURLs)
      setVideoData((prevVideoData: any) => [...prevVideoData, ...newVideoData]);
    }
  }

  const handleMouseWheel = (event: WheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    const delta = event.deltaY > 0 ? 1 : -1;
    const newIndex = (activeVideoIndex + delta + videoData.length) % videoData.length;
    setActiveVideoIndex(newIndex);
    const videoId = videoData?.length > 0 && videoData[newIndex].PostHashHex;

    router.push(`/moment/${videoId}`, undefined, { shallow: true });
  };


  return (
    <MainLayout>
      <div className="h-[calc(100vh_-_80px)] flex flex-col items-center justify-center" onWheel={handleMouseWheel}>
        {
          hasLoaded ? <LoadingSpinner isLoading={hasLoaded} /> :
            videoData.length > 0 && videoData.map((video: any, index: number) => (
              <div key={video.PostHashHex} className={`${activeVideoIndex !== index ? 'hidden' : ''}`}>
                <h1 className="text-4xl font-bold">{video?.ProfileEntryResponse?.Username}</h1>
                <iframe
                  className="mt-4"
                  width="560"
                  height="315"
                  src={video.VideoURLs[0] ?? 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'}
                  allowFullScreen>
                </iframe>
                <p className="mt-4">{video.Body}</p>
              </div>
            ))
        }
      </div>
    </MainLayout>
  );
};

export default MomentDetailsPage;
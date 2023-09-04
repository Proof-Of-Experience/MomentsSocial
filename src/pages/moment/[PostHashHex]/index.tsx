import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import MainLayout from '@/layouts/main-layout';
import { LoadingSpinner } from '@/components/core/loader';
import { mergeVideoData } from '@/utils';

const MomentDetailsPage = () => {
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const router = useRouter()

  const { PostHashHex, Tag }: any = router.query

  const [hasLoaded, setHasLoaded] = useState<boolean>(true)
  const [videoData, setVideoData] = useState<any>([])
  const wheelDivRef = useRef<HTMLDivElement>(null);

  console.log('videoData', videoData);

  useEffect(() => {
    if (!router.isReady) return
    fetchSingleProfile()
    if (Tag) {
      fetchFeedData()
    } else {
      fetchStatelessPostData()
    }
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

  useEffect(() => {
    const wheelDiv = wheelDivRef.current;

    const handleWheel = (event: globalThis.WheelEvent) => {
      if (videoData.length <= 1) {
        return;
      }

      event.preventDefault();

      const delta = event.deltaY > 0 ? 1 : -1;
      const newIndex = (activeVideoIndex + delta + videoData.length) % videoData.length;
      setActiveVideoIndex(newIndex);
      const videoId = videoData?.length > 0 && videoData[newIndex].PostHashHex;
      router.push(`/moment/${videoId}${Tag ? `?Tag=${Tag}` : ''}`, undefined, { shallow: true });
    };

    if (wheelDiv) {
      // Adding the event listener with the passive option set to false
      wheelDiv.addEventListener('wheel', handleWheel, { passive: false });
    }

    return () => {
      // Cleanup - remove the event listener
      if (wheelDiv) {
        wheelDiv.removeEventListener('wheel', handleWheel);
      }
    };
  }, [videoData, activeVideoIndex]);


  const fetchSingleProfile = async () => {
    const { getSinglePost } = await import('deso-protocol')
    const params = {
      PostHashHex,
    }

    const singlePost: any = await getSinglePost(params)
    setVideoData((prevVideoData: any) => mergeVideoData(prevVideoData, [singlePost?.PostFound]));

    setHasLoaded(false)
  }

  const fetchStatelessPostData = async () => {
    const { getPostsStateless } = await import('deso-protocol')
    const formData = {
      NumToFetch: 100,
      OrderBy: 'VideoURLs',
    }
    const postData = await getPostsStateless(formData)

    if (postData?.PostsFound && postData?.PostsFound.length > 0) {
      const filteredData: any = postData?.PostsFound.filter((item: any) =>
        item.VideoURLs && item.VideoURLs.some((videoURL: any) => videoURL)
      );
      setVideoData((prevVideoData: any) => mergeVideoData(prevVideoData, filteredData));
    }
  }

  const fetchFeedData = async () => {
    const { getHotFeed } = await import('deso-protocol')

    const data = {
      Tag: `#${Tag}`,
    }
    const feedData = await getHotFeed(data);

    if (feedData?.HotFeedPage && feedData?.HotFeedPage.length > 0) {
      const filteredData: any = feedData?.HotFeedPage.filter((item: any) =>
        item.VideoURLs && item.VideoURLs.some((videoURL: any) => videoURL)
      );
      setVideoData((prevVideoData: any) => mergeVideoData(prevVideoData, filteredData));
    }
  }


  return (
    <MainLayout>
      <div className="h-[calc(100vh_-_80px)] flex flex-col items-center justify-center" ref={wheelDivRef}>
        {
          hasLoaded ? <LoadingSpinner isLoading={hasLoaded} /> :
            videoData.length > 0 && videoData.map((video: any, index: number) => (
              <div key={index} className={`${activeVideoIndex !== index ? 'hidden' : ''}`}>
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
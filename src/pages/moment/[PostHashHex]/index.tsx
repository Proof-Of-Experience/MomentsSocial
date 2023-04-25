import { useState, useEffect, WheelEvent } from 'react';
import { useRouter } from 'next/router';
import MainLayout from '@/layouts/main-layout';

const videos = [
  {
    id: 1,
    title: "Video 1",
    description: "This is the first video.",
    videoUrl: "https://www.youtube.com/embed/abcdefghijk",
  },
  {
    id: 2,
    title: "Video 2",
    description: "This is the second video.",
    videoUrl: "https://www.youtube.com/embed/qrstuvwxyz",
  },
  {
    id: 3,
    title: "Video 3",
    description: "This is the third video.",
    videoUrl: "https://www.youtube.com/embed/1234567890",
  },
];

const VideoDetailsPage = () => {
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const router = useRouter()
  // const { PostHashHex }: any = router.query
  // const [dataLoaded, setDataLoaded] = useState<boolean>(true)
  // // const [videos, setVideos] = useState<object[]>([])
  // console.log('videos', videos);
  
  // const { id } = router.query;

  // const fetchSingleProfile = async () => {
  //   const { getSinglePost } = await import('deso-protocol')
  //   const params = {
  //     PostHashHex,
  //   }

  //   const singlePost: any = await getSinglePost(params)
  //   console.log('singlePost', singlePost);
  //   // setVideos([singlePost?.PostFound?.VideoURLs ?? 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'])

  //   setDataLoaded(false)
  // }


  // useEffect(() => {
  //   if (!router.isReady) return

  //   fetchSingleProfile()
  // }, [router.isReady])

  const handleMouseWheel = (event: WheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    const delta = event.deltaY > 0 ? 1 : -1;
    const newIndex = (activeVideoIndex + delta + videos.length) % videos.length;
    setActiveVideoIndex(newIndex);
    const videoId = videos[newIndex].id;
    router.push(`/moment/${videoId}`, undefined, { shallow: true });
  };


  useEffect(() => {
    const handleRouteChange = (url: string) => {
      const videoId = parseInt(url.split('/').pop() as string);
      const videoIndex = videos.findIndex(video => video.id === videoId);
      if (videoIndex !== -1) {
        setActiveVideoIndex(videoIndex);
      }
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, []);

  const activeVideo = videos[activeVideoIndex];

  return (
    <MainLayout>
      <div className="h-[calc(100vh_-_80px)] flex flex-col items-center justify-center" onWheel={handleMouseWheel}>
        <h1 className="text-4xl font-bold">{activeVideo.title}</h1>
        <iframe className="mt-4" width="560" height="315" src={activeVideo.videoUrl} allowFullScreen></iframe>
        <p className="mt-4">{activeVideo.description}</p>
      </div>
    </MainLayout>
  );
};

export default VideoDetailsPage;
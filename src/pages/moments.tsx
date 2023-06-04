import MainLayout from '@/layouts/main-layout'
import { getFeedData } from '@/pages/api/feed';
import Tags from '@/features/home/tags';
import { NextPage } from 'next';
import { Fragment, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Videos from '@/components/snippets/videos';


const Moments: NextPage = () => {
  const router = useRouter()
  const tagParam: any = router.query.tag

  const [dataLoaded, setDataLoaded] = useState<boolean>(true)
  const [videoData, setVideoData] = useState<string[]>([])


  useEffect(() => {
    if (!router.isReady) return

    if (tagParam) {
      fetchFeedData(tagParam)
    } else {
      fetchStatelessPostData()
    }
  }, [router.isReady])

  const fetchStatelessPostData = async () => {
    setDataLoaded(true)

    try {
      const { getPostsStateless } = await import('deso-protocol')
      const params = {
        NumToFetch: 100,
        OrderBy: 'VideoURLs',
      }
      const postData = await getPostsStateless(params)

      setDataLoaded(false)

      if (postData?.PostsFound) {
        const newVideoData: any = postData?.PostsFound.filter((item: any) => item.VideoURLs)
        setVideoData(newVideoData)
      }
    } catch (error) {
      setDataLoaded(false)
      console.error('statelesspost error', error);
    }
  }

  const fetchFeedData = async (tag: string) => {
    setDataLoaded(true)

    try {
      const data = {
        Tag: `#${tag}`,
      }
      const feedData = await getFeedData(data);
      setDataLoaded(false)

      if (feedData?.HotFeedPage) {
        const newVideoData: any = feedData?.PostsFound.filter((item: any) => item.VideoURLs)
        setVideoData(newVideoData)
      }
    } catch (error) {
      setDataLoaded(false)
      console.error('feed post error', error);
    }
  }

  const onClickTag = (value: string) => {
    if (value === 'all') {
      router.replace('/moments', undefined, { shallow: true });
      fetchStatelessPostData()

    } else {
      router.replace({
        query: { ...router.query, tag: value },
      })
      fetchFeedData(value)
    }
  }

  return (
    <MainLayout title='Moments' isLoading={dataLoaded}>
      <Fragment>
        <div className={`flex justify-between items-center mb-4`}>
          <Tags tagParam={tagParam} onClick={onClickTag} />
        </div>

        <div className="">

          <Videos
            iframeParams='?controls=0'
            videoData={videoData}
            // onClick={() => router.push(`moment/${item?.PostHashHex}`)}
          />

        </div>
      </Fragment>

    </MainLayout >
  )
}

export default Moments


import MainLayout from '@/layouts/main-layout'
import Layout from '@/features/home/layout';
import { getFeedData } from '@/pages/api/feed';
import { getStatelessPostData } from '@/pages/api/post';
import Tags from '@/features/home/tags';
import { NextPage } from 'next';
import { Fragment, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Moment from '@/components/snippets/moment';



const Home: NextPage = () => {
  const router = useRouter();
  const tagParam: any = router.query.tag

  const [dataLoaded, setDataLoaded] = useState<boolean>(true);
  const [imageData, setImageData] = useState<string[]>([]);

  const fetchStatelessPostData = async () => {
    setDataLoaded(true)
    const formData = {
      NumToFetch: 50,
      OrderBy: 'VideoURLs',
    }
    const postData = await getStatelessPostData(formData)
    setDataLoaded(false)

    if (postData?.PostsFound) {
      const newImageData: any = postData?.PostsFound.filter((item: any) => item.ImageURLs)
      setImageData(newImageData)
    }
  }

  const fetchFeedData = async (tag: string) => {
    setDataLoaded(true)

    const data = {
      Tag: `#${tag}`,
    }
    const feedData = await getFeedData(data);
    setDataLoaded(false)

    if (feedData?.HotFeedPage) {
      const newImageData: any = feedData?.HotFeedPage.filter((item: any) => item.ImageURLs)
      setImageData(newImageData)
    }
  }

  useEffect(() => {
    if (!router.isReady) return


    if (tagParam) {
      fetchFeedData(tagParam)
    } else {
      fetchStatelessPostData()
    }
  }, [router.isReady])

  const onClickTag = (value: string) => {
    if (value === 'all') {
      router.replace('/', undefined, { shallow: true });
      fetchStatelessPostData()

    } else {
      router.replace({
        query: { ...router.query, tag: value },
      })
      fetchFeedData(value)
    }
  }

  const onClickMoment = (item: any) => {
    console.log('item', item);

  }

  return (
    <MainLayout title='Moments' isLoading={dataLoaded}>
      <Fragment>
        <div className={`flex justify-between items-center mb-4`}>
          <Tags tagParam={tagParam} onClick={onClickTag} />
        </div>

        <div className="grid grid-flow-row lg:grid-cols-6 md:grid-cols-6 gap-4">
          {
            imageData.map((item: any, index: any) => {
              return (
                <Moment
                  key={`moment-${index}`}
                  item={item}
                  onClick={() => onClickMoment(item)}
                />
              )
            })
          }
        </div>
      </Fragment>

    </MainLayout >
  )
}

export default Home


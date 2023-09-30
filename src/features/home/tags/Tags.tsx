import React, { useEffect, useState } from 'react';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { ApiDataType, apiService } from '@/utils/request';
import { useRouter } from 'next/router';
import { capitalizeFirstLetter } from '@/utils';
import TagSkeleton from '@/components/skeletons/tag';

interface TagsProps {
  onClick: (value: string) => void;
  tagParam: string;
  tagSearch?: string;
  onChangeTagSearch?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onPressTagSearch?: () => void;
}

const Tags: React.FC<TagsProps> = ({ onClick, tagParam, tagSearch, onChangeTagSearch, onPressTagSearch }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [tags, setTags] = useState<any>([]);

  const fetchTags = async (page: number = 1) => {
    const apiData: ApiDataType = {
      method: 'get',
      url: `/api/hashtags`,
      customUrl: process.env.NEXT_PUBLIC_MOMENTS_UTIL_URL,
    };

    try {
      await apiService(apiData, (res: any, err: any) => {
        if (err) return err.response

        if (res?.length > 0) {
          setTags(res);
        }
      });
    } catch (error: any) {
      console.error('error', error.response);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (!router.isReady) return;

    fetchTags();
  }, [router.isReady]);


  return (
    <div className="flex items-center max-w-[94%] overflow-hidden">

      <div className='flex justify-between items-center border rounded-md px-3 max-w-[280px] mr-3'>
        <span className='mr-1'>#</span>
        <input
          type='text'
          placeholder='Search Hashtags'
          className='w-[150px] h-[32px] text-md focus:outline-none'
          value={tagSearch}
          onChange={onChangeTagSearch}
        />
        {
          tagSearch &&
          <ArrowRightIcon
            className="ml-2 w-4 h-4 text-blue-500 cursor-pointer"
            role='button'
            onClick={onPressTagSearch}
          />
        }
      </div>

      {
        isLoading ?
          <TagSkeleton />
          :
          <>
            <button
              className={`${!tagParam ? 'bg-gray-600 text-white' : 'bg-gray-200 text-black'} py-1 px-5 rounded-md mr-4 focus:bg-gray-600 focus:text-white mb-3 xl:mb-0`}
              title="All"
              disabled={!tagParam}
              onClick={() => onClick('all')}>
              All
            </button>

            {
              tags.map((item: any, index: number) => {
                const tagName = item.hashtag.substring(1);

                return (
                  <button
                    key={`tag-${index}`}
                    className={`${tagParam == tagName ? 'bg-gray-600 text-white' : 'bg-gray-200 text-black'} py-1 px-5 rounded-md mr-4 focus:bg-gray-600 focus:text-white mb-3 xl:mb-0`}
                    title={tagName}
                    onClick={() => onClick(item.hashtag)}>
                    {capitalizeFirstLetter(tagName)}
                  </button>
                )
              })
            }
          </>
      }

    </div>
  )
}

export default Tags


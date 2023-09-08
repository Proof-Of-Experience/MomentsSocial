import React from 'react';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { tags } from './mockData';

interface TagsProps {
  onClick: (value: string) => void;
  tagParam: string;
  tagSearch?: string;
  onChangeTagSearch?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onPressTagSearch?: () => void;
}

const Tags: React.FC<TagsProps> = ({ onClick, tagParam, tagSearch, onChangeTagSearch, onPressTagSearch }) => {

  return (
    <div className="flex items-center">
      {
        tags.map((item: any, index: number) => {
          return (
            <button
              key={`tag-${index}`}
              className={`${tagParam == item.value ? 'bg-gray-600 text-white' : 'bg-gray-200 text-black'} py-1 px-5 rounded-md mr-4 focus:bg-gray-600 focus:text-white mb-3 xl:mb-0`}
              title={item.name}
              onClick={() => onClick(item.value.toLowerCase())}>
              {item.name}
            </button>
          )
        })
      }

      <div className='flex justify-between items-center border rounded-md px-3 max-w-[280px]'>
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
    </div>
  )
}

export default Tags


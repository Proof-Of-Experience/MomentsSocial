import React, { useEffect, memo, useState, useCallback, Fragment } from 'react'
import { MomentProps } from '@/model/moment'
import { ApiDataType, apiService } from '@/utils/request';
import MomentSkeleton from '@/components/skeletons/moment';
import EmojiReaction from '../emoji-reaction';


const Moment = memo(({ className, onClick, item, isLoading }: MomentProps) => {


  return (
    isLoading ? (
      <MomentSkeleton />
    ) :
      (
        <div className={`block border rounded-xl cursor-pointer h-[368px] mb-4 ${className ? className : ''}`}>
          <Fragment>
            <div className="flex flex-wrap">
              <img
                src={`${process.env.NEXT_PUBLIC_MOMENTS_UTIL_URL}${item?.screenshot}`}
                alt={item?.Username}
                className="border rounded-xl w-full h-[280px] object-cover"
                onClick={onClick}
              />
            </div>

            <div className="px-2 pb-3 mt-2">
              <p className="font-bold text-sm line-clamp-2 text-left min-h-[40px]">{item?.Body}</p>
              <p className="text-sm mt-2">
                <button className="flex items-center text-lg font-bold text-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z" />
                  </svg>
                  <span className="ml-1">{item?.LikeCount}</span>
                </button>
              </p>

              {/* <EmojiReaction
                onReactionClick={onReactionClick}
                postHashHex={item?.PostHashHex}
              /> */}
            </div>
          </Fragment>
        </div>
      )
  )
})

export default Moment

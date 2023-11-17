import React, { memo, Fragment } from 'react'
import { MomentProps } from '@/model/moment'
import MomentSkeleton from '@/components/skeletons/moment';
import EmojiReaction from '../emoji-reaction';


const Moment = memo(({ className, onClick, item, isLoading }: MomentProps) => {


  return (
    isLoading ? (
      <MomentSkeleton />
    ) :
      (
        <div className={`block cursor-pointer h-[448px] mb-[48px] ${className ? className : ''}`}>
          <Fragment>
            <div className="flex flex-wrap">
              <img
                src={`${process.env.NEXT_PUBLIC_MOMENTS_UTIL_URL}${item?.screenshot}`}
                alt={item?.Username}
                className="w-full h-[370px] relative rounded-lg overflow-hidden bg-gradient-to-br from-lightgray via-transparent to-#7E7E7E"
                onClick={onClick}
              />
            </div>

            <div className="pb-3 mt-2">
              <p className="text-[#1C1B1F] dark:text-white leading-6 font-inter font-medium text-lg line-clamp-2">{item?.Body}</p>
              <div className="mt-[16px] flex flex-row justify-between">
                <p className="text-[#7E7E7E] leading-trim text-capitalize font-inter text-base font-normal leading-normal">12M views</p>
                <p className="text-[#7E7E7E] leading-trim text-capitalize font-inter text-base font-normal leading-normal">12K reaction</p>
              </div>

              <div className='flex justify-between'>
                {/* <p>{item?.GiftCount}</p> */}
                {/* <EmojiReaction
                  onReactionClick={() => { }}
                  postHashHex={item?.PostHashHex}
                /> */}
              </div>
            </div>
          </Fragment>
        </div>
      )
  )
})

export default Moment

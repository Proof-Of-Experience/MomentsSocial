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

              <EmojiReaction
                onReactionClick={() => {}}
                postHashHex={item?.PostHashHex}
              />
            </div>
          </Fragment>
        </div>
      )
  )
})

export default Moment

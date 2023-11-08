import React, { memo } from 'react'

const Comment = memo(({ comment }: any) => {
  return (
    <div className="flex flex-col text-lg text-gray-700">
        <div className='profile-picture flex justify-start w-full'>
            <div className='w-2/6'>
                <img className='w-12 h-12 rounded-md' src={comment?.ProfileEntryResponse?.ExtraData?.FeaturedImageURL} alt={comment?.ProfileEntryResponse?.username} />
            </div>
            <div className='w-4/6 font-medium'>
                {comment?.ProfileEntryResponse?.username}
            </div>
        </div>
        <div>
            {comment.Body}
        </div>
    </div>
  )
})

export default Comment

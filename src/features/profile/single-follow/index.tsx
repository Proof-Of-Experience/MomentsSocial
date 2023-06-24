import React from 'react'
import { CheckBadgeIcon } from '@heroicons/react/20/solid'


const SingleFollow = ({ followData }: any) => {

    return (
        <div className="mb-3 border-b pb-3">
            <div className="flex items-center">
                <img
                    src={`${process.env.NEXT_PUBLIC_BASE_URL}/api/v0/get-single-profile-picture/${followData.PublicKeyBase58Check}?fallback=https://diamondapp.com/assets/img/default-profile-pic.png`}
                    alt="avatar"
                    className="rounded-full h-10 w-10 mr-2" />
                <div className="overflow-hidden">
                    <span className="flex w-[150px] truncate font-bold">
                        {followData?.Username ? followData?.Username : followData.PublicKeyBase58Check}
                        {followData?.IsVerified && <CheckBadgeIcon className="ml-1 w-5 h-5 text-blue-500" />}
                    </span>
                    <p className="text-sm truncate">{followData?.Description ? followData.Description : ''}</p>
                </div>
            </div>
        </div>
    )
}

export default SingleFollow
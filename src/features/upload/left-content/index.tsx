import { CheckBadgeIcon, LockClosedIcon, UserCircleIcon } from '@heroicons/react/20/solid'
import React from 'react'

const LeftContent = () => {
    return (
        <div className="col-start-2 col-span-1">
            <div className="border px-4 py-5 rounded-lg mb-2 flex">
                <div className="mr-3">
                    <CheckBadgeIcon
                        color="#5798fb"
                        className="h-9 w-9 p-1 border rounded-full bg-white cursor-pointer z-10"
                    />
                </div>
                <div>
                    <h5 className="mb-1 font-semibold text-lg">Quality</h5>
                    <p>Your videos will look their best on every device, anywhere.</p>
                </div>
            </div>

            <div className="border px-4 py-5 rounded-lg mb-2 flex">
                <div className="mr-3">
                    <UserCircleIcon
                        color="#5798fb"
                        className="h-9 w-9 p-1 border rounded-full bg-white cursor-pointer z-10"
                    />
                </div>
                <div>
                    <h5 className="mb-1 font-semibold text-lg">Community</h5>
                    <p>Join one of the world’s best community of talented, supportive creators.</p>
                </div>
            </div>

            <div className="border px-4 py-5 rounded-lg mb-2 flex">
                <div className="mr-3">
                    <LockClosedIcon
                        color="#5798fb"
                        className="h-9 w-9 p-1 border rounded-full bg-white cursor-pointer z-10"
                    />
                </div>
                <div>
                    <h5 className="mb-1 font-semibold text-lg">Security</h5>
                    <p>Your data will be secured. No one can take access of your data.</p>
                </div>
            </div>
        </div>
    )
}

export default LeftContent
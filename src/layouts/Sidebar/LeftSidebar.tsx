import { HomeIcon, BoltIcon, FireIcon, ArrowPathRoundedSquareIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline'
import React from 'react'

const LeftSidebar = () => {
  return (
    <div className="flex flex-col items-center pt-5 bg-gray-200 h-full">
      <button
        className="mb-3 hover:bg-gray-300 transition-all rounded-md px-2 py-1 text-gray-600 focus:bg-gray-300"
        title="Home">
        <HomeIcon className="mx-auto h-7 w-7" />
      </button>
      <button
        className="mb-3 hover:bg-gray-300 transition-all rounded-md px-2 py-1 text-gray-600 focus:bg-gray-300"
        title="Moments">
        <BoltIcon className="mx-auto h-7 w-7" />
      </button>
      <button
        className="mb-3 hover:bg-gray-300 transition-all rounded-md px-2 py-1 text-gray-600 focus:bg-gray-300"
        title="Explore">
        <ArrowPathRoundedSquareIcon className="mx-auto h-7 w-7" />
      </button>
      <button
        className="mb-3 hover:bg-gray-300 transition-all rounded-md px-2 py-1 text-gray-600 focus:bg-gray-300"
        title="Trending">
        <FireIcon className="mx-auto h-7 w-7" />
      </button>
      <button
        className="mb-3 hover:bg-gray-300 transition-all rounded-md px-2 py-1 text-gray-600 focus:bg-gray-300"
        title="Upload">
        <ArrowUpTrayIcon className="mx-auto h-7 w-7" />
      </button>
    </div>
  )
}

export default LeftSidebar
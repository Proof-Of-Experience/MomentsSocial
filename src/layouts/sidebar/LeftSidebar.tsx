import React from 'react'
import { HomeIcon, BoltIcon, FireIcon, ArrowPathRoundedSquareIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/router'

const LeftSidebar = () => {
  const router = useRouter();

  const onClickItem = (url: string) => {
    router.push(url)
  }

  return (
    <div className="w-[80px] flex flex-col items-center pt-5 bg-gray-200 h-full">
      <button
        className="mb-3 hover:bg-gray-300 transition-all rounded-md px-2 py-1 text-gray-600 focus:bg-gray-300"
        title="Home"
        onClick={() => onClickItem('/')}>
        <HomeIcon className="mx-auto h-7 w-7" />
      </button>

      <button
        className="mb-3 hover:bg-gray-300 transition-all rounded-md px-2 py-1 text-gray-600 focus:bg-gray-300"
        title="Moments"
        onClick={() => onClickItem('/moments')}>
        <BoltIcon className="mx-auto h-7 w-7" />
      </button>

      <button
        className="mb-3 hover:bg-gray-300 transition-all rounded-md px-2 py-1 text-gray-600 focus:bg-gray-300"
        title="Explore"
        onClick={() => onClickItem('/')}>
        <ArrowPathRoundedSquareIcon className="mx-auto h-7 w-7" />
      </button>

      <button
        className="mb-3 hover:bg-gray-300 transition-all rounded-md px-2 py-1 text-gray-600 focus:bg-gray-300"
        title="Trending"
        onClick={() => onClickItem('/')}>
        <FireIcon className="mx-auto h-7 w-7" />
      </button>

      <button
        className="mb-3 hover:bg-gray-300 transition-all rounded-md px-2 py-1 text-gray-600 focus:bg-gray-300"
        title="Upload"
        onClick={() => onClickItem('/upload')}>
        <ArrowUpTrayIcon className="mx-auto h-7 w-7" />
      </button>
    </div>
  )
}

export default LeftSidebar
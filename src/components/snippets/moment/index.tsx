import React, { useEffect, memo, useState, useCallback } from 'react'
import { MomentProps } from '@/model/moment'
import { ApiDataType, apiService } from '@/utils/request';

const Moment = memo(({ className, onClick, item }: MomentProps) => {

  const [thumbnails, setThumbnails] = useState<any>({});

  console.log('thumbnails', thumbnails);

  const makeThumbnail = useCallback(async (itemId: string) => {
    // const videoId = new URL(item.VideoURLs[0]).searchParams.get('v'); // Extract videoId from URL
    let videoId: any;

    try {
      videoId = new URL(item.VideoURLs[0])?.searchParams.get('v'); // Extract videoId from URL
    } catch (err) {
      console.error('Invalid URL:', item.VideoURLs[0]);
      return; // Exit the function if the URL is invalid
    }

    if (!videoId) {
      console.error('URL does not have a "v" parameter:', item.VideoURLs[0]);
      return; // Exit the function if the URL does not have a "v" parameter
    }
    const body = {
      url: item.VideoURLs[0],
    };
    const apiData: ApiDataType = {
      customUrl: 'http://localhost:3001',
      method: 'post',
      url: `/api/video-info`,
      data: body,
    };

    await apiService(apiData, (res: any, err: any) => {
      if (err) console.error('err', err.response);
      if (res) {
        if (res.status === 409) {
          // if error 409, make a GET request to retrieve the thumbnail
          const getApiData: ApiDataType = {
            customUrl: 'http://localhost:3001',
            method: 'get',
            url: `/api/video-info/${videoId}`, // Use extracted videoId here
          };

          apiService(getApiData, (res: any, err: any) => {
            if (res) {
              const base64Image = res.videoInfo.screenshot;
              
              setThumbnails((prevThumbnails: any) => ({
                ...prevThumbnails,
                [itemId]: base64Image,  // change this line
              }));
            }
            if (err) console.error('GET error', err);
          });
          return; // Make sure to return here to prevent further execution in this callback
        }

        const base64Image = res.videoInfo.screenshot;

        // set thumbnail for specific item
        setThumbnails((prevThumbnails: any) => ({
          ...prevThumbnails,
          [itemId]: base64Image,
        }));
      }
    });
  }, [item, setThumbnails, apiService]); // dependencies


  useEffect(() => {
    makeThumbnail(item.PostHashHex)  // make sure to pass unique id for each item
  }, [item])

  return (
    <div className={`block border rounded-xl cursor-pointer h-[368px] mb-4 ${className ? className : ''}`} onClick={onClick}>
      <div className="flex flex-wrap">
        <img src={`http://localhost:3001${thumbnails[item.PostHashHex]}`} alt="Video thumbnail" className="border rounded-xl w-full h-[280px] object-cover" />

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
      </div>
    </div>
  )
})

export default Moment

// import React, { useEffect, useMemo, useRef, useState } from 'react';
// import { ArrowRightIcon } from '@heroicons/react/24/outline';
// import { ApiDataType, apiService } from '@/utils/request';
// import { useRouter } from 'next/router';
// import { capitalizeFirstLetter } from '@/utils';
// import TagSkeleton from '@/components/skeletons/tag';
// import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
// import Slider from "react-slick";



// interface TagsProps {
//   onClick: (value: string) => void;
//   tagParam: string;
//   tagSearch?: string;
//   onChangeTagSearch?: (event: React.ChangeEvent<HTMLInputElement>) => void;
//   onPressTagSearch?: () => void;
// }

// const Tags: React.FC<TagsProps> = ({ onClick, tagParam, tagSearch, onChangeTagSearch, onPressTagSearch }) => {
//   const router = useRouter();
//   const [isLoading, setIsLoading] = useState<boolean>(true);
//   const [tags, setTags] = useState<any>([]);

//   const slider: any = useRef(null);

//   const dynamicSlidesToShow = useMemo(() => {
//     if (tags.length > 5) {
//       return 6;
//     } else if (tags.length > 4) {
//       return 3;
//     } else if (tags.length < 1) {
//       return 1;
//     } else {
//       return tags.length;
//     }
//   }, [tags]);


//   const fetchTags = async (page: number = 1) => {
//     const apiData: ApiDataType = {
//       method: 'get',
//       url: `/api/hashtags`,
//       customUrl: process.env.NEXT_PUBLIC_MOMENTS_UTIL_URL,
//     };

//     try {
//       await apiService(apiData, (res: any, err: any) => {
//         if (err) return err.response

//         if (res?.length > 0) {
//           setTags(res);
//         }
//       });
//     } catch (error: any) {
//       console.error('error', error.response);
//     } finally {
//       setIsLoading(false);
//     }
//   }

//   useEffect(() => {
//     if (!router.isReady) return;

//     fetchTags();
//   }, [router.isReady]);


//   // return (
//   //   <div className="flex items-center max-w-[94%] overflow-x-scroll scrollbar-hidden">

//   //     <div className='flex justify-between items-center border rounded-md px-3 max-w-[280px] mr-3'>
//   //       {/* <span className='mr-1'>#</span>
//   //       <input
//   //         type='text'
//   //         placeholder='Search Hashtags'
//   //         className='w-[150px] h-[32px] text-md focus:outline-none'
//   //         value={tagSearch}
//   //         onChange={onChangeTagSearch}
//   //       /> */}
//   //       {
//   //         tagSearch &&
//   //         <ArrowRightIcon
//   //           className="ml-2 w-4 h-4 text-blue-500 cursor-pointer"
//   //           role='button'
//   //           onClick={onPressTagSearch}
//   //         />
//   //       }
//   //     </div>


//   //   </div>
//   // )


//   const momentSliderSettings = {
//     dots: false,
//     infinite: true,
//     loop: false,
//     arrows: false,
//     speed: 500,
//     slidesToShow: dynamicSlidesToShow,
//     slidesToScroll: 3,
//     responsive: [
//       {
//         breakpoint: 1200,
//         settings: {
//           slidesToShow: 5,
//           slidesToScroll: 3,
//         }
//       },
//       {
//         breakpoint: 991,
//         settings: {
//           slidesToShow: 3,
//           slidesToScroll: 2,
//         }
//       },
//       {
//         breakpoint: 700,
//         settings: {
//           slidesToShow: 2,
//           slidesToScroll: 1
//         }
//       },
//       {
//         breakpoint: 575,
//         settings: {
//           slidesToShow: 1,
//         }
//       }
//     ]
//   };

//   return (
//     <>
//       <div className="flex flex-row justify-between gap-4 mr-10 mb-[16px] mt-[24px]">
//         <h2 className='flex flex-row items-center'>
//           <img
//             className="mr-2"
//             src="/moments.svg"
//             alt="No data"
//           />
//           <span className="text-[#1C1B1F] leading-trim capitalize font-inter text-lg font-semibold">Shorts</span>
//         </h2>

//         {
//           tags.length > 4 && (
//             <div className="flex flex-row items-center">
//               <button
//                 className="mr-4 rounded-[28px] border border-solid border-gray-300 bg-white flex p-2 items-center gap-2"
//                 onClick={() => slider?.current?.slickPrev()}>
//                 <ChevronLeftIcon className="h-5 w-5" />
//               </button>
//               <button className="rounded-[28px] border border-solid border-gray-300 bg-white flex p-2 items-center gap-2"
//                >
//                 <ChevronRightIcon className="h-5 w-5" />
//               </button>
//             </div>
//           )
//         }
//       </div>

//       <Slider ref={slider}  {...momentSliderSettings}>
//         {
//           isLoading ?
//             <TagSkeleton />
//             :
//             <>
//               <button
//                 className={`${!tagParam ? 'bg-gray-600 text-white' : 'bg-gray-200 text-black'} py-1 px-5 rounded-md mr-4 focus:bg-gray-600 focus:text-white`}
//                 title="All"
//                 disabled={!tagParam}
//                 onClick={() => onClick('all')}>
//                 All
//               </button>

//               {
//                 tags.map((item: any, index: number) => {
//                   const tagName = item.hashtag.substring(1);

//                   return (
//                     <button
//                       key={`tag-${index}`}
//                       className={`${tagParam == tagName ? 'bg-gray-600 text-white' : 'bg-gray-200 text-black'} py-1 px-5 rounded-md mr-4 focus:bg-gray-600 focus:text-white`}
//                       title={tagName}
//                       onClick={() => onClick(item.hashtag)}>
//                       {capitalizeFirstLetter(tagName)}
//                     </button>
//                   )
//                 })
//               }

//             </>
//         }
//       </Slider>

//     </>
//   );
// }

// export default Tags

import React, { useEffect, useState } from 'react';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { ApiDataType, apiService } from '@/utils/request';
import { useRouter } from 'next/router';
import { capitalizeFirstLetter } from '@/utils';
import TagSkeleton from '@/components/skeletons/tag';

interface TagsProps {
  onClick: (value: string) => void;
  tagParam: string;
  tagSearch?: string;
  onChangeTagSearch?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onPressTagSearch?: () => void;
}

const Tags: React.FC<TagsProps> = ({ onClick, tagParam, tagSearch, onChangeTagSearch, onPressTagSearch }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [tags, setTags] = useState<any>([]);

  const fetchTags = async (page: number = 1) => {
    const apiData: ApiDataType = {
      method: 'get',
      url: `/api/hashtags`,
      customUrl: process.env.NEXT_PUBLIC_MOMENTS_UTIL_URL,
    };

    try {
      await apiService(apiData, (res: any, err: any) => {
        if (err) return err.response

        if (res?.length > 0) {
          setTags(res);
        }
      });
    } catch (error: any) {
      console.error('error', error.response);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (!router.isReady) return;

    fetchTags();
  }, [router.isReady]);


  return (
    <div className="flex items-center max-w-[94%] overflow-hidden">

      <div className='flex justify-between items-center border rounded-md px-3 max-w-[280px] mr-3'>
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

      {
        isLoading ?
          <TagSkeleton />
          :
          <>
            <button
              className={`${!tagParam ? 'bg-gray-600 text-white' : 'bg-gray-200 text-black'} py-1 px-5 rounded-md mr-4 focus:bg-gray-600 focus:text-white`}
              title="All"
              disabled={!tagParam}
              onClick={() => onClick('all')}>
              All
            </button>

            {
              tags.map((item: any, index: number) => {
                const tagName = item.hashtag.substring(1);

                return (
                  <button
                    key={`tag-${index}`}
                    className={`${tagParam == tagName ? 'bg-gray-600 text-white' : 'bg-gray-200 text-black'} py-1 px-5 rounded-md mr-4 focus:bg-gray-600 focus:text-white`}
                    title={tagName}
                    onClick={() => onClick(item.hashtag)}>
                    {capitalizeFirstLetter(tagName)}
                  </button>
                )
              })
            }
          </>
      }

    </div>
  )
}

export default Tags
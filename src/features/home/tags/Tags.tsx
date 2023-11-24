import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { ApiDataType, apiService } from '@/utils/request';
import { useRouter } from 'next/router';
import { capitalizeFirstLetter } from '@/utils';
// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import TagSkeleton from '@/components/skeletons/tag';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import Slider from 'react-slick';
import Layout from '../layout';

interface TagsProps {
	onClick: (value: string) => void;
	tagParam: string;
	tagSearch?: string;
	onChangeTagSearch?: (event: React.ChangeEvent<HTMLInputElement>) => void;
	onPressTagSearch?: () => void;
}

const Tags: React.FC<TagsProps> = ({
	onClick,
	tagParam,
	tagSearch,
	onChangeTagSearch,
	onPressTagSearch,
}) => {
	const router = useRouter();
	// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [tags, setTags] = useState<any>([]);

	const slider: any = useRef(null);

	const dynamicSlidesToShow = useMemo(() => {
		if (tags.length > 5) {
			return 11;
		} else if (tags.length > 4) {
			return 10;
		} else if (tags.length < 1) {
			return 1;
		} else {
			return tags.length;
		}
	}, [tags]);

	// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
	const fetchTags = async (page: number = 1) => {
		const apiData: ApiDataType = {
			method: 'get',
			url: `/api/hashtags`,
			customUrl: process.env.NEXT_PUBLIC_MOMENTS_UTIL_URL,
		};

		try {
			await apiService(apiData, (res: any, err: any) => {
				if (err) return err.response;

				if (res?.length > 0) {
					setTags(res);
				}
			});
		} catch (error: any) {
			console.error('error', error.response);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		if (!router.isReady) return;

		fetchTags();
	}, [router.isReady]);

	const momentSliderSettings = {
		dots: false,
		infinite: true,
		loop: false,
		arrows: false,
		speed: 500,
		slidesToShow: dynamicSlidesToShow,
		slidesToScroll: 3,
		variableWidth: true,
		responsive: [
			{
				breakpoint: 1200,
				settings: {
					slidesToShow: 10,
					slidesToScroll: 3,
				},
			},
			{
				breakpoint: 991,
				settings: {
					slidesToShow: 3,
					slidesToScroll: 2,
				},
			},
			{
				breakpoint: 700,
				settings: {
					slidesToShow: 2,
					slidesToScroll: 1,
				},
			},
			{
				breakpoint: 575,
				settings: {
					slidesToShow: 1,
				},
			},
		],
	};

	return (
		<>
			<div className="flex flex-row items-center justify-between gap-4 mr-10 mb-[16px] mt-[24px]">
				<div className="flex justify-between items-center border rounded-md px-3 max-w-[280px] mr-3">
					<span className="mr-1">#</span>
					<input
						type="text"
						placeholder="Search Hashtags"
						className="w-[170px] h-[32px] text-md focus:outline-none border-[gray] rounded-[5px] p-[5px] border-[1px] mr-4"
						value={tagSearch}
						onChange={onChangeTagSearch}
					/>
					{tagSearch && (
						<ArrowRightIcon
							className="ml-2 w-4 h-4 text-blue-500 cursor-pointer"
							role="button"
							onClick={onPressTagSearch}
						/>
					)}
				</div>
				{/* {
          tags.length > 4 && (
            <div className="flex flex-row items-start">
              <button
                className="mr-4 rounded-[28px] border border-solid border-gray-300 bg-white flex p-2 items-center gap-2"
                onClick={() => slider?.current?.slickPrev()}>
                <ChevronLeftIcon className="h-5 w-5" />
              </button>
              <button className="rounded-[28px] border border-solid border-gray-300 bg-white flex p-2 items-center gap-2"
                onClick={() => {
                  slider?.current?.slickNext()
                }}>
                <ChevronRightIcon className="h-5 w-5" />
              </button>
              <div className='ml-3'>
                <Layout />
              </div>
            </div>
          )

        } */}
			</div>

			<div className="flex flex-row items-center justify-between">
				{tags.length > 11 && (
					<button
						className="m-4 rounded-[28px] border border-solid border-gray-300 bg-white flex p-2 items-center gap-2"
						onClick={() => slider?.current?.slickPrev()}
					>
						<ChevronLeftIcon className="h-5 w-5" />
					</button>
				)}
				<div className="w-[75%]">
					<Slider
						ref={slider}
						{...momentSliderSettings}
					>
						<button
							className={`${
								!tagParam
									? ' border-b-[1px] border-[#00A1D4] text-[#00A1D4]'
									: 'text-[#7B7788]'
							} p-4 leading-trim font-inter font-[16px] text-base`}
							title="All"
							// disabled={!tagParam}
							onClick={() => onClick('all')}
						>
							All
						</button>
						{tags.map((item: any, index: number) => {
							return (
								<button
									key={`tag-${index}`}
									className={`${
										tagParam == item.hashtag
											? 'border-b-[1px] border-[#00A1D4] text-[#00A1D4]'
											: 'text-[#7B7788]'
									} p-4 leading-trim font-inter font-[16px] text-base`}
									title={item.name}
									onClick={() => onClick(item.name)}
								>
									{'#' + capitalizeFirstLetter(item.name)}
								</button>
							);
						})}
					</Slider>
				</div>

				{tags.length > 11 && (
					<div className="flex items-center justify-center">
						<button
							className="rounded-[28px] border border-solid border-gray-300 bg-white flex p-2 items-center gap-2"
							onClick={() => {
								slider?.current?.slickNext();
							}}
						>
							<ChevronRightIcon className="h-5 w-5" />
						</button>
						<div className="ml-3">
							<Layout />
						</div>
					</div>
				)}
			</div>
		</>
	);
};

export default Tags;

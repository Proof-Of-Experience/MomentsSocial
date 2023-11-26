import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { ApiDataType, apiService } from '@/utils/request';
import { useRouter } from 'next/router';
import { capitalizeFirstLetter, cn } from '@/utils';
// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import TagSkeleton from '@/components/skeletons/tag';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import Slider from 'react-slick';
import { useWindowSize } from '@/utils/hooks';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/20/solid';
// import Layout from '../layout';

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
	const { width: windowWidth } = useWindowSize();
	const isSmallDevice = windowWidth <= 991;

	// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [tags, setTags] = useState<any>([]);
	const [showSearchTag, setShowSearchTag] = useState<boolean>(!isSmallDevice ? true : false);
	// const [currentSlide, setCurrentSlide] = useState(0);

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

	const momentTagSliderSettings = {
		dots: false,
		infinite: true,
		loop: false,
		arrows: false,
		speed: 500,
		swipeToSlide: true,
		slidesToShow: dynamicSlidesToShow,
		slidesToScroll: 3,
		variableWidth: true,
		// afterChange: (current: any) => setCurrentSlide(current),
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
					slidesToShow: 4,
					slidesToScroll: 1,
				},
			},
			{
				breakpoint: 575,
				settings: {
					slidesToShow: 3,
				},
			},
		],
	};

	return (
		<div className="flex flex-row items-center">
			{tags.length > 11 && (
				<button
					className="hidden min-[575px]:flex mr-[10px] rounded-full border border-[#E4E4E4] bg-white p-[10px] items-center gap-2"
					onClick={() => slider?.current?.slickPrev()}
					// disabled={currentSlide === 0}
				>
					<ChevronLeftIcon className="h-5 w-5 text-[#1C1B1F]" />
				</button>
			)}
			{isSmallDevice && (
				<label
					htmlFor="search-tag"
					className="mr-[10px] rounded-full border border-[#E4E4E4] bg-white flex p-[10px] items-center gap-2"
					onClick={() => setShowSearchTag(!showSearchTag)}
				>
					{!showSearchTag ? (
						<MagnifyingGlassIcon className="h-5 w-5 text-[#1C1B1F]" />
					) : (
						<XMarkIcon className="h-5 w-5 text-[#1C1B1F]" />
					)}
				</label>
			)}
			{(showSearchTag || !isSmallDevice) && (
				<div className="flex items-center border rounded-md px-3 w-[172px] mr-3">
					<span className="mr-1 text-sm text-[#7B7788] font-medium">#</span>
					<input
						type="text"
						placeholder="Search Hashtags"
						id="search-tag"
						className="w-[115px] h-[32px] text-sm focus:outline-none leading-none p-[5px]"
						value={tagSearch}
						onChange={onChangeTagSearch}
					/>
					{tagSearch && (
						<ArrowRightIcon
							className="ml-0.5 w-4 h-4 text-blue-500 cursor-pointer"
							role="button"
							onClick={onPressTagSearch}
						/>
					)}
				</div>
			)}
			<div
				className={cn('max-w-[calc(100%_-_284px)] overflow-hidden h-[41px]', {
					'max-w-[calc(100%_-_284px)]': showSearchTag || !isSmallDevice,
					'max-w-[calc(100%_-_54px)] min-[575px]:max-w-[calc(100%_-_162px)] ':
						!showSearchTag && isSmallDevice,
					'max-w-[calc(100%_-_234px)] min-[575px]:max-w-[calc(100%_-_342px)]':
						showSearchTag && isSmallDevice,
				})}
			>
				<div className="">
					<Slider
						ref={slider}
						{...momentTagSliderSettings}
					>
						<button
							className={`${
								!tagParam
									? ' border-b-[1px] border-[#00A1D4] text-[#00A1D4]'
									: 'text-[#7B7788]'
							} px-3 py-2 leading-trim font-inter text-base`}
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
									} px-3 py-2 leading-trim font-inter text-base`}
									title={item.name}
									onClick={() => onClick(item.name)}
								>
									{'#' + capitalizeFirstLetter(item.name)}
								</button>
							);
						})}
					</Slider>
				</div>
			</div>
			{tags.length > 11 && (
				<button
					className="hidden min-[575px]:flex ml-[10px] rounded-full border border-[#E4E4E4] bg-white p-[10px] items-center gap-2"
					onClick={() => {
						slider?.current?.slickNext();
					}}
					// disabled={currentSlide === tags.length - 2}
				>
					<ChevronRightIcon className="h-5 w-5 text-[#1C1B1F]" />
				</button>
			)}
			{/* <div className="ml-3">
                <Layout />
            </div> */}
		</div>
	);
};

export default Tags;

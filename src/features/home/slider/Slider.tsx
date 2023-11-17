import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import Moment from '@/components/snippets/moment';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { useMemo, useRef } from "react";

const MomentsSlider = ({ momentsData, isLoading, loadMoreMoments, onClickMoment }: any) => {
    const slider: any = useRef(null);

    const dynamicSlidesToShow = useMemo(() => {
        if (momentsData.length > 5) {
            return 6;
        } else if (momentsData.length > 4) {
            return 3;
        } else if (momentsData.length < 1) {
            return 1;
        } else {
            return momentsData.length;
        }
    }, [momentsData]);

    const momentSliderSettings = {
        dots: false,
        infinite: true,
        loop: false,
        arrows: false,
        speed: 500,
        slidesToShow: dynamicSlidesToShow,
        slidesToScroll: 3,
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 5,
                    slidesToScroll: 3,
                }
            },
            {
                breakpoint: 991,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 2,
                }
            },
            {
                breakpoint: 700,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 575,
                settings: {
                    slidesToShow: 1,
                }
            }
        ]
    };

    return (
        <>
            <div className="flex flex-row justify-between gap-4 mr-10 mb-[16px] mt-[24px]">
                <h2 className='flex flex-row items-center'>
                    <img
                        className="mr-2"
                        src="/moments.svg"
                        alt="No data"
                    />
                    <span className="text-[#1C1B1F] leading-trim capitalize font-inter text-lg font-semibold">Shorts</span>
                </h2>

                {
                    momentsData.length > 4 && (
                        <div className="flex flex-row items-center">
                            <button
                                className="mr-4 rounded-[28px] border border-solid border-gray-300 bg-white flex p-2 items-center gap-2"
                                onClick={() => slider?.current?.slickPrev()}>
                                <ChevronLeftIcon className="h-5 w-5" />
                            </button>
                            <button className="rounded-[28px] border border-solid border-gray-300 bg-white flex p-2 items-center gap-2"
                                onClick={() => {
                                    slider?.current?.slickNext();
                                    loadMoreMoments();
                                }}>
                                <ChevronRightIcon className="h-5 w-5" />
                            </button>
                        </div>
                    )
                }
            </div>

            <Slider ref={slider}  {...momentSliderSettings}>
                {
                    momentsData.map((item: any) => {
                        return (
                            <Moment
                                key={item.PostHashHex}
                                className="mr-[27px]"
                                item={item}
                                isLoading={isLoading}
                                onClick={() => onClickMoment(item)}
                            />
                        )
                    })
                }
            </Slider>

        </>
    );
}

export default MomentsSlider;
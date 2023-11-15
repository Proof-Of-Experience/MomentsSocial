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
            <div className="flex justify-between items-center mr-10 mb-3">
                <h2 className='flex'>
                    <img
                        className=""
                        src="/moments.svg"
                        alt="No data"
                    />
                    <span className="font-semibold text-3xl">Moments</span>
                </h2>

                {
                    momentsData.length > 4 && (
                        <div>
                            <button
                                className="mr-4"
                                onClick={() => slider?.current?.slickPrev()}>
                                <ChevronLeftIcon className="h-5 w-5" />
                            </button>
                            <button
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
                                className="mr-6"
                                item={item}
                                isLoading={isLoading}
                                onClick={() => onClickMoment(item)}
                            />
                        )
                    })
                }
            </Slider>

            {
                momentsData.length > 0 &&
                <hr className="border-t-2 my-10" />
            }
        </>
    );
}

export default MomentsSlider;
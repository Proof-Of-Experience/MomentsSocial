export const getMomentSliderSettings = (dynamicSlidesToShow: number) => {
	return {
		dots: false,
		infinite: true,
		loop: false,
		arrows: false,
		speed: 500,
		slidesToShow: dynamicSlidesToShow,
		swipeToSlide: true,
		slidesToScroll: 3,
		responsive: [
			{
				breakpoint: 1920,
				settings: {
					slidesToShow: 5,
					slidesToScroll: 3,
				},
			},
			{
				breakpoint: 1550,
				settings: {
					slidesToShow: 4,
					slidesToScroll: 3,
				},
			},
			{
				breakpoint: 1280,
				settings: {
					slidesToShow: 3,
					slidesToScroll: 3,
				},
			},
			{
				breakpoint: 1040,
				settings: {
					slidesToShow: 3,
					slidesToScroll: 2,
				},
			},
			{
				breakpoint: 767,
				settings: {
					slidesToShow: 2,
					slidesToScroll: 1,
				},
			},
			{
				breakpoint: 575,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1,
				},
			},
		],
	};
};

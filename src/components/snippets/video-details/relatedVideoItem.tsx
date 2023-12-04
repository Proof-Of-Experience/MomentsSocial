// import { useRouter } from 'next/router';
import React from 'react';
import VideoItem from '../video';

const RelatedVideoItem = (props: { item: any }) => {
	const { item, ...rest } = props;

	// const router = useRouter();

	return (
		<VideoItem
			item={item}
			isHorizontal
			{...rest}
		/>
	);
};

export default RelatedVideoItem;

// import { useRouter } from 'next/router';
import React from 'react';
import VideoItem from '../video';

interface IRelatedVideoItemProps {
	item: any;
	playlistId?: string;
}
const RelatedVideoItem = (props: IRelatedVideoItemProps) => {
	const { item, playlistId, ...rest } = props;

	// const router = useRouter();

	return (
		<VideoItem
			item={item}
			playlistId={playlistId}
			isHorizontal
			{...rest}
		/>
	);
};

export default RelatedVideoItem;

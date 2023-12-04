import React from 'react';
import RelatedVideoItem from './relatedVideoItem';

const RelatedVideoList = (props: { videos: any[] }) => {
	const { videos } = props;

	return (
		<>
			{videos.length > 0 ? (
				<>
					{videos.map((item: any, index: any) => (
						<RelatedVideoItem
							key={index}
							item={item}
						/>
					))}
				</>
			) : (
				<div className="flex justify-center items-center w-full h-full">
					<p className="text-base text-[#7B7788] font-normal leading-6">
						No videos found
					</p>
				</div>
			)}
		</>
	);
};
export default RelatedVideoList;

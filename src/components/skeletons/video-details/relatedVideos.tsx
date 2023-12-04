import React from 'react';
import RelatedVideoItemSkeleton from './relatedVideoItem';

const RelatedVideosSkeleton = () => (
	<div className="animate-pulse">
		<div className="flex flex-col gap-y-4">
			{[...Array(8)].map((_, index) => (
				<RelatedVideoItemSkeleton key={index} />
			))}
		</div>
	</div>
);

export default RelatedVideosSkeleton;

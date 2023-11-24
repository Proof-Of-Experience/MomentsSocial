import React from 'react';

interface SkeletonProps {}

const TagSkeleton: React.FC<SkeletonProps> = () => (
	<div className="flex space-x-4">
		{[...Array(5)].map((_, index) => (
			<div
				key={index}
				className="bg-gray-300 h-8 w-24 rounded-md animate-pulse"
			></div>
		))}
	</div>
);

export default TagSkeleton;

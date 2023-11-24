import React from 'react';

interface SkeletonProps {
	width?: string;
	height?: string;
	className?: string;
}

const VideoSkeleton: React.FC<SkeletonProps> = () => (
	<div className="animate-pulse">
		<div className="bg-gray-200 rounded w-full h-[244px]"></div>
		<div className="mt-4 h-5 bg-gray-200 rounded w-full"></div>
		<div className="mt-3 h-8 bg-gray-200 rounded w-full"></div>
		<div className="flex justify-between">
			<div className="flex">
				<div className="mt-2 h-5 w-5 bg-gray-200 rounded-full mr-2"></div>
				<div className="mt-2 h-5 w-10 bg-gray-200 rounded"></div>
			</div>
			<div className="flex">
				<div className="mt-2 h-5 w-5 bg-gray-200 rounded-full mr-2"></div>
				<div className="mt-2 h-5 w-10 bg-gray-200 rounded"></div>
			</div>
		</div>
	</div>
);

export default VideoSkeleton;

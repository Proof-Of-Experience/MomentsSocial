import React from 'react';

const RelatedVideoItemSkeleton = () => {
	return (
		<div className="animate-pulse">
			<div className="flex items-start justify-between gap-x-4">
				<div className="w-[170px] h-[100px] rounded-lg bg-gray-200"></div>
				<div className="flex flex-col justify-start flex-1 h-[100px]">
					<div>
						<div className="flex flex-col items-start gap-y-2">
							<div className="h-5 w-full bg-gray-200 rounded-md"></div>
							<div className="h-5 w-4/5 bg-gray-200 rounded-md"></div>
						</div>
						<p className="h-4 w-32 bg-gray-200 mt-2 rounded-md"></p>
					</div>

					<div className="flex justify-between mt-1.5">
						<div className="h-4 w-12 bg-gray-200 rounded-md"></div>
						<div className="h-4 w-16 bg-gray-200 rounded-md"></div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default RelatedVideoItemSkeleton;

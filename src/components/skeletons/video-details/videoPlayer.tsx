import React from 'react';

const VideoPlayerSkeleton = () => (
	<div className="animate-pulse">
		<div className="flex flex-col gap-y-6">
			{/* 1.1. Video Player ------------------- */}
			<div className="rounded-2xl bg-gray-200 w-full h-[483px]"></div>
			{/* 1.2. Post title and reactions ------------------- */}
			<div className="flex flex-col items-start gap-y-4">
				<div className="w-3/4 h-7 bg-gray-200 rounded-md"></div>
				<div className="flex items-center justify-start">
					<div className="flex items-center justify-start gap-x-2">
						<div className="w-12 h-6 bg-gray-200 rounded-md"></div>
						<div className="w-28 h-6 bg-gray-200 rounded-md"></div>
					</div>
				</div>
			</div>

			{/* 1.3. User Info and Actions ------------------- */}
			<div className="flex items-center justify-between flex-wrap gap-y-4 gap-x-7 flex-1">
				<div className="flex items-center justify-start gap-x-4">
					<div className="w-12 h-12 rounded-full bg-gray-200"></div>
					<div className="w-40 h-8 bg-gray-200 rounded-md"></div>
				</div>
				<div className="flex items-center justify-start gap-x-4">
					<div className="w-[90px] h-8 bg-gray-200 rounded-2xl"></div>
					<div className="w-[90px] h-8 bg-gray-200 rounded-2xl"></div>
					<div className="w-[90px] h-8 bg-gray-200 rounded-2xl"></div>
					<div className="w-[90px] h-8 bg-gray-200 rounded-2xl"></div>
				</div>
			</div>

			{/* 1.4. Post Description ------------------- */}
			<div className="flex flex-col items-start gap-y-2">
				<div className="h-4 w-full bg-gray-200 rounded-md"></div>
				<div className="h-4 w-full bg-gray-200 rounded-md"></div>
				<div className="h-4 w-1/3 bg-gray-200 rounded-md"></div>
			</div>

			{/* 1.5. Post's CommentBox ------------------- */}
			{/* <div
				id="video-comments"
				className="py-6 rounded-lg w-full border border-[#EBEBEB]"
			>
				<CommentBox
					PostHashHex={videoData?.PostHashHex}
					commentCount={videoData?.CommentCount}
					comments={videoComments(videoData?.Comments)}
					authUser={authUser}
				/>
			</div> */}
		</div>
	</div>
);

export default VideoPlayerSkeleton;

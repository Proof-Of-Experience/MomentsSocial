import React, { memo } from 'react';
import TextDescription from '@/components/snippets/text-description';

const Comment = memo(({ comment }: any) => {
	return (
		<div className="flex justify-start items-start gap-x-3 w-full">
			<img
				className="w-12 h-12 rounded-full"
				src={comment?.ProfileEntryResponse?.ExtraData?.FeaturedImageURL}
				alt={comment?.ProfileEntryResponse?.Username}
			/>
			<div className="flex flex-col items-start flex-grow gap-y-4">
				<p className="text-[#1C1B1F] text-base leading-none font-semibold">
					{comment?.ProfileEntryResponse?.Username}
				</p>
				{comment?.Body && (
					<TextDescription
						description={comment?.Body}
						className="text-[#47474A] text-base font-normal leading-6"
						readMoreBtnClassName={'font-medium text-[#1C1B1F]'}
						readMoreBtnText="Show More"
						readLessBtnText="Show Less"
					/>
				)}
			</div>
		</div>
	);
});

export default Comment;

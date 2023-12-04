import { CommentIcon } from '@/components/icons';
import { cn, numerify } from '@/utils';
import React from 'react';
import MakeComment from './makeComment';
import CommentItem from './commentItem';

const CommentBox = (props: any) => {
	const { PostHashHex, commentCount, comments, authUser, className } = props;

	return (
		<div className={cn('flex flex-col w-full gap-y-6', className)}>
			<div className="mx-6 flex items-center gap-x-2">
				<CommentIcon className="w-5" />
				<span className="flex items-center text-[#7B7788] text-base font-normal justify-start gap-x-2">
					<span className="text-base">
						{commentCount > 1 ? `${numerify(commentCount)} Comments` : 'No comment'}
					</span>
				</span>
			</div>

			<div className="mx-6 border-b border-[#EBEBEB] pb-3 mb-3">
				<MakeComment
					postId={PostHashHex}
					userId={authUser?.PublicKeyBase58Check}
				></MakeComment>
			</div>

			<div className="px-6 flex flex-col w-full gap-y-6 min-h-[300px] max-h-[475px] overflow-y-scroll scrollbar-thin scrollbar-thumb-slate-300">
				{comments.map((comment: any, commentIndex: number) => (
					<CommentItem
						comment={comment}
						key={commentIndex}
					/>
				))}
			</div>
		</div>
	);
};

export default CommentBox;

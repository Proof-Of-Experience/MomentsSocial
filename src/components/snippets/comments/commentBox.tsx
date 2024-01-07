import { CommentIcon } from '@/components/icons';
import { cn, numerify } from '@/utils';
import React, { useEffect, useState } from 'react';
import MakeComment from './makeComment';
import CommentItem from './commentItem';
import { PrimaryButton } from '@/components/core/button';

export const DEFAULT_COMMENT_LIMIT: number = 30;

const CommentBox = (props: any) => {
	const { PostHashHex, authUser, className } = props;

	const [comments, setComments] = useState<any[]>([]);
	const [offset, setOffset] = useState<number>(0);
	const [limit] = useState<number>(DEFAULT_COMMENT_LIMIT);
	const [loading, setLoading] = useState<boolean>(false);
	const [hasMoreComments, setHasMoreComments] = useState<boolean>(true);
	const [commentCount, setCommentsCount] = useState<number>(0);

	useEffect(() => {
		getPostComments();
	}, []);

	const getPostComments = async () => {
		if (!hasMoreComments) {
			return;
		}

		if (loading) {
			return;
		}

		const { getSinglePost } = await import('deso-protocol');

		// 861caf9cadc5f9c03af0ba54f8d21960ea86a5c7e5b7f28b4e1554737012552d
		// use this id for some real data
		const params = {
			PostHashHex: PostHashHex,
			CommentOffset: offset,
			CommentLimit: limit,
		};

		setLoading(true);

		const res = await getSinglePost(params);

		setCommentsCount(res.PostFound?.CommentCount || 0);

		let _comments: any[] = res.PostFound?.Comments || [];

		setComments((prevComments) => [...prevComments, ..._comments]);

		setOffset(comments.length);

		setLoading(false);

		setHasMoreComments(commentCount >= comments.length);
	};

	const newCommentAdded = async () => {
		setOffset(0);
		setComments([]);

		getPostComments();
	};

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
					newCommentCreatedHandler={newCommentAdded}
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

			{hasMoreComments && commentCount > 0 ? (
				<div className="flex items-center justify-center">
					<PrimaryButton
						onClick={getPostComments}
						className="bg-[#ABABAB] text-white rounded-full w-48 text-center py-2 text-base font-semibold flex items-center"
						text={loading ? 'Loading' : 'Load more'}
						loader={loading}
						disabled={loading}
					/>
				</div>
			) : (
				<></>
			)}
		</div>
	);
};

export default CommentBox;

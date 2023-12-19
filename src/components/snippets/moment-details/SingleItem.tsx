import { getNFakeComments } from '@/data/comments';
import MomentOptionTray from '@/components/snippets/moment-details/OptionTray';
import CommentBox from '@/components/snippets/comments/commentBox';
import { XMarkIcon } from '@heroicons/react/20/solid';
import SocialSharePopup from '@/components/snippets/social-share-popup';
import { cn } from '@/utils';
import { useMomentReaction } from '@/utils/hooks';
import { useState } from 'react';

interface IMomentDetailsSIngleItem {
	item: any;
	videoData: any;
	authUser: any;
	videoUrl: any;
}
const MomentDetailsSingleItem = (props: IMomentDetailsSIngleItem) => {
	const {
		item,
		// videoData,
		authUser,
		// videoUrl,
	} = props;

	console.log('MomentDetailsSingleItem props-----', props);

	const {
		// currentReaction,
		totalReaction,
	} = useMomentReaction(item?.PostHashHex);

	const [showCommentSideBox, setShowCommentSideBox] = useState<boolean>(false);
	const [showShareModal, setShowShareModal] = useState<boolean>(false);

	const videoComments = (comments: any) => {
		if (!comments) {
			// return [];
			return getNFakeComments(5);
		}

		return comments;
	};

	return (
		<div
			className={cn(
				'relative transition-all',
				!showCommentSideBox ? 'w-[435px]' : 'w-[870px]'
			)}
		>
			<div
				className={cn(
					'relative max-w-full w-[435px] h-[calc(100vh-140px)] bg-[#babac3] rounded-2xl group z-20',
					showCommentSideBox ? 'rounded-tr-none rounded-br-none' : ''
				)}
			>
				{item?.VideoURLs?.[0] && (
					<iframe
						className={cn(
							'absolute top-0 left-0 w-full h-full object-cover rounded-2xl',
							showCommentSideBox ? 'rounded-tr-none rounded-br-none' : ''
						)}
						// width="100%"
						// height="500"
						src={
							`${item?.VideoURLs?.[0]}&loop=1` ??
							'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
						}
						allow="accelerometer; autoplay; clipboard-write; picture-in-picture;"
						allowFullScreen
					></iframe>
				)}
				<div className="absolute bottom-0 left-0 group-hover:hidden p-5">
					<h1 className="text-white text-sm font-medium line-clamp-1">
						{item?.ProfileEntryResponse?.Username || item?.Username}
					</h1>
					<p className="mt-3 text-white text-sm font-normal line-clamp-2 ">
						{item?.Body}
					</p>
				</div>
			</div>

			<MomentOptionTray
				video={item}
				totalReaction={totalReaction}
				totalComment={item?.Comments?.length}
				authUser={authUser}
				onClickComment={() => setShowCommentSideBox(true)}
				onClickShare={() => setShowShareModal(true)}
				className={cn(
					'absolute bottom-0',
					showCommentSideBox ? 'right-[calc(100%_-_435px)]' : '-right-[67px]'
				)}
			/>

			{/* Moment's CommentBox ------------------- */}
			<div
				className={cn(
					'absolute bottom-0 -right-0 py-6 rounded-2xl w-[435px] h-full border border-[#EBEBEB] bg-white opacity-0 overflow-hidden transition-all',
					showCommentSideBox
						? 'rounded-tl-none rounded-bl-none opacity-100 z-10 -right-[calc(100%_-_870px)]'
						: ''
				)}
			>
				<div
					className="flex items-center justify-center w-8 h-8 bg-transparent hover:bg-slate-200 translate-all absolute top-2.5 right-2.5 cursor-pointer rounded-full"
					onClick={() => setShowCommentSideBox(false)}
				>
					<XMarkIcon className="w-5 h-5" />
				</div>
				<CommentBox
					PostHashHex={item?.PostHashHex}
					commentCount={item?.CommentCount}
					comments={videoComments(item?.Comments)}
					authUser={authUser}
				/>
			</div>

			{/* Socail Share Section ------------------- */}
			<SocialSharePopup
				open={showShareModal}
				onClose={() => setShowShareModal(false)}
				videoData={item}
				type={'VIDEO'}
			/>
		</div>
	);
};

export default MomentDetailsSingleItem;

// TODO:: Call the component in src/pages/moment/[PostHashHex].tsx in between the video loop
// <div
// 	key={index}
// 	className={`${activeVideoIndex !== index ? 'hidden' : ''}`}
// 	// style={{ marginLeft: '30%', marginRight: '30%', width: '40%' }}
// >
// 	<MomentDetailsSingleItem
// 		item={video}
// 		videoData={item}
// 		authUser={authUser}
// 		videoUrl={videoUrl}
// 	/>
// </div>

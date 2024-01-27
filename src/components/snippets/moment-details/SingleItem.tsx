import { useState } from 'react';
// import { getNFakeComments } from '@/data/comments';
import MomentOptionTray from '@/components/snippets/moment-details/OptionTray';
import CommentBox from '@/components/snippets/comments/commentBox';
import SocialSharePopup from '@/components/snippets/social-share-popup';
import TextDescription from '@/components/snippets/text-description';
import { cn } from '@/utils';
import { useMomentReaction } from '@/utils/hooks';
import PlaylistPopup from '../playlist-popup';
import MomentSideBox from './SideBox';
import { NO_TITLE } from '@/enums/common';

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

	const {
		// currentReaction,
		totalReaction,
	} = useMomentReaction(item?.PostHashHex);

	const [showSideBox, setShowSideBox] = useState<'COMMENT' | 'DESCRIPTION' | null>(null);
	// const [showCommentSideBox, setShowCommentSideBox] = useState<boolean>(false);
	const [showShareModal, setShowShareModal] = useState<boolean>(false);
	const [showPlaylistModal, setShowPlaylistModal] = useState<boolean>(false);
	// const [showDescriptionSideBox, setShowDescriptionSideBox] = useState<boolean>(false);

	const onClickSavePlaylist = () => {
		setShowPlaylistModal(true);
	};

	return (
		<div className={cn('relative transition-all', !showSideBox ? 'w-[435px]' : 'w-[870px]')}>
			<div
				className={cn(
					'relative max-w-full w-[435px] h-[calc(100vh-140px)] bg-[#babac3] rounded-2xl group z-20',
					showSideBox ? 'rounded-tr-none rounded-br-none' : ''
				)}
			>
				{item?.VideoURLs?.[0] && (
					<iframe
						className={cn(
							'absolute top-0 left-0 w-full h-full object-cover rounded-2xl',
							showSideBox ? 'rounded-tr-none rounded-br-none' : ''
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
						{item?.Body || NO_TITLE}
					</p>
				</div>
			</div>

			<MomentOptionTray
				video={item}
				totalReaction={totalReaction}
				totalComment={item?.CommentCount}
				authUser={authUser}
				// onClickComment={() => setShowCommentSideBox(true)}
				onClickComment={() => setShowSideBox('COMMENT')}
				onClickShare={() => setShowShareModal(true)}
				onClickSavePlaylist={() => {
					onClickSavePlaylist();
				}}
				// onClickDescription={() => setShowDescriptionSideBox(true)}
				onClickDescription={() => setShowSideBox('DESCRIPTION')}
				className={cn(
					'absolute bottom-0',
					showSideBox ? 'right-[calc(100%_-_435px)]' : '-right-[67px]'
				)}
			/>

			{/* Moment's CommentBox ------------------- */}
			<MomentSideBox
				open={showSideBox === 'COMMENT' || showSideBox === 'DESCRIPTION'}
				onClose={() => setShowSideBox(null)}
			>
				{showSideBox === 'COMMENT' && (
					<CommentBox
						PostHashHex={item?.PostHashHex}
						authUser={authUser}
					/>
				)}
				{showSideBox === 'DESCRIPTION' && (
					<div className="px-6">
						<TextDescription description={item?.Body} />
					</div>
				)}
			</MomentSideBox>

			{/* Socail Share Section ------------------- */}
			<SocialSharePopup
				open={showShareModal}
				onClose={() => setShowShareModal(false)}
				videoData={item}
				type={'VIDEO'}
			/>

			{/* Playlist Popup Section ------------------- */}
			<PlaylistPopup
				open={showPlaylistModal}
				onClose={() => setShowPlaylistModal(false)}
				userId={authUser?.api_user?._id}
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

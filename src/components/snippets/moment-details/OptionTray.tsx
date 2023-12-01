import CommentIcon from '@/components/icons/comment';
import LikeIcon from '@/components/icons/like';
import ShareIcon from '@/components/icons/share';
import ThreeDotMenuIcon from '@/components/icons/three-dot-menu';
import React from 'react';
import SendTipButton, { SendTipButtonUI } from '../tip/SendTipButton';
import { DiamonLevel } from '@/services/tip';
interface IMomentOptionTray {
	video?: any;
	totalReaction?: number;
	totalComment?: number;
	authUser?: any;
}
const MomentOptionTray = (props: IMomentOptionTray) => {
	const { video, totalReaction, totalComment, authUser } = props;

	return (
		<div className="absolute -right-[67px] bottom-0 w-14">
			<div className="flex flex-col items-center justify-center text-center mb-6 last:mb-0">
				<LikeIcon
					className="cursor-pointer"
					// color="#FF0000"
					onClick={() => console.log('On Clicked Like')}
				/>
				<span className="text-[#939393] text-[10px] font-normal leading-none mt-[6px]">
					{totalReaction || 'No Reaction'}
				</span>
			</div>
			<div className="flex flex-col items-center justify-center text-center mb-6 last:mb-0">
				<CommentIcon
					className="cursor-pointer"
					onClick={() => console.log('On Clicked Comment')}
				/>
				<span className="text-[#939393] text-[10px] font-normal leading-none mt-[6px]">
					{totalComment || 'No Comment'}
				</span>
			</div>
			<div className="flex flex-col items-center justify-center text-center mb-6 last:mb-0">
				<ShareIcon
					className="cursor-pointer"
					onClick={() => console.log('On Clicked Share')}
				/>
				<span className="text-[#939393] text-[10px] font-normal leading-none mt-[6px]">
					{'Share'}
				</span>
			</div>
			{authUser && (
				<div className="flex flex-col items-center justify-center text-center mb-6 last:mb-0">
					<SendTipButton
						userId={authUser?.PublicKeyBase58Check}
						postId={video.PostHashHex}
						receiverId={video.PosterPublicKeyBase58Check}
						diamonLevel={DiamonLevel.ONE}
						ui={SendTipButtonUI.ICON}
					/>
				</div>
			)}
			<div className="flex flex-col items-center justify-center text-center mb-6 last:mb-0">
				<ThreeDotMenuIcon
					className="cursor-pointer"
					onClick={() => console.log('On Clicked Menu')}
				/>
			</div>
		</div>
	);
};

export default MomentOptionTray;

import CommentIcon from '@/components/icons/comment';
import LikeIcon from '@/components/icons/like';
import ShareIcon from '@/components/icons/share';
import ThreeDotMenuIcon from '@/components/icons/three-dot-menu';
import React from 'react';
import SendTipButton, { SendTipButtonUI } from '../tip/SendTipButton';
import { DiamonLevel } from '@/services/tip';
import { useRouter } from 'next/router';
import UserAvatar from '../user-avatar';
import { cn } from '@/utils';

interface IMomentOptionTray {
	video?: any;
	totalReaction?: number;
	totalComment?: number;
	authUser?: any;
	onClickReaction?: () => void;
	onClickComment?: () => void;
	onClickShare?: () => void;
	onClickTip?: () => void;
	onClickMenu?: () => void;
	className?: string;
}

interface ITrayOption {
	icon: JSX.Element;
	text?: string | number | undefined | null;
	onClick?: () => void;
}

const MomentOptionTray = (props: IMomentOptionTray) => {
	const {
		video,
		totalReaction,
		totalComment,
		authUser,
		onClickReaction,
		onClickComment,
		onClickShare,
		onClickMenu,
		onClickTip,
		className,
	} = props;
	console.log('video optionTray', video);
	const router = useRouter();
	const userProfilePhotoKey = video?.ProfileEntryResponse?.PublicKeyBase58Check;

	console.log('video userProfilePhotoKey', userProfilePhotoKey);

	const trayOptions: ITrayOption[] = [
		{
			icon: <LikeIcon className="group-hover:text-[#00A1D4]" />,
			text: totalReaction || 'No Reaction',
			onClick: () => {
				if (onClickReaction) onClickReaction();
				console.log('On Clicked Like');
			},
		},
		{
			icon: <CommentIcon className="group-hover:text-[#00A1D4]" />,
			text: totalComment || 'No Comment',
			onClick: () => {
				if (onClickComment) onClickComment();
				console.log('On Clicked Comment');
			},
		},
		{
			icon: <ShareIcon className="group-hover:text-[#00A1D4]" />,
			text: 'Share',
			onClick: () => {
				if (onClickShare) onClickShare();
				console.log('On Clicked Share');
			},
		},
		{
			icon: (
				<SendTipButton
					userId={authUser?.PublicKeyBase58Check}
					postId={video?.PostHashHex}
					receiverId={video?.PosterPublicKeyBase58Check}
					diamonLevel={DiamonLevel?.ONE}
					ui={SendTipButtonUI?.ICON}
					buttonMiniClassName="group-hover:text-[#00A1D4]"
				/>
			),
			text: 'Send Tip',
			onClick: () => {
				if (onClickTip) onClickTip();
				console.log('On Clicked Tip');
			},
		},
		{
			icon: <ThreeDotMenuIcon className="group-hover:text-[#00A1D4]" />,
			text: '',
			onClick: () => {
				if (onClickMenu) onClickMenu();
				console.log('On Clicked Menu');
			},
		},
		{
			icon: (
				<UserAvatar
					imageKey={userProfilePhotoKey}
					className="group-hover:text-[#00A1D4]"
				/>
			),
			text: '',
			onClick: () => {
				router.push(`/user/${video?.ProfileEntryResponse?.Username}`);
			},
		},
	];

	return (
		<>
			<div className={cn('w-14', className)}>
				{trayOptions?.length > 0 &&
					trayOptions.map((option: ITrayOption, index: number) => (
						<div
							key={index}
							className="flex flex-col items-center justify-center text-center mb-6 last:mb-0"
						>
							<div
								className="w-10 h-10 rounded-full border border-[#D7D7D7] cursor-pointer flex items-center justify-center group bg-white hover:bg-slate-50 transition-all"
								onClick={() => {
									if (option?.onClick) option?.onClick();
								}}
							>
								{option?.icon}
							</div>
							{option?.text && (
								<span className="text-[#939393] text-[10px] font-normal leading-none mt-[6px]">
									{option?.text}
								</span>
							)}
						</div>
					))}
			</div>
		</>
	);
};

export default MomentOptionTray;

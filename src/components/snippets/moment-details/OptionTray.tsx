import CommentIcon from '@/components/icons/comment';
import LikeIcon from '@/components/icons/like';
import ShareIcon from '@/components/icons/share';
import ThreeDotMenuIcon from '@/components/icons/three-dot-menu';
import React, { useState } from 'react';
import SendTipButton, { SendTipButtonUI } from '../tip/SendTipButton';
import { DiamonLevel } from '@/services/tip';
import { useRouter } from 'next/router';
import UserAvatar from '../user-avatar';
import { cn } from '@/utils';
import EmojiReactionTray from '../emoji-reaction-tray';
import MenuOptions from './MenuOptions';
import OutsideClickHandler from 'react-outside-click-handler';
// import OutsideClickHandler from 'react-outside-click-handler';
// import { Bars3CenterLeftIcon, SquaresPlusIcon } from '@heroicons/react/24/outline';

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
	onClickDescription?: () => void;
	onClickSavePlaylist?: () => void;
	className?: string;
}

interface ITrayOption {
	name: string;
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
		onClickDescription,
		onClickSavePlaylist,
		className,
	} = props;
	const router = useRouter();
	const userProfilePhotoKey = video?.ProfileEntryResponse?.PublicKeyBase58Check;

	const [showReactTray, setShowReactTray] = useState<boolean>(false);
	const [showMenuOptions, setShowMenuOptions] = useState<boolean>(false);

	const trayOptions: ITrayOption[] = [
		{
			name: 'like',
			icon: <LikeIcon className="group-hover:text-[#00A1D4]" />,
			text: totalReaction || 'No Reaction',
			onClick: () => {
				if (onClickReaction) onClickReaction();
			},
		},
		{
			name: 'comment',
			icon: <CommentIcon className="group-hover:text-[#00A1D4]" />,
			text: totalComment || 'No Comment',
			onClick: () => {
				if (onClickComment) onClickComment();
			},
		},
		{
			name: 'share',
			icon: <ShareIcon className="group-hover:text-[#00A1D4]" />,
			text: 'Share',
			onClick: () => {
				if (onClickShare) onClickShare();
			},
		},
		{
			name: 'tips',
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
			},
		},
		{
			name: 'menu',
			icon: <ThreeDotMenuIcon className="group-hover:text-[#00A1D4]" />,
			text: '',
			onClick: () => {
				if (onClickMenu) onClickMenu();
				setShowMenuOptions((prev) => !prev);
			},
		},
		{
			name: 'avatar',
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
							className="relative mb-6 last:mb-0"
							key={index}
						>
							<div className="flex flex-col items-center justify-center text-center">
								<div
									className="w-10 h-10 rounded-full border border-[#D7D7D7] cursor-pointer flex items-center justify-center group bg-white hover:bg-slate-50 transition-all"
									onClick={() => {
										if (option?.onClick) option?.onClick();
									}}
									onMouseEnter={() => {
										if (option?.name === 'like') {
											setShowReactTray(true);
										}
									}}
									onMouseLeave={() => {
										if (option?.name === 'like') {
											setShowReactTray(false);
										}
									}}
								>
									{option?.icon}
									{option?.name === 'like' && showReactTray && (
										<EmojiReactionTray
											postHashHex={video?.PostHashHex}
											className="absolute -top-1 right-12"
										/>
									)}
									{option?.name === 'menu' && showMenuOptions && (
										<OutsideClickHandler
											onOutsideClick={() => setShowMenuOptions(false)}
										>
											<MenuOptions
												onClickDescription={() => {
													if (onClickDescription) onClickDescription();
												}}
												onClickSavePlaylist={() => {
													if (onClickSavePlaylist) onClickSavePlaylist();
												}}
											/>
										</OutsideClickHandler>
									)}
								</div>
								{option?.text && (
									<span className="text-[#939393] text-[10px] font-normal leading-none mt-[6px]">
										{option?.text}
									</span>
								)}
							</div>
						</div>
					))}
			</div>
		</>
	);
};

export default MomentOptionTray;

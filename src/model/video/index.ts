export interface VideoItemProps {
	item: any;
	onReactionClick?: () => void;
	[rest: string]: any;
	desoResponse?: boolean;
	isHorizontal?: boolean;
	hideUserProfilePhoto?: boolean;
	showVideoOnly?: boolean;
}

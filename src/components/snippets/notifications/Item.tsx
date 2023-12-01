import { MomentNotification, TINoticationDataType } from '@/services/notification';

interface INotificationProps {
	notification: MomentNotification;
}
type IItemText = {
	[key in TINoticationDataType]: JSX.Element;
};

const NotificationItem = (props: INotificationProps) => {
	const { notification } = props;
	const { data } = notification;

	const ITEM_TEXT: IItemText = {
		TRANSFER: (
			<p className="">
				<span className="font-medium">@{data?.sender?.username}</span> sent you{' '}
				{data?.amountNanos} $DESO! (~$
				{data?.amountCalc})
			</p>
		),
		REACTION: (
			<p>
				<span className="font-medium">@{data?.sender?.username}</span>
				{data?.isUnlike ? 'unliked' : 'liked'} your post.
			</p>
		),
		POST_MENTION: (
			<p>
				<span className="font-medium">@{data?.sender?.username}</span> mentioned you in a
				post.
			</p>
		),
		POST_MESSAGE: (
			<p>
				<span className="font-medium">@{data?.sender?.username}</span> {data?.message}.
			</p>
		),
	};

	if (!data?.type) return <></>;

	return (
		<>
			<div className="py-3 border-b last:border-b-0 border-[#eeedfa] text-sm text-gray-900">
				{ITEM_TEXT[data?.type]}
			</div>
		</>
	);
};

export default NotificationItem;

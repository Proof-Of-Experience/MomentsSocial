import { MomentNotification } from '@/services/notification';
import { cn } from '@/utils';
import NotificationItem from './Item';

interface NotificationProps {
	notifications: MomentNotification[];
}

const Notifications = ({ notifications }: NotificationProps) => {
	return (
		<div className="bg-white mt-[10px] py-4 w-[350px] origin-top-right rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none transform opacity-100 scale-100">
			<h3 className="font-semibold text-base mx-5 pb-3 mb-3 border-b border-b-slate-400">
				Notifications
			</h3>
			<div
				className={cn(
					'px-5 min-h-[300px] max-h-[400px] overflow-y-scroll scrollbar-thin scrollbar-thumb-slate-300 ',
					{
						'flex items-center justify-center': notifications?.length <= 0,
					}
				)}
			>
				{notifications?.length === 0 && <p className="text-center">No notifications</p>}
				{notifications.map((notification: MomentNotification, index: number) => (
					<NotificationItem
						key={index}
						notification={notification}
					/>
				))}
			</div>
		</div>
	);
};

export default Notifications;

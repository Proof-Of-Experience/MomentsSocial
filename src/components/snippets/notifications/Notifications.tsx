import { MomentNotification } from '@/services/notification';

interface NotificationProps {
	notifications: MomentNotification[];
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
const Notifications = ({ notifications }: NotificationProps) => {
	return (
		<div className="bg-white shadow px-5 py-4 w-[300px]">
			<h3 className="font-semibold">Notifications</h3>

			{notifications.map((notification: MomentNotification, index: number) => (
				<div key={index} dangerouslySetInnerHTML={{ __html: notification.render()}}></div>
			))}
		</div>
	);
};

export default Notifications;

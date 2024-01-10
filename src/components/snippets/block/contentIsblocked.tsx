import { useSelector } from 'react-redux';
import { selectAuthUser } from '@/slices/authSlice';
import { getUserDBId, isUserAdmin, liftBan } from '@/services/user/user';
import { toast } from 'react-toastify';

interface LiftBanProps {
	bannedUserId: string;
}

export const ContnetIsBlocked = (props: LiftBanProps) => {
	const authUser = useSelector(selectAuthUser);
	const isAdmin = isUserAdmin(authUser);
	const { bannedUserId } = props;

	const attemptToLiftBan = async () => {
		try {
			await liftBan(bannedUserId, getUserDBId(authUser));

			toast.success('ban has been lifted, reloading...');

			// setTimeout(() => location.reload(), 2000);
		} catch (err: any) {
			toast.dismiss();
			toast.error(err.message);
		}
	};

	return (
		<div className="w-full flex flex-col max-w-7xl mx-auto justify-center items-center py-28">
			<div className="text-4xl text-gray-600 mb-4">Sorry!</div>
			<div className="text-2xl text-gray-600 font-medium mb-6">Content blocked</div>

			{isAdmin && (
				<>
					<div className="text-base mt-2 text-green-800 mb-4">
						As an admin, you can unblock this user.
					</div>

					<div>
						<button
							onClick={attemptToLiftBan}
							className="px-3 py-2 bg-green-100 text-green-700 font-medium rounded-md"
						>
							Unblock?
						</button>
					</div>
				</>
			)}
		</div>
	);
};

// import { DonateIcon } from '@/components/icons';
import { NoSymbolIcon } from '@heroicons/react/20/solid';
// import { DiamonLevel, sendTip } from '@/services/tip';
import { blockPermanently, getUserDBId, isUserAdmin } from '@/services/user/user';
import { selectAuthUser } from '@/slices/authSlice';
import { cn } from '@/utils';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

interface BlockButtonProps {
	userToBeBannedId: string;
	onSuccessBlock?: () => void;
}

const DefaultButtonText = 'Block';
const BlockedText = 'Blocked !';

export const BlockButton = (props: BlockButtonProps) => {
	const { userToBeBannedId, onSuccessBlock } = props;
	const authUser = useSelector(selectAuthUser);
	const [buttonText, setButtonText] = useState<string>(DefaultButtonText);

	const isAdmin = isUserAdmin(authUser);

	const handleClick = async () => {
		try {
			await blockPermanently(getUserDBId(authUser), userToBeBannedId, 'NO REASON GIVEN');

			setButtonText(BlockedText);

			if (onSuccessBlock) onSuccessBlock();
		} catch (err: any) {
			toast.dismiss();
			toast.error(err.message);
		}
	};

	if (!isAdmin) {
		return <></>;
	}

	return (
		<div>
			<button
				onClick={handleClick}
				className={cn(
					'px-3 pl-2 py-1 flex items-center gap-x-2 bg-[#EBFAFF] hover:bg-[#00A1D4] rounded-2xl cursor-pointer group transition-all'
				)}
			>
				<NoSymbolIcon className="h-6 w-6 group-hover:text-white transition-all" />

				<span className="text-sm text-[#47474A] group-hover:text-white transition-all">
					{buttonText}
				</span>
			</button>
		</div>
	);
};

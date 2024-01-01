import { cn } from '@/utils';
import React from 'react';

interface IUserAvatar {
	imageKey: string;
	onClick?: () => void;
	className?: string;
}

const UserAvatar = (props: IUserAvatar) => {
	const { imageKey, onClick, className } = props;

	const avatar = imageKey
		? `https://diamondapp.com/api/v0/get-single-profile-picture/${imageKey}`
		: 'https://diamondapp.com/assets/img/default-profile-pic.png';

	// console.log('UserAvatar props', props);
	// console.log('UserAvatar Image', avatar);

	return (
		<div
			className={cn(
				'w-10 h-10 bg-center bg-cover bg-no-repeat bg-slate-200 border-slate-100 cursor-pointer rounded-full overflow-hidden',
				className
			)}
			style={{
				backgroundImage: `url(${avatar})`,
			}}
			onClick={() => {
				if (onClick) onClick();
			}}
		></div>
	);
};

export default UserAvatar;

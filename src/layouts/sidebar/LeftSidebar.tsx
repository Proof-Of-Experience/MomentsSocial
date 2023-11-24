import React, { useEffect, useState } from 'react';
import {
	HomeIcon,
	BoltIcon,
	FireIcon,
	ArrowPathRoundedSquareIcon,
	ArrowUpTrayIcon,
} from '@heroicons/react/24/outline';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { selectAuthUser } from '@/slices/authSlice';

const LeftSidebar = ({ collapseSidebar }: { collapseSidebar: boolean }) => {
	const router = useRouter();
	const authUser = useSelector(selectAuthUser);
	const [activeItem, setActiveItem] = useState('/');

	useEffect(() => {
		setActiveItem(router.pathname);
	}, [router.pathname]);

	const onClickItem = (url: string) => {
		setActiveItem(url);
		router.push(url);
	};

	const menuItems = [
		{
			title: 'Home',
			label: 'Home',
			icon: (
				<HomeIcon
					className={`h-[20px] w-[20px] group-hover:text-[#00A1D4] ${
						activeItem === '/' ? 'bg-[#F0F9FC]  text-[#00A1D4]' : 'text-[#1C1B1F]'
					}`}
				/>
			),
			url: '/',
			onclick: () => onClickItem('/'),
			showItem: true,
		},
		{
			title: 'Moments',
			label: 'Moments',
			icon: (
				<BoltIcon
					className={`h-[20px] w-[20px] group-hover:text-[#00A1D4] ${
						activeItem === '/moments'
							? 'bg-[#F0F9FC]  text-[#00A1D4]'
							: 'text-[#1C1B1F]'
					}`}
				/>
			),
			url: '/moments',
			onclick: () => onClickItem('/moments'),
			showItem: true,
		},
		{
			title: 'Explore',
			label: 'Subscriptions',
			icon: (
				<ArrowPathRoundedSquareIcon
					className={`h-[20px] w-[20px] group-hover:text-[#00A1D4] ${
						activeItem === '/explore'
							? 'bg-[#F0F9FC]  text-[#00A1D4]'
							: 'text-[#1C1B1F]'
					}`}
				/>
			),
			url: '/explore',
			onclick: () => onClickItem('/explore'),
			showItem: true,
		},
		{
			title: 'Trending',
			label: 'Trending',
			icon: (
				<FireIcon
					className={`h-[20px] w-[20px] group-hover:text-[#00A1D4] ${
						activeItem === '/trending'
							? 'bg-[#F0F9FC]  text-[#00A1D4]'
							: 'text-[#1C1B1F]'
					}`}
				/>
			),
			url: '/trending',
			onclick: () => onClickItem('/trending'),
			showItem: true,
		},
		{
			title: 'Upload',
			label: 'Upload',
			icon: (
				<ArrowUpTrayIcon
					className={`h-[20px] w-[20px] group-hover:text-[#00A1D4] ${
						activeItem === '/upload' ? 'bg-[#F0F9FC]  text-[#00A1D4]' : 'text-[#1C1B1F]'
					}`}
				/>
			),
			url: '/upload',
			onclick: () => onClickItem('/upload'),
			showItem: authUser,
		},
	];

	return (
		<div
			className={`fixed ${
				collapseSidebar ? 'w-[110px]' : 'w-[261px]'
			} px-4 pt-4 border-r border-[#D7D7D7] flex flex-col bg-white h-full`}
		>
			<>
				{menuItems?.length > 0 &&
					menuItems.map((item, index) => {
						if (item?.showItem) {
							return (
								<button
									key={index}
									className={`group mb-[16px] hover:bg-[#F0F9FC] hover:text-[#00A1D4] transition-all flex items-center ${
										collapseSidebar ? 'flex-col' : 'flex-row'
									} rounded-[8px] p-[12px] focus:bg-[#F0F9FC] ${
										activeItem === item?.url
											? 'bg-[#F0F9FC] text-[#00A1D4]'
											: 'text-[#1C1B1F]'
									}`}
									title={item?.title}
									onClick={item?.onclick}
								>
									{item?.icon}
									<span
										className={`group-hover:text-[#00A1D4] ${
											collapseSidebar
												? 'ml-0 mt-1.5 text-[10px]'
												: 'ml-2 text-[14px]'
										} ${
											activeItem === item?.url
												? 'bg-[#F0F9FC]  text-[#00A1D4]'
												: 'text-[#1C1B1F]'
										}`}
									>
										{item?.label}
									</span>
								</button>
							);
						}
					})}
			</>
		</div>
	);
};

export default LeftSidebar;

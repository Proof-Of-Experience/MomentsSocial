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
import { useSidebar } from '@/utils/hooks';
import { cn } from '@/utils';

const LeftSidebar = () => {
	const router = useRouter();
	const authUser = useSelector(selectAuthUser);
	const { collapseSidebar, setCollapseSidebar, windowSize } = useSidebar();
	const { width: windowWidth } = windowSize;

	const [activeItem, setActiveItem] = useState('/');

	// console.log('windowWidth', windowWidth);

	// useEffect(() => {
	// 	if (windowWidth < 1024) {
	// 		setCollapseSidebar(true);
	// 	}
	// }, [windowWidth]);

	useEffect(() => {
		setActiveItem(router.pathname);
	}, [router.pathname]);

	const onClickItem = async (url: string) => {
		setActiveItem(url);
		await router.push(url);
		// DOCU:: Onclick menu item collapsing sidebar on mobile
		if (windowWidth < 1024) {
			setCollapseSidebar(true);
		}
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
			className={cn(
				'fixed lg:left-0 pt-4 border-r border-[#D7D7D7] flex flex-col bg-white h-full  ease-in-out duration-500 transition-all z-10',
				{
					'px-7 lg:px-4 w-[261px] lg:w-[110px] -left-[261px]': collapseSidebar,
					'px-7 left-0 w-[261px]': !collapseSidebar,
				}
			)}
		>
			<>
				{menuItems?.length > 0 &&
					menuItems.map((item, index) => {
						if (item?.showItem) {
							return (
								<button
									key={index}
									className={cn(
										'group mb-[16px] hover:bg-[#F0F9FC] hover:text-[#00A1D4] rounded-lg active:rounded-lg p-[12px] focus:bg-[#F0F9FC] ease-in-out duration-500 transition-all flex items-center',
										{
											'flex-row lg:flex-col': collapseSidebar,
											'flex-row': !collapseSidebar,
											'bg-[#F0F9FC] text-[#00A1D4]': activeItem === item?.url,
											'text-[#1C1B1F]': activeItem !== item?.url,
										}
									)}
									title={item?.title}
									onClick={item?.onclick}
								>
									{item?.icon}
									<span
										className={cn(
											'group-hover:text-[#00A1D4] ease-in-out duration-500 transition-all',
											{
												'ml-0 mt-1.5 text-[10px]': collapseSidebar,
												'ml-2 text-[14px]': !collapseSidebar,
												'bg-[#F0F9FC]  text-[#00A1D4]':
													activeItem === item?.url,
												'text-[#1C1B1F]': activeItem !== item?.url,
											}
										)}
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

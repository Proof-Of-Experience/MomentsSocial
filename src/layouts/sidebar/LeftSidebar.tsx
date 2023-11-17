import React, { useEffect, useState } from 'react';
import { HomeIcon, BoltIcon, FireIcon, ArrowPathRoundedSquareIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { selectAuthUser } from '@/slices/authSlice';

const LeftSidebar = () => {
	const router = useRouter();
	const authUser = useSelector(selectAuthUser);
	const [isSticky, setSticky] = useState(false);
	const [activeItem, setActiveItem] = useState('/');

	useEffect(() => {
		window.addEventListener('scroll', handleScroll);
		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	}, []);

	useEffect(() => {
		setActiveItem(router.pathname);
	}, [router.pathname]);

	const handleScroll = () => {
		if (window.scrollY >= 30) {
			setSticky(true);
		} else {
			setSticky(false);
		}
	};

	const onClickItem = (url: string) => {
		setActiveItem(url);
		router.push(url);
	};

	return (
		<div className={`${isSticky ? 'mt-[80px]' : ''} fixed w-[207px] flex flex-col pt-[16px] bg-white h-full`}>
			<button
				className={`group mb-[16px] hover:bg-[#F0F9FC] hover:text-[#00A1D4] transition-all flex flex-row rounded-[8px] p-[12px] focus:bg-[#F0F9FC] ${activeItem === '/' ? 'bg-[#F0F9FC] text-[#00A1D4]' : 'text-[#1C1B1F]'}`}
				title="Home"
				onClick={() => onClickItem('/')}>
				<HomeIcon className={`h-[20px] w-[20px] group-hover:text-[#00A1D4] ${activeItem === '/' ? 'bg-[#F0F9FC]  text-[#00A1D4]' : 'text-[#1C1B1F]'}`} />
				<p className={`group-hover:text-[#00A1D4] font-[14px] ml-1 ${activeItem === '/' ? 'bg-[#F0F9FC]  text-[#00A1D4]' : 'text-[#1C1B1F]'}`}>Home</p>
			</button>

			<button
				className={`group mb-[16px] hover:bg-[#F0F9FC] transition-all flex flex-row rounded-[8px] p-[12px] focus:bg-[#F0F9FC] ${activeItem === '/moments' ? 'bg-[#F0F9FC]' : ''}`}
				title="Moments"
				onClick={() => onClickItem('/moments')}>
				<BoltIcon className={`h-[20px] w-[20px] group-hover:text-[#00A1D4] ${activeItem === '/moments' ? 'bg-[#F0F9FC]  text-[#00A1D4]' : 'text-[#1C1B1F]'}`} />
				<p className={`group-hover:text-[#00A1D4] font-[14px] ml-1 ${activeItem === '/moments' ? 'bg-[#F0F9FC]  text-[#00A1D4]' : 'text-[#1C1B1F]'}`}>Shorts</p>
			</button>

			<button
				className={`group mb-[16px] hover:bg-[#F0F9FC] transition-all flex flex-row rounded-[8px] p-[12px] focus:bg-[#F0F9FC] ${activeItem === '/explore' ? 'bg-[#F0F9FC]' : ''}`}
				title="Explore"
				onClick={() => onClickItem('/')}>
				<ArrowPathRoundedSquareIcon className={`h-[20px] w-[20px] group-hover:text-[#00A1D4] ${activeItem === '/explore' ? 'bg-[#F0F9FC]  text-[#00A1D4]' : 'text-[#1C1B1F]'}`} />
				<p className={`group-hover:text-[#00A1D4] font-[14px] ml-1 ${activeItem === '/explore' ? 'bg-[#F0F9FC]  text-[#00A1D4]' : 'text-[#1C1B1F]'}`}>Subscriptions</p>
			</button>

			<button
				className={`group mb-[16px] hover:bg-[#F0F9FC] transition-all flex flex-row rounded-[8px] p-[12px] focus:bg-[#F0F9FC] ${activeItem === '/trending' ? 'bg-[#F0F9FC]' : ''}`}
				title="Trending"
				onClick={() => onClickItem('/')}>
				<FireIcon className={`h-[20px] w-[20px] group-hover:text-[#00A1D4] ${activeItem === '/trending' ? 'bg-[#F0F9FC]  text-[#00A1D4]' : 'text-[#1C1B1F]'}`} />
				<p className={`group-hover:text-[#00A1D4] font-[14px] ml-1 ${activeItem === '/trending' ? 'bg-[#F0F9FC]  text-[#00A1D4]' : 'text-[#1C1B1F]'}`}>Trending</p>
			</button>

			{authUser && (
				<button
					className={`group mb-[16px] hover:bg-[#F0F9FC] transition-all flex flex-row rounded-[8px] p-[12px] focus:bg-[#F0F9FC] ${activeItem === '/upload' ? 'bg-[#F0F9FC]' : ''}`}
					title="Upload"
					onClick={() => onClickItem('/upload')}>
					<ArrowUpTrayIcon className={`h-[20px] w-[20px] group-hover:text-[#00A1D4] ${activeItem === '/upload' ? 'bg-[#F0F9FC]  text-[#00A1D4]' : 'text-[#1C1B1F]'}`} />
				</button>
			)}
		</div>
	);
}

export default LeftSidebar
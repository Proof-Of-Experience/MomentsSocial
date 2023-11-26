import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { getSearchProfileData } from '@/pages/api/profile';
import AuthButtons from '@/features/header/auth-buttons';
import Search from '@/features/header/search';
import { BellIcon } from '@heroicons/react/24/outline';
import { useSelector } from 'react-redux';
import { selectAuthUser } from '@/slices/authSlice';
import OutsideClickHandler from 'react-outside-click-handler';
import Notifications from '@/components/snippets/notifications';
import { useRouter } from 'next/router';
import { Bars3Icon, MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import { useSidebar } from '@/utils/hooks';

const Header = () => {
	const router = useRouter();
	const authUser = useSelector(selectAuthUser);
	const { collapseSidebar, setCollapseSidebar, windowSize } = useSidebar();
	const { width: windowWidth } = windowSize;
	const isSmallDevice = windowWidth <= 575;
	const searchInputRef = useRef<HTMLInputElement>(null);

	const [selected, setSelected] = useState<any>([]);
	const [searchResult, setSearchResult] = useState<any>([]);
	const [query, setQuery] = useState<string>('');
	const [loadedQuery, setLoadedQuery] = useState<boolean>(false);
	const [notificationCount, setNotificationCount] = useState<number>(0);
	const [notificationData, setNotificationData] = useState<any>([]);
	const [showNotification, setShowNotification] = useState<boolean>(false);
	const [showSearchBar, setShowSearchBar] = useState(!isSmallDevice ? true : false);

	useEffect(() => {
		if (authUser) {
			fetchNotificationCount();
			fetchNotifications();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [authUser]);

	const onChangeSearch = async (e: ChangeEvent<HTMLInputElement>) => {
		setLoadedQuery(true);
		setQuery(e.target.value);
		const data = {
			UsernamePrefix: e.target.value,
		};

		const result = await getSearchProfileData(data);

		const filteredPeople =
			query === ''
				? result?.ProfilesFound
				: result?.ProfilesFound.filter((person: any) =>
						person.Username.toLowerCase()
							.replace(/\s+/g, '')
							.includes(query.toLowerCase().replace(/\s+/g, ''))
				  );
		setLoadedQuery(false);
		setSearchResult(filteredPeople);
	};

	const fetchNotificationCount = async () => {
		const { getUnreadNotificationsCount } = await import('deso-protocol');
		const params = {
			PublicKeyBase58Check: authUser?.PublicKeyBase58Check,
		};
		const response: any = await getUnreadNotificationsCount(params);
		setNotificationCount(response?.NotificationsCount);
	};

	const fetchNotifications = async () => {
		const { getNotifications } = await import('deso-protocol');
		const params = {
			FetchStartIndex: -1,
			FilteredOutNotificationCategories: {},
			NumToFetch: 50,
			PublicKeyBase58Check: authUser?.PublicKeyBase58Check,
		};
		const response: any = await getNotifications(params);
		setNotificationData(response);
	};

	const onClickNotification = async () => {
		setShowNotification(!showNotification);
		setNotificationCount(0);
		const { setNotificationMetadata, identity } = await import('deso-protocol');
		const JWT = await identity.jwt();
		const params = {
			PublicKeyBase58Check: authUser?.PublicKeyBase58Check,
			UnreadNotifications: 0,
			LastSeenIndex: notificationData?.LastSeenIndex,
			LastUnreadNotificationIndex: notificationData?.LastSeenIndex,
			JWT,
		};
		await setNotificationMetadata(params);
	};

	const CustomBellIcon = ({ onClick }: any) => (
		<div onClick={onClick}>
			<BellIcon
				className="h-7 w-7"
				aria-hidden="true"
				role="button"
			/>
		</div>
	);

	return (
		<header className="fixed flex items-center bg-white top-0 left-0 right-0 z-10 px-7 py-2 border-b border-[#D7D7D7] leading-[30px] h-20 w-full">
			<div className="flex items-center flex-wrap justify-left justify-between w-full">
				<div className="flex flex-wrap items-center justify-center">
					<div
						className="hover:bg-gray-100 rounded-full p-2 mr-3 -ml-3 cursor-pointer transition-all"
						onClick={() => setCollapseSidebar(!collapseSidebar)}
					>
						<Bars3Icon className="h-7 w-7" />
					</div>
					<Link
						href="/"
						className="flex rounded-md"
					>
						{/* eslint-disable-next-line @next/next/no-img-element */}
						<img
							className="flex h-10 lg:h-14 cursor-pointer"
							src={windowWidth >= 1024 ? '/logo-moment.svg' : '/logo-mobile.svg'}
							alt="dtube"
							onClick={() => router.push('/')}
						/>
					</Link>
				</div>
				{(showSearchBar || !isSmallDevice) && (
					<Search
						loadedQuery={loadedQuery}
						searchResult={searchResult}
						selected={selected}
						onChangeSelect={setSelected}
						onChangeSearch={onChangeSearch}
						query={query}
						setQuery={setQuery}
						inputRef={searchInputRef}
					/>
				)}

				<div className="flex items-center">
					{isSmallDevice && (
						<span
							className="flex lg:hidden items-center justify-center w-11 h-11 hover:bg-gray-100 rounded-full p-2 cursor-pointer transition-all"
							onClick={() => setShowSearchBar(!showSearchBar)}
						>
							<MagnifyingGlassIcon className="h-7 w-7" />
						</span>
					)}
					{authUser && (
						<div className="relative mr-4">
							{notificationCount > 0 && (
								<span className="absolute -top-2 bg-red-600 inline-block rounded-full w-4 mx-auto text-center leading-5 h-5 text-white z-10 text-xs">
									{notificationCount}
								</span>
							)}

							<CustomBellIcon onClick={onClickNotification} />

							{showNotification && (
								<OutsideClickHandler
									onOutsideClick={() => {
										setShowNotification(false);
									}}
								>
									<div className="absolute right-2 top-[56px]">
										<Notifications
											notifications={notificationData?.Notifications}
										/>
									</div>
								</OutsideClickHandler>
							)}
						</div>
					)}

					<AuthButtons />
				</div>
			</div>
		</header>
	);
};

export default Header;

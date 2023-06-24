import React, { ChangeEvent, useEffect, useState } from 'react'
import Link from 'next/link'
import { getSearchProfileData } from '@/pages/api/profile'
import AuthButtons from '@/features/header/auth-buttons'
import Search from '@/features/header/search'
import { BellIcon } from '@heroicons/react/24/outline'
import { useSelector } from 'react-redux'
import { selectAuthUser } from '@/slices/authSlice'
import OutsideClickHandler from 'react-outside-click-handler'
import Notifications from '@/components/snippets/notifications'

const Header = () => {
	const authUser = useSelector(selectAuthUser)
	const [selected, setSelected] = useState<any>([])
	const [searchResult, setSearchResult] = useState<any>([])
	const [query, setQuery] = useState<string>("")
	const [loadedQuery, setLoadedQuery] = useState<boolean>(false)
	const [isSticky, setSticky] = useState<boolean>(false)
	const [notificationCount, setNotificationCount] = useState<number>(0)
	const [notificationData, setNotificationData] = useState<any>([])
	const [showNotification, setShowNotification] = useState<boolean>(false)

	useEffect(() => {
		if (authUser) {
			fetchNotificationCount()
			fetchNotifications()
		}
	}, [authUser])

	useEffect(() => {
		window.addEventListener('scroll', () => {
			if (window.scrollY >= 30) {
				setSticky(true);
			} else {
				setSticky(false);
			}
		});
	}, []);

	const onChangeSearch = async (e: ChangeEvent<HTMLInputElement>) => {
		setLoadedQuery(true)
		setQuery(e.target.value)
		const data = {
			UsernamePrefix: e.target.value
		}

		const result = await getSearchProfileData(data);

		const filteredPeople =
			query === ""
				? result?.ProfilesFound
				: result?.ProfilesFound.filter((person: any) =>
					person.Username
						.toLowerCase()
						.replace(/\s+/g, "")
						.includes(query.toLowerCase().replace(/\s+/g, ""))
				);
		setLoadedQuery(false)
		setSearchResult(filteredPeople)

	}

	const fetchNotificationCount = async () => {
		const { getUnreadNotificationsCount } = await import('deso-protocol')
		const params = {
			PublicKeyBase58Check: authUser?.PublicKeyBase58Check
		}
		const response: any = await getUnreadNotificationsCount(params)
		setNotificationCount(response?.NotificationsCount)
	}

	const fetchNotifications = async () => {
		const { getNotifications } = await import('deso-protocol')
		const params = {
			FetchStartIndex: -1,
			FilteredOutNotificationCategories: {},
			NumToFetch: 50,
			PublicKeyBase58Check: authUser?.PublicKeyBase58Check
		}
		const response: any = await getNotifications(params)
		setNotificationData(response)
	}

	const onClickNotification = async () => {
		setShowNotification(!showNotification)
		setNotificationCount(0)
		const { setNotificationMetadata, identity } = await import('deso-protocol')
		const JWT = await identity.jwt()
		const params = {
			PublicKeyBase58Check: authUser?.PublicKeyBase58Check,
			UnreadNotifications: 0,
			LastSeenIndex: notificationData?.LastSeenIndex,
			LastUnreadNotificationIndex: notificationData?.LastSeenIndex,
			JWT,
		}
		await setNotificationMetadata(params)
	}

	const CustomBellIcon = ({ onClick }: any) => (
		<div onClick={onClick}>
			<BellIcon className="h-7 w-7" aria-hidden="true" role="button" />
		</div>
	)

	return (
		<header className={`${isSticky ? 'fixed' : 'relative'} bg-white top-0 left-0 right-0 z-10 p-2 lg:px-5 shadow h-[72px] leading-[30px]`}>
			<div className="flex items-start flex-wrap m-1 justify-left md:justify-between">

				<div className="flex flex-wrap">
					<Link href="/" className="flex rounded-md">
						<h2 className="text-4xl">Moment Social</h2>
						{/* <img
								className="flex w-[150px] h-[50px]"
								src="/DTube_Black.svg"
								alt="dtube"
								onClick={() => router.push('/')}
							/> */}
					</Link>
				</div>

				<Search
					loadedQuery={loadedQuery}
					searchResult={searchResult}
					selected={selected}
					onChangeSelect={setSelected}
					onChangeSearch={onChangeSearch}
					query={query}
					setQuery={setQuery}
				/>

				<div className="flex items-center">
					{
						authUser &&
						<div className="relative mr-4">
							{
								notificationCount > 0 &&
								<span className="absolute -top-2 bg-red-600 inline-block rounded-full w-4 mx-auto text-center leading-5 h-5 text-white z-10 text-xs">
									{notificationCount}
								</span>
							}

							<CustomBellIcon
								onClick={onClickNotification}
							/>


							{showNotification && (
								<OutsideClickHandler
									onOutsideClick={() => {
										setShowNotification(false)
									}}
								>
									<div className="absolute right-2 top-[56px]">
										<Notifications notifications={notificationData?.Notifications} />
									</div>
								</OutsideClickHandler>
							)}
						</div>
					}

					<AuthButtons />
				</div>

			</div>
		</header>
	)
}

export default Header
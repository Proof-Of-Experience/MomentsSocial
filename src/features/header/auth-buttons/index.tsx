import React, { Fragment, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PrimaryButton } from '@/components/core/button';
import { selectAuthUser, setAuthUser } from '@/slices/authSlice';
import { Menu, Transition } from '@headlessui/react';
import {
	ArrowRightOnRectangleIcon,
	UserPlusIcon,
	ChevronDownIcon,
	UserCircleIcon,
} from '@heroicons/react/20/solid';
import { useRouter } from 'next/router';
import { ApiDataType, apiService } from '@/utils/request';
import { userLogin } from '@/services/user/user';

const AuthButtons = () => {
	const router = useRouter();
	const dispatch = useDispatch();
	const authUser = useSelector(selectAuthUser);

	const getUserInfo = async () => {
		try {
			const { getSingleProfile } = await import('deso-protocol');
			const params = {
				PublicKeyBase58Check: authUser?.publicKeyBase58Check,
			};
			const userData = await getSingleProfile(params);

			dispatch(setAuthUser({ ...authUser, ...userData }));
		} catch (error) {
			console.error('profile error', error);
		}
	};

	useEffect(() => {
		if (authUser) {
			getUserInfo();
		}
	}, []);

	const getUserInfoFromUtils = async (userId: number) => {
		const apiUrl = `/api/user`;
		const data = {
			userId,
		};
		const apiData: ApiDataType = {
			method: 'post',
			data,
			url: apiUrl,
			customUrl: process.env.NEXT_PUBLIC_MOMENTS_UTIL_URL,
		};

		try {
			await apiService(apiData, (res: any, err: any) => {
				if (err) return err.response;
			});
		} catch (error: any) {
			console.error('error', error.response);
		}
	};

	const onClickLogin = async () => {
		const user = await userLogin()

		dispatch(setAuthUser(user));
	};

	const onClickSignUp = async () => {
		const { identity } = await import('deso-protocol');
		await identity.login();
	};

	const onClickMyProfile = () => {
		if (authUser) {
			router.push(`/user/${authUser?.ProfileEntryResponse?.Username}`);
		} else {
			location.reload();
		}
	};

	const onClicSettings = () => {
		if (authUser) {
			router.push(`/settings`);
		} else {
			location.reload();
		}
	};

	const onClickLogout = async () => {
		const { identity } = await import('deso-protocol');
		await identity.logout();
		dispatch(setAuthUser(null));
	};

	return (
		<div className="flex justify-end items-center">
			{authUser ? (
				<Menu
					as="div"
					className="relative inline-block text-left"
				>
					<Menu.Button className="relative flex w-full justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
						{authUser?.PublicKeyBase58Check ? (
							<img
								src={`https://node.deso.org/api/v0/get-single-profile-picture/${authUser?.PublicKeyBase58Check}`}
								className="w-14 h-14 rounded-full border border-slate-200"
								alt="Avatar"
							/>
						) : (
							<UserCircleIcon
								className="h-12 w-12 text-[#00A1D4]"
								aria-hidden="true"
							/>
						)}

						<ChevronDownIcon
							className="absolute -right-2.5 bottom-0 ml-2 h-5 w-5 text-blue-400 hover:text-blue-200 bg-white rounded-full shadow"
							aria-hidden="true"
						/>
					</Menu.Button>

					<Transition
						as={Fragment}
						enter="transition ease-out duration-100"
						enterFrom="transform opacity-0 scale-95"
						enterTo="transform opacity-100 scale-100"
						leave="transition ease-in duration-75"
						leaveFrom="transform opacity-100 scale-100"
						leaveTo="transform opacity-0 scale-95"
					>
						<Menu.Items className="absolute right-0 mt-[10px] w-56 origin-top-right divide-y bg-white divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
							<Menu.Item>
								{({ active }) => (
									<button
										onClick={onClickMyProfile}
										className={`${
											active ? 'bg-blue-500 text-white' : 'text-gray-900'
										} group flex w-full items-center px-3 py-2 text-sm`}
									>
										My Profile
									</button>
								)}
							</Menu.Item>
							<Menu.Item>
								{({ active }) => (
									<button
										onClick={onClicSettings}
										className={`${
											active ? 'bg-blue-500 text-white' : 'text-gray-900'
										} group flex w-full items-center px-3 py-2 text-sm`}
									>
										Settings
									</button>
								)}
							</Menu.Item>
							<Menu.Item>
								{({ active }) => (
									<button
										onClick={onClickLogout}
										className={`${
											active ? 'bg-blue-500 text-white' : 'text-gray-900'
										} group flex w-full items-center px-3 py-2 text-sm`}
									>
										Logout
									</button>
								)}
							</Menu.Item>
						</Menu.Items>
					</Transition>
				</Menu>
			) : (
				<div className="flex items-center">
					<span
						onClick={onClickLogin}
						className="bg-transparent hover:bg-gray-100 hover:lg:bg-transparent lg:text-blue-500  hover:text-blue-400 hover:underline font-inter font-semibold rounded-full lg:rounded-none cursor-pointer transition-all"
					>
						<span className="hidden lg:inline">Login</span>
						<span className="flex lg:hidden items-center justify-center w-11 h-11 p-2">
							<ArrowRightOnRectangleIcon className="h-7 w-7" />
						</span>
					</span>
					<PrimaryButton
						text="Signup"
						className="hidden lg:inline px-5 ml-5"
						onClick={onClickSignUp}
					/>
					<span
						className="flex lg:hidden items-center justify-center w-11 h-11 hover:bg-gray-100 rounded-full p-2 -mr-2 cursor-pointer transition-all"
						onClick={onClickSignUp}
					>
						<UserPlusIcon className="h-7 w-7" />
					</span>
				</div>
			)}
		</div>
	);
};

export default AuthButtons;

import React, { Fragment, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { PrimaryButton } from '@/components/core/button'
import { selectAuthUser, setAuthUser } from '@/slices/authSlice';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon, UserCircleIcon } from '@heroicons/react/20/solid'
import { useRouter } from 'next/router';

const AuthButtons = () => {
	const router = useRouter()
	const dispatch = useDispatch();
	const authUser = useSelector(selectAuthUser);

	const getUserInfo = async () => {
		try {
			const { getSingleProfile } = await import('deso-protocol')
			const params = {
				PublicKeyBase58Check: authUser?.publicKeyBase58Check,
			}
			const userData = await getSingleProfile(params)

			dispatch(setAuthUser({ ...authUser, ...userData }));
		} catch (error) {
			console.error('profile error', error);
		}
	}

	console.log('authUser', authUser);

	useEffect(() => {
		if (authUser) {
			getUserInfo()
		}
	}, [])

	return (
		<div className="flex justify-end items-center">
			{
				authUser ?
					<Menu as="div" className="relative inline-block text-left">

						<Menu.Button className="flex w-full justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">

							{
								authUser?.PublicKeyBase58Check ?
									<img
										src={`https://node.deso.org/api/v0/get-single-profile-picture/${authUser?.PublicKeyBase58Check}`}
										className="w-10 h-10 rounded-full"
										alt="Avatar" /> :
									<UserCircleIcon
										className="h-12 w-12"
										aria-hidden="true"
									/>
							}

							<ChevronDownIcon
								className="ml-2 -mr-1 h-5 w-5 text-blue-400 hover:text-blue-200"
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
											onClick={() => {
												if (authUser) {
													router.push(`/user/${authUser?.ProfileEntryResponse?.Username}`)
												} else {
													location.reload()
												}
											}}
											className={`${active ? 'bg-blue-500 text-white' : 'text-gray-900'
												} group flex w-full items-center px-3 py-2 text-sm`}
										>
											My Profile
										</button>
									)}
								</Menu.Item>
								<Menu.Item>
									{({ active }) => (
										<button
											onClick={async () => {
												const { identity } = (await import('deso-protocol'))
												await identity.logout()
												dispatch(setAuthUser({}));
											}}
											className={`${active ? 'bg-blue-500 text-white' : 'text-gray-900'
												} group flex w-full items-center px-3 py-2 text-sm`}
										>
											Logout
										</button>
									)}
								</Menu.Item>
							</Menu.Items>
						</Transition>
					</Menu> :
					<div className="flex items-center">
						<PrimaryButton
							text='Login'
							onClick={async () => {
								const { identity } = await import('deso-protocol')
								const loggedInInfo = await identity.login()
								dispatch(setAuthUser(loggedInInfo))
							}}
						/>
						<PrimaryButton
							text='Signup'
							className="ml-3"
						/>
					</div>
			}
		</div>
	)
}

export default AuthButtons
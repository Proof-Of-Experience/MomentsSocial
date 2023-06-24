import { selectAuthUser } from '@/slices/authSlice'
import React, { ChangeEvent, Fragment, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { ArrowUpTrayIcon, CheckBadgeIcon, PencilIcon } from '@heroicons/react/20/solid'
import { EditProfileProps } from '@/model/profile'
import { toast } from 'react-toastify'
import { Dialog, Tab, Transition } from '@headlessui/react'
import { PrimaryInput } from '@/components/core/input/Input'
import { PrimaryTextArea } from '@/components/core/textarea/Textarea'
import { desoPrice, nanosToUSD } from '@/utils'

const Info = ({ userDetails, username, setActiveTab }: any) => {
	const authUser = useSelector(selectAuthUser)
	const [exchangeData, setExchangeData] = useState<any>({})
	const [showEditModal, setShowEditModal] = useState<boolean>(false)
	const [editProfileData, setEditProfileData] = useState<EditProfileProps>({
		userName: userDetails?.Profile?.Username,
		description: userDetails?.Profile?.Description,
		updatedPhoto: '',
		reward: (userDetails?.Profile?.CoinEntry?.CreatorBasisPoints) / 100,
	})

	useEffect(() => {
		if (setActiveTab) {
			setActiveTab(0);
		}

		fetchExchangeRate()
	}, [])

	const fetchExchangeRate = async () => {
		const { getExchangeRates } = await import('deso-protocol')

		const response = await getExchangeRates()
		setExchangeData(response)
	}

	const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
		const file: any = event.target.files?.[0]
		if (file) {
			const { uploadImage, identity } = await import('deso-protocol')
			const JWT = await identity.jwt()
			const params = {
				UserPublicKeyBase58Check: userDetails?.Profile?.PublicKeyBase58Check,
				JWT,
				file
			}
			const response = await uploadImage(params)
			setEditProfileData(prevState => ({
				...prevState,
				updatedPhoto: response?.ImageURL
			}))
		}
	}

	const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		setEditProfileData(prevState => ({
			...prevState,
			[name]: value
		}))
	}

	const updateProfileInfo = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		try {
			const { identity, updateProfile, } = await import('deso-protocol')

			const profileParams = {
				ExtraData: {
					LargeProfilePicURL: userDetails?.Profile?.ExtraData?.LargeProfilePicURL
				},
				IsHidden: false,
				NewStakeMultipleBasisPoints: 12500,
				NewCreatorBasisPoints: editProfileData.reward,
				NewDescription: editProfileData.description,
				NewProfilePic: editProfileData.updatedPhoto,
				NewUsername: editProfileData.userName,
				ProfilePublicKeyBase58Check: userDetails?.Profile?.PublicKeyBase58Check,
				UpdaterPublicKeyBase58Check: userDetails?.Profile?.PublicKeyBase58Check,
			}

			const profileResponse: any = await updateProfile(profileParams)

			const result = await identity.submitTx(profileResponse?.TransactionHex)

			setShowEditModal(false)
			toast.success('Profile updated successfully')
		} catch (error: any) {
			toast.error(error?.message || 'Something went wrong!')
		}
	}

	const onclickFollow = async () => {

		const { updateFollowingStatus, } = await import('deso-protocol')

		try {
			const params = {
				FollowedPublicKeyBase58Check: userDetails?.Profile?.PublicKeyBase58Check,
				FollowerPublicKeyBase58Check: authUser?.Profile?.PublicKeyBase58Check,
				IsUnfollow: false,
				MinFeeRateNanosPerKB: 0,
			}

			const response = await updateFollowingStatus(params)

		} catch (error: any) {
			toast.error(error?.message || 'Something went wrong!')
		}
	}

	return (
		<div className="flex flex-wrap justify-center">
			<div className="w-full lg:w-4/12 px-4 lg:order-1">
				<div className="flex py-4 lg:pt-4 pt-8">
					<div className="mr-4 p-3 text-center cursor-pointer" onClick={() => setActiveTab(0)}>
						<span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">22</span>
						<span className="text-sm text-blueGray-400">Videos</span>
					</div>
					<div className="mr-4 p-3 text-center cursor-pointer" onClick={() => setActiveTab(1)}>
						<span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">10</span>
						<span className="text-sm text-blueGray-400">Moments</span>
					</div>
				</div>
			</div>

			<div className="w-full lg:w-3/12 px-4 lg:order-2 flex justify-center">
				<div className="relative -mt-[60px] text-center">
					<img alt="..."
						src={userDetails?.Avatar}
						className=" shadow-xl rounded-full h-[120px] w-[120px] align-middle border-none mx-auto" />

					<h3 className="flex justify-center items-center text-2xl font-semibold text-center mt-3">
						<span>{userDetails?.Profile?.Username}</span>
						{userDetails.Profile?.IsVerified && <CheckBadgeIcon className="ml-1 w-5 h-5 text-blue-500" />}
					</h3>

					<div className="flex justify-center">
						<p className="mr-3 font-medium text-sm">
							<span className="font-semibold">{userDetails?.Followers} </span>Followers
						</p>
						<p className="mr-3 font-medium text-sm">
							<span className="font-semibold">{userDetails?.Following} </span>Following
						</p>
						<p className="mr-3 font-medium text-sm">
							<span className="font-semibold">{((userDetails?.Profile?.CoinEntry?.CreatorBasisPoints) / 100) || 0}% </span>FR
						</p>
					</div>
				</div>
			</div>

			<div className="flex justify-end items-center lg:text-right lg:order-3 lg:self-center lg:w-4/12 px-4">
				{
					authUser?.ProfileEntryResponse?.Username === username ?

						<div>
							<div className="flex">
								<button
									className="flex items-center border-2 px-4 py-1 text-sm rounded-md mr-3"
									onClick={() => setShowEditModal(true)}>
									<PencilIcon className="w-4 h-4" />
									<span className="ml-3">Edit</span>
								</button>

								<a
									target="_blank"
									href={`https://wallet.deso.com/?user=${username}&tab=activity`}
									className="f bg-blue-500 text-white px-4 py-1 text-sm rounded-md">
									<span className="ml-3">View Activity</span>
								</a>
							</div>

							<div className="text-right mt-3">
								<p>
									<span>DESO Price</span>
									<span className="font-bold"> ≈ {desoPrice(exchangeData?.USDCentsPerDeSoCoinbase)}</span>
								</p>
								<p>
									<span>Your DESO </span>
									<span className="font-bold">
										{nanosToUSD(authUser?.Profile?.DESOBalanceNanos, 2)}
									</span>
								</p>
							</div>
						</div>
						:
						<button
							className="bg-blue-500 active:bg-blue-600 text-white font-bold hover:shadow-md shadow text-sm px-4 py-3 rounded outline-none ease-linear transition-all duration-150"
							onClick={onclickFollow}>
							Follow
						</button>
				}
			</div>

			<Transition appear show={showEditModal} as={Fragment}>
				<Dialog as="div" className="relative z-10" onClose={() => setShowEditModal(true)} onClick={() => setShowEditModal(false)}>
					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<div className="fixed inset-0 bg-black bg-opacity-25" />
					</Transition.Child>

					<div className="fixed inset-0 overflow-y-auto">
						<div className="flex min-h-full items-center justify-center p-4 text-center">
							<Transition.Child
								as={Fragment}
								enter="ease-out duration-300"
								enterFrom="opacity-0 scale-95"
								enterTo="opacity-100 scale-100"
								leave="ease-in duration-200"
								leaveFrom="opacity-100 scale-100"
								leaveTo="opacity-0 scale-95"
							>
								<Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white px-6 py-8 my-5 text-left align-middle shadow-xl transition-all relative z-50">

									<form onSubmit={updateProfileInfo}>
										<Dialog.Title
											as="h3"
											className="text-lg font-medium leading-6 text-gray-900"
										>
											Update profile
										</Dialog.Title>

										<div className="mt-2 flex flex-col justify-center items-start">
											<img alt="..."
												src={editProfileData.updatedPhoto ? editProfileData.updatedPhoto : userDetails?.Avatar}
												className=" shadow-xl rounded-full h-[120px] w-[120px] align-middle border-none mx-auto" />

											<div className="text-center flex justify-center w-full">
												<input
													type="file"
													id="fileInput"
													className="hidden"
													accept="image/*"
													onChange={handleFileChange}
												/>
												<label
													htmlFor="fileInput"
													className="flex items-center justify-center mx-auto mt-3 bg-blue-300 px-5 py-2 text-black rounded-md cursor-pointer" >
													<ArrowUpTrayIcon className="w-4 h-4" />
													<span className="ml-2">Upload Photo</span>
												</label>
											</div>
										</div>

										<div className="mt-4">
											<PrimaryInput
												required
												id="username"
												name="username"
												label="Username"
												className="w-full mb-4"
												placeholder="Write username"
												value={editProfileData.userName}
												onChange={handleInputChange} />

											<PrimaryTextArea
												id="description"
												name="description"
												label="Description"
												className="w-full mb-4 min-h-[100px]"
												placeholder="Write description"
												value={editProfileData.description}
												onChange={handleInputChange} />

											<PrimaryInput
												required
												id="reward"
												name="reward"
												label="Founder reward percentage"
												className="w-full mb-4"
												placeholder="Write reward percentage"
												value={editProfileData.reward}
												onChange={handleInputChange} />
										</div>

										<div className="mt-10 text-center">
											<button
												type="button"
												className="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
												onClick={() => setShowEditModal(false)}
											>
												Cancel
											</button>
											<button
												type="submit"
												className="ml-2 bg-blue-500 hover:bg-blue-600 px-8 py-2 text-white rounded-md"
											>
												Update
											</button>
										</div>
									</form>
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition>
		</div>
	)
}

export default Info
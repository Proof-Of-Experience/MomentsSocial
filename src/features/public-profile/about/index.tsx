import { PrimaryInput } from '@/components/core/input/Input';
import { PrimaryTextArea } from '@/components/core/textarea/Textarea';
import { EditProfileProps } from '@/model/profile';
import { selectAuthUser } from '@/slices/authSlice';
import { nanosToUSD } from '@/utils';
import { Dialog, Tab, Transition } from '@headlessui/react';
import { ArrowUpTrayIcon, PencilIcon } from '@heroicons/react/20/solid';
import React, { ChangeEvent, Fragment, useState } from 'react'
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';


const About = ({ username, userDetails }: any) => {
	const authUser = useSelector(selectAuthUser);
	const [editProfileData, setEditProfileData] = useState<EditProfileProps>({
		userName: userDetails?.Profile?.Username,
		description: userDetails?.Profile?.Description,
		updatedPhoto: '',
		reward: (userDetails?.Profile?.CoinEntry?.CreatorBasisPoints) / 100,
	});
	const [showEditModal, setShowEditModal] = useState<boolean>(false)
	const [showBuyModal, setShowBuyModal] = useState<boolean>(false)

	const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
		const file: any = event.target.files?.[0];
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
			}));
		}
	};

	const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setEditProfileData(prevState => ({
			...prevState,
			[name]: value
		}));
	};

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
			toast.success('Profile updated successfully');
		} catch (error: any) {
			toast.error(error?.message || 'Something went wrong!');
		}
	}


	return (
		<div className="flex justify-between">
			<div>
				Aoout page
			</div>

			{
				authUser?.currentUser?.ProfileEntryResponse?.Username === username &&
				<div className="flex">
					<button
						className="flex items-center border-2 px-8 py-3 rounded-md mr-3"
						onClick={() => setShowEditModal(true)}>
						<PencilIcon className="w-4 h-4" />
						<span className="ml-3">Edit</span>
					</button>

					<button
						className="f bg-blue-500 text-white px-8 py-3 rounded-md"
						onClick={() => setShowBuyModal(true)}>
						<span className="ml-3">Buy</span>
					</button>
				</div>
			}

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



			<Transition appear show={showBuyModal} as={Fragment}>
				<Dialog as="div" className="relative z-10" onClose={() => setShowBuyModal(true)} onClick={() => setShowBuyModal(false)}>
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
								<Dialog.Panel className="w-full max-w-xl transform overflow-hidden rounded-2xl bg-white px-6 py-8 my-5 text-left align-middle shadow-xl transition-all relative z-50">

									<form onSubmit={updateProfileInfo}>

										<div className="flex items-start mb-5">
											<img alt="..."
												src={editProfileData.updatedPhoto ? editProfileData.updatedPhoto : userDetails?.Avatar}
												className=" shadow-xl rounded-full h-[60px] w-[60px] align-middle border-none" />
											<div className="ml-2">
												<p>{username}</p>
												<p>≈{nanosToUSD(userDetails.Profile.CoinPriceDeSoNanos, 2)} Coin Price</p>
											</div>
										</div>

										<Tab.Group>
											<Tab.List className="border-b px-10">
												<Tab as={Fragment}>
													{({ selected }) =>
														<button className={`${selected ? 'text-[#4267F7] border-b-4 border-[#4267F7]' : 'text-black'} mr-5 py-2 px-5 font-medium focus-visible:outline-none`}>
															Buy
														</button>
													}
												</Tab>
												<Tab as={Fragment}>
													{({ selected }) =>
														<button className={`${selected ? 'text-[#4267F7] border-b-4 border-[#4267F7]' : 'text-black'} mr-5 py-2 px-5 font-medium focus-visible:outline-none`} >
															Sell
														</button>
													}
												</Tab>
												<Tab as={Fragment}>
													{({ selected }) =>
														<button className={`${selected ? 'text-[#4267F7] border-b-4 border-[#4267F7]' : 'text-black'} mr-5 py-2 px-5 font-medium focus-visible:outline-none`} >
															Transfer
														</button>
													}
												</Tab>
											</Tab.List>

											<Tab.Panels className="mt-2 mb-16">
												<Tab.Panel>
													<PrimaryInput
														required
														hasLeftDropdown
														dropdownOptions={['USD', 'Deso']}
														id="username"
														name="username"
														label="Username"
														className="w-full mb-4"
														placeholder="Write username"
														value={editProfileData.userName}
														onChange={handleInputChange} />
												</Tab.Panel>
												<Tab.Panel>
													<PrimaryInput
														required
														id="username"
														name="username"
														label="Username"
														className="w-full mb-4"
														placeholder="Write username"
														value={editProfileData.userName}
														onChange={handleInputChange} />
												</Tab.Panel>
												<Tab.Panel>
													<PrimaryInput
														required
														id="username"
														name="username"
														label="Username"
														className="w-full mb-4"
														placeholder="Write username"
														value={editProfileData.userName}
														onChange={handleInputChange} />
												</Tab.Panel>
											</Tab.Panels>
										</Tab.Group>

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

export default About
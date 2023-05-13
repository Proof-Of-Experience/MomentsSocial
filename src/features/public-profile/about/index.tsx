import { PrimaryInput } from '@/components/core/input/Input';
import { PrimaryTextArea } from '@/components/core/textarea/textarea';
import { selectAuthUser } from '@/slices/authSlice';
import { Dialog, Transition } from '@headlessui/react';
import { ArrowUpTrayIcon, PencilIcon } from '@heroicons/react/20/solid';
import React, { ChangeEvent, Fragment, useEffect, useState } from 'react'
import { useSelector } from 'react-redux';

const About = ({ username, userDetails }: any) => {
  const authUser = useSelector(selectAuthUser);
  let [jwt, setJwt] = useState('')
  let [updatedPhoto, setUpdatedPhoto] = useState('')
  let [showEditModal, setShowEditModal] = useState(false)

  const fetchUserMetaData = async () => {
    const { getUserGlobalMetadata, identity } = await import('deso-protocol')
    const JWT = await identity.jwt()
    setJwt(JWT)

    const params = {
      JWT,
      UserPublicKeyBase58Check: userDetails?.Profile?.PublicKeyBase58Check,
    }

    const response = await getUserGlobalMetadata(params)
    console.log('metadata response', response);

  }

  useEffect(() => {
    fetchUserMetaData()
  }, [])

  const uploadPhoto = async () => {
    const { updateProfile,  } = await import('deso-protocol')
    const params = {
      ExtraData:
      {
        LargeProfilePicURL: "https://images.deso.org/c11f48ada993e2b0c37b5befe2da744d221d1ea3d77234892ff97e20a94e215a.webp"
      },
      IsHidden : false,
      MinFeeRateNanosPerKB : 1000,
      NewCreatorBasisPoints : 10000,
      NewDescription : "",
      NewProfilePic : "https://images.deso.org/c11f48ada993e2b0c37b5befe2da744d221d1ea3d77234892ff97e20a94e215a.webp",
      NewStakeMultipleBasisPoints : 12500,
      NewUsername : "",
      ProfilePublicKeyBase58Check
        :
        "",
      UpdaterPublicKeyBase58Check
        :
        "BC1YLfsXHb15rC9FCtmy4QbjZ5YSibqQnqjAJALkbVeWu221wGUgnP9"
    }

    const params2 = {
      TransactionHex: ''
    }
  }

  console.log('authUser', authUser);


  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    // Handle the selected file here
    const file: any = event.target.files?.[0];
    console.log(file);
    const { uploadImage } = await import('deso-protocol')
    const params = {
      UserPublicKeyBase58Check: userDetails?.Profile?.PublicKeyBase58Check,
      JWT: jwt,
      file
    }
    const response = await uploadImage(params)
    setUpdatedPhoto(response?.ImageURL)
  };


  return (
    <div className="flex justify-between">
      <div>
        Aoout page
      </div>
      {
        authUser?.currentUser?.ProfileEntryResponse?.Username === username &&
        <button
          className="flex items-center bg-blue-500 text-white px-8 py-3 rounded-md"
          onClick={() => setShowEditModal(true)}>
          <PencilIcon className="w-4 h-4" />
          <span className="ml-3">Edit</span>
        </button>
      }

      <Transition appear show={showEditModal} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setShowEditModal(true)}>
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
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Update profile
                  </Dialog.Title>

                  <div className="mt-2 flex flex-col justify-center items-start">
                    <img alt="..."
                      src={updatedPhoto ? updatedPhoto : userDetails?.Avatar}
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
                        className="flex items-center justify-center mx-auto mt-3 bg-blue-300 px-5 py-2 text-black rounded-md cursor-pointer"
                        onClick={uploadPhoto}>
                        <ArrowUpTrayIcon className="w-4 h-4" />
                        <span className="ml-2">Upload Photo</span>
                      </label>
                    </div>
                  </div>


                  <div className="mt-4">
                    <PrimaryInput
                      label="Username"
                      className="w-full mb-4"
                      placeholder="Write username"
                      value={userDetails?.Profile?.Username} />

                    <PrimaryTextArea
                      label="Description"
                      className="w-full mb-4 min-h-[100px]"
                      placeholder="Write description"
                      value={userDetails?.Profile?.Description} />

                    <PrimaryInput
                      label="Founder reward percentage"
                      className="w-full mb-4"
                      placeholder="Write reward percentage"
                      value={(userDetails?.Profile?.CoinEntry?.CreatorBasisPoints) / 100} />

                    <PrimaryInput
                      type="email"
                      label="Email"
                      className="w-full"
                      placeholder="Write your email" />
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
                      type="button"
                      className="ml-2 bg-blue-500 hover:bg-blue-600 px-8 py-2 text-white rounded-md"
                      onClick={() => setShowEditModal(false)}
                    >
                      Update
                    </button>
                  </div>
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
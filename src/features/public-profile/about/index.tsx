import { PrimaryInput } from '@/components/core/input/Input';
import { PrimaryTextArea } from '@/components/core/textarea/textarea';
import { selectAuthUser } from '@/slices/authSlice';
import { Dialog, Transition } from '@headlessui/react';
import { ArrowUpTrayIcon, PencilIcon } from '@heroicons/react/20/solid';
import React, { Fragment, useState } from 'react'
import { useSelector } from 'react-redux';

const About = ({ username, userDetails }: any) => {
  const authUser = useSelector(selectAuthUser);
  let [showEditModal, setShowEditModal] = useState(false)

  console.log('authUser', authUser);


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
                      src={userDetails?.Avatar}
                      className=" shadow-xl rounded-full h-[120px] w-[120px] align-middle border-none mx-auto" />

                    <button className="flex items-center justify-center mx-auto mt-3 bg-blue-300 px-5 py-2 text-black rounded-md">
                      <ArrowUpTrayIcon className="w-4 h-4" />
                      <span className="ml-2">Upload Photo</span>
                    </button>
                  </div>


                  <div className="mt-4">
                    <PrimaryInput
                      label="Username"
                      className="w-full mb-4"
                      placeholder="Username"/>

                    <PrimaryTextArea
                      label="Description"
                      className="w-full mb-4 min-h-[100px]"
                      placeholder="Description"/>

                    <PrimaryInput
                      label="Founder reward percentage"
                      className="w-full mb-4"
                      placeholder="Description"/>

                    <PrimaryInput
                      type="email"
                      label="Email"
                      className="w-full" />
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
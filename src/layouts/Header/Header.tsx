import React, { Fragment, useCallback, useContext, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import Link from 'next/link'
// import { SearchIcon } from "@heroicons/react/outline";
// import { UploadIcon, BellIcon } from "@heroicons/react/solid"
import { useRouter } from 'next/router'
import { signIn, signOut, useSession } from "next-auth/react";
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { PrimaryButton } from '@/components/ui/Button';
import { identity } from "deso-protocol";

// import { UserContext } from '@/AppContext';

const Header = () => {
  const router = useRouter()
  const [popupOpen, setPopupOpen] = useState(false)
  const { data: session, status } = useSession()
  const [isOpen, setIsOpen] = useState(false);
  // const { currentUser, isLoading } = useContext(UserContext);


  return (
    <header className="sticky top-0 z-50 p-2 lg:px-5 shadow-md max-h-20">
      <div className="flex flex-wrap m-1 justify-left md:justify-between">
        {/* Left */}
        <div className="flex flex-wrap">
          <Link href="/" className="flex rounded-md bg-cyan-50 p-2 hover:scale-125 hover:bg-emerald-100">
            <img
              className="flex w-[150px] h-[50px]"
              src="/assets/DTube_files/images/DTube_Black.svg"
              alt="dtube"
              onClick={() => router.push('/')}
            />
          </Link>
        </div>

        {/* center  */}
        <div className="flex flex-wrap">
          {/* search bar */}
          <div>
            {/* <SearchIcon className="hidden h-6 text-gray-600" /> */}
            <input className="flex rounded-md mt-5 mb-2 border p-2 md:p-5 md:m-3 md:ml-60 h-10 w-64 md:w-96 bg-white outline-none placeholder-gray-500"
              placeholder="Search Dtube" />
          </div>
        </div>

        {/* right */}
        <div className="flex justify-end">
          {
            !session &&
            <div className="flex items-center">
              <PrimaryButton text='Login' 
              // onClick={() => identity.login()} 
              />
              <PrimaryButton text='Signup' className="ml-3" onClick={() => console.log('hi')} />
            </div>
          }

          {
            !session &&
            <div className="flex">
              {/* balance and voting power */}
              <div className="flex">
                {/* balance */}
                <div className="group relative flex p-2 m-1 mt-3 h-10 rounded bg-orange-100 hover:bg-orange-400">
                  <span className="font-bold text-rose-700">
                    10K
                  </span>
                  <span className="ml-1">
                    DTC
                  </span>
                  {/* <span className="flex group-hover:opacity-100 w-80 h-30 m-4 p-2 transition-opacity bg-emerald-200 px-1 text-black 
                            font-medium rounded-xl absolute left-1/2 -translate-x-1/2 translate-y-5 opacity-0">
                              DTUBE Coin balance - Hold more of it to generate more Voting Power. You can burn it to promote your videos and comments.
                            </span> */}
                </div>

                {/* voting power */}
                <div className="hidden md:block group relative flex p-2 m-1 mt-3 h-10 rounded bg-orange-100 hover:bg-orange-400">
                  <span className="font-bold text-blue-900"> 10M VP</span>
                  {/* <span className="flex group-hover:opacity-100 w-80 h-35 m-4 p-2 transition-opacity bg-emerald-200 px-1 text-black 
                            font-medium rounded-xl absolute left-1/2 -translate-x-1/2 translate-y-5 opacity-0">
                              Voting Power - Bound to your account, you need to use it when you vote or add new content. Hold on to your DTCs to become more powerful and influent in the network!
                            </span> */}

                </div>
              </div>

              <div className="flex ml-5 bg-slate-300 rounded-2xl p-0.5 hover:bg-red-200">

                <div className="">
                  
                </div>
              </div>

              {/* Add socials and accounts */}
              <div className="flex hidden md:block">

              </div>


              {/* notifications */}
              <div className="flex group relative">
                {/* <BellIcon className="flex w-10 h-10 mt-3 ml-5 bg-gray-400 rounded-xl hover:cursor-pointer hover:bg-red-500 hover:scale-105" /> */}
                <span className="flex group-hover:opacity-100 w-8 h-10 m-4 p-2 transition-opacity bg-red-500 px-1 text-black 
                              font-medium rounded-xl absolute left-1/2 translate-x-1 -translate-y-5 opacity-0 font-bold justify-center">
                  20
                </span>
              </div>
            </div>
          }

        </div>

        <div className="flex">
          <Transition appear show={isOpen} as={Fragment}>
            <Dialog
              as="div"
              className="fixed -inset-y-40 inset-x-10 right-0 z-10"
              onClose={() => { }}
            >
              <div className="min-h-screen px-4 text-center">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Dialog.Overlay className="fixed inset-0" />
                </Transition.Child>

                <span
                  className="inline-block h-screen align-middle"
                  aria-hidden="true"
                >
                  &#8203;
                </span>
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <div className="inline-block w-1/4 max-w-md p-3 my-6 overflow-hidden text-left align-middle transform bg-[#b5d3df] shadow-xl rounded-xl">
                    <Dialog.Title
                      className="flex flex-grow justify-center text-xl font-bold p-5 text-gray-900 py-1 rounded-t-2xl"
                    >
                      Login to Dtube
                    </Dialog.Title>

                    <div className="flex flex-grow justify-center">
                      <form className="flex-col">
                        <input
                          className="flex rounded-full h-12 bg-gray-100 px-5 my-2 focus:outline-none"
                          type="text"
                          name="username"
                          placeholder="username"
                        />
                        <input
                          className="flex rounded-full h-12 bg-gray-100 px-5 my-2 focus:outline-none"
                          type="text"
                          name="privatekey"
                          placeholder="password/private key"
                        />
                        <div className="">
                          <button className="flex-col text-black m-2 bg-blue-300 items-center rounded-2xl p-3" type="submit">
                            Login
                          </button>
                          <button className="flex-col text-black m-2 bg-blue-300 items-center rounded-2xl p-3" onClick={() => { }}>
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>

                    <div className="mt-4">
                      {/* divider */}
                      <div className="relative flex py-1 items-center">
                        <div className="flex-grow border-t border-gray-500"></div>
                        {/* <span className="flex-shrink mx-4 text-gray-500">
                                          
                                          </span> */}
                        <div className="flex-grow border-t border-gray-500"></div>
                      </div>
                    </div>
                  </div>
                </Transition.Child>
              </div>
            </Dialog>
          </Transition>
          <ToastContainer
            position="bottom-right"
            autoClose={1000}
            hideProgressBar
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
          />
        </div>
      </div>
    </header>
  )
}

export default Header
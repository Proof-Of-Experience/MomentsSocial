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
              src="/DTube_Black.svg"
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
                onClick={async () => {
                  const { identity } = (await import('deso-protocol'))
                  identity.login()
                }}
              />
              <PrimaryButton text='Signup' className="ml-3" />
            </div>
          }
        </div>
      </div>
    </header>
  )
}

export default Header
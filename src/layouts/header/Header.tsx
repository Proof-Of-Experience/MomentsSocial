import React, { ChangeEvent, Fragment, useState } from 'react'
import { Combobox, Transition } from '@headlessui/react'
import Link from 'next/link'
import { CheckIcon, MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { useRouter } from 'next/router'
import 'react-toastify/dist/ReactToastify.css'
import { PrimaryButton } from '@/components/ui/button';
import { getSearchProfileData } from '@/pages/api/profile';
import { useDispatch, useSelector } from 'react-redux';
import { selectAuthUser, setAuthUser } from '@/slices/authSlice';

const Header = () => {
  const authUser = useSelector(selectAuthUser);
  const dispatch = useDispatch();
  const router = useRouter()
  const [selected, setSelected] = useState([]);
  const [searchResult, setSearchResult] = useState([]);
  const [query, setQuery] = useState("");
  const [loadedQuery, setLoadedQuery] = useState(false);

  console.log('loadedQuery', loadedQuery);


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

  return (
    <header className="sticky top-0 z-50 p-2 lg:px-5 shadow max-h-20">
      <div className="flex flex-wrap m-1 justify-left md:justify-between">
        {/* Left */}
        <div className="flex flex-wrap">
          <Link href="/" className="flex rounded-md">
            <img
              className="flex w-[150px] h-[50px]"
              src="/DTube_Black.svg"
              alt="dtube"
              onClick={() => router.push('/')}
            />
          </Link>
        </div>

        {/* center  */}
        <Combobox value={selected} onChange={setSelected}>
          <div className="relative mt-1">
            <Combobox.Input
              className="flex rounded-md border border-gray-300 p-4 h-10 w-64 text-[14px] md:w-96 outline-none placeholder-gray-500"
              placeholder="Search video or author or tag...."
              displayValue={(person: any) => person.Username}
              onChange={onChangeSearch}
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
              <MagnifyingGlassIcon className="h-4 text-gray-600" />
            </Combobox.Button>

            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
              afterLeave={() => setQuery("")}
            >
              <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">

                {
                  loadedQuery ? (
                    <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                      Searching
                    </div>
                  ) : (
                    searchResult.length > 0 ? searchResult.map((person: any) => (
                      <Combobox.Option
                        onClick={() => router.push(`/@${person.Username}`)}
                        key={person.Username}
                        className={({ active }) =>
                          `relative cursor-pointer select-none py-2 pl-5 pr-4 ${active ? "bg-gray-400 text-white" : "text-gray-900"
                          }`
                        }
                        value={person}
                      >
                        {({ selected, active }) => (
                          <span className={`block truncate ${selected ? "font-medium" : "font-normal"}`} >
                            @{person.Username}
                          </span>
                        )}
                      </Combobox.Option>
                    )) : (
                      <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                        Not found
                      </div>
                    )
                  )
                }

              </Combobox.Options>
            </Transition>
          </div>
        </Combobox>

        {/* right */}
        <div className="flex justify-end">
          {
            authUser?.currentUser ?
              <PrimaryButton
                text='Logout'
                className="ml-3"
                onClick={async () => {
                  const { identity } = (await import('deso-protocol'))
                  await identity.logout()
                  dispatch(setAuthUser({}));
                }} /> :
              <div className="flex items-center">
                <PrimaryButton
                  text='Login'
                  onClick={async () => {
                    const { identity } = (await import('deso-protocol'))
                    identity.login()
                  }}
                />
                <PrimaryButton
                  text='Signup'
                  className="ml-3"
                />
              </div>
          }
        </div>
      </div>
    </header>
  )
}

export default Header
import React, { ChangeEvent, Fragment, useState } from 'react'
import { Combobox, Transition } from '@headlessui/react'
import Link from 'next/link'
import { CheckIcon, MagnifyingGlassIcon} from "@heroicons/react/20/solid";
import { useRouter } from 'next/router'
import 'react-toastify/dist/ReactToastify.css'
import { PrimaryButton } from '@/components/ui/Button';
import { getSearchProfileData } from '@/pages/api/profile';

const Header = () => {
  const router = useRouter()
  const [selected, setSelected] = useState([]);
  const [searchResult, setSearchResult] = useState([]);
  const [query, setQuery] = useState("");
  const [loadedQuery, setLoadedQuery] = useState(false);

  const onChangeSearch = async (e: ChangeEvent<HTMLInputElement>) => {
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

    setSearchResult(filteredPeople)

  }

  console.log('selectedPerson', selected);



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

            <Combobox value={selected} onChange={setSelected}>
              <div className="relative mt-1">
                <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
                  <Combobox.Input
                    // className="w-full border py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
                    className="flex rounded-md border p-2 md:p-5 h-10 w-64 md:w-96 bg-white outline-none placeholder-gray-500"
                    displayValue={(person: any) => person.Username}
                    onChange={onChangeSearch}
                  />
                  <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                  <MagnifyingGlassIcon className="hidden h-6 text-gray-600" />
                  </Combobox.Button>
                </div>

                <Transition
                  as={Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                  afterLeave={() => setQuery("")}
                >
                  <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    {searchResult.length === 0 && query !== "" ? (
                      <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                        Nothing found.
                      </div>
                    ) : (
                      searchResult.map((person: any) => (
                        <Combobox.Option
                          key={person.Username}
                          className={({ active }) =>
                            `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? "bg-teal-600 text-white" : "text-gray-900"
                            }`
                          }
                          value={person}
                        >
                          {({ selected, active }) => (
                            <>
                              <span
                                className={`block truncate ${selected ? "font-medium" : "font-normal"
                                  }`}
                              >
                                {person.Username}
                              </span>
                              {selected ? (
                                <span
                                  className={`absolute inset-y-0 left-0 flex items-center pl-3 ${active ? "text-white" : "text-teal-600"
                                    }`}
                                >
                                  <CheckIcon
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                  />
                                </span>
                              ) : null}
                            </>
                          )}
                        </Combobox.Option>
                      ))
                    )}
                  </Combobox.Options>
                </Transition>
              </div>
            </Combobox>

          </div>
        </div>

        {/* right */}
        <div className="flex justify-end">
          <div className="flex items-center">
            <PrimaryButton text='Login'
              onClick={async () => {
                const { identity } = (await import('deso-protocol'))
                identity.login()
              }}
            />
            <PrimaryButton text='Signup' className="ml-3" />
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
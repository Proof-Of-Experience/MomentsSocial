import React, { Fragment } from 'react'
import { Combobox, Transition } from '@headlessui/react';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import { useRouter } from 'next/router';

interface SearchProps {
    searchResult: object[],
    loadedQuery: boolean,
    selected: object[],
    onChangeSelect: any,
    onChangeSearch: any,
    setQuery: any
}

const Search = ({ searchResult, loadedQuery, selected, onChangeSelect, onChangeSearch, setQuery }: SearchProps) => {
    const router = useRouter()

    return (
        <Combobox value={selected} onChange={onChangeSelect}>
            <div className="relative">
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
                                searchResult?.length > 0 ? searchResult.map((person: any) => (
                                    <Combobox.Option
                                        onClick={() => router.push(`/user/${person.Username}`)}
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
    )
}

export default Search
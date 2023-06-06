import React, { Fragment } from 'react'
import { Combobox, Transition } from '@headlessui/react';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import { useRouter } from 'next/router';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';

interface SearchProps {
    searchResult: object[],
    loadedQuery: boolean,
    selected: object[],
    onChangeSelect: any,
    onChangeSearch: any,
    query: string,
    setQuery: any,
}

const Search = ({ searchResult, loadedQuery, selected, onChangeSelect, onChangeSearch, query, setQuery }: SearchProps) => {
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
                    as="div"
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                    afterLeave={() => setQuery("")}
                >

                    <div className="relative mt-1 w-full bg-white py-1 text-base border focus:outline-none sm:text-sm max-h-64 overflow-auto">
                        <Combobox.Options>
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
                    </div>

                    <a href={`https://www.cloutavista.com/deso/posts?text=${query}`}
                        target='_blank'
                        className="w-full flex items-center justify-center py-3 px-4 bg-white shadow text-center text-sm rounded-bl-[15px] rounded-br-[15px] ring-1 ring-black ring-opacity-5">
                        <ArrowTopRightOnSquareIcon className="w-5 mr-2" />
                        <span>Search on Cloutavista</span>
                    </a>

                </Transition>
            </div>
        </Combobox>
    )
}

export default Search
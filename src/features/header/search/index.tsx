import React from 'react';
import { Combobox, Transition } from '@headlessui/react';
import { useRouter } from 'next/router';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

interface SearchProps {
	searchResult: object[];
	loadedQuery: boolean;
	selected: object[];
	onChangeSelect: any;
	onChangeSearch: any;
	query: string;
	setQuery: any;
}

const Search = ({
	searchResult,
	loadedQuery,
	selected,
	onChangeSelect,
	onChangeSearch,
	query,
	setQuery,
}: SearchProps) => {
	const router = useRouter();

	return (
		<Combobox
			value={selected}
			onChange={onChangeSelect}
		>
			<div className="relative">
				<Combobox.Input
					className="flex bg-[#F2F7F8] rounded-3xl py-[14px] pl-[14px] h-[48px] w-64 md:w-96 lg:w-[600px] text-[16px] outline-none placeholder-[#909090]"
					placeholder="Search"
					displayValue={(person: any) => person.Username}
					onChange={onChangeSearch}
				/>
				<Combobox.Button className="absolute inset-y-0 right-[14px] flex items-center ">
					{/* <MagnifyingGlassIcon className="h-4 text-gray-600" /> */}
					<Image
						className="flex w-[20px] cursor-pointer"
						src="/home/search.svg"
						width="20"
						height="20"
						alt="dtube"
						onClick={() => router.push('/')}
					/>
				</Combobox.Button>

				<Transition
					as="div"
					leave="transition ease-in duration-100"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
					afterLeave={() => setQuery('')}
				>
					<div className="relative mt-1 w-full bg-white py-1 text-base border focus:outline-none sm:text-sm max-h-64 overflow-auto">
						<Combobox.Options>
							{loadedQuery ? (
								<div className="relative cursor-default select-none py-2 px-4 text-gray-700">
									Searching
								</div>
							) : searchResult?.length > 0 ? (
								searchResult.map((person: any) => (
									<Combobox.Option
										onClick={() => router.push(`/user/${person.Username}`)}
										key={person.Username}
										className={({ active }) =>
											`relative cursor-pointer select-none py-2 pl-5 pr-4 ${
												active ? 'bg-gray-400 text-white' : 'text-gray-900'
											}`
										}
										value={person}
									>
										{/* eslint-disable-next-line @typescript-eslint/no-unused-vars */}
										{({ selected, active }) => (
											<span
												className={`block truncate ${
													selected ? 'font-medium' : 'font-normal'
												}`}
											>
												@{person.Username}
											</span>
										)}
									</Combobox.Option>
								))
							) : (
								<div className="relative cursor-default select-none py-2 px-4 text-gray-700">
									Not found
								</div>
							)}
						</Combobox.Options>
					</div>

					<a
						href={`https://www.cloutavista.com/deso/posts?text=${query}`}
						target="_blank"
						className="w-full flex items-center justify-center py-3 px-4 bg-white shadow text-center text-sm rounded-bl-[15px] rounded-br-[15px] ring-1 ring-black ring-opacity-5"
					>
						<ArrowTopRightOnSquareIcon className="w-5 mr-2" />
						<span>Search on Cloutavista</span>
					</a>
				</Transition>
			</div>
		</Combobox>
	);
};

export default Search;

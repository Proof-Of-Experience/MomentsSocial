import React, { ChangeEvent, useEffect, useState } from 'react'
import Link from 'next/link'
import { getSearchProfileData } from '@/pages/api/profile';
import AuthButtons from '@/features/header/auth-buttons';
import Search from '@/features/header/search';
import { BellIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { useSelector } from 'react-redux';
import { selectAuthUser } from '@/slices/authSlice';

const Header = () => {
	const authUser = useSelector(selectAuthUser);
	const [selected, setSelected] = useState([]);
	const [searchResult, setSearchResult] = useState([]);
	const [query, setQuery] = useState("");
	const [loadedQuery, setLoadedQuery] = useState(false);
	const [isSticky, setSticky] = useState(false);

	useEffect(() => {
		window.addEventListener('scroll', () => {
			if (window.scrollY >= 30) {
				setSticky(true);
			} else {
				setSticky(false);
			}
		});
	}, []);

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
		<header className={`${isSticky ? 'fixed' : 'relative'} bg-white top-0 left-0 right-0 z-10 p-2 lg:px-5 shadow h-[72px] leading-[30px]`}>
			<div className="flex items-center flex-wrap m-1 justify-left md:justify-between">

				<div className="flex flex-wrap">
					<Link href="/" className="flex rounded-md">
						<h2 className="text-4xl">Moment Social</h2>
						{/* <img
              className="flex w-[150px] h-[50px]"
              src="/DTube_Black.svg"
              alt="dtube"
              onClick={() => router.push('/')}
            /> */}
					</Link>
				</div>

				<Search
					loadedQuery={loadedQuery}
					searchResult={searchResult}
					selected={selected}
					onChangeSelect={setSelected}
					onChangeSearch={onChangeSearch}
					setQuery={setQuery}
				/>

				<div className="flex items-center">
					{
						authUser &&
						<BellIcon
							className="h-7 w-7 mr-4"
							aria-hidden="true"
							role="button"
						/>
					}

					<AuthButtons />
				</div>

			</div>
		</header>
	)
}

export default Header
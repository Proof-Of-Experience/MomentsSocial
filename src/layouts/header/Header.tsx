import React, { ChangeEvent, useState } from 'react'
import Link from 'next/link'
import { getSearchProfileData } from '@/pages/api/profile';
import AuthButtons from '@/features/header/auth-buttons';
import 'react-toastify/dist/ReactToastify.css'
import Search from '@/features/header/search';

const Header = () => {
  const [selected, setSelected] = useState([]);
  const [searchResult, setSearchResult] = useState([]);
  const [query, setQuery] = useState("");
  const [loadedQuery, setLoadedQuery] = useState(false);

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

        <AuthButtons />

      </div>
    </header>
  )
}

export default Header
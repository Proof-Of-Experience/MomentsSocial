import { LoadingSpinner } from '@/components/core/loader';
import { Placeholder } from '@/components/core/placeholder';
import { selectAuthUser } from '@/slices/authSlice';
import { desoPrice, nanosToUSD, usdYouWouldGetIfYouSoldDisplay } from '@/utils';
import { Dialog, Tab, Transition } from '@headlessui/react';
import { CheckBadgeIcon } from '@heroicons/react/20/solid';
import { ClipboardDocumentCheckIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/router';
import React, { Fragment, useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const ProfileWallet = ({ username, publicKey, userDetails }: any) => {
    const router = useRouter()
    const authUser = useSelector(selectAuthUser)
    const [exchangeData, setExchangeData] = useState<any>({})
    const [isLoaded, setisLoaded] = useState<boolean>(true)
    const [iframeLoading, setIframeLoading] = useState(true)
    const [coinsPurchased, setCoinsPurchased] = useState<any>([])
    const [coinsReceived, setCoinsReceived] = useState<any>([])
    const [showBuyModal, setShowBuyModal] = useState<boolean>(false)
    const [showByCoinsModal, setShowByCoinsModal] = useState<boolean>(false)
    const [isLoadedProfiles, setIsLoadedProfiles] = useState<boolean>(true)
    const [allProfiles, setAllProfiles] = useState<any>([])

    useEffect(() => {
        fetchExchangeRate()
    }, [])

    useEffect(() => {
        if (username) {
            fetchCreatorCoin()
        }
    }, [username])

    useEffect(() => {
        if (showByCoinsModal) {
            fetchProfiles()
        }
    }, [showByCoinsModal])


    const fetchCreatorCoin = async () => {
        const { getHodlersForUser, HodlersSortType } = await import('deso-protocol')
        const params = {
            FetchAll: false,
            FetchHodlings: false,
            IsDAOCoin: false,
            LastPublicKeyBase58Check: '',
            NumToFetch: 100,
            PublicKeyBase58Check: '',
            SortType: HodlersSortType.coin_balance,
            Username: username
        }

        const creatorCoinData: any = await getHodlersForUser(params)
        const modifiedCoinsPurchased = creatorCoinData?.Hodlers.length > 0 && creatorCoinData?.Hodlers.filter((item: any) => item.HasPurchased)
        setCoinsPurchased(modifiedCoinsPurchased)

        const modifiedCoinsReceived = creatorCoinData?.Hodlers.length > 0 && creatorCoinData?.Hodlers.filter((item: any) => !item.HasPurchased)
        setCoinsReceived(modifiedCoinsReceived)

        setisLoaded(false)
    }

    const fetchExchangeRate = async () => {
        const { getExchangeRates } = await import('deso-protocol')

        const response = await getExchangeRates()
        setExchangeData(response)
    }

    const fetchProfiles = async () => {
        const { getProfiles } = await import('deso-protocol')
        const profileParams = {
            AddGlobalFeedBool: false,
            Description: '',
            FetchUsersThatHODL: false,
            ModerationType: 'leaderboard',
            NumToFetch: 50,
            OrderBy: 'influencer_coin_price',
            PublicKeyBase58Check: '',
            ReaderPublicKeyBase58Check: authUser?.PublicKeyBase58Check,
            Username: '',
            UsernamePrefix: ''
        }

        const response = await getProfiles(profileParams)
        setIsLoadedProfiles(false)
        setAllProfiles(response?.ProfilesFound)
        console.log('response', response);

    }

    console.log('authUser', authUser);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(authUser?.PublicKeyBase58Check)
        toast.success('Public key is copied to clipboard!')
    }


    return (
        <div>
            {
                isLoaded ? <LoadingSpinner isLoading={isLoaded} /> :
                    <>
                        <div className="grid grid-cols-4 gap-6">
                            <div className="bg-gray-100 shadow rounded-lg px-5 py-6 col-span-1">
                                <div className="mb-4">
                                    <p className="font-semibold">Publick Key</p>
                                    <div className="flex items-center">
                                        <p className="truncate">
                                            <span>{authUser?.PublicKeyBase58Check}</span>
                                        </p>
                                        <ClipboardDocumentCheckIcon
                                            role="button"
                                            className="w-8 text-blue-600 cursor-pointer"
                                            onClick={handleCopy} />
                                    </div>
                                </div>

                                <div>
                                    <a
                                        className="text-blue-600"
                                        href={`https://explorer.deso.org/?public-key=${authUser?.PublicKeyBase58Check}`}
                                        target="_blank">
                                        Transaction History
                                    </a>
                                </div>
                            </div>


                            <div className="bg-gray-100 shadow rounded-lg px-5 py-6 col-span-1">
                                <div className="mb-5">
                                    <p>
                                        <span>DESO Price</span>
                                        <span className="font-semibold"> ≈ {desoPrice(exchangeData?.USDCentsPerDeSoCoinbase)}</span>
                                    </p>
                                    <p>
                                        <span>Your DESO </span>
                                        <span className="font-semibold">
                                            {nanosToUSD(authUser?.Profile?.DESOBalanceNanos, 2)}
                                        </span>
                                    </p>
                                </div>

                                <div className="flex justify-between">
                                    <button
                                        className="px-4 py-2 rounded-full bg-blue-500 text-white mr-4 w-full"
                                        onClick={() => {
                                            setShowBuyModal(true)
                                            setIframeLoading(true)
                                        }}>
                                        Buy DESO
                                    </button>
                                </div>

                                <Transition appear show={showBuyModal} as={Fragment}>
                                    <Dialog as="div" className="relative z-10" onClose={() => setShowBuyModal(false)}>
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
                                                    <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white px-6 py-8 my-5 text-left align-middle shadow-xl transition-all relative z-50">

                                                        <Dialog.Title
                                                            as="h3"
                                                            className="text-lg font-medium leading-6 text-gray-900"
                                                        >
                                                            Buy DESO
                                                        </Dialog.Title>

                                                        <div className="mt-10">
                                                            <Tab.Group>
                                                                <Tab.List className="border-b px-10">
                                                                    <Tab as={Fragment}>
                                                                        {({ selected }) => (
                                                                            <button
                                                                                className={`${selected ? 'text-[#4267F7] border-b-4 border-[#4267F7]' : 'text-black'} mr-5 py-2 px-5 font-medium focus-visible:outline-none`}
                                                                            >
                                                                                Buy with Crypto
                                                                            </button>
                                                                        )}
                                                                    </Tab>

                                                                    <Tab as={Fragment}>
                                                                        {({ selected }) => (
                                                                            <button
                                                                                className={`${selected ? 'text-[#4267F7] border-b-4 border-[#4267F7]' : 'text-black'} mr-5 py-2 px-5 font-medium focus-visible:outline-none`}
                                                                            >
                                                                                Buy On
                                                                            </button>
                                                                        )}
                                                                    </Tab>

                                                                </Tab.List>

                                                                <Tab.Panels className="mt-2">
                                                                    <Tab.Panel>
                                                                        {
                                                                            iframeLoading && <LoadingSpinner isLoading={iframeLoading} />
                                                                        }

                                                                        <iframe
                                                                            src="https://megaswap.xyz/#/iframe/v1?network=mainnet&theme=default&depositTicker=BTC&destinationTickers=DESO&destinationTicker=DESO&destinationAddress=BC1YLfsXHb15rC9FCtmy4QbjZ5YSibqQnqjAJALkbVeWu221wGUgnP9&affiliateAddress=BC1YLgTKfwSeHuNWtuqQmwduJM2QZ7ZQ9C7HFuLpyXuunUN7zTEr5WL"
                                                                            width="100%"
                                                                            height="400"
                                                                            title="MegaSwap"
                                                                            allow="fullscreen"
                                                                            onLoad={() => setIframeLoading(false)}
                                                                            style={{ display: iframeLoading ? 'none' : 'block' }}
                                                                        />
                                                                    </Tab.Panel>

                                                                    <Tab.Panel className="text-center">

                                                                        <button
                                                                            className="text-white bg-blue-400 mr-5 mb-5 py-1 px-5 rounded-lg text-base focus-visible:outline-none"
                                                                            onClick={() => window.open('https://exchange.coinbase.com/trade/DESO-USD', '_blank')}
                                                                        >
                                                                            Coinbase
                                                                        </button>

                                                                        <button
                                                                            className="text-white bg-blue-400 mr-5 mb-5 py-1 px-5 rounded-lg text-base focus-visible:outline-none"
                                                                            onClick={() => window.open('https://gate.io/trade/deso_usdt?ref=12312805', '_blank')}
                                                                        >
                                                                            Gate.io
                                                                        </button>
                                                                        <button
                                                                            className="text-white bg-blue-400 mr-5 mb-5 py-1 px-5 rounded-lg text-base focus-visible:outline-none"
                                                                            onClick={() => window.open('https://www.lbank.com/en-US/trade/deso_usdt', '_blank')}
                                                                        >
                                                                            LBank
                                                                        </button>

                                                                        <button
                                                                            className="text-white bg-blue-400 mr-5 mb-5 py-1 px-5 rounded-lg text-base focus-visible:outline-none"
                                                                            onClick={() => window.open('https://www.coinex.com/exchange/deso-usdt', '_blank')}
                                                                        >
                                                                            CoinEx
                                                                        </button>

                                                                        <button
                                                                            className="text-white bg-blue-400 mr-5 mb-5 py-1 px-5 rounded-lg text-base focus-visible:outline-none"
                                                                            onClick={() => window.open('https://www.ascendex.com/en/basic/cashtrade-spottrading/usdt/deso', '_blank')}
                                                                        >
                                                                            AscendEX
                                                                        </button>

                                                                        <button
                                                                            className="text-white bg-blue-400 mr-5 mb-5 py-1 px-5 rounded-lg text-base focus-visible:outline-none"
                                                                            onClick={() => window.open('https://www.jbex.com/exchange/DESO/USDT', '_blank')}
                                                                        >
                                                                            Jubi
                                                                        </button>
                                                                    </Tab.Panel>
                                                                </Tab.Panels>
                                                            </Tab.Group>
                                                        </div>
                                                    </Dialog.Panel>
                                                </Transition.Child>
                                            </div>
                                        </div>
                                    </Dialog>
                                </Transition>
                            </div>


                            <div className="bg-gray-100 shadow rounded-lg px-5 py-6 col-span-1">
                                <div className="mb-5">
                                    <p>0.00 DESO ~ $0</p>
                                    <p>0 Creator Coin</p>
                                </div>

                                <div className="flex justify-between">
                                    <button
                                        className="px-4 py-2 rounded-full border border-[#0066ff] text-black mr-4 w-full"
                                        onClick={() => setShowByCoinsModal(true)}>
                                        Buy Creator Coin
                                    </button>
                                </div>

                                <Transition appear show={showByCoinsModal} as={Fragment}>
                                    <Dialog as="div" className="relative z-10" onClose={() => setShowByCoinsModal(false)}>
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
                                                    <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white px-6 py-8 my-5 text-left align-middle shadow-xl transition-all relative z-50">

                                                        <Dialog.Title
                                                            as="h3"
                                                            className="text-lg font-medium leading-6 text-gray-900"
                                                        >
                                                            Discover Creators
                                                        </Dialog.Title>

                                                        <div className="mt-5">
                                                            {
                                                                isLoadedProfiles ? <LoadingSpinner isLoading={isLoadedProfiles} /> :
                                                                    <table className="table-auto w-full">
                                                                        <thead>
                                                                            <tr>
                                                                                <th className="border-b border-black py-2 text-left">Name</th>
                                                                                <th className="border-b border-black py-2 text-left">Price</th>
                                                                                <th className="border-b border-black py-2 text-center"></th>
                                                                                <th className="border-b border-black py-2 text-center"></th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            {allProfiles?.length > 0 ? allProfiles.map((profileItem: any, index: number) => (
                                                                                <tr key={index}>
                                                                                    <td className="border-b py-3">
                                                                                        <div
                                                                                            className="flex items-center cursor-pointer"
                                                                                            onClick={() => router.push(`/user/${profileItem.Username}`)}>
                                                                                            <img
                                                                                                src={`${process.env.NEXT_PUBLIC_BASE_URL}/api/v0/get-single-profile-picture/${profileItem.PublicKeyBase58Check}?fallback=https://diamondapp.com/assets/img/default-profile-pic.png`}
                                                                                                alt="avatar"
                                                                                                className="rounded-full h-10 w-10 mr-2" />
                                                                                            <span className="flex w-[150px] truncate">
                                                                                                {profileItem?.Username ? profileItem?.Username : profileItem.PublicKeyBase58Check}
                                                                                                {profileItem?.IsVerified && <CheckBadgeIcon className="ml-1 w-5 h-5 text-blue-500" />}
                                                                                            </span>
                                                                                        </div>
                                                                                    </td>
                                                                                    <td className="border-b py-3 text-left">
                                                                                        {nanosToUSD(profileItem?.DESOBalanceNanos, 2)}
                                                                                    </td>
                                                                                    <td className="border-b py-3 text-center">
                                                                                        <button>
                                                                                            Follow
                                                                                        </button>
                                                                                    </td>
                                                                                    <td className="border-b py-3 text-center">
                                                                                        <button>
                                                                                            Buy
                                                                                        </button>
                                                                                    </td>
                                                                                </tr>
                                                                            )) :
                                                                                <tr>
                                                                                    <td colSpan={4}>
                                                                                        <Placeholder />
                                                                                    </td>
                                                                                </tr>
                                                                            }
                                                                        </tbody>
                                                                    </table>
                                                            }
                                                        </div>
                                                    </Dialog.Panel>
                                                </Transition.Child>
                                            </div>
                                        </div>
                                    </Dialog>
                                </Transition>
                            </div>
                        </div>

                        <div className="mt-4">
                            <Tab.Group>
                                <Tab.List className="border-b px-10">
                                    <Tab as={Fragment}>
                                        {({ selected }) =>
                                            <button
                                                className={`${selected ? 'text-[#4267F7] border-b-4 border-[#4267F7]' : 'text-black'} mr-5 py-2 px-5 font-medium focus-visible:outline-none`}>
                                                Coins Purchased
                                            </button>
                                        }
                                    </Tab>
                                    <Tab as={Fragment}>
                                        {({ selected }) =>
                                            <button
                                                className={`${selected ? 'text-[#4267F7] border-b-4 border-[#4267F7]' : 'text-black'} mr-5 py-2 px-5 font-medium focus-visible:outline-none`}>
                                                Coins Received
                                            </button>
                                        }
                                    </Tab>
                                </Tab.List>

                                <Tab.Panels className="px-10 mt-2 mb-16">
                                    <Tab.Panel>
                                        <table className="table-auto w-full">
                                            <thead>
                                                <tr>
                                                    <th className="border-b border-black py-2 text-left">Username</th>
                                                    <th className="border-b border-black py-2 text-left">Price</th>
                                                    <th className="border-b border-black py-2 text-center">Value</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {coinsPurchased?.length > 0 ? coinsPurchased.map((holder: any, index: number) => (
                                                    <tr key={index}>
                                                        <td className="border-b py-3">
                                                            <div
                                                                className="flex items-center cursor-pointer"
                                                                onClick={() => router.push(`/user/${holder.ProfileEntryResponse?.Username}`)}>
                                                                <img
                                                                    src={`${process.env.NEXT_PUBLIC_BASE_URL}/api/v0/get-single-profile-picture/${holder.HODLerPublicKeyBase58Check}?fallback=https://diamondapp.com/assets/img/default-profile-pic.png`}
                                                                    alt="avatar"
                                                                    className="rounded-full h-10 w-10 mr-2" />
                                                                <span className="flex w-[150px] truncate">
                                                                    {holder.ProfileEntryResponse?.Username ? holder.ProfileEntryResponse?.Username : holder.HODLerPublicKeyBase58Check}
                                                                    {holder.ProfileEntryResponse?.IsVerified && <CheckBadgeIcon className="ml-1 w-5 h-5 text-blue-500" />}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="border-b py-3 text-left">
                                                            {nanosToUSD(holder.ProfileEntryResponse?.CoinPriceDeSoNanos, 2)}
                                                        </td>
                                                        <td className="border-b py-3 text-center">
                                                            {usdYouWouldGetIfYouSoldDisplay(
                                                                holder.BalanceNanos,
                                                                holder.ProfileEntryResponse?.CoinEntry
                                                            )}
                                                        </td>
                                                    </tr>
                                                )) :
                                                    <tr>
                                                        <td colSpan={4}>
                                                            <Placeholder />
                                                        </td>
                                                    </tr>
                                                }
                                            </tbody>
                                        </table>
                                    </Tab.Panel>

                                    <Tab.Panel>
                                        <table className="table-auto w-full">
                                            <thead>
                                                <tr>
                                                    <th className="border-b border-black py-2 text-left">Username</th>
                                                    <th className="border-b border-black py-2 text-left">Price</th>
                                                    <th className="border-b border-black py-2 text-center">Value</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {coinsReceived?.length > 0 ? coinsReceived.map((holder: any, index: number) => (
                                                    <tr key={index}>
                                                        <td className="border-b py-3">
                                                            <div
                                                                className="flex items-center cursor-pointer"
                                                                onClick={() => router.push(`/user/${holder.ProfileEntryResponse?.Username}`)}>
                                                                <img
                                                                    src={`${process.env.NEXT_PUBLIC_BASE_URL}/api/v0/get-single-profile-picture/${holder.HODLerPublicKeyBase58Check}?fallback=https://diamondapp.com/assets/img/default-profile-pic.png`}
                                                                    alt="avatar"
                                                                    className="rounded-full h-10 w-10 mr-2" />
                                                                <span className="flex w-[150px] truncate">
                                                                    {holder.ProfileEntryResponse?.Username ? holder.ProfileEntryResponse?.Username : holder.HODLerPublicKeyBase58Check}
                                                                    {holder.ProfileEntryResponse?.IsVerified && <CheckBadgeIcon className="ml-1 w-5 h-5 text-blue-500" />}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="border-b py-3 text-left">
                                                            {nanosToUSD(holder.ProfileEntryResponse?.CoinPriceDeSoNanos, 2)}
                                                        </td>
                                                        <td className="border-b py-3 text-center">
                                                            {usdYouWouldGetIfYouSoldDisplay(
                                                                holder.BalanceNanos,
                                                                holder.ProfileEntryResponse?.CoinEntry
                                                            )}
                                                        </td>
                                                    </tr>
                                                )) :
                                                    <tr>
                                                        <td colSpan={4}>
                                                            <Placeholder />
                                                        </td>
                                                    </tr>
                                                }
                                            </tbody>
                                        </table>
                                    </Tab.Panel>
                                </Tab.Panels>
                            </Tab.Group>
                        </div>
                    </>
            }
        </div>
    )
}

export default ProfileWallet
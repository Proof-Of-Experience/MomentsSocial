import { LoadingSpinner } from '@/components/core/loader';
import { Placeholder } from '@/components/core/placeholder';
import { selectAuthUser } from '@/slices/authSlice';
import { desoPrice, nanosToUSD } from '@/utils';
import { Tab } from '@headlessui/react';
import { CheckBadgeIcon } from '@heroicons/react/20/solid';
import { ClipboardDocumentCheckIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/router';
import React, { Fragment, useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const ProfileWallet = ({ username, publiKey, userDetails }: any) => {
    const router = useRouter()
    const authUser = useSelector(selectAuthUser)
    const [exchangeData, setExchangeData] = useState<any>({})
    const [isLoaded, setisLoaded] = useState<boolean>(true)
    const [holders, setHolders] = useState<any>([])
    const [coinsPurchased, setCoinsPurchased] = useState<any>([])
    const [coinsReceived, setCoinsReceived] = useState<any>([])

    useEffect(() => {
        fetchExchangeRate()
    }, [])

    useEffect(() => {
        if (username) {
            fetchCreatorCoin()
        }
    }, [username])

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
        console.log('creatorCoinData', creatorCoinData);
        const modifiedCoinsPurchased = creatorCoinData?.Hodlers.length > 0 && creatorCoinData?.Hodlers.filter((item: any) => item.HasPurchased)
        console.log('modifiedCoinsPurchased', modifiedCoinsPurchased);

        setCoinsPurchased(modifiedCoinsPurchased)
        const modifiedCoinsReceived = creatorCoinData?.Hodlers.length > 0 && creatorCoinData?.Hodlers.filter((item: any) => !item.HasPurchased)
        setCoinsReceived(modifiedCoinsReceived)

        setisLoaded(false)
        setHolders(creatorCoinData?.Hodlers)
    }

    const fetchExchangeRate = async () => {
        const { getExchangeRates } = await import('deso-protocol')

        const response = await getExchangeRates()
        setExchangeData(response)
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
                                    <p className="font-bold">Publick Key</p>
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
                                        <span>$DESO Price</span>
                                        <span className="font-bold"> ≈{desoPrice(exchangeData?.USDCentsPerDeSoCoinbase)}</span>
                                    </p>
                                    <p>
                                        <span>Your $DESO </span>
                                        <span className="font-bold">
                                            {nanosToUSD(authUser?.Profile?.DESOBalanceNanos, 2)} ≈{desoPrice(exchangeData?.USDCentsPerDeSoCoinbase)}
                                        </span>
                                    </p>
                                </div>

                                <div className="flex justify-between">
                                    <button className="px-4 py-2 rounded-full bg-blue-500 text-white mr-4 w-full">
                                        Buy $DESO
                                    </button>
                                </div>
                            </div>


                            <div className="bg-gray-100 shadow rounded-lg px-5 py-6 col-span-1">
                                <div className="mb-5">
                                    <p>0.00 $DESO ~ $0</p>
                                    <p>0 Creator Coin</p>
                                </div>

                                <div className="flex justify-between">
                                    <button className="px-4 py-2 rounded-full border border-[#0066ff] text-black mr-4 w-full">
                                        Buy Creator Coin
                                    </button>
                                </div>
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
                                                    <th className="border-b border-black py-2 text-right">Actions</th>
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
                                                            {
                                                                holder.HasPurchased ? <span className="text-blue-500">Purchased</span> :
                                                                    <span className="text-lime-600">Received</span>
                                                            }
                                                        </td>
                                                        <td className="border-b py-3 text-center">{holder.BalanceNanos}</td>
                                                        <td className="border-b py-3 text-right">{holder.ProfileEntryResponse?.CoinPriceBitCloutNanos}</td>
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
                                                    <th className="border-b border-black py-2 text-right">Actions</th>
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
                                                            {
                                                                holder.HasPurchased ? <span className="text-blue-500">Purchased</span> :
                                                                    <span className="text-lime-600">Received</span>
                                                            }
                                                        </td>
                                                        <td className="border-b py-3 text-center">{holder.BalanceNanos}</td>
                                                        <td className="border-b py-3 text-right">{holder.ProfileEntryResponse?.CoinPriceBitCloutNanos}</td>
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
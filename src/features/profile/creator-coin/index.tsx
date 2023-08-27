import { LoadingSpinner } from '@/components/core/loader';
import { Placeholder } from '@/components/core/placeholder';
import { creatorCoinNanosToUSDNaive } from '@/utils';
import { CheckBadgeIcon } from '@heroicons/react/20/solid';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'


const CreatorCoin = ({ username }: any) => {
    const router = useRouter()
    const [hasLoaded, setHasLoaded] = useState<boolean>(true);
    const [holders, setHolders] = useState<any>([]);

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

        const creatorCoinData = await getHodlersForUser(params)
        setHasLoaded(false)
        setHolders(creatorCoinData?.Hodlers)


    }

    useEffect(() => {
        if (username) {
            fetchCreatorCoin()
        }
    }, [username])

    const _renderHolders = () => {
        return (
            <table className="table-auto w-full">
                <thead>
                    <tr>
                        <th className="border-b border-black py-2 text-left">Username</th>
                        <th className="border-b border-black py-2 text-left">Type</th>
                        <th className="border-b border-black py-2 text-center">Coins Held</th>
                        <th className="border-b border-black py-2 text-right">Coin Price Bit Clout</th>
                    </tr>
                </thead>
                <tbody>
                    {holders.map((holder: any, index: number) => (
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
                            <td className="border-b py-3 text-center">
                                {(holder.BalanceNanos / 1e9).toFixed(4)}
                            </td>
                            <td className="border-b py-3 text-right">
                                ≈ {creatorCoinNanosToUSDNaive(holder.BalanceNanos, holder.ProfileEntryResponse?.CoinPriceDeSoNanos, true)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        )
    }


    return (
        <div>
            {
                hasLoaded ? <LoadingSpinner isLoading={hasLoaded} /> :
                    holders.length > 0 ?
                        _renderHolders() :
                        <Placeholder text={`No one owns ${username} coin yet.`} />
            }
        </div>
    )
}

export default CreatorCoin
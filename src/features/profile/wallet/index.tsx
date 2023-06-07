import { LoadingSpinner } from '@/components/core/loader';
import { selectAuthUser } from '@/slices/authSlice';
import { desoPrice, nanosToUSD } from '@/utils';
import { ClipboardDocumentCheckIcon } from '@heroicons/react/24/outline';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const ProfileWallet = ({ username, publiKey, userDetails }: any) => {
    const authUser = useSelector(selectAuthUser)
    const [exchangeData, setExchangeData] = useState<any>({})
    const [isLoaded, setisLoaded] = useState<boolean>(true);
    const [nfts, setNfts] = useState<any>({});

    const fetchExchangeRate = async () => {
        const { getExchangeRates } = await import('deso-protocol')

        const response = await getExchangeRates()
        setisLoaded(false)
        setExchangeData(response)
    }

    useEffect(() => {
        fetchExchangeRate()
    }, [])

    console.log('authUser', authUser);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(authUser?.PublicKeyBase58Check)
        toast.success('Public key is copied to clipboard!')
    }


    return (
        <div>
            {
                isLoaded ? <LoadingSpinner isLoading={isLoaded} /> :
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



                        <div className="bg-gray-100 shadow rounded-lg px-5 py-6 col-span-1 flex flex-col justify-between">
                            <div className="mb-5">
                                <p>0.00 $DESO ~ $0</p>
                            </div>

                            <div className="flex justify-between">
                                <button className="px-4 py-2 rounded-full border border-[#0066ff] text-black mr-4 w-full">
                                    Buy Creator Coin
                                </button>
                            </div>
                        </div>
                    </div>
            }
        </div>
    )
}

export default ProfileWallet
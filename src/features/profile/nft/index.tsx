import { LoadingSpinner } from '@/components/core/loader';
import { Placeholder } from '@/components/core/placeholder';
import { parseStringInnerHtml } from '@/utils';
import React, { useEffect, useState } from 'react'


const ProfileNFT = ({ username, publicKey, userDetails }: any) => {
    const [isLoaded, setisLoaded] = useState<boolean>(true);
    const [nfts, setNfts] = useState<any>({});

    const fetchPublicPost = async () => {

        const { getNFTsForUser } = await import('deso-protocol')
        const params = {
            IsPending: false,
            ReaderPublicKeyBase58Check: publicKey,
            UserPublicKeyBase58Check: userDetails.Profile?.PublicKeyBase58Check,
        }
        const nftData: any = await getNFTsForUser(params);
        setisLoaded(false)

        if (nftData?.NFTsMap) {
            setNfts(nftData.NFTsMap)
        }
    }

    useEffect(() => {
        if (publicKey) {
            fetchPublicPost()
        }
    }, [publicKey])



    const _renderHolders = () => {
        return (
            <div className="">
                {/* {nfts.map((nft: any) =>
                    <div key={nft.PostHashHex} className="mb-12 border border-b rounded-lg p-5">
                        <div className="mb-5 flex items-center">
                            <img alt="..."
                                src={userDetails?.Avatar}
                                className=" shadow-xl rounded-full h-[40px] w-[40px] border-none" />
                            <p className="ml-2">{username}</p>
                        </div>
                        {
                            nft?.PostEntryResponse?.ImageURLs &&
                            <img src={nft?.PostEntryResponse?.ImageURLs[0]} alt='' className="max-w-[600px]" />
                        }
                        <div dangerouslySetInnerHTML={{ __html: parseStringInnerHtml(nft?.PostEntryResponse?.Body) }}></div>
                    </div>
                )} */}

                {
                    Object.entries(nfts).map(([key, value]: any) => {
                        return (
                            <div key={key.PostHashHex} className="mb-12 border border-b rounded-lg p-5">
                                <div className="mb-5 flex items-center">
                                    <a href={`/user/${value?.PostEntryResponse?.ProfileEntryResponse?.Username}`} className="flex items-center font-bold">
                                        <img alt="..."
                                            src={`https://node.deso.org/api/v0/get-single-profile-picture/${value?.PostEntryResponse?.PosterPublicKeyBase58Check}`}
                                            className=" shadow-xl rounded-full h-[40px] w-[40px] border-none" />
                                        <span className="ml-2 text-blue-500">{value?.PostEntryResponse?.ProfileEntryResponse?.Username}</span>
                                    </a>
                                </div>
                                {
                                    value?.PostEntryResponse?.ImageURLs &&
                                    <img src={value?.PostEntryResponse?.ImageURLs[0]} alt='' className="max-w-[600px]" />
                                }
                                <div
                                    className="mt-4"
                                    dangerouslySetInnerHTML={{ __html: parseStringInnerHtml(value?.PostEntryResponse?.Body) }}
                                />
                            </div>
                        )

                    })
                }

            </div>
        )
    }


    return (
        <div>
            {
                isLoaded ? <LoadingSpinner isLoading={isLoaded} /> :
                    nfts ?
                        _renderHolders() :
                        <Placeholder text={`No NFT found`} />
            }
        </div>
    )
}

export default ProfileNFT
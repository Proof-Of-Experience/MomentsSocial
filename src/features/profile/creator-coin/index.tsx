import { Placeholder } from '@/components/core/placeholder';
import React, { useEffect, useState } from 'react'

const CreatorCoin = ({ username }: any) => {
    const [isLoaded, setisLoaded] = useState<boolean>(true);
    const [holders, setHolders] = useState<any>([]);
    console.log('holders', holders);

    const fetchSingleProfile = async () => {
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
        setHolders(creatorCoinData?.Hodlers)
        

    }

    useEffect(() => {
        if (username) {
            fetchSingleProfile()
        }
    }, [username])

    const _renderHoist = () => {
        return(
            <div>
                Creator coin list
            </div>
        )
    }


    return (
        <div>
            {
                holders.length > 0 ?
                _renderHoist() :
                <Placeholder text={`No one owns ${username} coin yet.`} />
            }
        </div>
    )
}

export default CreatorCoin
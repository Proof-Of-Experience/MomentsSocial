import React, { useEffect, useState } from 'react'
import MainLayout from '@/layouts/main-layout'
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux';
import { selectAuthUser } from '@/slices/authSlice';
import { ApiDataType, apiService } from '@/utils/request';
import { PrimaryButton } from '@/components/core/button';
import { capitalizeFirstLetter } from '@/utils';


const Settings = () => {
    const router = useRouter()
    const authUser = useSelector(selectAuthUser)
    const [accounts, setAccounts] = useState<any>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const fetchUserData = async (page: number = 1) => {
        let apiUrl = `/api/users/${authUser.PublicKeyBase58Check}`;
        const apiData: ApiDataType = {
            method: 'get',
            url: apiUrl,
            customUrl: process.env.NEXT_PUBLIC_MOMENTS_UTIL_URL,
        };

        try {
            await apiService(apiData, (res: any, err: any) => {
                if (err) return err.response
                setAccounts(res?.accounts)

            });
        } catch (error: any) {
            console.error('error', error.response);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        if (!router.isReady) return;
        if (authUser) {
            fetchUserData();
        }
    }, [router.isReady, authUser]);

    return (

        <MainLayout title="Settings" mainWrapClass='p-5' isLoading={isLoading}>
            <section className="">
                <h2 className="text-2xl font-bold">Settings</h2>

                <h3 className="text-xl mt-2">Sync your video from other platforms</h3>

                <ul className='mt-4'>
                    {
                        accounts?.length > 0 && accounts.map((account: any) => {
                            
                            return (
                                <li className='flex items-center' key={account._id}>
                                    <div className='mr-5'>{capitalizeFirstLetter(account.name)}</div>
                                    <PrimaryButton
                                        disabled={account.isActive}
                                        text="Sync"
                                    />
                                </li>
                            )
                        })

                    }
                </ul>
            </section>
        </MainLayout>
    )
}

export default Settings
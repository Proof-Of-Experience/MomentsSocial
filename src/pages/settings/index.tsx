import React, { useEffect, useState } from 'react'
import MainLayout from '@/layouts/main-layout'
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux';
import { selectAuthUser } from '@/slices/authSlice';
import { ApiDataType, apiService } from '@/utils/request';
import { PrimaryButton } from '@/components/core/button';
import { capitalizeFirstLetter } from '@/utils';
import { toast } from 'react-toastify';


const Settings = () => {
    const router = useRouter()
    const authUser = useSelector(selectAuthUser)
    const [accounts, setAccounts] = useState<any>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [accessToken, setAccessToken] = useState<string | null>(null);


    const fetchUserData = async (page: number = 1) => {
        let apiUrl = `/api/users/${authUser.PublicKeyBase58Check}`;
        const apiData: ApiDataType = {
            method: 'get',
            url: apiUrl,
            customUrl: process.env.NEXT_PUBLIC_MOMENTS_UTIL_URL,
        };
        setIsLoading(true);

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

        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);
        const token = params.get("access_token");

        if (token) {
            setAccessToken(token);
            // remove the access token from the URL for security reasons
            window.history.replaceState(null, "", window.location.pathname);
        }
    }, [router.isReady, authUser]);

    const handleLoginClick = async () => {
        const redirectUri = `${window.location.origin}/api/auth/callback`;
        console.log('redirectUri', redirectUri);

        const scope = "https://www.googleapis.com/auth/youtube.readonly";
        const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.NEXT_PUBLIC_YOUTUBE_CLIENT_ID}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&access_type=offline`;

        window.location.href = authUrl;
    };

    const syncYoutubeVideos = async () => {
        if (!accessToken) {
            console.error("No access token available");
            return;
        }

        try {
            const response = await fetch("https://www.googleapis.com/youtube/v3/search?type=video&part=snippet&forMine=true&maxResults=50", {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });

            const data = await response.json();
            console.log(data.items); // Here's your list of videos.
            if (data.items.length > 0) {

            } else {
                toast.error('No videos found for this account!')
            }
            // Sync these videos to the platform

        } catch (error) {
            console.error("Error fetching YouTube videos:", error);
        }
    }


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
                                        text={accessToken ? 'Sync' : 'Login with Google'}
                                        onClick={accessToken ? syncYoutubeVideos : handleLoginClick}
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
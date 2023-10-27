import React, { useEffect, useState } from 'react'
import MainLayout from '@/layouts/main-layout'
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux';
import { selectAuthUser } from '@/slices/authSlice';
import { ApiDataType, apiService } from '@/utils/request';
import { PrimaryButton } from '@/components/core/button';
import { capitalizeFirstLetter } from '@/utils';
import { toast } from 'react-toastify';
import { isVideoIdInVideoData } from '@/utils/video';


const Settings = () => {
    const MAX_YT_VIDEOS = 50
    const router = useRouter()
    const authUser = useSelector(selectAuthUser)
    const [accounts, setAccounts] = useState<any>([]);
    const [videoData, setVideoData] = useState<any>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [postProcessing, setPostProcessing] = useState<boolean>(false);
    const [youtubeAccessToken, setYoutubeAccessToken] = useState<string | null>(null);
    const [processing, setProcessing] = useState<boolean>(false);


    const fetchUserPosts = async () => {

        const { getPostsForUser } = await import('deso-protocol')
        const data = {
            MediaRequired: true,
            NumToFetch: 20,
            ReaderPublicKeyBase58Check: authUser?.Profile?.PublicKeyBase58Check,
            Username: authUser?.Profile?.Username,
        }
        const publicData = await getPostsForUser(data);

        if (publicData?.Posts) {
            const newVideoData: any = publicData?.Posts.filter((item: any) => item.VideoURLs)
            setVideoData(newVideoData)
        } else {
            setVideoData([])
        }
    }


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
                setYoutubeAccessToken(res?.youtubeAccessToken)

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
            fetchUserPosts();
        }
    }, [router.isReady, authUser]);

    useEffect(() => {
        if (!router.isReady) return;
        if (authUser) {
            fetchUserData();
        }

        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);
        const token = params.get("access_token");

        if (token && !youtubeAccessToken && authUser) {
            updateUserData({ youtubeAccessToken: token })
            // remove the access token from the URL for security reasons
            window.history.replaceState(null, "", window.location.pathname);
        }
    }, [router.isReady, authUser]);

    const updateUserData = async (data: any) => {
        let apiUrl = `/api/users/${authUser?.PublicKeyBase58Check}`;
        const apiData: ApiDataType = {
            method: 'PATCH',
            url: apiUrl,
            data,
            customUrl: process.env.NEXT_PUBLIC_MOMENTS_UTIL_URL,
        };
        setProcessing(true);

        try {
            await apiService(apiData, (res: any, err: any) => {
                if (err) return err.response
                fetchUserData()
            });
        } catch (error: any) {
            console.error('error', error.response);
        } finally {
            setProcessing(false);
        }
    }

    const handleYoutubeAuthentication = async () => {
        const redirectUri = `${window.location.origin}/api/auth/callback`;
        const scope = "https://www.googleapis.com/auth/youtube.readonly";
        const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.NEXT_PUBLIC_YOUTUBE_CLIENT_ID}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&access_type=offline`;

        window.location.href = authUrl;
    };

    const fetchSubmitPost = async (item: any) => {
        const { submitPost } = await import('deso-protocol')
        const videodUrl = `https://www.youtube.com/watch?v=${item?.id?.videoId}`

        setPostProcessing(true)

        try {
            const postParams = {
                BodyObj: {
                    Body: item?.snippet?.description,
                    ImageURLs: [],
                    VideoURLs: [videodUrl]
                },
                IsHidden: false,
                MinFeeRateNanosPerKB: 1000,
                ParentStakeID: '',
                RepostedPostHashHex: '',
                UpdaterPublicKeyBase58Check: authUser.PublicKeyBase58Check || ''
            }

            const response: any = await submitPost(postParams)
            // const result = await identity.submitTx(response?.TransactionHex)            

            setPostProcessing(false)
        } catch (error) {
            console.error('error', error);
        }

    }

    const syncYoutubeVideos = async () => {

        if (!youtubeAccessToken) {
            handleYoutubeAuthentication()
            return;
        }

        accounts.forEach((account: any) => {
            if (account.isActive === true) {
                toast.success('Already synced')
                return;
            }
        })

        try {
            const response = await fetch(`https://www.googleapis.com/youtube/v3/search?type=video&part=snippet&forMine=true&maxResults=${MAX_YT_VIDEOS}`, {
                headers: {
                    Authorization: `Bearer ${youtubeAccessToken}`
                }
            });

            const data = await response.json();
            if (data?.error?.code === 401) {
                setYoutubeAccessToken(null)
                toast.success('Please authenticate again')
                return
            }

            const videoItems = data.items

            if (videoItems.length > 0) {
                videoItems.forEach(async (videoItem: any) => {

                    const videoId = videoItem?.id?.videoId;
                    if (videoId) {
                        if (!isVideoIdInVideoData(videoId, videoData)) {
                            await fetchSubmitPost(videoItem)
                            updateUserData({ accounts: [{ isActive: true, name: 'youtube' }] });
                        }
                    }
                });



                toast.success('Synced successfully')


            } else {
                toast.error('No videos found for this account!')
            }

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
                        authUser && accounts?.length > 0 && accounts.map((account: any) => {

                            return (
                                <li className='flex items-center' key={account._id}>
                                    <div className='mr-5'>{capitalizeFirstLetter(account.name)}</div>
                                    <PrimaryButton
                                        disabled={account.isActive || processing || postProcessing}
                                        text={account.isActive ? 'Already Synced' : (youtubeAccessToken ? (postProcessing ? 'Syncing' : 'Sync Now') : 'Authenticate to Sync')}
                                        onClick={syncYoutubeVideos}
                                    />

                                    {
                                        youtubeAccessToken &&
                                        <PrimaryButton
                                            text='Unauthenticate'
                                            onClick={() => updateUserData({ youtubeAccessToken: null })}
                                            className='ml-3'
                                            color='error'
                                        />
                                    }
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
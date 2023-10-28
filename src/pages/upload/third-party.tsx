import React, { useEffect, useState } from 'react';
import { PrimaryButton } from '@/components/core/button';
import LeftContent from '@/features/upload/left-content';
import MainLayout from '@/layouts/main-layout';
import { selectAuthUser } from '@/slices/authSlice';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { PrimaryInput } from '@/components/core/input/Input';
import { useRouter } from 'next/router';
import { checkIfYoutubeUrlExists, checkVideoOwnership, extractVideoIdFromUrl, handleYoutubeAuthentication } from '@/utils/youtube';
import { ApiDataType, apiService } from '@/utils/request';



const ThirdParty = () => {
    const router = useRouter();
    const authUser = useSelector(selectAuthUser);
    const [postProcessing, setPostProcessing] = useState<boolean>(false);
    const [youtubeAccessToken, setYoutubeAccessToken] = useState<string | null>(null);
    const [url, setUrl] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(true);


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
                setYoutubeAccessToken(res?.youtubeAccessToken)

            });
        } catch (error: any) {
            console.error('error', error.response);
        } finally {
            setIsLoading(false);
        }
    }


    const updateUserData = async (data: any) => {
        let apiUrl = `/api/users/${authUser?.PublicKeyBase58Check}`;
        const apiData: ApiDataType = {
            method: 'PATCH',
            url: apiUrl,
            data,
            customUrl: process.env.NEXT_PUBLIC_MOMENTS_UTIL_URL,
        };

        try {
            await apiService(apiData, (res: any, err: any) => {
                if (err) return err.response
                fetchUserData()
            });
        } catch (error: any) {
            console.error('error', error.response);
        }
    }


    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUrl(event.target.value);
    };



    const fetchSubmitPost = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!youtubeAccessToken) {
            handleYoutubeAuthentication()
            return;
        }


        if (!url) {
            toast.error('Please enter a youtube link first');
        }
        setPostProcessing(true)
        const exists = await checkIfYoutubeUrlExists(url, youtubeAccessToken);

        if (exists) {
            const isOwner = await checkVideoOwnership(youtubeAccessToken, extractVideoIdFromUrl(url))

            if (isOwner) {
                const { submitPost } = await import('deso-protocol')

                try {

                    const postParams = {
                        BodyObj: {
                            Body: '',
                            ImageURLs: [],
                            VideoURLs: [url]
                        },
                        IsHidden: false,
                        MinFeeRateNanosPerKB: 1000,
                        ParentStakeID: '',
                        RepostedPostHashHex: '',
                        UpdaterPublicKeyBase58Check: authUser.PublicKeyBase58Check || ''
                    }

                    const response: any = await submitPost(postParams)
                    toast.success('Youtube video posted successfully')
                    setUrl('')
                } catch (error) {
                    console.error('error', error);
                } finally {
                    setPostProcessing(false)
                }
            } else {
                setPostProcessing(false)
                toast.error('Please enter a youtube link from your channel')
            }
        } else {
            toast.error('Please enter a valid youtube link');
            setPostProcessing(false)
        }
    }



    return (
        <MainLayout title='Upload Third Party Link'>

            <div className="grid grid-cols-5 my-10 gap-5">

                <LeftContent />

                <div className="col-span-2">

                    <form onSubmit={fetchSubmitPost}>
                        <div className="text-center mx-auto border border-dashed border-[#5798fb] py-8 px-7 relative rounded-2xl mb-5">
                            {
                                youtubeAccessToken &&
                                <PrimaryInput
                                    placeholder="Enter youtube link here"
                                    className="w-full"
                                    onChange={handleChange}
                                    value={url}
                                />
                            }

                            {
                                !isLoading &&

                                <PrimaryButton
                                    className="w-full mt-1 py-3 text-lg"
                                    type="submit"
                                    text={youtubeAccessToken ? 'Upload Now' : 'Add youtube link'}
                                    loader={postProcessing}
                                    disabled={!url && youtubeAccessToken || postProcessing}
                                />
                            }

                        </div>
                    </form >
                </div>
            </div>
        </MainLayout >
    );
};

export default ThirdParty
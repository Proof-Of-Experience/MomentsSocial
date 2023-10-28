import React, { useEffect, useMemo, useState } from 'react';
import { PrimaryButton } from '@/components/core/button';
import LeftContent from '@/features/upload/left-content';
import MainLayout from '@/layouts/main-layout';
import { selectAuthUser } from '@/slices/authSlice';
import { useCreateAsset } from '@livepeer/react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { PrimaryInput } from '@/components/core/input/Input';
import { useRouter } from 'next/router';

const ThirdParty = () => {
    const router = useRouter();
    const [videoFile, setVideoFile] = useState<File | undefined | null>();
    const [previewUrl, setPreviewUrl] = useState<string>('');
    const [postProcessing, setPostProcessing] = useState<boolean>(false);
    const [youtubeAccessToken, setYoutubeAccessToken] = useState<string | null>(null);

    console.log('youtubeAccessToken', youtubeAccessToken);
    

    const {
        mutate: createAsset,
        data: asset,
        status,
        progress,
        error,
    } = useCreateAsset(
        videoFile
            ? {
                sources: [{ name: videoFile.name, file: videoFile }] as const,
            }
            : null,
    );
    const [description, setDescription] = useState<string>('');
    const [livepeerSuccess, setLivepeerSuccess] = useState<boolean>(status === 'success');
    const authUser = useSelector(selectAuthUser);


    useEffect(() => {
        if (!router.isReady) return;

        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);
        const token = params.get("access_token");

        if (token) {
            setYoutubeAccessToken(token)
            // remove the access token from the URL for security reasons
            window.history.replaceState(null, "", window.location.pathname);
        }
    }, [router.isReady, authUser]);

    const isLoading = useMemo(
        () =>
            status === 'loading' ||
            (asset?.[0] && asset[0].status?.phase !== 'ready'),
        [status, asset],
    );
    
    const handleYoutubeAuthentication = async () => {
        const currentUrl = encodeURIComponent(window.location.href);
        const redirectUri = `${window.location.origin}/api/auth/callback`;
        const scope = "https://www.googleapis.com/auth/youtube.readonly";
        const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.NEXT_PUBLIC_YOUTUBE_CLIENT_ID}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&access_type=offline&state=${currentUrl}`;
    
        window.location.href = authUrl;
    };


    const fetchSubmitPost = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!youtubeAccessToken) {
            handleYoutubeAuthentication()
            return;
        }

        return


        const { submitPost } = await import('deso-protocol')

        setPostProcessing(true)

        try {
            const postParams = {
                BodyObj: {
                    Body: description,
                    ImageURLs: [],
                    VideoURLs: [asset?.[0].downloadUrl || '']
                },
                IsHidden: false,
                MinFeeRateNanosPerKB: 1000,
                ParentStakeID: '',
                PostExtraData: {
                    Language: 'en',
                    LivepeerAssetId: '',
                    Node: '3',
                },
                RepostedPostHashHex: '',
                UpdaterPublicKeyBase58Check: authUser.currentUser.PublicKeyBase58Check || ''
            }

            const response: any = await submitPost(postParams)
            // const result = await identity.submitTx(response?.TransactionHex)            

            toast.success('Post created successfully')
            setPostProcessing(false)
            setVideoFile(null)
            setPreviewUrl('')
            setDescription('')
            setLivepeerSuccess(false)
        } catch (error) {
            console.error('error', error);
        }

    }

    return (
        <MainLayout title='Upload'>

            <div className="grid grid-cols-5 my-10 gap-5">

                <LeftContent />

                <div className="col-span-2">

                    <form onSubmit={fetchSubmitPost}>
                        <div className="text-center mx-auto border border-dashed border-[#5798fb] py-8 px-7 relative rounded-2xl mb-5">
                            <PrimaryInput
                                placeholder="Enter youtube link here"
                                className="w-full"
                            />

                        </div>

                        <PrimaryButton
                            className="w-full mt-1 py-3 text-lg"
                            type="submit"
                            text={!livepeerSuccess ? 'Next' : 'Submit Post'}
                            loader={postProcessing ? postProcessing : isLoading}
                            disabled={postProcessing ? postProcessing : isLoading}
                        />
                    </form >
                </div>
            </div>
        </MainLayout >
    );
};

export default ThirdParty
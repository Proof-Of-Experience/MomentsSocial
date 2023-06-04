import React, { useEffect, useMemo, useState } from 'react';
import { PrimaryButton } from '@/components/core/button';
import LeftContent from '@/features/upload/left-content';
import MainLayout from '@/layouts/main-layout';
import { selectAuthUser } from '@/slices/authSlice';
import { ArrowUpTrayIcon, XMarkIcon } from '@heroicons/react/20/solid';
import { useCreateAsset } from '@livepeer/react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import dynamic from 'next/dynamic';

const DynamicEditor = dynamic(
    () => import('@ckeditor/ckeditor5-react').then((mod) => mod.CKEditor),
    { ssr: false }
);
const ClassicEditor = typeof window !== 'undefined' ? require('@ckeditor/ckeditor5-build-classic') : null;


const UploadFile = () => {
    const [videoFile, setVideoFile] = useState<File | undefined | null>();
    const [previewUrl, setPreviewUrl] = useState<string>('');
    const [postProcessing, setPostProcessing] = useState<boolean>(false);

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
    const [editorLoaded, setEditorLoaded] = useState<boolean>(false);
    const [isDescriptionValid, setIsDescriptionValid] = useState<boolean>(true);
    const [livepeerSuccess, setLivepeerSuccess] = useState<boolean>(status === 'success');
    const authUser = useSelector(selectAuthUser);

    useEffect(() => {
        setLivepeerSuccess(status === 'success')
    }, [status === 'success'])

    useEffect(() => {
        setEditorLoaded(true);
    }, []);

    const isLoading = useMemo(
        () =>
            status === 'loading' ||
            (asset?.[0] && asset[0].status?.phase !== 'ready'),
        [status, asset],
    );


    const progressFormatted = useMemo(
        () =>
            progress?.[0].phase === 'failed'
                ? 'Failed to process video.'
                : progress?.[0].phase === 'waiting'
                    ? 'Waiting...'
                    : progress?.[0].phase === 'uploading'
                        ? `Uploading: ${Math.round(progress?.[0]?.progress * 100)}%`
                        : progress?.[0].phase === 'processing'
                            ? `Processing: ${Math.round(progress?.[0].progress * 100)}%`
                            : null,
        [progress],
    );

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const fileList = event.target.files;

        if (fileList?.length) {
            const firstFile = fileList[0];
            setVideoFile(firstFile);

            if (firstFile) {
                setPreviewUrl(URL.createObjectURL(firstFile));
            }
        }

    };    

    const handleVideoToLivepeer = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        // const data = {
        //     TransactionHex: "000005680000577b22426f6479223a227465737420706f7374222c22566964656f55524c73223a5b2268747470733a2f2f6c702d706c61796261636b2e636f6d2f686c732f373164306f666b32667a796a35716d682f766964656f225d7de807d461a9b1a8ae89bde6aa170021021a750e3941487413ac7d8e15452d1cb57c6a80a04ae7b77972012ea9dc4ba53003084c616e677561676502656e0f4c697665706565724173736574496400044e6f6465013300019502fde529b6f8e9cf949291b95f"
        // }

        // return


        if (!videoFile) {
            return;
        }

        createAsset?.()

    }

    const fetchSubmitPost = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const { submitPost } = await import('deso-protocol')

        if (!isDescriptionValid) {
            toast.error('Description is required')
            return
        }

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

    const renderPreviewVideo = () => {
        return (
            <>
                {
                    videoFile &&
                    <XMarkIcon
                        role="button"
                        color="#ff0000"
                        className="h-8 w-8 absolute -right-3 -top-3 border rounded-full bg-white cursor-pointer z-10"
                        onClick={() => {
                            setVideoFile(null)
                            setPreviewUrl('')
                        }}
                    />
                }
                <div className="mb-4">
                    <video
                        className="h-[330px] w-full"
                        src={previewUrl}
                        autoPlay
                        muted
                        controls
                    />
                </div>

                {
                    videoFile &&
                    <p><span className="font-semibold">File Name: </span> {videoFile.name}</p>
                }
            </>
        )
    }


    const renderFileUpload = () => {
        return (
            <div className="flex flex-col items-center justify-center text-center relative mb-10 h-[330px]">
                <input
                    type="file"
                    id="fileInput"
                    accept="video/*"
                    required
                    className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleFileSelect}
                />
                <label htmlFor="fileInput" className="cursor-pointer">
                    <div className="flex flex-col justify-center items-center">
                        <ArrowUpTrayIcon
                            className="h-20 w-20 z-10 text-black"
                        />
                        <h4 className="my-5 text-3xl">Drag & drop a file to upload</h4>
                        <h5 className="mb-5">Or <span className="text-blue-500">browse file </span>from device</h5>
                    </div>
                </label>
            </div>
        )
    }

    const renderProgressAndError = () => {
        return (
            <>
                {error?.message && <div className="my-2 text-center text-red-700"><p>{error.message}</p></div>}

                {progressFormatted &&
                    <p className="text-center">{progressFormatted}</p>}
            </>
        )
    }

    const handleEditorChange = (event: any, editor: any) => {
        const data = editor.getData();
        setDescription(data)
        setIsDescriptionValid(data.length > 0);
    };

    return (
        <MainLayout title='Upload'>

            <div className="grid grid-cols-5 my-10 gap-5">

                <LeftContent />

                <div className="col-span-2">

                    <form onSubmit={livepeerSuccess ? fetchSubmitPost : handleVideoToLivepeer}>
                        <div className="text-center mx-auto border border-dashed border-[#5798fb] py-8 px-7 relative rounded-2xl mb-5">
                            {
                                !livepeerSuccess ?
                                    previewUrl ? (renderPreviewVideo()) :
                                        renderFileUpload() :
                                    <div className="">
                                        <h4 className="text-left font-semibold mb-2">Other information</h4>

                                        {editorLoaded ? (
                                            <DynamicEditor
                                                editor={ClassicEditor}
                                                data={description}
                                                onChange={handleEditorChange}

                                            />
                                        ) : (
                                            <div>Loading CKEditor...</div>
                                        )}
                                    </div>
                            }

                        </div>

                        {renderProgressAndError()}

                        <PrimaryButton
                            className="w-full mt-1 py-3 text-lg"
                            type="submit"
                            text={!livepeerSuccess ? 'Next' : 'Submit Post'}
                            // loader={postProcessing ? postProcessing : isLoading || !createAsset}
                            // disabled={postProcessing ? postProcessing : isLoading || !createAsset}
                            loader={postProcessing ? postProcessing : isLoading}
                            disabled={postProcessing ? postProcessing : isLoading}
                        />
                    </form >
                </div>
            </div>
        </MainLayout >
    );
};

export default UploadFile
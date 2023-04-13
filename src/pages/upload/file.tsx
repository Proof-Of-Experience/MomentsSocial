

import { PrimaryButton } from '@/components/core/button';
import MainLayout from '@/layouts/main-layout';
import { ArrowUpTrayIcon, CheckBadgeIcon, LockClosedIcon, UserCircleIcon, XMarkIcon } from '@heroicons/react/20/solid';
import { useCreateAsset } from '@livepeer/react';
import React, { useMemo, useState } from 'react';

const UploadFile = () => {
    const [videoFile, setVideoFile] = useState<File | undefined | null>();
    const [previewUrl, setPreviewUrl] = useState<string>('');
    const [processing, setProcessing] = useState<boolean>(false);

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


    console.log('asset', asset);
    console.log('videoFile', videoFile);


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
                console.log('firstFile', firstFile);
                setPreviewUrl(URL.createObjectURL(firstFile));
            }
        }

    };


    const handleSubmit = async (e: any) => {
        e.preventDefault()

        if (!videoFile) {
            return;
        }

        createAsset?.();
    }


    return (
        <MainLayout title='Upload'>


            <div className="grid grid-cols-5 mt-10 gap-5">

                <div className="col-start-2 col-span-1">
                    <div className="border px-4 py-5 rounded-lg mb-2 flex">
                        <div className="mr-3">
                            <CheckBadgeIcon
                                color="#5798fb"
                                className="h-9 w-9 p-1 border rounded-full bg-white cursor-pointer z-10"
                            />
                        </div>
                        <div>
                            <h5 className="mb-1 font-semibold text-lg">Quality</h5>
                            <p>Your videos will look their best on every device, anywhere.</p>
                        </div>
                    </div>

                    <div className="border px-4 py-5 rounded-lg mb-2 flex">
                        <div className="mr-3">
                            <UserCircleIcon
                                color="#5798fb"
                                className="h-9 w-9 p-1 border rounded-full bg-white cursor-pointer z-10"
                            />
                        </div>
                        <div>
                            <h5 className="mb-1 font-semibold text-lg">Community</h5>
                            <p>Join the world’s best community of talented, supportive creators.</p>
                        </div>
                    </div>

                    <div className="border px-4 py-5 rounded-lg mb-2 flex">
                        <div className="mr-3">
                            <LockClosedIcon
                                color="#5798fb"
                                className="h-9 w-9 p-1 border rounded-full bg-white cursor-pointer z-10"
                            />
                        </div>
                        <div>
                            <h5 className="mb-1 font-semibold text-lg">Security</h5>
                            <p>Your data will be secured. No one can take access of your data.</p>
                        </div>
                    </div>
                </div>

                <div className="col-span-2">

                    <form onSubmit={handleSubmit}>
                        <div className="text-center mx-auto border border-dashed border-[#5798fb] py-8 px-7 relative rounded-2xl mb-5">

                            {
                                previewUrl ? (
                                    <>
                                        <div className="flex justify-between mb-4">
                                            <video
                                                className="h-[330px] w-full"
                                                src={previewUrl}
                                                autoPlay
                                                muted
                                                controls
                                            />
                                            <XMarkIcon
                                                role="button"
                                                color="#ff0000"
                                                className="h-8 w-8 absolute -right-3 -top-3 border rounded-full bg-white cursor-pointer z-10"
                                                onClick={() => {
                                                    setVideoFile(null)
                                                    setPreviewUrl('')
                                                }}
                                            />
                                        </div>

                                        {
                                            videoFile ?
                                                <p><span className="font-semibold">File Name: </span> {videoFile.name}</p> :
                                                <p>Select a video file to upload.</p>
                                        }
                                    </>
                                ) :

                                    <div className="flex flex-col items-center justify-center text-center relative mb-10 h-[330px]">
                                        <input
                                            type="file"
                                            id="fileInput"
                                            accept="video/*"
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

                                            {/* <p className="bg-blue-400 text-white py-2 px-4 rounded cursor-pointer block">Select a file</p> */}
                                        </label>
                                    </div>
                            }

                        </div>



                        <div className="my-2 text-center text-red-700">{error?.message && <p>{error.message}</p>}</div>


                        {
                            progressFormatted &&
                            <p className="text-center">{progressFormatted}</p>
                        }

                        <PrimaryButton
                            className="w-full mt-1 py-3 text-lg"
                            type="submit"
                            text='Submit Video'
                            loader={processing}
                            disabled={isLoading || !createAsset}
                        />
                    </form >
                </div>
            </div>
        </MainLayout>
    );
};

export default UploadFile


import { PrimaryButton } from '@/components/core/button';
import MainLayout from '@/layouts/main-layout';
import { useCreateAsset } from '@livepeer/react';
import React, { useMemo, useState } from 'react';

const UploadFile = () => {
    const [videoFile, setVideoFile] = useState<File | undefined>();
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


            <div className="grid grid-cols-7 mt-10">
                <div className="col-start-3 col-span-4">

                    <form onSubmit={handleSubmit} className="">
                        <div>
                            {previewUrl && (
                                <video src={previewUrl} autoPlay muted controls className="max-w-xl" />
                            )}
                        </div>

                        {videoFile ? <p>{videoFile.name}</p> : <p>Select a video file to upload.</p>}

                        <div>{error?.message && <p>{error.message}</p>}</div>

                        <div>
                            {progressFormatted && <p>{progressFormatted}</p>}
                        </div>


                        <div className="relative mb-10 grid grid-cols-3">
                            <input
                                type="file"
                                id="fileInput"
                                accept="video/*"
                                className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                                onChange={handleFileSelect}
                            />
                            <label htmlFor="fileInput" className="bg-blue-500 text-white py-2 px-4 rounded cursor-pointer">
                                Choose a file
                            </label>
                        </div>

                        <PrimaryButton
                            type="submit"
                            text='Upload Video'
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
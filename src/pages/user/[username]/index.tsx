import React, { Fragment, useEffect, useState } from 'react'
import About from '@/features/public-profile/about'
import Banner from '@/features/public-profile/banner'
import Info from '@/features/public-profile/info'
import Moments from '@/components/snippets/moments';
import Videos from '@/components/snippets/videos';
import MainLayout from '@/layouts/main-layout'
import { Tab } from '@headlessui/react'
import { useRouter } from 'next/router'
import { getPublicPostData } from '../../api/post'
import { Placeholder } from '@/components/core/placeholder';

const PublicProfile = () => {
    const router = useRouter()
    const { username }: any = router.query
    const [publiKey, setPubliKey] = useState<string>("");
    const [userDetails, setUserDetails] = useState<any>({});
    const [videoData, setVideoData] = useState<string[]>([]);
    const [imageData, setImageData] = useState<string[]>([]);
    const [isLoaded, setisLoaded] = useState<boolean>(true);

    console.log('router', router);
    
    const fetchSingleProfile = async () => {
        const { getSingleProfile, buildProfilePictureUrl } = await import('deso-protocol')
        const params = {
            Username: username,
            PublicKeyBase58Check: ''
        }

        const profileData: any = await getSingleProfile(params)
        const Avatar = await buildProfilePictureUrl(profileData?.Profile?.PublicKeyBase58Check, {
            fallbackImageUrl: ''
        })

        setUserDetails({ ...profileData, Avatar })
        setPubliKey(profileData?.Profile?.PublicKeyBase58Check)
        setisLoaded(false)
    }

    const fetchPublicPost = async () => {
        const data = {
            MediaRequired: true,
            NumToFetch: 20,
            ReaderPublicKeyBase58Check: publiKey,
            Username: username,
        }
        const publicData = await getPublicPostData(data);

        if (publicData?.Posts) {
            const newVideoData: any = publicData?.Posts.filter((item: any) => item.VideoURLs)
            const newImageData: any = publicData?.Posts.filter((item: any) => item.ImageURLs)
            setVideoData(newVideoData)
            setImageData(newImageData)
        }
    }

    useEffect(() => {
        if (username) {
            fetchSingleProfile()
        }
    }, [username])

    useEffect(() => {
        if (username && publiKey) {
            fetchPublicPost()
        }
    }, [username, publiKey])


    return (

        <MainLayout title='Upload' isLoading={isLoaded}>
            <Banner />

            <section className="relative py-[216px]">
                <div className="container mx-auto px-4">
                    <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg">

                        <Info userDetails={userDetails} />

                        <div className="mt-5">
                            <Tab.Group>
                                <Tab.List className="border-b px-10">
                                    <Tab as={Fragment}>
                                        {({ selected }) =>
                                            <button className={`${selected ? 'text-white bg-[#4267F7]' : 'text-black'} mr-5 py-2 px-5 font-medium focus-visible:outline-none`}>
                                                Videos
                                            </button>
                                        }
                                    </Tab>
                                    <Tab as={Fragment}>
                                        {({ selected }) =>
                                            <button className={`${selected ? 'text-white bg-[#4267F7]' : 'text-black'} mr-5 py-2 px-5 font-medium focus-visible:outline-none`} >
                                                Moments
                                            </button>
                                        }
                                    </Tab>
                                    <Tab as={Fragment}>
                                        {({ selected }) =>
                                            <button className={`${selected ? 'text-white bg-[#4267F7]' : 'text-black'} mr-5 py-2 px-5 font-medium focus-visible:outline-none`} >
                                                About
                                            </button>
                                        }
                                    </Tab>
                                </Tab.List>

                                <Tab.Panels className="px-10 mt-2 mb-16">
                                    <Tab.Panel>
                                        {
                                            videoData.length > 0 ?
                                                <Videos videoData={videoData} /> :
                                                <div className="mt-10">
                                                    <Placeholder
                                                        text="No video available"
                                                    />
                                                </div>
                                        }
                                    </Tab.Panel>
                                    <Tab.Panel>
                                        {
                                            imageData.length > 0 ?
                                                <Moments imageData={imageData} /> :
                                                <div className="mt-10">
                                                    <Placeholder
                                                        text="No moment available"
                                                    />
                                                </div>
                                        }
                                    </Tab.Panel>
                                    <Tab.Panel>
                                        <About />
                                    </Tab.Panel>
                                </Tab.Panels>
                            </Tab.Group>
                        </div>
                    </div>
                </div>
            </section>
        </MainLayout>
    )
}

export default PublicProfile
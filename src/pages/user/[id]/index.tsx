import React, { useEffect, useState } from 'react'
import About from '@/features/public-profile/about'
import Banner from '@/features/public-profile/banner'
import Info from '@/features/public-profile/info'
import Moments from '@/components/snippets/moments';
import Videos from '@/components/snippets/videos';
import MainLayout from '@/layouts/main-layout'
import { Tab } from '@headlessui/react'
import { useRouter } from 'next/router'
import { getPublicPostData } from '../../api/post'
import { getSingleProfile } from '@/pages/api/profile'

const PublicProfile = () => {
    const router = useRouter()
    const { id }: any = router.query
    const [publiKey, setPubliKey] = useState("");
    const [videoData, setVideoData] = useState<string[]>([]);
    const [imageData, setImageData] = useState<string[]>([]);

    console.log('id', id);
    console.log('publiKey', publiKey);


    const fetchSingleProfile = async () => {
        const data = {
            Username: id,
        }
        const profileData = await getSingleProfile(data);
        setPubliKey(profileData?.Profile?.PublicKeyBase58Check)
    }

    const fetchPublicPost = async () => {
        const data = {
            MediaRequired: true,
            NumToFetch: 20,
            ReaderPublicKeyBase58Check: publiKey,
            Username: id,
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
        if (id) {
            fetchSingleProfile()
        }
    }, [id])

    useEffect(() => {
        if (id && publiKey) {
            fetchPublicPost()
        }
    }, [id, publiKey])


    return (

        <MainLayout title='Upload'>
            <Banner />

            <section className="relative py-[216px]">
                <div className="container mx-auto px-4">
                    <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg">

                        <Info />

                        <div className="mt-5">
                            <Tab.Group>
                                <Tab.List className="border-b px-10">
                                    <Tab>
                                        {({ selected }) => (
                                            <button className={`${selected ? 'text-white bg-gray-500' : 'text-black'} mr-5 py-2 px-5 font-medium focus-visible:outline-none`}>
                                                Videos
                                            </button>
                                        )}
                                    </Tab>
                                    <Tab className="">
                                        {({ selected }) => (
                                            <button className={`${selected ? 'text-white bg-gray-500' : 'text-black'} mr-5 py-2 px-5 font-medium focus-visible:outline-none`} >
                                                Moments
                                            </button>
                                        )}
                                    </Tab>
                                    <Tab>

                                        {({ selected }) => (
                                            <button className={`${selected ? 'text-white bg-gray-500' : 'text-black'} mr-5 py-2 px-5 font-medium focus-visible:outline-none`} >
                                                About
                                            </button>
                                        )}
                                    </Tab>
                                </Tab.List>

                                <Tab.Panels className="px-10 mt-2 mb-16">
                                    <Tab.Panel>
                                        <Videos videoData={videoData} />
                                    </Tab.Panel>
                                    <Tab.Panel>
                                        <Moments imageData={imageData} />
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
import Banner from '@/features/public-profile/banner'
import Info from '@/features/public-profile/info'
import Moments from '@/features/public-profile/moments'
import Videos from '@/features/public-profile/videos'
import MainLayout from '@/layouts/main-layout'
import { Tab } from '@headlessui/react'
import { useRouter } from 'next/router'
import React from 'react'

const PublicProfile = () => {
    const router = useRouter()
    const { id } = router.query

    console.log('id', id);


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
                                    <Tab className="py-2 px-5 font-medium focus-visible:bg-gray-500 focus-visible:outline-none focus-visible:text-white">
                                        Videos
                                    </Tab>
                                    <Tab className="mr-10 py-2 px-5 font-medium focus-visible:bg-gray-500 focus-visible:outline-none focus-visible:text-white">
                                        Moments
                                    </Tab>
                                    <Tab className="mr-10 py-2 px-5 font-medium focus-visible:bg-gray-500 focus-visible:outline-none focus-visible:text-white">
                                        About
                                    </Tab>
                                </Tab.List>

                                <Tab.Panels className="px-10 mt-2 mb-16">
                                    <Tab.Panel>
                                        <Videos />
                                    </Tab.Panel>
                                    <Tab.Panel>
                                        <Moments />
                                    </Tab.Panel>
                                    <Tab.Panel>Content 3</Tab.Panel>
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
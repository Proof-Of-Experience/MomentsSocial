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
            <section className="relative block h-500-px">
                <div className="absolute top-0 w-full bg-center bg-cover h-[300px]"
                    style={{
                        backgroundImage: 'url(\'https://images.unsplash.com/photo-1499336315816-097655dcfbda?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=crop&amp;w=2710&amp;q=80\');'
                    }}>
                    <span id="blackOverlay" className="w-full h-full absolute opacity-50 bg-black"></span>
                </div>
            </section>

            <section className="relative py-[216px] bg-blueGray-200">
                <div className="container mx-auto px-4">
                    <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg">
                        <div className="px-6">
                            <div className="flex flex-wrap justify-center">

                                <div className="w-full lg:w-4/12 px-4 lg:order-1">
                                    <div className="flex justify-center py-4 lg:pt-4 pt-8">
                                        <div className="mr-4 p-3 text-center">
                                            <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">22</span><span className="text-sm text-blueGray-400">Friends</span>
                                        </div>
                                        <div className="mr-4 p-3 text-center">
                                            <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">10</span><span className="text-sm text-blueGray-400">Photos</span>
                                        </div>
                                        <div className="lg:mr-4 p-3 text-center">
                                            <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">89</span><span className="text-sm text-blueGray-400">Comments</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="w-full lg:w-3/12 px-4 lg:order-2 flex justify-center">
                                    <div className="relative -mt-[80px]">
                                        <img alt="..."
                                            src="https://www.w3schools.com/howto/img_avatar.png"
                                            className=" shadow-xl rounded-full h-[160px] w-[160px] align-middle border-none max-w-150-px" />
                                    </div>
                                </div>

                                <div className="w-full lg:w-4/12 px-4 lg:order-3 lg:text-right lg:self-center">
                                    <div className="py-6 px-3 mt-32 sm:mt-0">
                                        <button className="bg-pink-500 active:bg-pink-600 uppercase text-white font-bold hover:shadow-md shadow text-xs px-4 py-2 rounded outline-none focus:outline-none sm:mr-2 mb-1 ease-linear transition-all duration-150" type="button">
                                            Subscribe
                                        </button>
                                    </div>
                                </div>
                            </div>


                            <div className="text-center mt-5">
                                <h3 className="text-4xl font-semibold leading-normal text-blueGray-700 mb-0">
                                    Jenna Stones
                                </h3>
                                <div className="text-sm leading-normal mt-0 mb-2 text-blueGray-400 font-bold uppercase">
                                    <i className="fas fa-map-marker-alt mr-2 text-lg text-blueGray-400"></i>
                                    Los Angeles, California
                                </div>

                            </div>


                            <div className="mt-10 py-10 border-t border-blueGray-200 text-center">
                                <Tab.Group>
                                    <Tab.List>
                                        <Tab>Tab 1</Tab>
                                        <Tab>Tab 2</Tab>
                                        <Tab>Tab 3</Tab>
                                    </Tab.List>
                                    <Tab.Panels>
                                        <Tab.Panel>Content 1</Tab.Panel>
                                        <Tab.Panel>Content 2</Tab.Panel>
                                        <Tab.Panel>Content 3</Tab.Panel>
                                    </Tab.Panels>
                                </Tab.Group>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </MainLayout>
    )
}

export default PublicProfile
import React, { Fragment, useEffect, useState } from 'react'
import About from '@/features/public-profile/about'
import Banner from '@/features/public-profile/banner'
import Info from '@/features/public-profile/info'
import Moments from '@/components/snippets/moments';
import Videos from '@/components/snippets/videos';
import MainLayout from '@/layouts/main-layout'
import { Tab } from '@headlessui/react'
import { useRouter } from 'next/router'
import { Placeholder } from '@/components/core/placeholder';
import CreatorCoin from '@/features/profile/creator-coin';
import Diamonds from '@/features/profile/diamonds';
import ProfileBlog from '@/features/profile/blog';
import ProfileNFT from '@/features/profile/nft';
import ProfileWallet from '@/features/profile/wallet';
import { useSelector } from 'react-redux';
import { selectAuthUser } from '@/slices/authSlice';


const PublicProfile = () => {
    const router = useRouter()
    const authUser = useSelector(selectAuthUser)
    const { username }: any = router.query
    const [publiKey, setPubliKey] = useState<string>("")
    const [userDetails, setUserDetails] = useState<any>({})
    const [videoData, setVideoData] = useState<string[]>([])
    const [imageData, setImageData] = useState<string[]>([])
    const [isLoaded, setisLoaded] = useState<boolean>(true)
    const [reactionClick, onReactionClick] = useState<any>(null)
    const [activeTab, setActiveTab] = useState<number>(0)

    
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

        const updatedData = {
            ...profileData, Avatar,
        }
        setUserDetails(updatedData)
        setPubliKey(profileData?.Profile?.PublicKeyBase58Check)
    }

    const fetchPublicPost = async () => {

        const { getPostsForUser } = await import('deso-protocol')
        const data = {
            MediaRequired: true,
            NumToFetch: 20,
            ReaderPublicKeyBase58Check: publiKey,
            Username: username,
        }
        const publicData = await getPostsForUser(data);

        if (publicData?.Posts) {
            const newVideoData: any = publicData?.Posts.filter((item: any) => item.VideoURLs)
            const newImageData: any = publicData?.Posts.filter((item: any) => item.ImageURLs)
            setVideoData(newVideoData)
            setImageData(newImageData)
        } else {
            setVideoData([])
            setImageData([])
        }
        setisLoaded(false)
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
    }, [username, publiKey, reactionClick])

    const tabHeaders = [
        'Videos',
        'Moments',
        'Creator Coin',
        'Diamonds',
        'Blog',
        'NFTs',
        'My Wallets',
        'About',
    ]


    return (

        <MainLayout title={username} isLoading={isLoaded}>
            <Banner />

            <section className="relative py-[216px]">
                <div className="container mx-auto px-4">
                    <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg">

                        <Info username={username} userDetails={userDetails} setActiveTab={setActiveTab} />

                        <div className="mt-5 min-h-[200px]">
                            <Tab.Group key={activeTab} defaultIndex={activeTab} onChange={setActiveTab}>
                                <Tab.List className="border-b px-10">
                                    {
                                        tabHeaders.map((item: string, index: number) => {
                                            if (authUser?.ProfileEntryResponse?.Username !== username && item === 'My Wallets') {
                                                return null;
                                            }

                                            return (
                                                <Tab as={Fragment} key={index}>
                                                    {({ selected }) =>
                                                        <button
                                                            className={`${selected ? 'text-[#4267F7] border-b-4 border-[#4267F7]' : 'text-black'} mr-5 py-2 px-5 font-medium focus-visible:outline-none`}>
                                                            {item}
                                                        </button>
                                                    }
                                                </Tab>
                                            )
                                        })
                                    }
                                </Tab.List>

                                <Tab.Panels className="px-10 mt-2 mb-16">
                                    <Tab.Panel>
                                        {
                                            videoData.length > 0 ?
                                                <Videos videoData={videoData} onReactionClick={onReactionClick} /> :
                                                !isLoaded &&
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

                                                !isLoaded &&
                                                <div className="mt-10">
                                                    <Placeholder
                                                        text="No moment available"
                                                    />

                                                </div>
                                        }
                                    </Tab.Panel>
                                    <Tab.Panel>
                                        <CreatorCoin username={username} />
                                    </Tab.Panel>
                                    <Tab.Panel>
                                        <Diamonds username={username} />
                                    </Tab.Panel>
                                    <Tab.Panel>
                                        <ProfileBlog username={username} publiKey={publiKey} userDetails={userDetails} />
                                    </Tab.Panel>
                                    <Tab.Panel>
                                        <ProfileNFT username={username} publiKey={publiKey} userDetails={userDetails} />
                                    </Tab.Panel>
                                    {
                                        authUser?.ProfileEntryResponse?.Username === username &&
                                        <Tab.Panel>
                                            <ProfileWallet username={username} publiKey={publiKey} userDetails={userDetails} />
                                        </Tab.Panel>
                                    }
                                    <Tab.Panel>
                                        <About username={username} userDetails={userDetails} />
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
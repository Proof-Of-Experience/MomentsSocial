
import { NextPage } from 'next';
import { useSelector } from 'react-redux';
import UploadCard from '@/features/upload/card';
import LoginRequired from '@/features/upload/login-required';
import MainLayout from '@/layouts/main-layout'
import { selectAuthUser } from '@/slices/authSlice';
import { ArrowUpTrayIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/router';

const Upload: NextPage = () => {
  const router = useRouter();
  const authUser = useSelector(selectAuthUser);

  return (
    <MainLayout title='Upload'>

      {
        authUser?.currentUser ?
          <div className="grid grid-cols-5 mt-10">
            <div className="col-start-2 col-span-3">
              <h2 className="text-3xl">Upload a Video</h2>
              <p className="mt-2">You can now combine multiple sources into the same DTube video.</p>

              <div className="mt-5 grid grid-cols-3 gap-8">
                <UploadCard
                  icon={<GlobeAltIcon className="h-[100px] text-gray-600" />}
                  title="Peer to Peer"
                />
                <UploadCard
                  icon={<GlobeAltIcon className="h-[100px] text-gray-600" />}
                  title="Third Party"
                />
                <UploadCard
                  icon={<ArrowUpTrayIcon className="h-[100px] text-gray-600" />}
                  title="File Upload"
                  onClick={() => router.push('/upload/file')}
                />
              </div>
            </div>
          </div>
          : <LoginRequired />
      }

    </MainLayout>
  )
}

export default Upload


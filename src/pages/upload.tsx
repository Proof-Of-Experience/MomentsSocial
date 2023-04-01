import UploadCard from '@/features/upload';
import MainLayout from '@/layouts/MainLayout'
import { selectAuthUser } from '@/slices/authSlice';
import { ArrowUpTrayIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
import { NextPage } from 'next';
import { useSelector } from 'react-redux';

const Upload: NextPage = () => {
  const authUser = useSelector(selectAuthUser);

  console.log('authUser', authUser);
  

  return (
    <MainLayout title='Upload'>

      <div className="grid grid-cols-5 mt-10">
        <div className="col-start-2 col-span-3">
          <h2 className="text-3xl">Upload a Video</h2>
          <p className="mt-2">You can now combine multiple sources into the same DTube video.</p>

          <div className="mt-5 grid grid-cols-3 gap-8">
            <UploadCard
              icon={<GlobeAltIcon className="h-[100px] text-gray-600" />}
            />
            <UploadCard
              icon={<GlobeAltIcon className="h-[100px] text-gray-600" />}
            />
            <UploadCard
              icon={<ArrowUpTrayIcon className="h-[100px] text-gray-600" />}
            />
          </div>
        </div>
      </div>

    </MainLayout>
  )
}

export default Upload


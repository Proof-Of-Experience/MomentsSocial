import { MetaData } from '@/components/snippets';
import Header from '../Header';
import { LeftSidebar } from '../Sidebar';

interface MainLayoutProps {
  children: JSX.Element | JSX.Element[] | string;
  title?: string;
}

const MainLayout = ({ title, children }: MainLayoutProps) => {
  return (
    <>
      <MetaData title={title} />

      <div className='grid grid-cols-12 font-poppins'>
        <div className='col-span-1 bg-gray-50 h-screen shadow-md'>
          <LeftSidebar />
        </div>
        <div className='col-span-11'>
          <Header />

          <div className='p-5'>
            {children}
          </div>
        </div>
      </div>
    </>
  )
}

export default MainLayout
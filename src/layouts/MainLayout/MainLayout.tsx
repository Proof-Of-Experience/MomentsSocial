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
      <Header />

      <main className='container grid grid-cols-4 gap-4'>
        <LeftSidebar />
        {children}
      </main>
    </>
  )
}

export default MainLayout
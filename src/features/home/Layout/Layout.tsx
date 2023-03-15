import VideoLayoutContext from '@/contexts/VideosContext';
import { useContext } from 'react';

const Layout = () => {
  const { updateLayout } = useContext(VideoLayoutContext)

  return (
    <div>
      <button className="mr-4" onClick={() => updateLayout('grid')}>Grid</button>
      <button className="mr-4" onClick={() => updateLayout('list')}>List</button>
      <button className="" onClick={() => updateLayout('blog')}>Blog</button>
    </div>
  )
}

export default Layout

export async function getServerSideProps(context: any) {
  return {
    props: {}
  };
}

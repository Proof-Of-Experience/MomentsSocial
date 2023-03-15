import VideoItem from '@/components/snippets/VideoItem';
import VideoLayoutContext from '@/contexts/VideosContext';
import { useContext } from 'react';

const Videos = () => {
    const { gridView } = useContext(VideoLayoutContext)

    const mockData = [
        'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    ]

    const showGridCol = () => {
        if (gridView === 'grid') {
            return '5'
        } else if(gridView === 'list') {
            return '1'
        }
    }

    return (
        <div className="mt-8">
            <div className={`grid lg:grid-cols-${showGridCol()} md:grid-cols-6 gap-x-5 gap-y-10`}>
                {
                    mockData.map((item, index) => {
                        return (
                            <div key={`real-${index}`} className="overflow-hidden">
                                <VideoItem />
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default Videos

export async function getServerSideProps(context: any) {
    return {
        props: {}
    };
}

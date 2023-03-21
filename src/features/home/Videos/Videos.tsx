import VideoItem from '@/components/snippets/VideoItem';
import VideoLayoutContext from '@/contexts/VideosContext';
import { useContext } from 'react';

const Videos = () => {
    const { gridView }: any = useContext(VideoLayoutContext)

    console.log('gridView', gridView);
    

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
            return 'grid-cols-6'
        } else if(gridView === 'list') {
            return 'grid-cols-1'
        } else {
            return 'grid-cols-3'
        }
    }

    return (
        <div className="mt-8">
            <div className={`grid ${showGridCol()} gap-x-5 gap-y-10`}>
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

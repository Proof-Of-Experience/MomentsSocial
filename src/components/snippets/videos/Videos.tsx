import VideoSkeleton from '@/components/skeletons/video';
import VideoItem from '@/components/snippets/video';
import VideoLayoutContext from '@/contexts/VideosContext';
import { useContext } from 'react';

const Videos = ({ videoData = [], onReactionClick, videoLoaded, ...rest }: any) => {

    const { gridView }: any = useContext(VideoLayoutContext)
    const SKELETON_COUNT = 5;

    const showGridCol = () => {
        if (gridView === 'grid') {
            return 'grid-cols-5'
        } else {
            return 'grid-cols-3'
        }
    }

    const renderVideoItems = () => {
        if (videoLoaded) {
            // Display skeletons when video is not loaded
            return Array(SKELETON_COUNT).fill(null).map((_, idx) => (
                <div key={`skeleton-${idx}`} className="overflow-hidden">
                    <VideoSkeleton />
                </div>
            ));
        }

        // Display video items when loaded
        return videoData.map((item: any, index: any) => (
            <div key={`moment-${index}`} className="overflow-hidden">
                <VideoItem {...rest} item={item} onReactionClick={() => onReactionClick(new Date())} />
            </div>
        ));
    }


    return (
        <div className={`grid ${showGridCol()} gap-x-5 gap-y-10`}>
            {renderVideoItems()}
        </div>
    );
}

export default Videos
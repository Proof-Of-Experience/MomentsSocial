import VideoItem from '@/components/snippets/video';
import VideoLayoutContext from '@/contexts/VideosContext';
import { useContext, useState } from 'react';

const Videos = ({ videoData, onReactionClick, ...rest }: any) => {

    const { gridView }: any = useContext(VideoLayoutContext)


    const showGridCol = () => {
        if (gridView === 'grid') {
            return 'grid-cols-5'
        } else if (gridView === 'list') {
            return 'grid-cols-1'
        } else {
            return 'grid-cols-3'
        }
    }

    return (
        <div className={`grid ${showGridCol()} gap-x-5 gap-y-10`}>
            {
                videoData.map((item: any, index: any) => {
                    return (
                        <div key={`moment-${index}`} className="overflow-hidden">
                            <VideoItem {...rest} item={item} onReactionClick={() => onReactionClick(new Date())} />
                        </div>
                    )
                })
            }
        </div>
    )
}

export default Videos
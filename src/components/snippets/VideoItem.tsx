import React from 'react'

interface VideoItemProps {
  imgUrl?: string
}

const VideoItem = ({ imgUrl, ...rest }: VideoItemProps) => {

  return (
    <div style={{
      overflow: 'hidden',
      width: '100%',
    }}>
      <video width="100%" autoPlay loop>
        <source src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4" />
      </video>
      <h4 className="mt-2 text-sm font-bold">Debugging useEffect Issues Made Simple</h4>
      <p className="text-sm">Test blogger</p>
      <p className="text-sm"><small>1133 likes</small></p>
    </div>
  )
}

export default VideoItem
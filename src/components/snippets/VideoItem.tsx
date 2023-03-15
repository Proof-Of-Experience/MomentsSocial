import React from 'react'

interface VideoItemProps {
  imgUrl?: string
}

const VideoItem = ({ imgUrl, ...rest }: VideoItemProps) => {
  return (
    <div style={{
      overflow: 'hidden',
      width: '100%',
      height: 314
    }}>
      <video height="auto" width="100%" autoPlay loop>
        <source src="https://s3-us-west-1.amazonaws.com/lapka-assets/web_blur.mp4" type="video/mp4" />
      </video>
    </div>
  )
}

export default VideoItem
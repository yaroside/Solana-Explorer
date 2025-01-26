import React from 'react'
import video from '../video/background-video.mp4'

const BackgroundVideo = React.memo(() => {
	return <video className='video' src={video} autoPlay loop muted></video>
})

export default BackgroundVideo

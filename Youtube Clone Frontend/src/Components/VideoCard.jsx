import React from 'react'
import '../Css/VideoCard.css'
import { Link } from 'react-router-dom'
function VideoCard({ video }) {
    return (
        <Link to={`/video/${video._id}`} className='video-card overflow-hidden'>
            <img className="thumb w-7" src={video.thumbnailUrl ? video.thumbnailUrl : "https://img.freepik.com/premium-vector/youtube-thumbnail-background-design-with-text-editable_672856-143.jpg"} alt='' />
            <div className="first">
                <img className='clogo' src={video.channelId.logoUrl} alt="" />
                <div>
                    <h1 className='description text-nowrap'>{video.title.slice(0,35)}...</h1>
                    <p>{video.channelId.name}</p>  
                                        <p>{video.views} views</p>
                </div>

            </div>
        </Link>
    )
}

export default VideoCard

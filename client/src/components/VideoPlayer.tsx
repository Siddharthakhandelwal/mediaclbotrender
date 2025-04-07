import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

interface VideoPlayerProps {
  query?: string;
  data?: Record<string, any>;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ query, data }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Default data in case the backend doesn't provide it
  const videoData = {
    title: data?.title || `Video about ${query}`,
    thumbnail: data?.thumbnail,
    duration: data?.duration || '6:42',
    channel: data?.channel || 'Medical Channel',
    views: data?.views || '23K',
    likes: data?.likes || '450',
    description: data?.description || `This video provides information about ${query}.`,
    videoId: data?.videoId
  };

  const handlePlay = () => {
    setIsPlaying(true);
  };

  return (
    <div>
      <div className="service-content aspect-video bg-black relative" style={{ height: '250px' }}>
        {!isPlaying ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-black/50 w-full h-full absolute"></div>
            <div className="relative z-10 text-center">
              <div 
                className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4 cursor-pointer"
                onClick={handlePlay}
              >
                <i className="ri-play-fill text-white text-3xl"></i>
              </div>
              <p className="text-white">{videoData.title}</p>
              <p className="text-gray-300 text-sm mt-2">{videoData.duration} • {videoData.channel}</p>
            </div>
          </div>
        ) : (
          <iframe
            src={`https://www.youtube.com/embed/${videoData.videoId || 'dQw4w9WgXcQ'}?autoplay=1`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
            title={videoData.title}
          ></iframe>
        )}
      </div>
      
      <div className="p-3">
        <div className="flex space-x-2 mb-2">
          <Button variant="ghost" className="flex items-center space-x-1 p-2 hover:bg-gray-100 rounded">
            <i className="ri-thumb-up-line"></i>
            <span className="text-sm">{videoData.likes}</span>
          </Button>
          <Button variant="ghost" className="flex items-center space-x-1 p-2 hover:bg-gray-100 rounded">
            <i className="ri-thumb-down-line"></i>
            <span className="text-sm">150</span>
          </Button>
          <Button variant="ghost" className="flex items-center space-x-1 p-2 hover:bg-gray-100 rounded ml-auto">
            <i className="ri-share-line"></i>
            <span className="text-sm">Share</span>
          </Button>
        </div>
        
        <div className="text-sm text-gray-600">
          {videoData.description}
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;

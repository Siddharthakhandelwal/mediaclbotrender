import React, { useState } from 'react';
import { EmbeddedServiceData } from '../types';
import AppointmentScheduler from './AppointmentScheduler';
import SearchResults from './SearchResults';
import VideoPlayer from './VideoPlayer';

interface EmbeddedServiceProps {
  service: EmbeddedServiceData;
}

const EmbeddedService: React.FC<EmbeddedServiceProps> = ({ service }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const renderServiceContent = () => {
    switch (service.type) {
      case 'appointment':
        return <AppointmentScheduler data={service.data} />;
      case 'search':
        return <SearchResults query={service.query} data={service.data} />;
      case 'video':
        return <VideoPlayer query={service.query} data={service.data} />;
      default:
        return null;
    }
  };

  const getServiceTitle = () => {
    switch (service.type) {
      case 'appointment':
        return 'Appointment Scheduler';
      case 'search':
        return `Search Results: ${service.query}`;
      case 'video':
        return service.data?.title || `Video: ${service.query}`;
      default:
        return 'Service';
    }
  };

  const getServiceIcon = () => {
    switch (service.type) {
      case 'appointment':
        return <i className="ri-calendar-check-line text-primary mr-2"></i>;
      case 'search':
        return <i className="ri-search-line text-primary mr-2"></i>;
      case 'video':
        return <i className="ri-youtube-line text-red-600 mr-2"></i>;
      default:
        return null;
    }
  };

  return (
    <div className="flex items-start space-x-2 ml-10">
      <div className="bg-gray-100 rounded-lg p-3 w-full max-w-[95%]">
        <div className={`service-area bg-white rounded-lg border border-gray-200 overflow-hidden ${isFullscreen ? 'fullscreen' : ''}`}>
          <div className="bg-gray-50 p-3 border-b border-gray-200 flex justify-between items-center">
            <div className="flex items-center">
              {getServiceIcon()}
              <h3 className="font-medium text-gray-700">{getServiceTitle()}</h3>
            </div>
            <button 
              className="text-gray-500 hover:text-gray-700"
              onClick={toggleFullscreen}
            >
              {isFullscreen ? (
                <i className="ri-contract-left-right-line"></i>
              ) : (
                <i className="ri-fullscreen-line"></i>
              )}
            </button>
          </div>
          <div className={`service-content ${isFullscreen ? 'fullscreen' : ''}`}>
            {renderServiceContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmbeddedService;

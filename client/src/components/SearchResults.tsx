import React from 'react';
import { Button } from '@/components/ui/button';

interface SearchResultsProps {
  query?: string;
  data?: Record<string, any>;
}

const SearchResults: React.FC<SearchResultsProps> = ({ query, data }) => {
  // Default data in case the backend doesn't provide it
  const searchResults = data?.results || [];
  const featuredInfo = data?.featuredInfo;

  return (
    <div className="p-4 service-content">
      {featuredInfo && (
        <div className="mb-3 p-3 border-l-4 border-primary bg-blue-50 rounded">
          <h4 className="font-medium text-gray-900 mb-1">{featuredInfo.title}</h4>
          <ul className="list-disc pl-4 text-sm text-gray-700 space-y-1">
            {featuredInfo.content.map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
          <div className="text-xs text-gray-500 mt-2">Source: {featuredInfo.source}</div>
        </div>
      )}
      
      <div className="space-y-4">
        {searchResults.map((result: any, index: number) => (
          <div className="result-item" key={index}>
            <a href={result.url} className="text-primary font-medium hover:underline" target="_blank" rel="noopener noreferrer">
              {result.title}
            </a>
            <div className="text-xs text-green-700">{result.displayUrl}</div>
            <p className="text-sm text-gray-700 mt-1">{result.snippet}</p>
          </div>
        ))}
        
        {searchResults.length === 0 && (
          <div className="text-center py-4">
            <p className="text-gray-500">No results found for "{query}"</p>
          </div>
        )}
      </div>
      
      {searchResults.length > 0 && (
        <Button 
          className="mt-4 px-4 py-2 border border-primary text-primary hover:bg-primary hover:text-white transition text-sm"
          onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(query || '')}`, '_blank')}
        >
          View more results
        </Button>
      )}
    </div>
  );
};

export default SearchResults;

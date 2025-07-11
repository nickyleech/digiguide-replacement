'use client';

import { useState, useEffect } from 'react';
import { Clock, Calendar, Star, Tv, Tag, Bookmark, Bell, ChevronDown, ChevronUp, Search, X } from 'lucide-react';
import { Programme } from '@/types';
import { SearchResult, SearchFacets, FacetItem } from '@/lib/search';
import { formatTime } from '@/lib/utils';
import WatchlistButton from './WatchlistButton';
import ReminderButton from './ReminderButton';
import ChannelLogo from './ChannelLogo';

interface SearchResultsProps {
  searchResult: SearchResult;
  onFacetToggle: (facetType: string, value: string) => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
  loading?: boolean;
  className?: string;
}

export default function SearchResults({
  searchResult,
  onFacetToggle,
  onLoadMore,
  hasMore = false,
  loading = false,
  className = ''
}: SearchResultsProps) {
  const [expandedFacets, setExpandedFacets] = useState<Set<string>>(new Set(['genres', 'channels']));
  const [selectedProgramme, setSelectedProgramme] = useState<Programme | null>(null);

  const toggleFacet = (facetType: string) => {
    const newExpanded = new Set(expandedFacets);
    if (newExpanded.has(facetType)) {
      newExpanded.delete(facetType);
    } else {
      newExpanded.add(facetType);
    }
    setExpandedFacets(newExpanded);
  };

  const highlightSearchTerms = (text: string, query: string): string => {
    if (!query.trim()) return text;
    
    const terms = query.split(/\s+/).filter(term => term.length > 0);
    let highlightedText = text;
    
    terms.forEach(term => {
      const regex = new RegExp(`(${term})`, 'gi');
      highlightedText = highlightedText.replace(regex, '<mark class="bg-yellow-200 px-1 rounded">$1</mark>');
    });
    
    return highlightedText;
  };

  const formatSearchTime = (milliseconds: number): string => {
    if (milliseconds < 1000) return `${Math.round(milliseconds)}ms`;
    return `${(milliseconds / 1000).toFixed(2)}s`;
  };

  const isLive = (programme: Programme): boolean => {
    const now = new Date();
    const start = new Date(programme.startTime);
    const end = new Date(programme.endTime);
    return now >= start && now <= end;
  };

  const isUpcoming = (programme: Programme): boolean => {
    const now = new Date();
    const start = new Date(programme.startTime);
    const timeDiff = start.getTime() - now.getTime();
    return timeDiff > 0 && timeDiff < 24 * 60 * 60 * 1000; // Within 24 hours
  };

  const ProgrammeCard = ({ programme, index }: { programme: Programme; index: number }) => (
    <div
      className={`border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow ${
        isLive(programme) ? 'bg-red-50 border-red-200' : 'bg-white'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <ChannelLogo channelId={programme.channelId} size="sm" />
            <span className="text-sm font-medium text-gray-600">{programme.channel}</span>
            {isLive(programme) && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                LIVE
              </span>
            )}
            {isUpcoming(programme) && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                <Clock className="w-3 h-3" />
                Soon
              </span>
            )}
          </div>
          
          <h3 
            className="text-lg font-semibold text-gray-900 mb-2 cursor-pointer hover:text-blue-600"
            onClick={() => setSelectedProgramme(programme)}
            dangerouslySetInnerHTML={{ 
              __html: highlightSearchTerms(programme.title, searchResult.filters.query) 
            }}
          />
          
          <p 
            className="text-gray-600 text-sm mb-3 line-clamp-2"
            dangerouslySetInnerHTML={{ 
              __html: highlightSearchTerms(programme.description, searchResult.filters.query) 
            }}
          />
          
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {new Date(programme.startTime).toLocaleDateString()}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {formatTime(programme.startTime)} - {formatTime(programme.endTime)}
            </div>
            <div className="flex items-center gap-1">
              <Tag className="w-4 h-4" />
              {programme.genre}
            </div>
            {programme.rating && (
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4" />
                {programme.rating}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2 ml-4">
          <ReminderButton programme={programme} className="h-8 w-8" />
          <WatchlistButton
            programme={programme}
            channelName={programme.channel}
            size="sm"
            variant="icon"
          />
        </div>
      </div>
    </div>
  );

  const FacetSection = ({ title, items, facetType, icon: Icon }: {
    title: string;
    items: FacetItem[];
    facetType: string;
    icon: any;
  }) => (
    <div className="border-b border-gray-200 pb-4">
      <button
        onClick={() => toggleFacet(facetType)}
        className="flex items-center justify-between w-full text-left"
      >
        <h3 className="text-sm font-medium text-gray-900 flex items-center gap-2">
          <Icon className="w-4 h-4" />
          {title}
        </h3>
        {expandedFacets.has(facetType) ? (
          <ChevronUp className="w-4 h-4 text-gray-500" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-500" />
        )}
      </button>
      
      {expandedFacets.has(facetType) && (
        <div className="mt-3 space-y-2 max-h-48 overflow-y-auto">
          {items.slice(0, 10).map((item) => (
            <label key={item.value} className="flex items-center justify-between cursor-pointer">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={item.selected}
                  onChange={() => onFacetToggle(facetType, item.value)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2 mr-2"
                />
                <span className="text-sm text-gray-700 truncate">{item.label}</span>
              </div>
              <span className="text-xs text-gray-500 ml-2">({item.count})</span>
            </label>
          ))}
          {items.length > 10 && (
            <button className="text-xs text-blue-600 hover:text-blue-800">
              Show {items.length - 10} more...
            </button>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className={`${className}`}>
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Facets Sidebar */}
        <div className="lg:w-64 flex-shrink-0">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sticky top-4">
            <div className="flex items-center gap-2 mb-4">
              <Search className="w-5 h-5 text-gray-500" />
              <h2 className="text-lg font-semibold text-gray-900">Filter Results</h2>
            </div>
            
            <div className="space-y-4">
              {searchResult.facets.genres.length > 0 && (
                <FacetSection
                  title="Genres"
                  items={searchResult.facets.genres}
                  facetType="genres"
                  icon={Tag}
                />
              )}
              
              {searchResult.facets.channels.length > 0 && (
                <FacetSection
                  title="Channels"
                  items={searchResult.facets.channels}
                  facetType="channels"
                  icon={Tv}
                />
              )}
              
              {searchResult.facets.ratings.length > 0 && (
                <FacetSection
                  title="Ratings"
                  items={searchResult.facets.ratings}
                  facetType="ratings"
                  icon={Star}
                />
              )}
              
              {searchResult.facets.timeSlots.length > 0 && (
                <FacetSection
                  title="Time Slots"
                  items={searchResult.facets.timeSlots}
                  facetType="timeSlots"
                  icon={Clock}
                />
              )}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="flex-1">
          {/* Results Header */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {searchResult.totalResults.toLocaleString()} results
                  {searchResult.filters.query && (
                    <span className="text-gray-600 font-normal">
                      {' '}for "{searchResult.filters.query}"
                    </span>
                  )}
                </h2>
                <p className="text-sm text-gray-500">
                  Search completed in {formatSearchTime(searchResult.searchTime)}
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                <select
                  value={searchResult.filters.sortBy.field}
                  onChange={(e) => {
                    // This would typically trigger a re-search with new sort
                    console.log('Sort by:', e.target.value);
                  }}
                  className="px-3 py-1 border border-gray-300 rounded text-sm"
                >
                  <option value="relevance">Relevance</option>
                  <option value="startTime">Start Time</option>
                  <option value="title">Title</option>
                  <option value="genre">Genre</option>
                  <option value="channel">Channel</option>
                </select>
              </div>
            </div>
          </div>

          {/* No Results */}
          {searchResult.programmes.length === 0 && !loading && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No programmes found</h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search criteria or filters
              </p>
              {searchResult.suggestions.length > 0 && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">Did you mean:</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {searchResult.suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm hover:bg-blue-200"
                        onClick={() => {
                          // This would trigger a new search with the suggestion
                          console.log('Suggested search:', suggestion);
                        }}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Results List */}
          <div className="space-y-4">
            {searchResult.programmes.map((programme, index) => (
              <ProgrammeCard key={programme.id} programme={programme} index={index} />
            ))}
          </div>

          {/* Load More */}
          {hasMore && (
            <div className="text-center mt-8">
              <button
                onClick={onLoadMore}
                disabled={loading}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Loading...' : 'Load More Results'}
              </button>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Searching programmes...</p>
            </div>
          )}
        </div>
      </div>

      {/* Programme Detail Modal */}
      {selectedProgramme && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedProgramme.title}</h2>
                  <p className="text-gray-600">{selectedProgramme.channel}</p>
                </div>
                <button
                  onClick={() => setSelectedProgramme(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(selectedProgramme.startTime).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {formatTime(selectedProgramme.startTime)} - {formatTime(selectedProgramme.endTime)}
                </div>
                <div className="flex items-center gap-1">
                  <Tag className="w-4 h-4" />
                  {selectedProgramme.genre}
                </div>
              </div>
              
              <p className="text-gray-700 mb-6">{selectedProgramme.description}</p>
              
              <div className="flex items-center gap-4">
                <ReminderButton programme={selectedProgramme} showLabel />
                <WatchlistButton
                  programme={selectedProgramme}
                  channelName={selectedProgramme.channel}
                  size="md"
                  variant="button"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { Search, Bookmark, History, Filter } from 'lucide-react';
import { SearchFilters, SearchResult, DEFAULT_SEARCH_FILTERS } from '@/lib/search';
import { searchService } from '@/lib/searchService';
import { fuzzySearch } from '@/lib/fuzzySearch';
import { epgService } from '@/lib/epgService';
import AdvancedSearch from '@/components/AdvancedSearch';
import SearchResults from '@/components/SearchResults';
import SavedSearches from '@/components/SavedSearches';
import { useAuth } from '@/contexts/AuthContext';

export default function SearchPage() {
  const { user } = useAuth();
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'results' | 'saved'>('results');
  const [quickFilters] = useState(searchService.getQuickFilters());

  useEffect(() => {
    // Initialize search service with programme data
    initializeSearch();
  }, []);

  const initializeSearch = async () => {
    try {
      // Load programme data for search
      const channels = await epgService.getChannels('freeview');
      const programmes = [];
      
      // Load programmes for next 7 days
      for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(date.getDate() + i);
        
        for (const channel of channels) {
          const channelProgrammes = await epgService.getProgrammes(channel.id, date);
          programmes.push(...channelProgrammes);
        }
      }
      
      // Initialize search services
      searchService.setProgrammes(programmes);
      fuzzySearch.setProgrammes(programmes);
    } catch (error) {
      console.error('Error initializing search:', error);
    }
  };

  const handleSearch = async (filters: SearchFilters) => {
    setLoading(true);
    try {
      const result = await searchService.search(filters);
      setSearchResult(result);
      setActiveTab('results');
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickSearch = (filters: SearchFilters) => {
    handleSearch(filters);
  };

  const handleFacetToggle = (facetType: string, value: string) => {
    if (!searchResult) return;

    const currentFilters = { ...searchResult.filters };
    
    switch (facetType) {
      case 'genres':
        currentFilters.genres = currentFilters.genres.includes(value)
          ? currentFilters.genres.filter(g => g !== value)
          : [...currentFilters.genres, value];
        break;
      case 'channels':
        currentFilters.channels = currentFilters.channels.includes(value)
          ? currentFilters.channels.filter(c => c !== value)
          : [...currentFilters.channels, value];
        break;
      case 'ratings':
        currentFilters.ratings = currentFilters.ratings.includes(value)
          ? currentFilters.ratings.filter(r => r !== value)
          : [...currentFilters.ratings, value];
        break;
      case 'timeSlots':
        const timeSlot = { id: value, label: value, start: 0, end: 0 };
        currentFilters.timeSlots = currentFilters.timeSlots.some(ts => ts.id === value)
          ? currentFilters.timeSlots.filter(ts => ts.id !== value)
          : [...currentFilters.timeSlots, timeSlot];
        break;
    }

    handleSearch(currentFilters);
  };

  const handleSaveSearch = (name: string, filters: SearchFilters) => {
    if (!user) return;
    searchService.saveSavedSearch(user.id, name, filters);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Search TV Guide</h1>
          <p className="text-gray-600">Find programmes across all channels and dates</p>
        </div>

        {/* Advanced Search */}
        <div className="mb-6">
          <AdvancedSearch
            onSearch={handleSearch}
            initialFilters={searchResult?.filters || DEFAULT_SEARCH_FILTERS}
            showAdvanced={false}
          />
        </div>

        {/* Quick Filters */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Quick Searches</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {quickFilters.map((filter, index) => (
              <button
                key={index}
                onClick={() => handleQuickSearch(filter)}
                className="p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow text-left"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Search className="w-4 h-4 text-blue-500" />
                  <span className="font-medium text-gray-900">{filter.query}</span>
                </div>
                <p className="text-sm text-gray-600">
                  {filter.genres.length > 0 && `${filter.genres.length} genres`}
                  {filter.timeSlots.length > 0 && ` • ${filter.timeSlots.length} time slots`}
                  {filter.duration.min && ` • ${filter.duration.min}+ min`}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('results')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'results'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4" />
                  Search Results
                  {searchResult && (
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      {searchResult.totalResults}
                    </span>
                  )}
                </div>
              </button>
              <button
                onClick={() => setActiveTab('saved')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'saved'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Bookmark className="w-4 h-4" />
                  Saved Searches
                </div>
              </button>
            </nav>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'results' && (
          <div>
            {searchResult ? (
              <SearchResults
                searchResult={searchResult}
                onFacetToggle={handleFacetToggle}
                loading={loading}
              />
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">Start your search</h3>
                <p className="text-gray-600 mb-6">
                  Enter a programme name, channel, or genre to find what you're looking for
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <button
                    onClick={() => handleQuickSearch(quickFilters[0])}
                    className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200"
                  >
                    Tonight's TV
                  </button>
                  <button
                    onClick={() => handleQuickSearch(quickFilters[1])}
                    className="px-4 py-2 bg-green-100 text-green-800 rounded-lg hover:bg-green-200"
                  >
                    Movies
                  </button>
                  <button
                    onClick={() => handleQuickSearch(quickFilters[2])}
                    className="px-4 py-2 bg-purple-100 text-purple-800 rounded-lg hover:bg-purple-200"
                  >
                    Sport
                  </button>
                  <button
                    onClick={() => handleQuickSearch(quickFilters[3])}
                    className="px-4 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200"
                  >
                    News
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'saved' && (
          <SavedSearches
            onSearchSelect={handleSearch}
            onSaveSearch={handleSaveSearch}
            currentFilters={searchResult?.filters}
          />
        )}
      </div>
    </div>
  );
}
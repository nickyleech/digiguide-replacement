'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, Filter, X, Clock, Calendar, Star, Tv, Tag, SlidersHorizontal } from 'lucide-react';
import { SearchFilters, TimeSlot, SearchSuggestion, DEFAULT_SEARCH_FILTERS, TIME_SLOTS, SORT_OPTIONS, RATING_OPTIONS } from '@/lib/search';
import { searchService } from '@/lib/searchService';
import { fuzzySearch } from '@/lib/fuzzySearch';

interface AdvancedSearchProps {
  onSearch: (filters: SearchFilters) => void;
  onSuggestionSelect?: (suggestion: SearchSuggestion) => void;
  initialFilters?: SearchFilters;
  showAdvanced?: boolean;
  className?: string;
}

export default function AdvancedSearch({
  onSearch,
  onSuggestionSelect,
  initialFilters = DEFAULT_SEARCH_FILTERS,
  showAdvanced = false,
  className = ''
}: AdvancedSearchProps) {
  const [filters, setFilters] = useState<SearchFilters>(initialFilters);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showFilters, setShowFilters] = useState(showAdvanced);
  const [isSearching, setIsSearching] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Update filters when initialFilters change
  useEffect(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  // Generate suggestions as user types
  useEffect(() => {
    if (filters.query.length >= 2) {
      const results = fuzzySearch.searchWithSuggestions(filters.query, { maxSuggestions: 8 });
      setSuggestions(results.suggestions.map(s => ({ text: s, type: 'programme' })));
    } else {
      setSuggestions([]);
    }
  }, [filters.query]);

  const handleFilterChange = (updates: Partial<SearchFilters>) => {
    const newFilters = { ...filters, ...updates };
    setFilters(newFilters);
    
    // Auto-search on filter changes (debounced)
    if (updates.query === undefined) {
      handleSearch(newFilters);
    }
  };

  const handleSearch = async (searchFilters = filters) => {
    setIsSearching(true);
    setShowSuggestions(false);
    
    try {
      await onSearch(searchFilters);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    const newFilters = { ...filters, query: suggestion.text };
    setFilters(newFilters);
    setShowSuggestions(false);
    onSuggestionSelect?.(suggestion);
    handleSearch(newFilters);
    searchInputRef.current?.focus();
  };

  const handleGenreToggle = (genre: string) => {
    const newGenres = filters.genres.includes(genre)
      ? filters.genres.filter(g => g !== genre)
      : [...filters.genres, genre];
    handleFilterChange({ genres: newGenres });
  };

  const handleChannelToggle = (channel: string) => {
    const newChannels = filters.channels.includes(channel)
      ? filters.channels.filter(c => c !== channel)
      : [...filters.channels, channel];
    handleFilterChange({ channels: newChannels });
  };

  const handleTimeSlotToggle = (timeSlot: TimeSlot) => {
    const newTimeSlots = filters.timeSlots.some(ts => ts.id === timeSlot.id)
      ? filters.timeSlots.filter(ts => ts.id !== timeSlot.id)
      : [...filters.timeSlots, timeSlot];
    handleFilterChange({ timeSlots: newTimeSlots });
  };

  const handleRatingToggle = (rating: string) => {
    const newRatings = filters.ratings.includes(rating)
      ? filters.ratings.filter(r => r !== rating)
      : [...filters.ratings, rating];
    handleFilterChange({ ratings: newRatings });
  };

  const clearFilters = () => {
    const clearedFilters = {
      ...DEFAULT_SEARCH_FILTERS,
      query: filters.query // Keep the search query
    };
    setFilters(clearedFilters);
    handleSearch(clearedFilters);
  };

  const clearAllFilters = () => {
    setFilters(DEFAULT_SEARCH_FILTERS);
    handleSearch(DEFAULT_SEARCH_FILTERS);
    searchInputRef.current?.focus();
  };

  const getActiveFilterCount = () => {
    return (
      filters.genres.length +
      filters.channels.length +
      filters.timeSlots.length +
      filters.ratings.length +
      (filters.duration.min !== undefined ? 1 : 0) +
      (filters.duration.max !== undefined ? 1 : 0)
    );
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      {/* Main Search Bar */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                ref={searchInputRef}
                type="text"
                value={filters.query}
                onChange={(e) => handleFilterChange({ query: e.target.value })}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch();
                  } else if (e.key === 'Escape') {
                    setShowSuggestions(false);
                  }
                }}
                onFocus={() => setShowSuggestions(suggestions.length > 0)}
                placeholder="Search programmes, channels, or genres..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {filters.query && (
                <button
                  onClick={() => handleFilterChange({ query: '' })}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>
            
            <button
              onClick={() => handleSearch()}
              disabled={isSearching}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSearching ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Search className="h-4 w-4" />
              )}
              Search
            </button>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-lg border transition-colors ${
                showFilters || getActiveFilterCount() > 0
                  ? 'bg-blue-50 border-blue-200 text-blue-600'
                  : 'border-gray-300 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <SlidersHorizontal className="h-4 w-4" />
              {getActiveFilterCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {getActiveFilterCount()}
                </span>
              )}
            </button>
          </div>

          {/* Search Suggestions */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 first:rounded-t-lg last:rounded-b-lg"
                >
                  {suggestion.type === 'programme' && <Tv className="h-4 w-4 text-gray-400" />}
                  {suggestion.type === 'channel' && <Tag className="h-4 w-4 text-gray-400" />}
                  {suggestion.type === 'genre' && <Filter className="h-4 w-4 text-gray-400" />}
                  <span dangerouslySetInnerHTML={{ __html: suggestion.highlight || suggestion.text }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Quick Filter Tags */}
        {(filters.genres.length > 0 || filters.channels.length > 0 || filters.timeSlots.length > 0 || filters.ratings.length > 0) && (
          <div className="flex flex-wrap gap-2 mt-3">
            {filters.genres.map(genre => (
              <span
                key={genre}
                className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
              >
                <Tag className="h-3 w-3" />
                {genre}
                <button
                  onClick={() => handleGenreToggle(genre)}
                  className="hover:text-blue-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
            {filters.channels.map(channel => (
              <span
                key={channel}
                className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
              >
                <Tv className="h-3 w-3" />
                {channel}
                <button
                  onClick={() => handleChannelToggle(channel)}
                  className="hover:text-green-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
            {filters.timeSlots.map(slot => (
              <span
                key={slot.id}
                className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
              >
                <Clock className="h-3 w-3" />
                {slot.label}
                <button
                  onClick={() => handleTimeSlotToggle(slot)}
                  className="hover:text-purple-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
            {filters.ratings.map(rating => (
              <span
                key={rating}
                className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm"
              >
                <Star className="h-3 w-3" />
                {rating}
                <button
                  onClick={() => handleRatingToggle(rating)}
                  className="hover:text-orange-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm hover:bg-gray-200"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="p-4 bg-gray-50 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Time Slots */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Time Slots
              </h3>
              <div className="space-y-2">
                {TIME_SLOTS.map(slot => (
                  <label key={slot.id} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.timeSlots.some(ts => ts.id === slot.id)}
                      onChange={() => handleTimeSlotToggle(slot)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2"
                    />
                    <span className="ml-2 text-sm text-gray-700">{slot.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Ratings */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                <Star className="h-4 w-4" />
                Ratings
              </h3>
              <div className="space-y-2">
                {RATING_OPTIONS.map(rating => (
                  <label key={rating.value} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.ratings.includes(rating.value)}
                      onChange={() => handleRatingToggle(rating.value)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2"
                    />
                    <span className="ml-2 text-sm text-gray-700">{rating.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Duration */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Duration
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Min duration (minutes)</label>
                  <input
                    type="number"
                    value={filters.duration.min || ''}
                    onChange={(e) => handleFilterChange({
                      duration: { ...filters.duration, min: e.target.value ? parseInt(e.target.value) : undefined }
                    })}
                    className="w-full px-3 py-1 border border-gray-300 rounded text-sm"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Max duration (minutes)</label>
                  <input
                    type="number"
                    value={filters.duration.max || ''}
                    onChange={(e) => handleFilterChange({
                      duration: { ...filters.duration, max: e.target.value ? parseInt(e.target.value) : undefined }
                    })}
                    className="w-full px-3 py-1 border border-gray-300 rounded text-sm"
                    placeholder="∞"
                  />
                </div>
              </div>
            </div>

            {/* Date Range */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Date Range
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">From</label>
                  <input
                    type="date"
                    value={filters.dateRange.start.toISOString().split('T')[0]}
                    onChange={(e) => handleFilterChange({
                      dateRange: { ...filters.dateRange, start: new Date(e.target.value) }
                    })}
                    className="w-full px-3 py-1 border border-gray-300 rounded text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">To</label>
                  <input
                    type="date"
                    value={filters.dateRange.end.toISOString().split('T')[0]}
                    onChange={(e) => handleFilterChange({
                      dateRange: { ...filters.dateRange, end: new Date(e.target.value) }
                    })}
                    className="w-full px-3 py-1 border border-gray-300 rounded text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Sort Options */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                Sort By
              </h3>
              <div className="space-y-3">
                <select
                  value={filters.sortBy.field}
                  onChange={(e) => {
                    const sortOption = SORT_OPTIONS.find(opt => opt.field === e.target.value);
                    if (sortOption) {
                      handleFilterChange({ sortBy: sortOption });
                    }
                  }}
                  className="w-full px-3 py-1 border border-gray-300 rounded text-sm"
                >
                  {SORT_OPTIONS.map(option => (
                    <option key={option.field} value={option.field}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="flex items-center gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="sortOrder"
                      value="asc"
                      checked={filters.sortOrder === 'asc'}
                      onChange={(e) => handleFilterChange({ sortOrder: 'asc' })}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Ascending</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="sortOrder"
                      value="desc"
                      checked={filters.sortOrder === 'desc'}
                      onChange={(e) => handleFilterChange({ sortOrder: 'desc' })}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Descending</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Filter Actions */}
          <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
            <button
              onClick={clearAllFilters}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              Clear all filters
            </button>
            <button
              onClick={() => setShowFilters(false)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              Hide filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
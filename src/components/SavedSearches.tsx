'use client';

import { useState, useEffect } from 'react';
import { Save, Search, Trash2, Edit2, Bell, BellOff, Calendar, Clock, Tag, Star } from 'lucide-react';
import { SavedSearch, SearchFilters, SearchHistory } from '@/lib/search';
import { searchService } from '@/lib/searchService';
import { useAuth } from '@/contexts/AuthContext';

interface SavedSearchesProps {
  onSearchSelect: (filters: SearchFilters) => void;
  onSaveSearch: (name: string, filters: SearchFilters) => void;
  currentFilters?: SearchFilters;
  className?: string;
}

export default function SavedSearches({
  onSearchSelect,
  onSaveSearch,
  currentFilters,
  className = ''
}: SavedSearchesProps) {
  const { user } = useAuth();
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [editingSearch, setEditingSearch] = useState<SavedSearch | null>(null);
  const [searchName, setSearchName] = useState('');

  useEffect(() => {
    if (user) {
      loadSavedSearches();
      loadSearchHistory();
    }
  }, [user]);

  const loadSavedSearches = () => {
    if (!user) return;
    const searches = searchService.getSavedSearches(user.id);
    setSavedSearches(searches);
  };

  const loadSearchHistory = () => {
    if (!user) return;
    const history = searchService.getSearchHistory(user.id);
    setSearchHistory(history);
  };

  const handleSaveSearch = () => {
    if (!user || !currentFilters || !searchName.trim()) return;

    if (editingSearch) {
      // Update existing search
      searchService.updateSavedSearch(editingSearch.id, {
        name: searchName.trim(),
        filters: currentFilters
      });
    } else {
      // Save new search
      searchService.saveSavedSearch(user.id, searchName.trim(), currentFilters);
    }

    setShowSaveDialog(false);
    setEditingSearch(null);
    setSearchName('');
    loadSavedSearches();
  };

  const handleDeleteSearch = (searchId: string) => {
    searchService.deleteSavedSearch(searchId);
    loadSavedSearches();
  };

  const handleEditSearch = (search: SavedSearch) => {
    setEditingSearch(search);
    setSearchName(search.name);
    setShowSaveDialog(true);
  };

  const handleToggleAlert = (searchId: string, enabled: boolean) => {
    searchService.updateSavedSearch(searchId, { alertEnabled: enabled });
    loadSavedSearches();
  };

  const formatFilters = (filters: SearchFilters): string => {
    const parts: string[] = [];
    
    if (filters.query) {
      parts.push(`"${filters.query}"`);
    }
    
    if (filters.genres.length > 0) {
      parts.push(`${filters.genres.length} genre${filters.genres.length > 1 ? 's' : ''}`);
    }
    
    if (filters.channels.length > 0) {
      parts.push(`${filters.channels.length} channel${filters.channels.length > 1 ? 's' : ''}`);
    }
    
    if (filters.timeSlots.length > 0) {
      parts.push(`${filters.timeSlots.length} time slot${filters.timeSlots.length > 1 ? 's' : ''}`);
    }
    
    if (filters.ratings.length > 0) {
      parts.push(`${filters.ratings.length} rating${filters.ratings.length > 1 ? 's' : ''}`);
    }
    
    return parts.join(' • ') || 'No filters';
  };

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (!user) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
        <div className="text-center text-gray-500">
          <Save className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>Please sign in to save your searches</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Saved Searches</h2>
          {currentFilters && (
            <button
              onClick={() => setShowSaveDialog(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              <Save className="w-4 h-4" />
              Save Search
            </button>
          )}
        </div>

        {/* Saved Searches */}
        <div className="space-y-4 mb-8">
          {savedSearches.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Search className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No saved searches yet</p>
              <p className="text-sm">Save your favourite searches to find them quickly later</p>
            </div>
          ) : (
            savedSearches.map((search) => (
              <div
                key={search.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-medium text-gray-900">{search.name}</h3>
                      {search.alertEnabled && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                          <Bell className="w-3 h-3" />
                          Alert ON
                        </span>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">
                      {formatFilters(search.filters)}
                    </p>
                    
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Created {formatDate(search.createdAt)}
                      </div>
                      {search.lastExecuted && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Last used {formatDate(search.lastExecuted)}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => handleToggleAlert(search.id, !search.alertEnabled)}
                      className={`p-2 rounded-lg border transition-colors ${
                        search.alertEnabled
                          ? 'bg-green-50 border-green-200 text-green-600'
                          : 'border-gray-300 text-gray-400 hover:text-gray-600'
                      }`}
                      title={search.alertEnabled ? 'Disable alerts' : 'Enable alerts'}
                    >
                      {search.alertEnabled ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
                    </button>
                    
                    <button
                      onClick={() => handleEditSearch(search)}
                      className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50"
                      title="Edit search"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={() => onSearchSelect(search.filters)}
                      className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
                    >
                      Search
                    </button>
                    
                    <button
                      onClick={() => handleDeleteSearch(search.id)}
                      className="p-2 rounded-lg border border-gray-300 text-red-600 hover:bg-red-50"
                      title="Delete search"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Search History */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Searches</h3>
          <div className="space-y-2">
            {searchHistory.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                <p className="text-sm">No search history yet</p>
              </div>
            ) : (
              searchHistory.slice(0, 10).map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer"
                  onClick={() => onSearchSelect({ ...entry.filters, query: entry.query } as SearchFilters)}
                >
                  <div className="flex items-center gap-3">
                    <Search className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">"{entry.query}"</p>
                      <p className="text-sm text-gray-500">
                        {entry.resultCount} results • {formatDate(entry.executedAt)}
                      </p>
                    </div>
                  </div>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSaveSearch(entry.query, { ...entry.filters, query: entry.query } as SearchFilters);
                    }}
                    className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-white"
                    title="Save this search"
                  >
                    <Save className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Save Search Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editingSearch ? 'Edit Search' : 'Save Search'}
            </h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Name
              </label>
              <input
                type="text"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                placeholder="Enter a name for this search..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoFocus
              />
            </div>
            
            {currentFilters && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Criteria
                </label>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    {formatFilters(currentFilters)}
                  </p>
                </div>
              </div>
            )}
            
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowSaveDialog(false);
                  setEditingSearch(null);
                  setSearchName('');
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveSearch}
                disabled={!searchName.trim()}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {editingSearch ? 'Update' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
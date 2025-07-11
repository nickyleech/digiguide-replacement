import { Programme } from '@/types';
import { 
  SearchFilters, 
  SearchResult, 
  SearchFacets, 
  SavedSearch, 
  SearchHistory, 
  SearchSuggestion,
  FacetItem,
  TimeSlot,
  DEFAULT_SEARCH_FILTERS,
  TIME_SLOTS,
  parseSearchQuery,
  calculateRelevanceScore
} from './search';

class SearchService {
  private programmes: Programme[] = [];
  private savedSearches: SavedSearch[] = [];
  private searchHistory: SearchHistory[] = [];
  private searchSuggestions: SearchSuggestion[] = [];

  // Storage keys
  private readonly SAVED_SEARCHES_KEY = 'tv-guide-saved-searches';
  private readonly SEARCH_HISTORY_KEY = 'tv-guide-search-history';
  private readonly SEARCH_SUGGESTIONS_KEY = 'tv-guide-search-suggestions';

  constructor() {
    this.loadFromStorage();
  }

  // Load data from localStorage
  private loadFromStorage(): void {
    try {
      // Check if localStorage is available (client-side only)
      if (typeof window === 'undefined' || !window.localStorage) {
        return;
      }

      const savedSearches = localStorage.getItem(this.SAVED_SEARCHES_KEY);
      if (savedSearches) {
        this.savedSearches = JSON.parse(savedSearches).map((search: any) => ({
          ...search,
          createdAt: new Date(search.createdAt),
          updatedAt: new Date(search.updatedAt),
          lastExecuted: search.lastExecuted ? new Date(search.lastExecuted) : undefined,
          filters: {
            ...search.filters,
            dateRange: {
              start: new Date(search.filters.dateRange.start),
              end: new Date(search.filters.dateRange.end)
            }
          }
        }));
      }

      const searchHistory = localStorage.getItem(this.SEARCH_HISTORY_KEY);
      if (searchHistory) {
        this.searchHistory = JSON.parse(searchHistory).map((entry: any) => ({
          ...entry,
          executedAt: new Date(entry.executedAt)
        }));
      }

      const suggestions = localStorage.getItem(this.SEARCH_SUGGESTIONS_KEY);
      if (suggestions) {
        this.searchSuggestions = JSON.parse(suggestions);
      }
    } catch (error) {
      console.error('Error loading search data from storage:', error);
    }
  }

  // Save data to localStorage
  private saveToStorage(): void {
    try {
      // Check if localStorage is available (client-side only)
      if (typeof window === 'undefined' || !window.localStorage) {
        return;
      }

      localStorage.setItem(this.SAVED_SEARCHES_KEY, JSON.stringify(this.savedSearches));
      localStorage.setItem(this.SEARCH_HISTORY_KEY, JSON.stringify(this.searchHistory));
      localStorage.setItem(this.SEARCH_SUGGESTIONS_KEY, JSON.stringify(this.searchSuggestions));
    } catch (error) {
      console.error('Error saving search data to storage:', error);
    }
  }

  // Set programmes data
  setProgrammes(programmes: Programme[]): void {
    this.programmes = programmes;
    this.updateSearchSuggestions();
    
    // Also update fuzzy search with the same data
    const { fuzzySearch } = require('./fuzzySearch');
    fuzzySearch.setProgrammes(programmes);
  }

  // Main search function
  async search(filters: SearchFilters): Promise<SearchResult> {
    const startTime = performance.now();
    
    // Parse search query
    const { terms, filters: queryFilters } = parseSearchQuery(filters.query);
    
    // Merge query filters with provided filters
    const mergedFilters = {
      ...filters,
      ...queryFilters,
      genres: [...(filters.genres || []), ...(queryFilters.genres || [])],
      channels: [...(filters.channels || []), ...(queryFilters.channels || [])],
      ratings: [...(filters.ratings || []), ...(queryFilters.ratings || [])]
    };

    // Filter programmes
    let filteredProgrammes = this.programmes.filter(programme => 
      this.matchesProgramme(programme, mergedFilters, terms)
    );

    // If we have very few results and a search query, try fuzzy search
    if (filteredProgrammes.length < 5 && terms.length > 0) {
      const { fuzzySearch } = require('./fuzzySearch');
      const fuzzyResults = fuzzySearch.search(filters.query, { 
        maxResults: 20,
        includeScore: true 
      });
      
      // Add fuzzy results that aren't already included
      fuzzyResults.forEach((fuzzyResult: any) => {
        if (!filteredProgrammes.some(p => p.id === fuzzyResult.item.id)) {
          filteredProgrammes.push({
            ...fuzzyResult.item,
            relevanceScore: fuzzyResult.score
          });
        }
      });
    }

    // Calculate relevance scores if searching by relevance
    if (mergedFilters.sortBy.field === 'relevance' && terms.length > 0) {
      filteredProgrammes = filteredProgrammes.map(programme => ({
        ...programme,
        relevanceScore: (programme as any).relevanceScore || 
                       calculateRelevanceScore(programme, terms, mergedFilters)
      }));
    }

    // Sort results
    filteredProgrammes = this.sortProgrammes(filteredProgrammes, mergedFilters);

    // Generate facets
    const facets = this.generateFacets(filteredProgrammes, mergedFilters);

    // Generate suggestions (including fuzzy suggestions)
    const searchSuggestions = this.generateSuggestions(filters.query, terms);
    const suggestions = searchSuggestions.map(s => s.text);

    const endTime = performance.now();
    const searchTime = endTime - startTime;

    const result: SearchResult = {
      programmes: filteredProgrammes,
      totalResults: filteredProgrammes.length,
      searchTime,
      filters: mergedFilters,
      suggestions,
      facets
    };

    // Save to search history
    this.addToSearchHistory(filters, result.totalResults);

    return result;
  }

  // Check if programme matches filters
  private matchesProgramme(programme: Programme, filters: SearchFilters, terms: string[]): boolean {
    // Text search
    if (terms.length > 0) {
      const searchText = `${programme.title} ${programme.description} ${programme.genre} ${programme.channel}`.toLowerCase();
      const hasMatch = terms.some(term => searchText.includes(term.toLowerCase()));
      if (!hasMatch) return false;
    }

    // Genre filter
    if (filters.genres.length > 0) {
      if (!filters.genres.some(genre => 
        programme.genre.toLowerCase().includes(genre.toLowerCase())
      )) {
        return false;
      }
    }

    // Channel filter
    if (filters.channels.length > 0) {
      if (!filters.channels.some(channel => 
        programme.channel.toLowerCase().includes(channel.toLowerCase())
      )) {
        return false;
      }
    }

    // Rating filter
    if (filters.ratings.length > 0 && programme.rating) {
      if (!filters.ratings.includes(programme.rating)) {
        return false;
      }
    }

    // Time slot filter
    if (filters.timeSlots.length > 0) {
      const programmeStart = new Date(programme.startTime);
      const programmeHour = programmeStart.getHours();
      
      const matchesTimeSlot = filters.timeSlots.some(slot => {
        const timeSlot = TIME_SLOTS.find(ts => ts.id === slot.id);
        if (!timeSlot) return false;
        
        if (timeSlot.start <= timeSlot.end) {
          return programmeHour >= timeSlot.start && programmeHour < timeSlot.end;
        } else {
          // Handle overnight slot (e.g., 21-6)
          return programmeHour >= timeSlot.start || programmeHour < timeSlot.end;
        }
      });
      
      if (!matchesTimeSlot) return false;
    }

    // Date range filter
    const programmeDate = new Date(programme.startTime);
    if (programmeDate < filters.dateRange.start || programmeDate > filters.dateRange.end) {
      return false;
    }

    // Duration filter
    if (filters.duration.min !== undefined && programme.duration < filters.duration.min) {
      return false;
    }
    if (filters.duration.max !== undefined && programme.duration > filters.duration.max) {
      return false;
    }

    // Specific start/end time filter
    if (filters.startTime) {
      const programmeStart = new Date(programme.startTime);
      if (programmeStart < filters.startTime) return false;
    }
    if (filters.endTime) {
      const programmeEnd = new Date(programme.endTime);
      if (programmeEnd > filters.endTime) return false;
    }

    return true;
  }

  // Sort programmes based on criteria
  private sortProgrammes(programmes: Programme[], filters: SearchFilters): Programme[] {
    return programmes.sort((a, b) => {
      let comparison = 0;

      switch (filters.sortBy.field) {
        case 'relevance':
          comparison = ((b as any).relevanceScore || 0) - ((a as any).relevanceScore || 0);
          break;
        case 'startTime':
          comparison = new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'genre':
          comparison = a.genre.localeCompare(b.genre);
          break;
        case 'channel':
          comparison = a.channel.localeCompare(b.channel);
          break;
        case 'duration':
          comparison = a.duration - b.duration;
          break;
      }

      return filters.sortOrder === 'desc' ? -comparison : comparison;
    });
  }

  // Generate facets for filtering
  private generateFacets(programmes: Programme[], filters: SearchFilters): SearchFacets {
    const genreCounts = new Map<string, number>();
    const channelCounts = new Map<string, number>();
    const ratingCounts = new Map<string, number>();
    const timeSlotCounts = new Map<string, number>();

    programmes.forEach(programme => {
      // Count genres
      genreCounts.set(programme.genre, (genreCounts.get(programme.genre) || 0) + 1);

      // Count channels
      channelCounts.set(programme.channel, (channelCounts.get(programme.channel) || 0) + 1);

      // Count ratings
      if (programme.rating) {
        ratingCounts.set(programme.rating, (ratingCounts.get(programme.rating) || 0) + 1);
      }

      // Count time slots
      const programmeStart = new Date(programme.startTime);
      const programmeHour = programmeStart.getHours();
      
      TIME_SLOTS.forEach(slot => {
        let matches = false;
        if (slot.start <= slot.end) {
          matches = programmeHour >= slot.start && programmeHour < slot.end;
        } else {
          matches = programmeHour >= slot.start || programmeHour < slot.end;
        }
        
        if (matches) {
          timeSlotCounts.set(slot.id, (timeSlotCounts.get(slot.id) || 0) + 1);
        }
      });
    });

    return {
      genres: Array.from(genreCounts.entries())
        .sort((a, b) => b[1] - a[1])
        .map(([value, count]) => ({
          value,
          label: value,
          count,
          selected: filters.genres.includes(value)
        })),
      channels: Array.from(channelCounts.entries())
        .sort((a, b) => b[1] - a[1])
        .map(([value, count]) => ({
          value,
          label: value,
          count,
          selected: filters.channels.includes(value)
        })),
      ratings: Array.from(ratingCounts.entries())
        .sort((a, b) => b[1] - a[1])
        .map(([value, count]) => ({
          value,
          label: value,
          count,
          selected: filters.ratings.includes(value)
        })),
      timeSlots: Array.from(timeSlotCounts.entries())
        .sort((a, b) => b[1] - a[1])
        .map(([value, count]) => {
          const slot = TIME_SLOTS.find(ts => ts.id === value);
          return {
            value,
            label: slot?.label || value,
            count,
            selected: filters.timeSlots.some(ts => ts.id === value)
          };
        }),
      dateRanges: [] // Could be implemented for longer date ranges
    };
  }

  // Generate search suggestions
  private generateSuggestions(query: string, terms: string[]): SearchSuggestion[] {
    if (query.length < 2) return [];

    const suggestions: SearchSuggestion[] = [];
    const queryLower = query.toLowerCase();

    // Programme title suggestions
    const uniqueTitles = new Set(this.programmes.map(p => p.title));
    uniqueTitles.forEach(title => {
      if (title.toLowerCase().includes(queryLower)) {
        suggestions.push({
          text: title,
          type: 'programme',
          highlight: this.highlightMatch(title, query)
        });
      }
    });

    // Genre suggestions
    const uniqueGenres = new Set(this.programmes.map(p => p.genre));
    uniqueGenres.forEach(genre => {
      if (genre.toLowerCase().includes(queryLower)) {
        suggestions.push({
          text: genre,
          type: 'genre',
          highlight: this.highlightMatch(genre, query)
        });
      }
    });

    // Channel suggestions
    const uniqueChannels = new Set(this.programmes.map(p => p.channel));
    uniqueChannels.forEach(channel => {
      if (channel.toLowerCase().includes(queryLower)) {
        suggestions.push({
          text: channel,
          type: 'channel',
          highlight: this.highlightMatch(channel, query)
        });
      }
    });

    // Sort by relevance and limit
    return suggestions
      .sort((a, b) => {
        // Prioritize exact matches
        if (a.text.toLowerCase() === queryLower) return -1;
        if (b.text.toLowerCase() === queryLower) return 1;
        
        // Then by prefix matches
        if (a.text.toLowerCase().startsWith(queryLower)) return -1;
        if (b.text.toLowerCase().startsWith(queryLower)) return 1;
        
        return 0;
      })
      .slice(0, 10);
  }

  // Highlight matching text
  private highlightMatch(text: string, query: string): string {
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  }

  // Update search suggestions based on programmes
  private updateSearchSuggestions(): void {
    const suggestions: SearchSuggestion[] = [];

    // Add popular programmes
    const programmeCounts = new Map<string, number>();
    this.programmes.forEach(programme => {
      programmeCounts.set(programme.title, (programmeCounts.get(programme.title) || 0) + 1);
    });

    const popularProgrammes = Array.from(programmeCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(([title, count]) => ({
        text: title,
        type: 'programme' as const,
        count
      }));

    suggestions.push(...popularProgrammes);

    this.searchSuggestions = suggestions;
    this.saveToStorage();
  }

  // Saved searches management
  saveSavedSearch(userId: string, name: string, filters: SearchFilters): SavedSearch {
    const savedSearch: SavedSearch = {
      id: this.generateId(),
      userId,
      name,
      filters,
      alertEnabled: false,
      alertFrequency: 'daily',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.savedSearches.push(savedSearch);
    this.saveToStorage();
    return savedSearch;
  }

  getSavedSearches(userId: string): SavedSearch[] {
    return this.savedSearches.filter(search => search.userId === userId);
  }

  deleteSavedSearch(searchId: string): boolean {
    const index = this.savedSearches.findIndex(search => search.id === searchId);
    if (index === -1) return false;

    this.savedSearches.splice(index, 1);
    this.saveToStorage();
    return true;
  }

  updateSavedSearch(searchId: string, updates: Partial<SavedSearch>): boolean {
    const index = this.savedSearches.findIndex(search => search.id === searchId);
    if (index === -1) return false;

    this.savedSearches[index] = {
      ...this.savedSearches[index],
      ...updates,
      updatedAt: new Date()
    };

    this.saveToStorage();
    return true;
  }

  // Search history management
  private addToSearchHistory(filters: SearchFilters, resultCount: number): void {
    if (!filters.query.trim()) return;

    const historyEntry: SearchHistory = {
      id: this.generateId(),
      userId: 'current', // Will be replaced with actual user ID
      query: filters.query,
      filters: {
        genres: filters.genres,
        channels: filters.channels,
        ratings: filters.ratings,
        timeSlots: filters.timeSlots
      },
      resultCount,
      executedAt: new Date()
    };

    this.searchHistory.unshift(historyEntry);
    
    // Keep only last 50 searches
    if (this.searchHistory.length > 50) {
      this.searchHistory = this.searchHistory.slice(0, 50);
    }

    this.saveToStorage();
  }

  getSearchHistory(userId: string): SearchHistory[] {
    return this.searchHistory.filter(entry => entry.userId === userId);
  }

  clearSearchHistory(userId: string): void {
    this.searchHistory = this.searchHistory.filter(entry => entry.userId !== userId);
    this.saveToStorage();
  }

  // Utility function to generate unique IDs
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Get quick filters for common searches
  getQuickFilters(): SearchFilters[] {
    return [
      {
        ...DEFAULT_SEARCH_FILTERS,
        query: 'Tonight',
        dateRange: {
          start: new Date(),
          end: new Date(Date.now() + 24 * 60 * 60 * 1000)
        },
        timeSlots: [TIME_SLOTS.find(ts => ts.id === 'evening')!]
      },
      {
        ...DEFAULT_SEARCH_FILTERS,
        query: 'Movies',
        genres: ['Action', 'Drama', 'Comedy'],
        duration: { min: 90 }
      },
      {
        ...DEFAULT_SEARCH_FILTERS,
        query: 'Sport',
        genres: ['Sport']
      },
      {
        ...DEFAULT_SEARCH_FILTERS,
        query: 'News',
        genres: ['News']
      }
    ];
  }
}

export const searchService = new SearchService();
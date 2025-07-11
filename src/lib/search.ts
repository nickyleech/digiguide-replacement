import { Programme } from '@/types';

export interface SearchFilters {
  query: string;
  genres: string[];
  channels: string[];
  startTime?: Date;
  endTime?: Date;
  timeSlots: TimeSlot[];
  ratings: string[];
  dateRange: {
    start: Date;
    end: Date;
  };
  duration: {
    min?: number;
    max?: number;
  };
  sortBy: SortOption;
  sortOrder: 'asc' | 'desc';
}

export interface TimeSlot {
  id: string;
  label: string;
  start: number; // hour (0-23)
  end: number;   // hour (0-23)
}

export interface SortOption {
  field: 'startTime' | 'title' | 'genre' | 'channel' | 'duration' | 'relevance';
  label: string;
}

export interface SearchResult {
  programmes: Programme[];
  totalResults: number;
  searchTime: number;
  filters: SearchFilters;
  suggestions: string[];
  facets: SearchFacets;
}

export interface SearchFacets {
  genres: FacetItem[];
  channels: FacetItem[];
  ratings: FacetItem[];
  timeSlots: FacetItem[];
  dateRanges: FacetItem[];
}

export interface FacetItem {
  value: string;
  label: string;
  count: number;
  selected: boolean;
}

export interface SavedSearch {
  id: string;
  userId: string;
  name: string;
  filters: SearchFilters;
  alertEnabled: boolean;
  alertFrequency: 'daily' | 'weekly' | 'immediate';
  createdAt: Date;
  updatedAt: Date;
  lastExecuted?: Date;
}

export interface SearchHistory {
  id: string;
  userId: string;
  query: string;
  filters: Partial<SearchFilters>;
  resultCount: number;
  executedAt: Date;
}

export interface SearchSuggestion {
  text: string;
  type: 'query' | 'programme' | 'channel' | 'genre';
  count?: number;
  highlight?: string;
}

export const DEFAULT_SEARCH_FILTERS: SearchFilters = {
  query: '',
  genres: [],
  channels: [],
  timeSlots: [],
  ratings: [],
  dateRange: {
    start: new Date(),
    end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
  },
  duration: {},
  sortBy: {
    field: 'relevance',
    label: 'Relevance'
  },
  sortOrder: 'desc'
};

export const TIME_SLOTS: TimeSlot[] = [
  { id: 'morning', label: 'Morning (6-9 AM)', start: 6, end: 9 },
  { id: 'late-morning', label: 'Late Morning (9-12 PM)', start: 9, end: 12 },
  { id: 'afternoon', label: 'Afternoon (12-3 PM)', start: 12, end: 15 },
  { id: 'early-evening', label: 'Early Evening (3-6 PM)', start: 15, end: 18 },
  { id: 'evening', label: 'Evening (6-9 PM)', start: 18, end: 21 },
  { id: 'late-night', label: 'Late Night (9 PM-12 AM)', start: 21, end: 24 },
  { id: 'overnight', label: 'Overnight (12-6 AM)', start: 0, end: 6 }
];

export const SORT_OPTIONS: SortOption[] = [
  { field: 'relevance', label: 'Relevance' },
  { field: 'startTime', label: 'Start Time' },
  { field: 'title', label: 'Title' },
  { field: 'genre', label: 'Genre' },
  { field: 'channel', label: 'Channel' },
  { field: 'duration', label: 'Duration' }
];

export const COMMON_GENRES = [
  'Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Documentary', 
  'Drama', 'Family', 'Fantasy', 'Horror', 'Music', 'Mystery', 'News', 
  'Reality', 'Romance', 'Sci-Fi', 'Sport', 'Thriller', 'War', 'Western'
];

export const RATING_OPTIONS = [
  { value: 'U', label: 'U (Universal)' },
  { value: 'PG', label: 'PG (Parental Guidance)' },
  { value: '12', label: '12 (12 and over)' },
  { value: '15', label: '15 (15 and over)' },
  { value: '18', label: '18 (18 and over)' }
];

export const DURATION_RANGES = [
  { min: 0, max: 30, label: 'Short (0-30 min)' },
  { min: 30, max: 60, label: 'Medium (30-60 min)' },
  { min: 60, max: 120, label: 'Long (1-2 hours)' },
  { min: 120, max: 180, label: 'Extended (2-3 hours)' },
  { min: 180, max: undefined, label: 'Very Long (3+ hours)' }
];

// Search query parsing utilities
export const parseSearchQuery = (query: string): {
  terms: string[];
  operators: string[];
  filters: Partial<SearchFilters>;
} => {
  const terms: string[] = [];
  const operators: string[] = [];
  const filters: Partial<SearchFilters> = {};
  
  // Extract quoted phrases
  const quotedMatches = query.match(/"([^"]*)"/g);
  if (quotedMatches) {
    quotedMatches.forEach(match => {
      terms.push(match.replace(/"/g, ''));
      query = query.replace(match, '');
    });
  }
  
  // Extract filter operators (e.g., genre:drama, channel:bbc)
  const filterMatches = query.match(/(\w+):(\w+)/g);
  if (filterMatches) {
    filterMatches.forEach(match => {
      const [field, value] = match.split(':');
      switch (field.toLowerCase()) {
        case 'genre':
          filters.genres = [...(filters.genres || []), value];
          break;
        case 'channel':
          filters.channels = [...(filters.channels || []), value];
          break;
        case 'rating':
          filters.ratings = [...(filters.ratings || []), value];
          break;
      }
      query = query.replace(match, '');
    });
  }
  
  // Extract remaining terms
  const remainingTerms = query.split(/\s+/).filter(term => term.length > 0);
  terms.push(...remainingTerms);
  
  return { terms, operators, filters };
};

// Search result scoring
export const calculateRelevanceScore = (
  programme: Programme,
  searchTerms: string[],
  filters: SearchFilters
): number => {
  let score = 0;
  
  // Title matching (highest weight)
  searchTerms.forEach(term => {
    if (programme.title.toLowerCase().includes(term.toLowerCase())) {
      score += 10;
      // Exact match bonus
      if (programme.title.toLowerCase() === term.toLowerCase()) {
        score += 20;
      }
      // Start of title bonus
      if (programme.title.toLowerCase().startsWith(term.toLowerCase())) {
        score += 5;
      }
    }
  });
  
  // Description matching
  searchTerms.forEach(term => {
    if (programme.description.toLowerCase().includes(term.toLowerCase())) {
      score += 3;
    }
  });
  
  // Genre matching
  searchTerms.forEach(term => {
    if (programme.genre.toLowerCase().includes(term.toLowerCase())) {
      score += 5;
    }
  });
  
  // Channel matching
  searchTerms.forEach(term => {
    if (programme.channel.toLowerCase().includes(term.toLowerCase())) {
      score += 2;
    }
  });
  
  // Time relevance (current/upcoming programmes get bonus)
  const now = new Date();
  const startTime = new Date(programme.startTime);
  const timeDiff = startTime.getTime() - now.getTime();
  
  if (timeDiff > 0 && timeDiff < 24 * 60 * 60 * 1000) {
    score += 3; // Bonus for programmes starting within 24 hours
  }
  
  return score;
};
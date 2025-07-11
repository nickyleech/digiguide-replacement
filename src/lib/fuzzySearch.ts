import { Programme } from '@/types';

// Levenshtein distance for fuzzy matching
export function levenshteinDistance(str1: string, str2: string): number {
  const matrix = [];
  const len1 = str1.length;
  const len2 = str2.length;

  // Initialize the matrix
  for (let i = 0; i <= len1; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= len2; j++) {
    matrix[0][j] = j;
  }

  // Fill the matrix
  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,     // deletion
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j - 1] + 1  // substitution
        );
      }
    }
  }

  return matrix[len1][len2];
}

// Calculate similarity ratio (0-1, where 1 is exact match)
export function similarity(str1: string, str2: string): number {
  const maxLength = Math.max(str1.length, str2.length);
  if (maxLength === 0) return 1;
  
  const distance = levenshteinDistance(str1.toLowerCase(), str2.toLowerCase());
  return (maxLength - distance) / maxLength;
}

// Jaro-Winkler distance for better matching of names and titles
export function jaroWinklerDistance(str1: string, str2: string): number {
  const s1 = str1.toLowerCase();
  const s2 = str2.toLowerCase();
  
  if (s1 === s2) return 1;
  
  const len1 = s1.length;
  const len2 = s2.length;
  
  // Maximum allowed distance
  const maxDistance = Math.floor(Math.max(len1, len2) / 2) - 1;
  
  // Arrays to track matches
  const match1 = new Array(len1).fill(false);
  const match2 = new Array(len2).fill(false);
  
  let matches = 0;
  let transpositions = 0;
  
  // Find matches
  for (let i = 0; i < len1; i++) {
    const start = Math.max(0, i - maxDistance);
    const end = Math.min(i + maxDistance + 1, len2);
    
    for (let j = start; j < end; j++) {
      if (match2[j] || s1[i] !== s2[j]) continue;
      
      match1[i] = true;
      match2[j] = true;
      matches++;
      break;
    }
  }
  
  if (matches === 0) return 0;
  
  // Find transpositions
  let k = 0;
  for (let i = 0; i < len1; i++) {
    if (!match1[i]) continue;
    
    while (!match2[k]) k++;
    
    if (s1[i] !== s2[k]) transpositions++;
    k++;
  }
  
  // Calculate Jaro similarity
  const jaro = (matches / len1 + matches / len2 + (matches - transpositions / 2) / matches) / 3;
  
  // Calculate Jaro-Winkler similarity
  let prefix = 0;
  for (let i = 0; i < Math.min(len1, len2, 4); i++) {
    if (s1[i] === s2[i]) prefix++;
    else break;
  }
  
  return jaro + (0.1 * prefix * (1 - jaro));
}

// Soundex algorithm for phonetic matching
export function soundex(str: string): string {
  const soundexMap: { [key: string]: string } = {
    'B': '1', 'F': '1', 'P': '1', 'V': '1',
    'C': '2', 'G': '2', 'J': '2', 'K': '2', 'Q': '2', 'S': '2', 'X': '2', 'Z': '2',
    'D': '3', 'T': '3',
    'L': '4',
    'M': '5', 'N': '5',
    'R': '6'
  };
  
  const word = str.toUpperCase().replace(/[^A-Z]/g, '');
  if (word.length === 0) return '0000';
  
  let result = word[0];
  let prevCode = soundexMap[word[0]] || '0';
  
  for (let i = 1; i < word.length && result.length < 4; i++) {
    const code = soundexMap[word[i]] || '0';
    if (code !== '0' && code !== prevCode) {
      result += code;
    }
    prevCode = code;
  }
  
  return result.padEnd(4, '0').substring(0, 4);
}

// Advanced fuzzy search with multiple algorithms
export interface FuzzyMatch {
  item: Programme;
  score: number;
  matches: {
    field: string;
    value: string;
    similarity: number;
    algorithm: string;
  }[];
}

export class FuzzySearch {
  private programmes: Programme[] = [];
  private threshold = 0.6; // Minimum similarity threshold
  
  constructor(programmes: Programme[] = [], threshold = 0.6) {
    this.programmes = programmes;
    this.threshold = threshold;
  }
  
  setProgrammes(programmes: Programme[]): void {
    this.programmes = programmes;
  }
  
  setThreshold(threshold: number): void {
    this.threshold = threshold;
  }
  
  // Main fuzzy search function
  search(query: string, options: {
    fields?: string[];
    maxResults?: number;
    includeScore?: boolean;
    phoneticMatch?: boolean;
  } = {}): FuzzyMatch[] {
    const {
      fields = ['title', 'description', 'genre', 'channel'],
      maxResults = 50,
      phoneticMatch = true
    } = options;
    
    if (!query.trim()) return [];
    
    const matches: FuzzyMatch[] = [];
    const queryLower = query.toLowerCase();
    const querySoundex = phoneticMatch ? soundex(query) : '';
    
    this.programmes.forEach(programme => {
      const matchResults: FuzzyMatch['matches'] = [];
      let maxScore = 0;
      
      // Check each field
      fields.forEach(field => {
        const fieldValue = (programme as any)[field];
        if (typeof fieldValue !== 'string') return;
        
        const fieldLower = fieldValue.toLowerCase();
        
        // Exact match (highest score)
        if (fieldLower === queryLower) {
          matchResults.push({
            field,
            value: fieldValue,
            similarity: 1,
            algorithm: 'exact'
          });
          maxScore = Math.max(maxScore, 1);
          return;
        }
        
        // Substring match
        if (fieldLower.includes(queryLower)) {
          const similarity = queryLower.length / fieldLower.length;
          matchResults.push({
            field,
            value: fieldValue,
            similarity,
            algorithm: 'substring'
          });
          maxScore = Math.max(maxScore, similarity);
        }
        
        // Jaro-Winkler similarity
        const jaroSimilarity = jaroWinklerDistance(query, fieldValue);
        if (jaroSimilarity >= this.threshold) {
          matchResults.push({
            field,
            value: fieldValue,
            similarity: jaroSimilarity,
            algorithm: 'jaro-winkler'
          });
          maxScore = Math.max(maxScore, jaroSimilarity);
        }
        
        // Levenshtein similarity
        const levSimilarity = similarity(query, fieldValue);
        if (levSimilarity >= this.threshold) {
          matchResults.push({
            field,
            value: fieldValue,
            similarity: levSimilarity,
            algorithm: 'levenshtein'
          });
          maxScore = Math.max(maxScore, levSimilarity);
        }
        
        // Phonetic matching (Soundex)
        if (phoneticMatch && querySoundex) {
          const fieldSoundex = soundex(fieldValue);
          if (fieldSoundex === querySoundex) {
            matchResults.push({
              field,
              value: fieldValue,
              similarity: 0.8, // Fixed similarity for phonetic matches
              algorithm: 'soundex'
            });
            maxScore = Math.max(maxScore, 0.8);
          }
        }
        
        // Word-based matching for multi-word queries
        if (query.includes(' ') || fieldValue.includes(' ')) {
          const queryWords = query.toLowerCase().split(/\s+/);
          const fieldWords = fieldValue.toLowerCase().split(/\s+/);
          
          let wordMatches = 0;
          let totalSimilarity = 0;
          
          queryWords.forEach(queryWord => {
            let bestWordMatch = 0;
            fieldWords.forEach(fieldWord => {
              const wordSimilarity = Math.max(
                jaroWinklerDistance(queryWord, fieldWord),
                similarity(queryWord, fieldWord)
              );
              bestWordMatch = Math.max(bestWordMatch, wordSimilarity);
            });
            
            if (bestWordMatch >= this.threshold) {
              wordMatches++;
              totalSimilarity += bestWordMatch;
            }
          });
          
          if (wordMatches > 0) {
            const wordBasedSimilarity = totalSimilarity / queryWords.length;
            matchResults.push({
              field,
              value: fieldValue,
              similarity: wordBasedSimilarity,
              algorithm: 'word-based'
            });
            maxScore = Math.max(maxScore, wordBasedSimilarity);
          }
        }
      });
      
      // If we have any matches above threshold, add to results
      if (maxScore >= this.threshold) {
        matches.push({
          item: programme,
          score: maxScore,
          matches: matchResults
        });
      }
    });
    
    // Sort by score and limit results
    return matches
      .sort((a, b) => b.score - a.score)
      .slice(0, maxResults);
  }
  
  // Search with auto-correction suggestions
  searchWithSuggestions(query: string, options: {
    maxResults?: number;
    maxSuggestions?: number;
  } = {}): {
    results: FuzzyMatch[];
    suggestions: string[];
  } {
    const { maxResults = 50, maxSuggestions = 5 } = options;
    
    const results = this.search(query, { maxResults });
    
    // If we have good results, return them
    if (results.length > 0 && results[0].score > 0.8) {
      return { results, suggestions: [] };
    }
    
    // Generate suggestions based on similar titles
    const suggestions: string[] = [];
    const allTitles = this.programmes.map(p => p.title);
    
    allTitles.forEach(title => {
      const titleSimilarity = jaroWinklerDistance(query, title);
      if (titleSimilarity >= 0.5 && titleSimilarity < 0.8) {
        suggestions.push(title);
      }
    });
    
    // Sort suggestions by similarity and limit
    const sortedSuggestions = suggestions
      .sort((a, b) => jaroWinklerDistance(query, b) - jaroWinklerDistance(query, a))
      .slice(0, maxSuggestions);
    
    return { results, suggestions: sortedSuggestions };
  }
  
  // Get typo corrections
  getTypoCorrections(query: string, maxSuggestions = 5): string[] {
    const corrections: { text: string; score: number }[] = [];
    
    // Get all unique words from programmes
    const allWords = new Set<string>();
    this.programmes.forEach(programme => {
      const words = `${programme.title} ${programme.description} ${programme.genre} ${programme.channel}`
        .toLowerCase()
        .split(/\s+/)
        .filter(word => word.length > 2);
      words.forEach(word => allWords.add(word));
    });
    
    // Find similar words
    const queryWords = query.toLowerCase().split(/\s+/);
    
    queryWords.forEach(queryWord => {
      if (queryWord.length < 3) return;
      
      allWords.forEach(word => {
        const score = jaroWinklerDistance(queryWord, word);
        if (score >= 0.7 && score < 0.95) {
          corrections.push({ text: word, score });
        }
      });
    });
    
    // Return top corrections
    return corrections
      .sort((a, b) => b.score - a.score)
      .slice(0, maxSuggestions)
      .map(c => c.text);
  }
}

// Export singleton instance
export const fuzzySearch = new FuzzySearch();
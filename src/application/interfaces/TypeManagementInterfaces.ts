/**
 * Type Management Use Case Interfaces
 * Defines input/output DTOs and contracts for Pokemon type management operations
 */

import type { TypeId } from '@/domain/types';

// DTOs (Data Transfer Objects)

export interface GetAllTypesRequest {
  /**
   * Include additional metadata
   */
  includeMetadata?: boolean;
  
  /**
   * Language for type names
   */
  language?: 'en' | 'ja';
}

export interface GetAllTypesResponse {
  types: TypeDTO[];
  totalCount: number;
  metadata?: {
    languages: string[];
    categories: string[];
    lastUpdated: Date;
  };
}

export interface GetTypeDetailsRequest {
  typeId: TypeId;
  
  /**
   * Language for type names and descriptions
   */
  language?: 'en' | 'ja';
  
  /**
   * Include effectiveness relationships
   */
  includeEffectiveness?: boolean;
}

export interface GetTypeDetailsResponse {
  type: TypeDetailDTO;
  effectiveness?: {
    strongAgainst: TypeId[];
    weakAgainst: TypeId[];
    resistantTo: TypeId[];
    vulnerableTo: TypeId[];
    immuneTo: TypeId[];
    ineffectiveAgainst: TypeId[];
  };
}

export interface SearchTypesRequest {
  /**
   * Search by type name (supports partial matching)
   */
  searchText?: string;
  
  /**
   * Filter by color
   */
  color?: string;
  
  /**
   * Filter by category (physical, special, status)
   */
  category?: string;
  
  /**
   * Language for search and results
   */
  language?: 'en' | 'ja';
  
  /**
   * Sort by field
   */
  sortBy?: 'name' | 'color' | 'category';
  
  /**
   * Sort order
   */
  sortOrder?: 'asc' | 'desc';
}

export interface SearchTypesResponse {
  types: TypeDTO[];
  totalCount: number;
  searchCriteria: {
    appliedFilters: string[];
    searchText?: string;
    resultLanguage: 'en' | 'ja';
  };
}

export interface GetTypeEffectivenessMatrixRequest {
  /**
   * Include only specific types in the matrix
   */
  includeTypes?: TypeId[];
  
  /**
   * Exclude specific types from the matrix
   */
  excludeTypes?: TypeId[];
  
  /**
   * Format of the matrix
   */
  format?: 'full' | 'compact' | 'summary';
}

export interface GetTypeEffectivenessMatrixResponse {
  matrix: EffectivenessMatrixEntry[][];
  types: TypeId[];
  dimensions: {
    attackingTypes: number;
    defendingTypes: number;
  };
  statistics: {
    totalCombinations: number;
    superEffectiveCombinations: number;
    notVeryEffectiveCombinations: number;
    noEffectCombinations: number;
    normalEffectiveCombinations: number;
  };
}

export interface GetTypeStatisticsRequest {
  /**
   * Include effectiveness statistics
   */
  includeEffectiveness?: boolean;
  
  /**
   * Include color distribution
   */
  includeColorDistribution?: boolean;
  
  /**
   * Include usage statistics (if available)
   */
  includeUsageStats?: boolean;
}

export interface GetTypeStatisticsResponse {
  totalTypes: number;
  colorDistribution?: Record<string, number>;
  effectivenessStats?: {
    averageAdvantages: number;
    averageDisadvantages: number;
    mostVersatileType: TypeId;
    mostSpecializedType: TypeId;
    balanceScore: Record<TypeId, number>;
  };
  usageStats?: {
    mostSearchedTypes: Array<{ typeId: TypeId; searchCount: number }>;
    leastSearchedTypes: Array<{ typeId: TypeId; searchCount: number }>;
    averageSearchesPerType: number;
  };
}

export interface ValidateTypeInteractionRequest {
  attackingType: TypeId;
  defendingType: TypeId[];
  
  /**
   * Expected effectiveness for validation
   */
  expectedEffectiveness?: string;
}

export interface ValidateTypeInteractionResponse {
  isValid: boolean;
  calculatedEffectiveness: {
    value: string;
    multiplier: number;
    description: string;
  };
  expectedEffectiveness?: {
    value: string;
    multiplier: number;
    description: string;
  };
  matches: boolean;
  explanation: string;
}

export interface GetTypeRecommendationsRequest {
  /**
   * User preferences or current team
   */
  userPreferences?: {
    favoriteTypes?: TypeId[];
    dislikedTypes?: TypeId[];
    playstyle?: 'offensive' | 'defensive' | 'balanced';
  };
  
  /**
   * Context for recommendations
   */
  context?: 'team_building' | 'learning' | 'quiz_focus';
  
  /**
   * Number of recommendations to return
   */
  limit?: number;
}

export interface GetTypeRecommendationsResponse {
  recommendations: TypeRecommendationDTO[];
  reasoning: {
    basedOn: string[];
    context: string;
    confidenceScore: number;
  };
}

// Shared DTOs

export interface TypeDTO {
  id: TypeId;
  name: string;
  nameJa: string;
  color: string;
  colorLight?: string;
  symbol?: string;
  animation?: string;
  category?: string;
  description?: string;
  tags?: string[];
}

export interface TypeDetailDTO extends TypeDTO {
  metadata: {
    introduced: string;
    commonPokemon: string[];
    uniqueTraits: string[];
    culturalReferences?: string[];
    competitiveNotes?: string[];
  };
  visuals: {
    primaryColor: string;
    secondaryColor?: string;
    gradientColors?: string[];
    iconUrl?: string;
    backgroundPattern?: string;
  };
}

export interface EffectivenessMatrixEntry {
  attackingType: TypeId;
  defendingType: TypeId;
  effectiveness: string;
  multiplier: number;
  isNeutral: boolean;
  isAdvantage: boolean;
  isDisadvantage: boolean;
}

export interface TypeRecommendationDTO {
  typeId: TypeId;
  typeName: string;
  recommendationScore: number;
  reasons: string[];
  learningPriority: 'high' | 'medium' | 'low';
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
  relatedTypes: TypeId[];
}

// Use Case Interface

export interface ITypeManagementUseCase {
  /**
   * Get all available Pokemon types
   */
  getAllTypes(request: GetAllTypesRequest): Promise<GetAllTypesResponse>;

  /**
   * Get detailed information about a specific type
   */
  getTypeDetails(request: GetTypeDetailsRequest): Promise<GetTypeDetailsResponse>;

  /**
   * Search for types with various filters
   */
  searchTypes(request: SearchTypesRequest): Promise<SearchTypesResponse>;

  /**
   * Get type effectiveness matrix
   */
  getTypeEffectivenessMatrix(request: GetTypeEffectivenessMatrixRequest): Promise<GetTypeEffectivenessMatrixResponse>;

  /**
   * Get comprehensive type statistics
   */
  getTypeStatistics(request: GetTypeStatisticsRequest): Promise<GetTypeStatisticsResponse>;

  /**
   * Validate type interactions and effectiveness calculations
   */
  validateTypeInteraction(request: ValidateTypeInteractionRequest): Promise<ValidateTypeInteractionResponse>;

  /**
   * Get personalized type recommendations
   */
  getTypeRecommendations(request: GetTypeRecommendationsRequest): Promise<GetTypeRecommendationsResponse>;
}
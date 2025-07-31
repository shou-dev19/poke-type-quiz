/**
 * Type Management Use Case Implementation
 * Handles Pokemon type operations, statistics, and recommendations
 */

import type {
  ITypeManagementUseCase,
  GetAllTypesRequest,
  GetAllTypesResponse,
  GetTypeDetailsRequest,
  GetTypeDetailsResponse,
  SearchTypesRequest,
  SearchTypesResponse,
  GetTypeEffectivenessMatrixRequest,
  GetTypeEffectivenessMatrixResponse,
  GetTypeStatisticsRequest,
  GetTypeStatisticsResponse,
  ValidateTypeInteractionRequest,
  ValidateTypeInteractionResponse,
  GetTypeRecommendationsRequest,
  GetTypeRecommendationsResponse,
  TypeDTO,
  TypeDetailDTO,
  EffectivenessMatrixEntry,
  TypeRecommendationDTO
} from '@/application/interfaces/TypeManagementInterfaces';

import type { 
  ITypeEffectivenessService, 
  ITypeRepository 
} from '@/domain/services';
import { TypeEffectiveness } from '@/domain/entities/TypeEffectiveness';
import { PokemonType } from '@/domain/entities/PokemonType';
import type { TypeId } from '@/domain/types';

/**
 * Type Management Use Case
 * Provides comprehensive Pokemon type management capabilities
 */
export class TypeManagementUseCase implements ITypeManagementUseCase {
  // Cache for frequently accessed data
  private typeCache: Map<string, PokemonType[]> = new Map();
  private statisticsCache: Map<string, any> = new Map();
  private cacheExpiry: Map<string, number> = new Map();
  private readonly CACHE_TTL = 10 * 60 * 1000; // 10 minutes
  
  // Usage tracking for recommendations
  private typeSearchCounts: Map<TypeId, number> = new Map();
  private lastSearchTimes: Map<TypeId, Date> = new Map();

  constructor(
    private readonly typeEffectivenessService: ITypeEffectivenessService,
    private readonly typeRepository: ITypeRepository
  ) {}

  /**
   * Get all available Pokemon types
   */
  async getAllTypes(request: GetAllTypesRequest): Promise<GetAllTypesResponse> {
    const cacheKey = `all_types_${JSON.stringify(request)}`;
    
    // Check cache
    if (this.isValidCache(cacheKey)) {
      return this.typeCache.get(cacheKey);
    }

    // Get all types from repository
    const allTypes = await this.typeRepository.getAllTypes();
    const language = request.language || 'en';

    // Convert to DTOs
    const typeDTOs = allTypes.map(type => this.convertToTypeDTO(type, language));

    const response: GetAllTypesResponse = {
      types: typeDTOs,
      totalCount: allTypes.length
    };

    // Add metadata if requested
    if (request.includeMetadata) {
      response.metadata = {
        languages: ['en', 'ja'],
        categories: this.extractCategories(allTypes),
        lastUpdated: new Date()
      };
    }

    // Cache the results
    this.cacheResults(cacheKey, response);

    return response;
  }

  /**
   * Get detailed information about a specific type
   */
  async getTypeDetails(request: GetTypeDetailsRequest): Promise<GetTypeDetailsResponse> {
    const allTypes = await this.typeRepository.getAllTypes();
    const targetType = allTypes.find(type => type.id === request.typeId);

    if (!targetType) {
      throw new Error(`Type not found: ${request.typeId}`);
    }

    const language = request.language || 'en';
    const typeDetailDTO = this.convertToTypeDetailDTO(targetType, language);

    const response: GetTypeDetailsResponse = {
      type: typeDetailDTO
    };

    // Add effectiveness relationships if requested
    if (request.includeEffectiveness) {
      response.effectiveness = await this.calculateTypeRelationships(request.typeId);
    }

    return response;
  }

  /**
   * Search for types with various filters
   */
  async searchTypes(request: SearchTypesRequest): Promise<SearchTypesResponse> {
    const allTypes = await this.typeRepository.getAllTypes();
    const language = request.language || 'en';
    let filteredTypes = [...allTypes];

    // Apply search text filter
    if (request.searchText) {
      const searchLower = request.searchText.toLowerCase();
      filteredTypes = filteredTypes.filter(type => {
        const name = language === 'ja' ? type.nameJa : type.id;
        return name.toLowerCase().includes(searchLower) ||
               type.id.toLowerCase().includes(searchLower);
      });
    }

    // Apply color filter
    if (request.color) {
      filteredTypes = filteredTypes.filter(type => 
        type.color.toLowerCase() === request.color!.toLowerCase()
      );
    }

    // Apply category filter
    if (request.category) {
      filteredTypes = filteredTypes.filter(type => 
        this.getTypeCategory(type).toLowerCase() === request.category!.toLowerCase()
      );
    }

    // Apply sorting
    if (request.sortBy) {
      filteredTypes = this.applySorting(filteredTypes, request.sortBy, request.sortOrder, language);
    }

    // Update search tracking
    if (request.searchText || filteredTypes.length <= 5) {
      filteredTypes.forEach(type => this.trackTypeSearch(type.id as TypeId));
    }

    // Convert to DTOs
    const typeDTOs = filteredTypes.map(type => this.convertToTypeDTO(type, language));

    const appliedFilters: string[] = [];
    if (request.searchText) appliedFilters.push('text_search');
    if (request.color) appliedFilters.push('color_filter');
    if (request.category) appliedFilters.push('category_filter');

    return {
      types: typeDTOs,
      totalCount: filteredTypes.length,
      searchCriteria: {
        appliedFilters,
        searchText: request.searchText,
        resultLanguage: language
      }
    };
  }

  /**
   * Get type effectiveness matrix
   */
  async getTypeEffectivenessMatrix(request: GetTypeEffectivenessMatrixRequest): Promise<GetTypeEffectivenessMatrixResponse> {
    const cacheKey = `effectiveness_matrix_${JSON.stringify(request)}`;
    
    // Check cache
    if (this.isValidCache(cacheKey)) {
      return this.statisticsCache.get(cacheKey);
    }

    const allTypes = await this.typeRepository.getAllTypes();
    let types = allTypes.map(t => t.id as TypeId);

    // Apply type filters
    if (request.includeTypes) {
      types = types.filter(t => request.includeTypes!.includes(t));
    }
    if (request.excludeTypes) {
      types = types.filter(t => !request.excludeTypes!.includes(t));
    }

    // Build effectiveness matrix
    const matrix: EffectivenessMatrixEntry[][] = [];
    const statistics = {
      totalCombinations: 0,
      superEffectiveCombinations: 0,
      notVeryEffectiveCombinations: 0,
      noEffectCombinations: 0,
      normalEffectiveCombinations: 0
    };

    for (const attackingType of types) {
      const row: EffectivenessMatrixEntry[] = [];
      
      for (const defendingType of types) {
        const effectiveness = this.typeEffectivenessService.calculateEffectiveness(
          attackingType,
          [defendingType]
        );

        const entry: EffectivenessMatrixEntry = {
          attackingType,
          defendingType,
          effectiveness: effectiveness.value,
          multiplier: effectiveness.multiplier,
          isNeutral: effectiveness.isNeutral(),
          isAdvantage: effectiveness.multiplier > 1,
          isDisadvantage: effectiveness.multiplier < 1 && effectiveness.multiplier > 0
        };

        row.push(entry);

        // Update statistics
        statistics.totalCombinations++;
        if (effectiveness.multiplier > 1) {
          statistics.superEffectiveCombinations++;
        } else if (effectiveness.multiplier === 0) {
          statistics.noEffectCombinations++;
        } else if (effectiveness.multiplier < 1) {
          statistics.notVeryEffectiveCombinations++;
        } else {
          statistics.normalEffectiveCombinations++;
        }
      }
      
      matrix.push(row);
    }

    const response: GetTypeEffectivenessMatrixResponse = {
      matrix,
      types,
      dimensions: {
        attackingTypes: types.length,
        defendingTypes: types.length
      },
      statistics
    };

    // Cache the results
    this.cacheResults(cacheKey, response);

    return response;
  }

  /**
   * Get comprehensive type statistics
   */
  async getTypeStatistics(request: GetTypeStatisticsRequest): Promise<GetTypeStatisticsResponse> {
    const cacheKey = `type_statistics_${JSON.stringify(request)}`;
    
    // Check cache
    if (this.isValidCache(cacheKey)) {
      return this.statisticsCache.get(cacheKey);
    }

    const allTypes = await this.typeRepository.getAllTypes();
    const response: GetTypeStatisticsResponse = {
      totalTypes: allTypes.length
    };

    // Color distribution
    if (request.includeColorDistribution) {
      response.colorDistribution = this.calculateColorDistribution(allTypes);
    }

    // Effectiveness statistics
    if (request.includeEffectiveness) {
      response.effectivenessStats = await this.calculateEffectivenessStatistics(allTypes);
    }

    // Usage statistics
    if (request.includeUsageStats) {
      response.usageStats = this.calculateUsageStatistics();
    }

    // Cache the results
    this.cacheResults(cacheKey, response);

    return response;
  }

  /**
   * Validate type interactions and effectiveness calculations
   */
  async validateTypeInteraction(request: ValidateTypeInteractionRequest): Promise<ValidateTypeInteractionResponse> {
    // Calculate actual effectiveness
    const calculatedEffectiveness = this.typeEffectivenessService.calculateEffectiveness(
      request.attackingType,
      request.defendingType
    );

    const response: ValidateTypeInteractionResponse = {
      isValid: true,
      calculatedEffectiveness: {
        value: calculatedEffectiveness.value,
        multiplier: calculatedEffectiveness.multiplier,
        description: calculatedEffectiveness.displayText
      },
      matches: true,
      explanation: `${request.attackingType} vs ${request.defendingType.join('/')}: ${calculatedEffectiveness.displayText} (${calculatedEffectiveness.multiplier}x)`
    };

    // Validate against expected effectiveness if provided
    if (request.expectedEffectiveness) {
      const expectedEffectiveness = TypeEffectiveness.fromValue(request.expectedEffectiveness as any);
      
      response.expectedEffectiveness = {
        value: expectedEffectiveness.value,
        multiplier: expectedEffectiveness.multiplier,
        description: expectedEffectiveness.displayText
      };

      response.matches = calculatedEffectiveness.value === expectedEffectiveness.value;
      
      if (!response.matches) {
        response.explanation += ` Expected: ${expectedEffectiveness.displayText} (${expectedEffectiveness.multiplier}x)`;
      }
    }

    return response;
  }

  /**
   * Get personalized type recommendations
   */
  async getTypeRecommendations(request: GetTypeRecommendationsRequest): Promise<GetTypeRecommendationsResponse> {
    const allTypes = await this.typeRepository.getAllTypes();
    const limit = request.limit || 5;
    
    // Calculate recommendation scores for each type
    const recommendations: TypeRecommendationDTO[] = [];
    
    for (const type of allTypes) {
      const score = this.calculateRecommendationScore(
        type.id as TypeId,
        request.userPreferences,
        request.context
      );

      if (score > 0) {
        const recommendation: TypeRecommendationDTO = {
          typeId: type.id as TypeId,
          typeName: type.nameJa,
          recommendationScore: score,
          reasons: this.generateRecommendationReasons(type.id as TypeId, request.userPreferences, request.context),
          learningPriority: this.determineLearningPriority(score),
          difficultyLevel: this.determineDifficultyLevel(type.id as TypeId),
          relatedTypes: await this.findRelatedTypes(type.id as TypeId)
        };

        recommendations.push(recommendation);
      }
    }

    // Sort by recommendation score and limit
    recommendations.sort((a, b) => b.recommendationScore - a.recommendationScore);
    const limitedRecommendations = recommendations.slice(0, limit);

    return {
      recommendations: limitedRecommendations,
      reasoning: {
        basedOn: this.getReasoningFactors(request.userPreferences, request.context),
        context: request.context || 'general',
        confidenceScore: this.calculateConfidenceScore(limitedRecommendations)
      }
    };
  }

  /**
   * Convert PokemonType to TypeDTO
   */
  private convertToTypeDTO(type: PokemonType, language: 'en' | 'ja'): TypeDTO {
    return {
      id: type.id as TypeId,
      name: type.id,
      nameJa: type.nameJa,
      color: type.color,
      colorLight: type.colorLight,
      symbol: type.symbol,
      animation: type.animation,
      category: this.getTypeCategory(type),
      description: this.getTypeDescription(type, language),
      tags: this.generateTypeTags(type)
    };
  }

  /**
   * Convert PokemonType to TypeDetailDTO
   */
  private convertToTypeDetailDTO(type: PokemonType, language: 'en' | 'ja'): TypeDetailDTO {
    const baseDTO = this.convertToTypeDTO(type, language);

    return {
      ...baseDTO,
      metadata: {
        introduced: 'Generation I', // Default for now
        commonPokemon: this.getCommonPokemon(type.id as TypeId),
        uniqueTraits: this.getUniqueTraits(type.id as TypeId),
        culturalReferences: this.getCulturalReferences(type.id as TypeId),
        competitiveNotes: this.getCompetitiveNotes(type.id as TypeId)
      },
      visuals: {
        primaryColor: type.color,
        secondaryColor: type.colorLight,
        gradientColors: this.generateGradientColors(type.color),
        iconUrl: `/icons/types/${type.id}.svg`,
        backgroundPattern: this.getBackgroundPattern(type.id as TypeId)
      }
    };
  }

  /**
   * Calculate type relationships (strengths/weaknesses)
   */
  private async calculateTypeRelationships(typeId: TypeId): Promise<{
    strongAgainst: TypeId[];
    weakAgainst: TypeId[];
    resistantTo: TypeId[];
    vulnerableTo: TypeId[];
    immuneTo: TypeId[];
    ineffectiveAgainst: TypeId[];
  }> {
    const allTypes = await this.typeRepository.getAllTypes();
    const typeIds = allTypes.map(t => t.id as TypeId);

    const relationships = {
      strongAgainst: [] as TypeId[],
      weakAgainst: [] as TypeId[],
      resistantTo: [] as TypeId[],
      vulnerableTo: [] as TypeId[],
      immuneTo: [] as TypeId[],
      ineffectiveAgainst: [] as TypeId[]
    };

    for (const targetType of typeIds) {
      // Offensive relationships (typeId attacking targetType)
      const offensiveEffectiveness = this.typeEffectivenessService.calculateEffectiveness(
        typeId,
        [targetType]
      );

      if (offensiveEffectiveness.multiplier > 1) {
        relationships.strongAgainst.push(targetType);
      } else if (offensiveEffectiveness.multiplier < 1 && offensiveEffectiveness.multiplier > 0) {
        relationships.weakAgainst.push(targetType);
      } else if (offensiveEffectiveness.multiplier === 0) {
        relationships.ineffectiveAgainst.push(targetType);
      }

      // Defensive relationships (targetType attacking typeId)
      const defensiveEffectiveness = this.typeEffectivenessService.calculateEffectiveness(
        targetType,
        [typeId]
      );

      if (defensiveEffectiveness.multiplier > 1) {
        relationships.vulnerableTo.push(targetType);
      } else if (defensiveEffectiveness.multiplier < 1 && defensiveEffectiveness.multiplier > 0) {
        relationships.resistantTo.push(targetType);
      } else if (defensiveEffectiveness.multiplier === 0) {
        relationships.immuneTo.push(targetType);
      }
    }

    return relationships;
  }

  /**
   * Apply sorting to types array
   */
  private applySorting(
    types: PokemonType[], 
    sortBy: string, 
    sortOrder: 'asc' | 'desc' = 'asc',
    language: 'en' | 'ja'
  ): PokemonType[] {
    const multiplier = sortOrder === 'desc' ? -1 : 1;

    return types.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          const nameA = language === 'ja' ? a.nameJa : a.id;
          const nameB = language === 'ja' ? b.nameJa : b.id;
          return nameA.localeCompare(nameB) * multiplier;
        
        case 'color':
          return a.color.localeCompare(b.color) * multiplier;
        
        default:
          return 0;
      }
    });
  }

  /**
   * Calculate color distribution
   */
  private calculateColorDistribution(types: PokemonType[]): Record<string, number> {
    const distribution: Record<string, number> = {};
    
    for (const type of types) {
      const colorKey = type.color.toLowerCase();
      distribution[colorKey] = (distribution[colorKey] || 0) + 1;
    }

    return distribution;
  }

  /**
   * Calculate effectiveness statistics
   */
  private async calculateEffectivenessStatistics(types: PokemonType[]): Promise<{
    averageAdvantages: number;
    averageDisadvantages: number;
    mostVersatileType: TypeId;
    mostSpecializedType: TypeId;
    balanceScore: Record<TypeId, number>;
  }> {
    const typeIds = types.map(t => t.id as TypeId);
    const balanceScores: Record<TypeId, number> = {};
    let totalAdvantages = 0;
    let totalDisadvantages = 0;

    for (const typeId of typeIds) {
      let advantages = 0;
      let disadvantages = 0;

      for (const targetType of typeIds) {
        if (typeId === targetType) continue;

        const effectiveness = this.typeEffectivenessService.calculateEffectiveness(
          typeId,
          [targetType]
        );

        if (effectiveness.multiplier > 1) {
          advantages++;
        } else if (effectiveness.multiplier < 1) {
          disadvantages++;
        }
      }

      balanceScores[typeId] = advantages - disadvantages;
      totalAdvantages += advantages;
      totalDisadvantages += disadvantages;
    }

    // Find most versatile (balanced) and most specialized types
    const sortedByBalance = Object.entries(balanceScores)
      .map(([typeId, score]) => ({ typeId: typeId as TypeId, score: Math.abs(score) }))
      .sort((a, b) => a.score - b.score);

    const mostVersatileType = sortedByBalance[0].typeId;
    const mostSpecializedType = sortedByBalance[sortedByBalance.length - 1].typeId;

    return {
      averageAdvantages: totalAdvantages / typeIds.length,
      averageDisadvantages: totalDisadvantages / typeIds.length,
      mostVersatileType,
      mostSpecializedType,
      balanceScore: balanceScores
    };
  }

  /**
   * Calculate usage statistics
   */
  private calculateUsageStatistics(): {
    mostSearchedTypes: Array<{ typeId: TypeId; searchCount: number }>;
    leastSearchedTypes: Array<{ typeId: TypeId; searchCount: number }>;
    averageSearchesPerType: number;
  } {
    const searchEntries = Array.from(this.typeSearchCounts.entries())
      .map(([typeId, count]) => ({ typeId, searchCount: count }))
      .sort((a, b) => b.searchCount - a.searchCount);

    const totalSearches = searchEntries.reduce((sum, entry) => sum + entry.searchCount, 0);
    const averageSearches = searchEntries.length > 0 ? totalSearches / searchEntries.length : 0;

    return {
      mostSearchedTypes: searchEntries.slice(0, 5),
      leastSearchedTypes: searchEntries.slice(-5).reverse(),
      averageSearchesPerType: averageSearches
    };
  }

  /**
   * Calculate recommendation score for a type
   */
  private calculateRecommendationScore(
    typeId: TypeId,
    preferences?: any,
    context?: string
  ): number {
    let score = 50; // Base score

    // Adjust based on user preferences
    if (preferences?.favoriteTypes?.includes(typeId)) {
      score += 30;
    }
    if (preferences?.dislikedTypes?.includes(typeId)) {
      score -= 20;
    }

    // Adjust based on search frequency (recommend less-known types)
    const searchCount = this.typeSearchCounts.get(typeId) || 0;
    if (searchCount < 5) {
      score += 10; // Boost for less-searched types
    }

    // Context-based adjustments
    if (context === 'learning') {
      // Prioritize fundamental types for learning
      const fundamentalTypes: TypeId[] = ['fire', 'water', 'grass', 'electric', 'normal'];
      if (fundamentalTypes.includes(typeId)) {
        score += 15;
      }
    }

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Generate recommendation reasons
   */
  private generateRecommendationReasons(
    typeId: TypeId,
    preferences?: any,
    context?: string
  ): string[] {
    const reasons: string[] = [];

    if (preferences?.favoriteTypes?.includes(typeId)) {
      reasons.push('matches your favorite types');
    }

    const searchCount = this.typeSearchCounts.get(typeId) || 0;
    if (searchCount < 3) {
      reasons.push('explore something new');
    }

    if (context === 'learning') {
      reasons.push('fundamental for understanding type mechanics');
    }

    if (reasons.length === 0) {
      reasons.push('well-balanced learning opportunity');
    }

    return reasons;
  }

  /**
   * Get various helper methods for metadata
   */
  private extractCategories(types: PokemonType[]): string[] {
    return ['Physical', 'Special', 'Status']; // Simplified categories
  }

  private getTypeCategory(type: PokemonType): string {
    // Simple categorization logic
    const physicalTypes = ['normal', 'fighting', 'rock', 'bug', 'ghost', 'steel'];
    const specialTypes = ['fire', 'water', 'grass', 'electric', 'psychic', 'ice', 'dragon', 'dark'];
    
    if (physicalTypes.includes(type.id)) return 'Physical';
    if (specialTypes.includes(type.id)) return 'Special';
    return 'Balanced';
  }

  private getTypeDescription(type: PokemonType, language: 'en' | 'ja'): string {
    const descriptions: Record<string, { en: string; ja: string }> = {
      fire: { en: 'Powerful attacking type', ja: '強力な攻撃タイプ' },
      water: { en: 'Versatile and balanced', ja: '汎用性が高くバランスが良い' },
      grass: { en: 'Good defensive options', ja: '優秀な防御オプション' }
    };
    
    return descriptions[type.id]?.[language] || 'A unique Pokemon type';
  }

  private generateTypeTags(type: PokemonType): string[] {
    const tags = [type.id];
    
    if (type.color) tags.push(type.color.toLowerCase());
    if (type.symbol) tags.push('symbol');
    if (type.animation) tags.push('animated');
    
    return tags;
  }

  private getCommonPokemon(typeId: TypeId): string[] {
    const commonPokemon: Record<TypeId, string[]> = {
      fire: ['Charmander', 'Arcanine', 'Rapidash'],
      water: ['Squirtle', 'Psyduck', 'Staryu'],
      grass: ['Bulbasaur', 'Oddish', 'Bellsprout']
    };
    return commonPokemon[typeId] || [];
  }

  private getUniqueTraits(typeId: TypeId): string[] {
    const traits: Record<TypeId, string[]> = {
      fire: ['Burns enemies', 'Melts ice'],
      water: ['Extinguishes fire', 'Good mobility'],
      electric: ['Paralyzes foes', 'Super speed']
    };
    return traits[typeId] || ['Unique battle properties'];
  }

  private getCulturalReferences(typeId: TypeId): string[] {
    return ['Popular in competitive play', 'Featured in many generations'];
  }

  private getCompetitiveNotes(typeId: TypeId): string[] {
    return ['Viable in current meta', 'Good type coverage'];
  }

  private generateGradientColors(baseColor: string): string[] {
    return [baseColor, '#ffffff'];
  }

  private getBackgroundPattern(typeId: TypeId): string {
    return 'solid';
  }

  private determineLearningPriority(score: number): 'high' | 'medium' | 'low' {
    if (score >= 80) return 'high';
    if (score >= 60) return 'medium';
    return 'low';
  }

  private determineDifficultyLevel(typeId: TypeId): 'beginner' | 'intermediate' | 'advanced' {
    const beginnerTypes: TypeId[] = ['normal', 'fire', 'water', 'grass'];
    const advancedTypes: TypeId[] = ['dragon', 'steel', 'fairy'];
    
    if (beginnerTypes.includes(typeId)) return 'beginner';
    if (advancedTypes.includes(typeId)) return 'advanced';
    return 'intermediate';
  }

  private async findRelatedTypes(typeId: TypeId): Promise<TypeId[]> {
    // Simple implementation - find types with similar effectiveness patterns
    const allTypes = await this.typeRepository.getAllTypes();
    const relatedTypes: TypeId[] = [];
    
    // Add a few related types based on simple logic
    const typeRelations: Record<TypeId, TypeId[]> = {
      fire: ['electric', 'fighting'],
      water: ['ice', 'grass'],
      grass: ['bug', 'poison']
    };
    
    return typeRelations[typeId] || [];
  }

  private getReasoningFactors(preferences?: any, context?: string): string[] {
    const factors = ['type_balance', 'learning_progression'];
    
    if (preferences?.favoriteTypes) factors.push('user_preferences');
    if (context) factors.push(`context_${context}`);
    
    return factors;
  }

  private calculateConfidenceScore(recommendations: TypeRecommendationDTO[]): number {
    if (recommendations.length === 0) return 0;
    
    const averageScore = recommendations.reduce((sum, rec) => sum + rec.recommendationScore, 0) / recommendations.length;
    return Math.round(averageScore);
  }

  private trackTypeSearch(typeId: TypeId): void {
    this.typeSearchCounts.set(typeId, (this.typeSearchCounts.get(typeId) || 0) + 1);
    this.lastSearchTimes.set(typeId, new Date());
  }

  private isValidCache(key: string): boolean {
    const expiry = this.cacheExpiry.get(key);
    return expiry ? Date.now() < expiry : false;
  }

  private cacheResults(key: string, data: any): void {
    this.typeCache.set(key, data);
    this.statisticsCache.set(key, data);
    this.cacheExpiry.set(key, Date.now() + this.CACHE_TTL);
  }
}
/**
 * TypeManagementUseCase Unit Tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TypeManagementUseCase } from '@/application/usecases/TypeManagementUseCase';
import { TypeEffectivenessService } from '@/infrastructure/services/TypeEffectivenessService';
import { FileTypeRepository } from '@/infrastructure/repositories/FileTypeRepository';
import type {
  GetAllTypesRequest,
  GetTypeDetailsRequest,
  SearchTypesRequest,
  GetTypeEffectivenessMatrixRequest,
  GetTypeStatisticsRequest,
  ValidateTypeInteractionRequest,
  GetTypeRecommendationsRequest
} from '@/application/interfaces/TypeManagementInterfaces';

describe('TypeManagementUseCase', () => {
  let useCase: TypeManagementUseCase;
  let typeEffectivenessService: TypeEffectivenessService;
  let typeRepository: FileTypeRepository;

  beforeEach(() => {
    typeRepository = new FileTypeRepository();
    typeEffectivenessService = new TypeEffectivenessService();
    useCase = new TypeManagementUseCase(typeEffectivenessService, typeRepository);
  });

  describe('getAllTypes', () => {
    it('should get all types with basic request', async () => {
      const request: GetAllTypesRequest = {};

      const response = await useCase.getAllTypes(request);

      expect(response.types).toBeDefined();
      expect(response.types.length).toBe(18); // Standard Pokemon types
      expect(response.totalCount).toBe(18);
      expect(response.metadata).toBeUndefined(); // Not requested

      // Verify type structure
      const firstType = response.types[0];
      expect(firstType.id).toBeDefined();
      expect(firstType.name).toBeDefined();
      expect(firstType.nameJa).toBeDefined();
      expect(firstType.color).toBeDefined();
    });

    it('should include metadata when requested', async () => {
      const request: GetAllTypesRequest = {
        includeMetadata: true
      };

      const response = await useCase.getAllTypes(request);

      expect(response.metadata).toBeDefined();
      expect(response.metadata!.languages).toEqual(['en', 'ja']);
      expect(response.metadata!.categories).toBeDefined();
      expect(response.metadata!.lastUpdated).toBeInstanceOf(Date);
    });

    it('should return Japanese names when language is ja', async () => {
      const request: GetAllTypesRequest = {
        language: 'ja'
      };

      const response = await useCase.getAllTypes(request);

      expect(response.types.length).toBeGreaterThan(0);
      response.types.forEach(type => {
        expect(type.nameJa).toBeDefined();
        expect(type.nameJa.length).toBeGreaterThan(0);
      });
    });
  });

  describe('getTypeDetails', () => {
    it('should get detailed information for a valid type', async () => {
      const request: GetTypeDetailsRequest = {
        typeId: 'fire'
      };

      const response = await useCase.getTypeDetails(request);

      expect(response.type).toBeDefined();
      expect(response.type.id).toBe('fire');
      expect(response.type.metadata).toBeDefined();
      expect(response.type.metadata.commonPokemon).toBeDefined();
      expect(response.type.metadata.uniqueTraits).toBeDefined();
      expect(response.type.visuals).toBeDefined();
      expect(response.type.visuals.primaryColor).toBeDefined();
    });

    it('should include effectiveness relationships when requested', async () => {
      const request: GetTypeDetailsRequest = {
        typeId: 'fire',
        includeEffectiveness: true
      };

      const response = await useCase.getTypeDetails(request);

      expect(response.effectiveness).toBeDefined();
      expect(response.effectiveness!.strongAgainst).toBeDefined();
      expect(response.effectiveness!.weakAgainst).toBeDefined();
      expect(response.effectiveness!.resistantTo).toBeDefined();
      expect(response.effectiveness!.vulnerableTo).toBeDefined();
      expect(response.effectiveness!.immuneTo).toBeDefined();
      expect(response.effectiveness!.ineffectiveAgainst).toBeDefined();

      // Fire should be strong against grass
      expect(response.effectiveness!.strongAgainst).toContain('grass');
      // Fire should be weak against water
      expect(response.effectiveness!.weakAgainst).toContain('water');
    });

    it('should throw error for invalid type', async () => {
      const request: GetTypeDetailsRequest = {
        typeId: 'invalid' as any
      };

      await expect(useCase.getTypeDetails(request)).rejects.toThrow('Type not found: invalid');
    });
  });

  describe('searchTypes', () => {
    it('should search types by text', async () => {
      const request: SearchTypesRequest = {
        searchText: 'fire'
      };

      const response = await useCase.searchTypes(request);

      expect(response.types.length).toBeGreaterThan(0);
      expect(response.searchCriteria.appliedFilters).toContain('text_search');
      expect(response.searchCriteria.searchText).toBe('fire');
      
      // Should contain fire type
      const fireType = response.types.find(t => t.id === 'fire');
      expect(fireType).toBeDefined();
    });

    it('should filter types by color', async () => {
      const request: SearchTypesRequest = {
        color: '#F08030' // Fire type color
      };

      const response = await useCase.searchTypes(request);

      expect(response.types.length).toBeGreaterThan(0);
      expect(response.searchCriteria.appliedFilters).toContain('color_filter');
      
      response.types.forEach(type => {
        expect(type.color.toLowerCase()).toBe('#f08030');
      });
    });

    it('should sort types by name', async () => {
      const request: SearchTypesRequest = {
        sortBy: 'name',
        sortOrder: 'asc'
      };

      const response = await useCase.searchTypes(request);

      expect(response.types.length).toBeGreaterThan(1);
      
      // Check if sorted alphabetically
      for (let i = 1; i < response.types.length; i++) {
        expect(response.types[i].name >= response.types[i - 1].name).toBe(true);
      }
    });

    it('should handle empty search results', async () => {
      const request: SearchTypesRequest = {
        searchText: 'nonexistenttype'
      };

      const response = await useCase.searchTypes(request);

      expect(response.types).toHaveLength(0);
      expect(response.totalCount).toBe(0);
      expect(response.searchCriteria.appliedFilters).toContain('text_search');
    });
  });

  describe('getTypeEffectivenessMatrix', () => {
    it('should generate complete effectiveness matrix', async () => {
      const request: GetTypeEffectivenessMatrixRequest = {};

      const response = await useCase.getTypeEffectivenessMatrix(request);

      expect(response.matrix).toBeDefined();
      expect(response.types).toBeDefined();
      expect(response.types.length).toBe(18);
      expect(response.dimensions.attackingTypes).toBe(18);
      expect(response.dimensions.defendingTypes).toBe(18);
      expect(response.matrix.length).toBe(18);
      expect(response.matrix[0].length).toBe(18);

      // Verify statistics
      expect(response.statistics.totalCombinations).toBe(18 * 18);
      expect(response.statistics.superEffectiveCombinations).toBeGreaterThan(0);
      expect(response.statistics.normalEffectiveCombinations).toBeGreaterThan(0);
    });

    it('should filter matrix by included types', async () => {
      const request: GetTypeEffectivenessMatrixRequest = {
        includeTypes: ['fire', 'water', 'grass']
      };

      const response = await useCase.getTypeEffectivenessMatrix(request);

      expect(response.types).toEqual(['fire', 'water', 'grass']);
      expect(response.dimensions.attackingTypes).toBe(3);
      expect(response.dimensions.defendingTypes).toBe(3);
      expect(response.matrix.length).toBe(3);
      expect(response.matrix[0].length).toBe(3);
      expect(response.statistics.totalCombinations).toBe(9);
    });

    it('should exclude specified types from matrix', async () => {
      const request: GetTypeEffectivenessMatrixRequest = {
        excludeTypes: ['fairy', 'dark', 'steel']
      };

      const response = await useCase.getTypeEffectivenessMatrix(request);

      expect(response.types).not.toContain('fairy');
      expect(response.types).not.toContain('dark');
      expect(response.types).not.toContain('steel');
      expect(response.types.length).toBe(15); // 18 - 3 excluded
    });

    it('should verify specific effectiveness relationships', async () => {
      const request: GetTypeEffectivenessMatrixRequest = {
        includeTypes: ['fire', 'water', 'grass']
      };

      const response = await useCase.getTypeEffectivenessMatrix(request);

      // Find fire attacking grass
      const fireRow = response.matrix[0]; // Assuming fire is first
      const fireVsGrass = fireRow.find(entry => 
        entry.attackingType === 'fire' && entry.defendingType === 'grass'
      );

      if (fireVsGrass) {
        expect(fireVsGrass.multiplier).toBe(2);
        expect(fireVsGrass.isAdvantage).toBe(true);
        expect(fireVsGrass.effectiveness).toBe('SUPER_EFFECTIVE');
      }
    });
  });

  describe('getTypeStatistics', () => {
    it('should get basic statistics', async () => {
      const request: GetTypeStatisticsRequest = {};

      const response = await useCase.getTypeStatistics(request);

      expect(response.totalTypes).toBe(18);
      expect(response.colorDistribution).toBeUndefined(); // Not requested
      expect(response.effectivenessStats).toBeUndefined(); // Not requested
      expect(response.usageStats).toBeUndefined(); // Not requested
    });

    it('should include color distribution when requested', async () => {
      const request: GetTypeStatisticsRequest = {
        includeColorDistribution: true
      };

      const response = await useCase.getTypeStatistics(request);

      expect(response.colorDistribution).toBeDefined();
      expect(typeof response.colorDistribution).toBe('object');
      
      const colorKeys = Object.keys(response.colorDistribution!);
      expect(colorKeys.length).toBeGreaterThan(0);
      
      const totalTypes = Object.values(response.colorDistribution!).reduce((sum, count) => sum + count, 0);
      expect(totalTypes).toBe(18);
    });

    it('should include effectiveness statistics when requested', async () => {
      const request: GetTypeStatisticsRequest = {
        includeEffectiveness: true
      };

      const response = await useCase.getTypeStatistics(request);

      expect(response.effectivenessStats).toBeDefined();
      expect(response.effectivenessStats!.averageAdvantages).toBeGreaterThan(0);
      expect(response.effectivenessStats!.averageDisadvantages).toBeGreaterThan(0);
      expect(response.effectivenessStats!.mostVersatileType).toBeDefined();
      expect(response.effectivenessStats!.mostSpecializedType).toBeDefined();
      expect(response.effectivenessStats!.balanceScore).toBeDefined();
    });

    it('should include usage statistics when requested', async () => {
      const request: GetTypeStatisticsRequest = {
        includeUsageStats: true
      };

      const response = await useCase.getTypeStatistics(request);

      expect(response.usageStats).toBeDefined();
      expect(response.usageStats!.mostSearchedTypes).toBeDefined();
      expect(response.usageStats!.leastSearchedTypes).toBeDefined();
      expect(response.usageStats!.averageSearchesPerType).toBeGreaterThanOrEqual(0);
    });
  });

  describe('validateTypeInteraction', () => {
    it('should validate correct type interaction', async () => {
      const request: ValidateTypeInteractionRequest = {
        attackingType: 'fire',
        defendingType: ['grass']
      };

      const response = await useCase.validateTypeInteraction(request);

      expect(response.isValid).toBe(true);
      expect(response.calculatedEffectiveness.value).toBe('SUPER_EFFECTIVE');
      expect(response.calculatedEffectiveness.multiplier).toBe(2);
      expect(response.matches).toBe(true);
      expect(response.explanation).toContain('fire vs grass');
    });

    it('should validate against expected effectiveness', async () => {
      const request: ValidateTypeInteractionRequest = {
        attackingType: 'fire',
        defendingType: ['grass'],
        expectedEffectiveness: 'SUPER_EFFECTIVE'
      };

      const response = await useCase.validateTypeInteraction(request);

      expect(response.isValid).toBe(true);
      expect(response.matches).toBe(true);
      expect(response.expectedEffectiveness).toBeDefined();
      expect(response.expectedEffectiveness!.value).toBe('SUPER_EFFECTIVE');
    });

    it('should detect mismatched expectations', async () => {
      const request: ValidateTypeInteractionRequest = {
        attackingType: 'fire',
        defendingType: ['grass'],
        expectedEffectiveness: 'HALF_EFFECTIVE'  // Incorrect expectation (fire is actually super effective vs grass)
      };

      const response = await useCase.validateTypeInteraction(request);

      expect(response.isValid).toBe(true);
      expect(response.matches).toBe(false);
      expect(response.explanation).toContain('Expected:');
    });

    it('should handle dual-type defending', async () => {
      const request: ValidateTypeInteractionRequest = {
        attackingType: 'water',
        defendingType: ['fire', 'rock']
      };

      const response = await useCase.validateTypeInteraction(request);

      expect(response.isValid).toBe(true);
      expect(response.calculatedEffectiveness.multiplier).toBe(4); // 2x * 2x = 4x
      expect(response.explanation).toContain('fire/rock');
    });
  });

  describe('getTypeRecommendations', () => {
    it('should get basic recommendations', async () => {
      const request: GetTypeRecommendationsRequest = {};

      const response = await useCase.getTypeRecommendations(request);

      expect(response.recommendations).toBeDefined();
      expect(response.recommendations.length).toBeGreaterThan(0);
      expect(response.recommendations.length).toBeLessThanOrEqual(5); // Default limit
      expect(response.reasoning).toBeDefined();
      expect(response.reasoning.basedOn).toBeDefined();
      expect(response.reasoning.context).toBe('general');

      // Verify recommendation structure
      const firstRec = response.recommendations[0];
      expect(firstRec.typeId).toBeDefined();
      expect(firstRec.typeName).toBeDefined();
      expect(firstRec.recommendationScore).toBeGreaterThan(0);
      expect(firstRec.reasons).toBeDefined();
      expect(firstRec.learningPriority).toMatch(/^(high|medium|low)$/);
      expect(firstRec.difficultyLevel).toMatch(/^(beginner|intermediate|advanced)$/);
    });

    it('should consider user preferences', async () => {
      const request: GetTypeRecommendationsRequest = {
        userPreferences: {
          favoriteTypes: ['fire'],
          dislikedTypes: ['bug'],
          playstyle: 'offensive'
        }
      };

      const response = await useCase.getTypeRecommendations(request);

      expect(response.recommendations.length).toBeGreaterThan(0);
      expect(response.reasoning.basedOn).toContain('user_preferences');
      
      // Fire should get a high score due to preference
      const fireRec = response.recommendations.find(r => r.typeId === 'fire');
      if (fireRec) {
        expect(fireRec.recommendationScore).toBeGreaterThan(70);
        expect(fireRec.reasons).toContain('matches your favorite types');
      }

      // Bug should not be recommended or have low score
      const bugRec = response.recommendations.find(r => r.typeId === 'bug');
      if (bugRec) {
        expect(bugRec.recommendationScore).toBeLessThan(50);
      }
    });

    it('should adapt to learning context', async () => {
      const request: GetTypeRecommendationsRequest = {
        context: 'learning',
        limit: 3
      };

      const response = await useCase.getTypeRecommendations(request);

      expect(response.recommendations.length).toBeLessThanOrEqual(3);
      expect(response.reasoning.context).toBe('learning');
      expect(response.reasoning.basedOn).toContain('context_learning');

      // Should prioritize fundamental types for learning
      const fundamentalTypes = ['fire', 'water', 'grass', 'electric', 'normal'];
      const hasFundamentalType = response.recommendations.some(r => 
        fundamentalTypes.includes(r.typeId)
      );
      expect(hasFundamentalType).toBe(true);
    });

    it('should return sorted recommendations by score', async () => {
      const request: GetTypeRecommendationsRequest = {
        limit: 10
      };

      const response = await useCase.getTypeRecommendations(request);

      expect(response.recommendations.length).toBeGreaterThan(1);

      // Should be sorted by recommendation score (descending)
      for (let i = 1; i < response.recommendations.length; i++) {
        expect(response.recommendations[i].recommendationScore)
          .toBeLessThanOrEqual(response.recommendations[i - 1].recommendationScore);
      }
    });

    it('should calculate confidence score', async () => {
      const request: GetTypeRecommendationsRequest = {
        limit: 5
      };

      const response = await useCase.getTypeRecommendations(request);

      expect(response.reasoning.confidenceScore).toBeGreaterThanOrEqual(0);
      expect(response.reasoning.confidenceScore).toBeLessThanOrEqual(100);
    });
  });

  describe('caching behavior', () => {
    it('should cache getAllTypes results', async () => {
      const request: GetAllTypesRequest = {};

      // First call
      const response1 = await useCase.getAllTypes(request);
      const startTime = Date.now();

      // Second call should be faster due to caching
      const response2 = await useCase.getAllTypes(request);
      const endTime = Date.now();

      expect(response1.types.length).toBe(response2.types.length);
      expect(response1.totalCount).toBe(response2.totalCount);
      
      // Second call should be very fast (< 10ms) if cached properly
      expect(endTime - startTime).toBeLessThan(50);
    });

    it('should cache effectiveness matrix results', async () => {
      const request: GetTypeEffectivenessMatrixRequest = {
        includeTypes: ['fire', 'water', 'grass']
      };

      // First call
      const response1 = await useCase.getTypeEffectivenessMatrix(request);
      const startTime = Date.now();

      // Second call should be faster due to caching
      const response2 = await useCase.getTypeEffectivenessMatrix(request);
      const endTime = Date.now();

      expect(response1.types).toEqual(response2.types);
      expect(response1.statistics.totalCombinations).toBe(response2.statistics.totalCombinations);
      
      // Second call should be very fast if cached properly
      expect(endTime - startTime).toBeLessThan(50);
    });
  });

  describe('error handling', () => {
    it('should handle invalid type IDs gracefully', async () => {
      const request: ValidateTypeInteractionRequest = {
        attackingType: 'invalidtype' as any,
        defendingType: ['fire']
      };

      // Should throw an error for invalid type ID
      await expect(useCase.validateTypeInteraction(request)).rejects.toThrow('Invalid type ID');
    });

    it('should handle empty defending types array', async () => {
      const request: ValidateTypeInteractionRequest = {
        attackingType: 'fire',
        defendingType: []
      };

      // Should throw an error for empty defending types
      await expect(useCase.validateTypeInteraction(request)).rejects.toThrow('Defending types array cannot be empty');
    });
  });
});
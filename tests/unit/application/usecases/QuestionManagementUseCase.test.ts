/**
 * QuestionManagementUseCase Unit Tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { QuestionManagementUseCase } from '@/application/usecases/QuestionManagementUseCase';
import { TypeEffectivenessService } from '@/infrastructure/services/TypeEffectivenessService';
import { QuestionGeneratorService } from '@/infrastructure/services/QuestionGeneratorService';
import { FileTypeRepository } from '@/infrastructure/repositories/FileTypeRepository';
import type {
  SearchQuestionsRequest,
  GetQuestionStatisticsRequest,
  ValidateQuestionRequest,
  GetSimilarQuestionsRequest,
  GetQuestionPoolRequest
} from '@/application/interfaces/QuestionManagementInterfaces';

describe('QuestionManagementUseCase', () => {
  let useCase: QuestionManagementUseCase;
  let questionGenerator: QuestionGeneratorService;
  let typeEffectivenessService: TypeEffectivenessService;
  let typeRepository: FileTypeRepository;

  beforeEach(() => {
    typeRepository = new FileTypeRepository();
    typeEffectivenessService = new TypeEffectivenessService();
    questionGenerator = new QuestionGeneratorService(typeEffectivenessService, typeRepository);
    useCase = new QuestionManagementUseCase(questionGenerator, typeEffectivenessService, typeRepository);
  });

  describe('searchQuestions', () => {
    it('should search questions with basic parameters', async () => {
      const request: SearchQuestionsRequest = {
        difficulty: 'normal',
        page: 1,
        limit: 10
      };

      const response = await useCase.searchQuestions(request);

      expect(response.questions).toBeDefined();
      expect(response.questions.length).toBeGreaterThan(0);
      expect(response.questions.length).toBeLessThanOrEqual(10);
      expect(response.totalCount).toBeGreaterThan(0);
      expect(response.currentPage).toBe(1);
      expect(response.totalPages).toBeGreaterThan(0);
      expect(typeof response.hasNextPage).toBe('boolean');
      expect(typeof response.hasPreviousPage).toBe('boolean');
      expect(response.hasPreviousPage).toBe(false);

      // Verify question structure
      const firstQuestion = response.questions[0];
      expect(firstQuestion).toBeDefined();
      expect(firstQuestion!.id).toBeDefined();
      expect(firstQuestion!.attackingType).toBeDefined();
      expect(firstQuestion!.defendingType).toBeDefined();
      expect(firstQuestion!.difficulty).toBe('normal');
      expect(firstQuestion!.effectiveness).toBeDefined();
      expect(firstQuestion!.questionText).toBeDefined();
    });

    it('should filter by attacking type', async () => {
      const request: SearchQuestionsRequest = {
        attackingType: 'fire',
        limit: 5
      };

      const response = await useCase.searchQuestions(request);

      expect(response.questions.length).toBeGreaterThan(0);
      response.questions.forEach(question => {
        expect(question.attackingType).toBe('fire');
      });
    });

    it('should filter by defending types', async () => {
      const request: SearchQuestionsRequest = {
        defendingTypes: ['grass'],
        limit: 5
      };

      const response = await useCase.searchQuestions(request);

      expect(response.questions.length).toBeGreaterThan(0);
      response.questions.forEach(question => {
        expect(question.defendingType).toContain('grass');
      });
    });

    it('should filter by difficulty', async () => {
      const request: SearchQuestionsRequest = {
        difficulty: 'easy',
        limit: 5
      };

      const response = await useCase.searchQuestions(request);

      expect(response.questions.length).toBeGreaterThan(0);
      response.questions.forEach(question => {
        expect(question.difficulty).toBe('easy');
      });
    });

    it('should handle pagination correctly', async () => {
      const page1Request: SearchQuestionsRequest = {
        difficulty: 'normal',
        page: 1,
        limit: 3
      };

      const page2Request: SearchQuestionsRequest = {
        difficulty: 'normal',
        page: 2,
        limit: 3
      };

      const page1Response = await useCase.searchQuestions(page1Request);
      const page2Response = await useCase.searchQuestions(page2Request);

      expect(page1Response.currentPage).toBe(1);
      expect(page2Response.currentPage).toBe(2);
      expect(page1Response.totalCount).toBe(page2Response.totalCount);
      
      if (page1Response.totalCount > 3) {
        expect(page1Response.hasNextPage).toBe(true);
        expect(page2Response.hasPreviousPage).toBe(true);
      }
    });

    it('should handle text search', async () => {
      const request: SearchQuestionsRequest = {
        searchText: 'fire',
        limit: 5
      };

      const response = await useCase.searchQuestions(request);

      expect(response.questions.length).toBeGreaterThan(0);
      response.questions.forEach(question => {
        const searchableText = `${question.questionText} ${question.attackingType} ${question.defendingType.join(' ')}`;
        expect(searchableText.toLowerCase()).toContain('fire');
      });
    });
  });

  describe('getQuestionStatistics', () => {
    it('should get overall statistics', async () => {
      const request: GetQuestionStatisticsRequest = {};

      const response = await useCase.getQuestionStatistics(request);

      expect(response.totalQuestions).toBeGreaterThan(0);
      expect(response.difficultyDistribution).toBeDefined();
      expect(response.difficultyDistribution.easy).toBeGreaterThanOrEqual(0);
      expect(response.difficultyDistribution.normal).toBeGreaterThanOrEqual(0);
      expect(response.difficultyDistribution.hard).toBeGreaterThanOrEqual(0);
      expect(response.typeDistribution).toBeDefined();
      expect(response.typeDistribution.attackingTypes).toBeDefined();
      expect(response.typeDistribution.defendingTypes).toBeDefined();
      expect(response.typeDistribution.typeMatches).toBeDefined();
      expect(response.effectivenessDistribution).toBeDefined();
      expect(response.averageGenerationTime).toBeGreaterThan(0);
    });

    it('should get statistics for specific difficulty', async () => {
      const request: GetQuestionStatisticsRequest = {
        difficulty: 'hard'
      };

      const response = await useCase.getQuestionStatistics(request);

      expect(response.totalQuestions).toBeGreaterThan(0);
      expect(response.difficultyDistribution.hard).toBeGreaterThan(0);
    });

    it('should get statistics with type filter', async () => {
      const request: GetQuestionStatisticsRequest = {
        typeFilter: {
          attackingType: 'fire'
        }
      };

      const response = await useCase.getQuestionStatistics(request);

      expect(response.totalQuestions).toBeGreaterThan(0);
      expect(response.typeDistribution.attackingTypes.fire).toBeGreaterThan(0);
    });
  });

  describe('validateQuestion', () => {
    it('should validate correct question configuration', async () => {
      const request: ValidateQuestionRequest = {
        attackingType: 'fire',
        defendingType: ['grass'],
        difficulty: 'normal'
      };

      const response = await useCase.validateQuestion(request);

      expect(response.isValid).toBe(true);
      expect(response.errors).toHaveLength(0);
      expect(response.calculatedEffectiveness).toBeDefined();
      expect(response.estimatedDifficulty).toBeDefined();
    });

    it('should detect invalid attacking type', async () => {
      const request: ValidateQuestionRequest = {
        attackingType: 'invalid' as any,
        defendingType: ['grass'],
        difficulty: 'normal'
      };

      const response = await useCase.validateQuestion(request);

      expect(response.isValid).toBe(false);
      expect(response.errors.length).toBeGreaterThan(0);
      expect(response.errors[0]).toContain('Invalid attacking type');
    });

    it('should detect invalid defending type', async () => {
      const request: ValidateQuestionRequest = {
        attackingType: 'fire',
        defendingType: ['invalid'] as any,
        difficulty: 'normal'
      };

      const response = await useCase.validateQuestion(request);

      expect(response.isValid).toBe(false);
      expect(response.errors.length).toBeGreaterThan(0);
      expect(response.errors[0]).toContain('Invalid defending type');
    });

    it('should detect empty defending types', async () => {
      const request: ValidateQuestionRequest = {
        attackingType: 'fire',
        defendingType: [],
        difficulty: 'normal'
      };

      const response = await useCase.validateQuestion(request);

      expect(response.isValid).toBe(false);
      expect(response.errors.length).toBeGreaterThan(0);
      expect(response.errors[0]).toContain('At least one defending type is required');
    });

    it('should detect too many defending types', async () => {
      const request: ValidateQuestionRequest = {
        attackingType: 'fire',
        defendingType: ['grass', 'water', 'rock'],
        difficulty: 'normal'
      };

      const response = await useCase.validateQuestion(request);

      expect(response.isValid).toBe(false);
      expect(response.errors.length).toBeGreaterThan(0);
      expect(response.errors[0]).toContain('Maximum of 2 defending types allowed');
    });

    it('should detect duplicate defending types', async () => {
      const request: ValidateQuestionRequest = {
        attackingType: 'fire',
        defendingType: ['grass', 'grass'],
        difficulty: 'normal'
      };

      const response = await useCase.validateQuestion(request);

      expect(response.isValid).toBe(false);
      expect(response.errors.length).toBeGreaterThan(0);
      expect(response.errors[0]).toContain('Duplicate defending types are not allowed');
    });

    it('should generate warnings for difficulty mismatch', async () => {
      const request: ValidateQuestionRequest = {
        attackingType: 'fire',
        defendingType: ['grass'],
        difficulty: 'hard' // Fire vs Grass is typically easy/normal
      };

      const response = await useCase.validateQuestion(request);

      expect(response.isValid).toBe(true);
      // May have warnings about difficulty mismatch
      if (response.estimatedDifficulty !== 'hard') {
        expect(response.warnings.length).toBeGreaterThan(0);
      }
    });
  });

  describe('getSimilarQuestions', () => {
    it('should find similar questions', async () => {
      const request: GetSimilarQuestionsRequest = {
        attackingType: 'fire',
        defendingType: ['grass'],
        limit: 5
      };

      const response = await useCase.getSimilarQuestions(request);

      expect(response.similarQuestions).toBeDefined();
      expect(response.similarQuestions.length).toBeGreaterThan(0);
      expect(response.similarQuestions.length).toBeLessThanOrEqual(5);
      expect(response.matchReasons).toBeDefined();
      expect(response.matchReasons.length).toBe(response.similarQuestions.length);

      // Check that each question has match reasons
      response.matchReasons.forEach(match => {
        expect(match.questionId).toBeDefined();
        expect(match.reasons.length).toBeGreaterThan(0);
        expect(match.reasons.every(reason => 
          ['same_attacking_type', 'same_defending_type', 'same_effectiveness', 'same_difficulty'].includes(reason)
        )).toBe(true);
      });
    });

    it('should respect difficulty filter', async () => {
      const request: GetSimilarQuestionsRequest = {
        attackingType: 'water',
        defendingType: ['fire'],
        difficulty: 'easy',
        limit: 3
      };

      const response = await useCase.getSimilarQuestions(request);

      expect(response.similarQuestions.length).toBeGreaterThan(0);
      
      // Check that some questions match the difficulty
      const difficultyMatches = response.matchReasons.filter(match => 
        match.reasons.includes('same_difficulty')
      );
      expect(difficultyMatches.length).toBeGreaterThan(0);
    });
  });

  describe('getQuestionPool', () => {
    it('should generate question pool with basic parameters', async () => {
      const request: GetQuestionPoolRequest = {
        poolSize: 10,
        difficulty: 'normal'
      };

      const response = await useCase.getQuestionPool(request);

      expect(response.questions).toBeDefined();
      expect(response.questions.length).toBeGreaterThan(0);
      expect(response.questions.length).toBeLessThanOrEqual(10);
      expect(response.poolMetadata).toBeDefined();
      expect(response.poolMetadata.requestedSize).toBe(10);
      expect(response.poolMetadata.actualSize).toBeGreaterThan(0);
      expect(response.poolMetadata.generationTime).toBeGreaterThan(0);

      // All questions should match the requested difficulty
      response.questions.forEach(question => {
        expect(question.difficulty).toBe('normal');
      });
    });

    it('should handle focus types', async () => {
      const request: GetQuestionPoolRequest = {
        poolSize: 5,
        difficulty: 'normal',
        focusTypes: ['fire', 'water']
      };

      const response = await useCase.getQuestionPool(request);

      expect(response.questions.length).toBeGreaterThan(0);
      
      // Questions should focus on the requested types
      const hasFocusTypes = response.questions.some(question => 
        ['fire', 'water'].includes(question.attackingType) ||
        question.defendingType.some(type => ['fire', 'water'].includes(type))
      );
      expect(hasFocusTypes).toBe(true);
    });

    it('should handle exclude types', async () => {
      const request: GetQuestionPoolRequest = {
        poolSize: 5,
        difficulty: 'normal',
        excludeTypes: ['ghost']
      };

      const response = await useCase.getQuestionPool(request);

      expect(response.questions.length).toBeGreaterThan(0);
      
      // No questions should contain excluded types
      response.questions.forEach(question => {
        expect(question.attackingType).not.toBe('ghost');
        expect(question.defendingType).not.toContain('ghost');
      });
    });

    it('should balance effectiveness when requested', async () => {
      const request: GetQuestionPoolRequest = {
        poolSize: 20,
        difficulty: 'normal',
        balanceEffectiveness: true
      };

      const response = await useCase.getQuestionPool(request);

      expect(response.questions.length).toBeGreaterThan(0);
      expect(response.poolMetadata.effectivenessDistribution).toBeDefined();
      
      // Should have multiple effectiveness types when balanced
      const effectivenessTypes = Object.keys(response.poolMetadata.effectivenessDistribution);
      expect(effectivenessTypes.length).toBeGreaterThan(1);
    });

    it('should include comprehensive metadata', async () => {
      const request: GetQuestionPoolRequest = {
        poolSize: 15,
        difficulty: 'hard'
      };

      const response = await useCase.getQuestionPool(request);

      const metadata = response.poolMetadata;
      expect(metadata.requestedSize).toBe(15);
      expect(metadata.actualSize).toBeGreaterThan(0);
      expect(metadata.difficultyDistribution).toBeDefined();
      expect(metadata.difficultyDistribution.hard).toBeGreaterThan(0);
      expect(metadata.effectivenessDistribution).toBeDefined();
      expect(metadata.typeDistribution).toBeDefined();
      expect(typeof metadata.duplicatesRemoved).toBe('number');
      expect(metadata.generationTime).toBeGreaterThan(0);
    });
  });

  describe('error handling', () => {
    it('should handle empty search results gracefully', async () => {
      const request: SearchQuestionsRequest = {
        difficulty: 'normal',
        attackingType: 'fire',
        defendingTypes: ['fire', 'water'], // Very specific combination
        effectiveness: 'SUPER_EFFECTIVE',
        limit: 1
      };

      const response = await useCase.searchQuestions(request);

      expect(response.questions).toBeDefined();
      expect(response.totalCount).toBeGreaterThanOrEqual(0);
      expect(response.currentPage).toBe(1);
      expect(response.totalPages).toBeGreaterThanOrEqual(0);
    });

    it('should handle large page numbers', async () => {
      const request: SearchQuestionsRequest = {
        page: 999,
        limit: 10
      };

      const response = await useCase.searchQuestions(request);

      expect(response.questions).toBeDefined();
      expect(response.questions.length).toBe(0);
      expect(response.currentPage).toBe(999);
      expect(response.hasNextPage).toBe(false);
      expect(response.hasPreviousPage).toBe(true);
    });

    it('should respect limit bounds', async () => {
      const request: SearchQuestionsRequest = {
        limit: 150 // Above maximum
      };

      const response = await useCase.searchQuestions(request);

      expect(response.questions.length).toBeLessThanOrEqual(100); // Should be capped at 100
    });
  });
});
/**
 * QuestionGeneratorService Unit Tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { QuestionGeneratorService } from '@/infrastructure/services/QuestionGeneratorService';
import { TypeEffectivenessService } from '@/infrastructure/services/TypeEffectivenessService';
import { FileTypeRepository } from '@/infrastructure/repositories/FileTypeRepository';
import { Question } from '@/domain/entities/Question';
import type { GameConfig, DifficultyLevel, TypeId } from '@/domain/types';

describe('QuestionGeneratorService', () => {
  let service: QuestionGeneratorService;
  let typeEffectivenessService: TypeEffectivenessService;
  let typeRepository: FileTypeRepository;

  beforeEach(() => {
    typeEffectivenessService = new TypeEffectivenessService();
    typeRepository = new FileTypeRepository();
    service = new QuestionGeneratorService(typeEffectivenessService, typeRepository);
  });

  describe('generateQuestions', () => {
    it('should generate correct number of questions', async () => {
      const config: GameConfig = {
        difficulty: 'normal',
        questionCount: 10 // Use larger number to ensure variety is achievable
      };

      const questions = await service.generateQuestions(config);
      
      expect(questions).toHaveLength(10);
      expect(questions.every(q => q instanceof Question)).toBe(true);
    });

    it('should generate questions with correct difficulty', async () => {
      const config: GameConfig = {
        difficulty: 'hard',
        questionCount: 3
      };

      const questions = await service.generateQuestions(config);
      
      expect(questions.every(q => q.difficulty === 'hard')).toBe(true);
      expect(questions.every(q => q.isDualType())).toBe(true); // Hard questions should be dual-type
    });

    it('should generate single-type questions for easy/normal difficulty', async () => {
      const config: GameConfig = {
        difficulty: 'normal',
        questionCount: 3
      };

      const questions = await service.generateQuestions(config);
      
      expect(questions.every(q => q.difficulty === 'normal')).toBe(true);
      expect(questions.every(q => q.isSingleType())).toBe(true); // Normal questions should be single-type
    });
  });

  describe('generateQuestionsWithOptions', () => {
    it('should generate questions with metadata', async () => {
      const options = {
        count: 5,
        difficulty: 'normal' as DifficultyLevel,
        allowDuplicates: false,
        minEffectivenessVariety: 1 // Relax variety requirement for test
      };

      const result = await service.generateQuestionsWithOptions(options);
      
      expect(result.questions).toHaveLength(5);
      expect(result.metadata).toBeDefined();
      expect(result.metadata.totalAttempts).toBeGreaterThan(0);
      expect(result.metadata.typesUsed.length).toBeGreaterThan(0);
      expect(result.metadata.generationTime).toBeGreaterThanOrEqual(0);
      expect(typeof result.metadata.effectivenessDistribution).toBe('object');
    });

    it('should respect allowDuplicates setting', async () => {
      const options = {
        count: 3,
        difficulty: 'normal' as DifficultyLevel,
        allowDuplicates: false,
        minEffectivenessVariety: 1 // Relax variety requirement
      };

      const result = await service.generateQuestionsWithOptions(options);
      
      const questionIds = result.questions.map((q: Question) => q.getId());
      const uniqueIds = new Set(questionIds);
      
      expect(uniqueIds.size).toBe(questionIds.length); // No duplicates
    });

    it('should handle focus types', async () => {
      const options = {
        count: 3,
        difficulty: 'normal' as DifficultyLevel,
        focusTypes: ['fire', 'water'] as TypeId[],
        minEffectivenessVariety: 1 // Relax variety requirement
      };

      const result = await service.generateQuestionsWithOptions(options);
      
      // At least some questions should involve the focus types
      const involvesFocusTypes = result.questions.some((q: Question) => 
        options.focusTypes!.includes(q.attackingType) || 
        q.defendingType.some((type: TypeId) => options.focusTypes!.includes(type))
      );
      
      expect(involvesFocusTypes).toBe(true);
    });

    it('should exclude specified types', async () => {
      const options = {
        count: 3,
        difficulty: 'normal' as DifficultyLevel,
        excludeTypes: ['fire', 'water'] as TypeId[],
        minEffectivenessVariety: 1 // Relax variety requirement
      };

      const result = await service.generateQuestionsWithOptions(options);
      
      // No questions should involve excluded types
      const involvesExcludedTypes = result.questions.some((q: Question) => 
        options.excludeTypes!.includes(q.attackingType) || 
        q.defendingType.some((type: TypeId) => options.excludeTypes!.includes(type))
      );
      
      expect(involvesExcludedTypes).toBe(false);
    });
  });

  describe('generateSingleQuestion', () => {
    it('should generate a single question', async () => {
      const question = await service.generateSingleQuestion('normal');
      
      expect(question).toBeInstanceOf(Question);
      expect(question.difficulty).toBe('normal');
      expect(question.isSingleType()).toBe(true);
    });

    it('should exclude specified types', async () => {
      const excludeTypes: TypeId[] = ['fire', 'water'];
      const question = await service.generateSingleQuestion('normal', excludeTypes);
      
      expect(excludeTypes).not.toContain(question.attackingType);
      expect(question.defendingType.every(type => !excludeTypes.includes(type))).toBe(true);
    });
  });

  describe('generateQuestionForMatchup', () => {
    it('should generate question for specific matchup', async () => {
      const question = await service.generateQuestionForMatchup('fire', ['grass'], 'normal');
      
      expect(question.attackingType).toBe('fire');
      expect(question.defendingType).toEqual(['grass']);
      expect(question.difficulty).toBe('normal');
      expect(question.correctAnswer).toBe('SUPER_EFFECTIVE'); // Fire vs Grass
    });

    it('should generate dual-type question for hard difficulty', async () => {
      const question = await service.generateQuestionForMatchup('ice', ['dragon', 'ground'], 'hard');
      
      expect(question.attackingType).toBe('ice');
      expect(question.defendingType).toEqual(['dragon', 'ground']);
      expect(question.difficulty).toBe('hard');
      expect(question.correctAnswer).toBe('ULTRA_EFFECTIVE'); // Ice vs Dragon/Ground = 4x
    });

    it('should throw error for invalid type', async () => {
      await expect(
        service.generateQuestionForMatchup('invalid' as TypeId, ['fire'], 'normal')
      ).rejects.toThrow('Invalid attacking type: invalid');
    });

    it('should throw error for invalid difficulty/type combination', async () => {
      await expect(
        service.generateQuestionForMatchup('fire', ['grass', 'water'], 'normal') // Dual-type not allowed for normal
      ).rejects.toThrow('is not valid for normal difficulty');
    });
  });

  describe('generateBalancedQuestions', () => {
    it('should generate balanced questions', async () => {
      const questions = await service.generateBalancedQuestions(8, 'normal');
      
      expect(questions).toHaveLength(8);
      expect(questions.every(q => q.difficulty === 'normal')).toBe(true);
      
      // Should have some variety in effectiveness
      const effectivenessValues = questions.map(q => q.correctAnswer);
      const uniqueEffectiveness = new Set(effectivenessValues);
      expect(uniqueEffectiveness.size).toBeGreaterThan(1);
    });
  });

  describe('generateFocusedQuestions', () => {
    it('should generate questions focused on specific types', async () => {
      const focusTypes: TypeId[] = ['fire', 'water'];
      const questions = await service.generateFocusedQuestions(focusTypes, 5, 'normal');
      
      expect(questions).toHaveLength(5);
      
      // All questions should involve at least one focus type
      const allInvolveFocusTypes = questions.every(q => 
        focusTypes.includes(q.attackingType) || 
        q.defendingType.some(type => focusTypes.includes(type))
      );
      
      expect(allInvolveFocusTypes).toBe(true);
    });
  });

  describe('generateQuestionsWithEffectiveness', () => {
    it('should generate questions with specific effectiveness', async () => {
      const targetEffectiveness = ['SUPER_EFFECTIVE', 'HALF_EFFECTIVE'];
      const questions = await service.generateQuestionsWithEffectiveness(targetEffectiveness, 4, 'normal');
      
      expect(questions.length).toBeGreaterThan(0);
      expect(questions.length).toBeLessThanOrEqual(4);
      
      // All questions should have one of the target effectiveness values
      const allMatchTarget = questions.every(q => 
        targetEffectiveness.includes(q.correctAnswer)
      );
      
      expect(allMatchTarget).toBe(true);
    });
  });

  describe('validateGenerationConfig', () => {
    it('should validate correct config', async () => {
      const config: GameConfig = {
        difficulty: 'normal',
        questionCount: 10
      };

      const isValid = await service.validateGenerationConfig(config);
      expect(isValid).toBe(true);
    });

    it('should throw error for missing config', async () => {
      await expect(service.validateGenerationConfig(null as any)).rejects.toThrow('Game configuration is required');
    });

    it('should throw error for invalid difficulty', async () => {
      const config = {
        difficulty: 'invalid',
        questionCount: 10
      } as any;

      await expect(service.validateGenerationConfig(config)).rejects.toThrow('Invalid difficulty: invalid');
    });

    it('should throw error for invalid question count', async () => {
      const config: GameConfig = {
        difficulty: 'normal',
        questionCount: 0
      };

      await expect(service.validateGenerationConfig(config)).rejects.toThrow('Question count must be positive');
    });

    it('should throw error for excessive question count', async () => {
      const config: GameConfig = {
        difficulty: 'normal',
        questionCount: 150
      };

      await expect(service.validateGenerationConfig(config)).rejects.toThrow('Question count cannot exceed 100');
    });
  });

  describe('getGenerationStatistics', () => {
    it('should return initial statistics', async () => {
      const stats = await service.getGenerationStatistics();
      
      expect(stats.totalQuestionsGenerated).toBe(0);
      expect(stats.averageGenerationTime).toBe(0);
      expect(stats.generationsByDifficulty.easy).toBe(0);
      expect(stats.generationsByDifficulty.normal).toBe(0);
      expect(stats.generationsByDifficulty.hard).toBe(0);
      expect(Array.isArray(stats.mostUsedTypes)).toBe(true);
      expect(Array.isArray(stats.leastUsedTypes)).toBe(true);
    });

    it('should update statistics after generation', async () => {
      // Generate some questions first
      await service.generateQuestions({ difficulty: 'normal', questionCount: 10 });
      
      const stats = await service.getGenerationStatistics();
      
      expect(stats.totalQuestionsGenerated).toBe(10);
      expect(stats.generationsByDifficulty.normal).toBe(10);
      expect(stats.averageGenerationTime).toBeGreaterThanOrEqual(0);
    });
  });

  describe('estimateGenerationTime', () => {
    it('should estimate generation time', async () => {
      const estimatedTime = await service.estimateGenerationTime(10, 'normal');
      
      expect(estimatedTime).toBeGreaterThan(0);
      expect(typeof estimatedTime).toBe('number');
    });

    it('should estimate higher time for hard difficulty', async () => {
      const normalTime = await service.estimateGenerationTime(10, 'normal');
      const hardTime = await service.estimateGenerationTime(10, 'hard');
      
      expect(hardTime).toBeGreaterThan(normalTime);
    });
  });

  describe('isValidMatchupForDifficulty', () => {
    it('should validate single-type for easy/normal difficulty', async () => {
      const isValid = await service.isValidMatchupForDifficulty('fire', ['grass'], 'normal');
      expect(isValid).toBe(true);
      
      const isInvalid = await service.isValidMatchupForDifficulty('fire', ['grass', 'water'], 'normal');
      expect(isInvalid).toBe(false);
    });

    it('should validate dual-type for hard difficulty', async () => {
      const isValid = await service.isValidMatchupForDifficulty('fire', ['grass', 'steel'], 'hard');
      expect(isValid).toBe(true);
      
      const isInvalid = await service.isValidMatchupForDifficulty('fire', ['grass'], 'hard');
      expect(isInvalid).toBe(false);
    });
  });

  describe('getAvailableMatchups', () => {
    it('should return available matchups for difficulty', async () => {
      const matchups = await service.getAvailableMatchups('normal', 10);
      
      expect(Array.isArray(matchups)).toBe(true);
      expect(matchups.length).toBeLessThanOrEqual(10);
      
      if (matchups.length > 0) {
        const firstMatchup = matchups[0];
        expect(firstMatchup).toBeDefined();
        expect(firstMatchup!).toHaveProperty('attacking');
        expect(firstMatchup!).toHaveProperty('defending');
        expect(Array.isArray(firstMatchup!.defending)).toBe(true);
        expect(firstMatchup!.defending).toHaveLength(1); // Single-type for normal
      }
    });

    it('should return dual-type matchups for hard difficulty', async () => {
      const matchups = await service.getAvailableMatchups('hard', 5);
      
      if (matchups.length > 0) {
        const firstMatchup = matchups[0];
        expect(firstMatchup).toBeDefined();
        expect(firstMatchup!.defending).toHaveLength(2); // Dual-type for hard
      }
    });
  });

  describe('reset', () => {
    it('should reset statistics', async () => {
      // Generate some questions first
      await service.generateQuestions({ difficulty: 'normal', questionCount: 10 });
      
      let stats = await service.getGenerationStatistics();
      expect(stats.totalQuestionsGenerated).toBe(10);
      
      // Reset
      await service.reset();
      
      stats = await service.getGenerationStatistics();
      expect(stats.totalQuestionsGenerated).toBe(0);
      expect(stats.averageGenerationTime).toBe(0);
    });
  });
});
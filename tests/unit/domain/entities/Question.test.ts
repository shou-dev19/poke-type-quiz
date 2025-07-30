/**
 * Question Entity Unit Tests
 */

import { describe, it, expect } from 'vitest';
import { Question } from '@/domain/entities/Question';
import { TypeEffectiveness } from '@/domain/entities/TypeEffectiveness';
import type { Question as QuestionData, TypeId, DifficultyLevel, EffectivenessValue } from '@/domain/types';

describe('Question', () => {
  const validSingleTypeQuestion: QuestionData = {
    id: 'q001',
    attackingType: 'fire',
    defendingType: ['water'],
    correctAnswer: 'HALF_EFFECTIVE',
    difficulty: 'normal'
  };

  const validDualTypeQuestion: QuestionData = {
    id: 'q002',
    attackingType: 'ice',
    defendingType: ['dragon', 'ground'],
    correctAnswer: 'ULTRA_EFFECTIVE',
    difficulty: 'hard'
  };

  describe('Constructor and Creation', () => {
    it('should create a valid single-type Question instance', () => {
      const question = new Question(validSingleTypeQuestion);
      
      expect(question.id).toBe('q001');
      expect(question.attackingType).toBe('fire');
      expect(question.defendingType).toEqual(['water']);
      expect(question.correctAnswer).toBe('HALF_EFFECTIVE');
      expect(question.difficulty).toBe('normal');
    });

    it('should create a valid dual-type Question instance', () => {
      const question = new Question(validDualTypeQuestion);
      
      expect(question.id).toBe('q002');
      expect(question.attackingType).toBe('ice');
      expect(question.defendingType).toEqual(['dragon', 'ground']);
      expect(question.correctAnswer).toBe('ULTRA_EFFECTIVE');
      expect(question.difficulty).toBe('hard');
    });

    it('should create instance using static create method', () => {
      const question = Question.create(validSingleTypeQuestion);
      expect(question).toBeInstanceOf(Question);
      expect(question.id).toBe('q001');
    });

    it('should create immutable defending type array', () => {
      const question = new Question(validSingleTypeQuestion);
      const originalDefending = question.defendingType;
      
      // Modifying the original data should not affect the question
      validSingleTypeQuestion.defendingType.push('electric' as TypeId);
      expect(question.defendingType).toEqual(originalDefending);
    });
  });

  describe('Validation', () => {
    it('should throw error for null data', () => {
      expect(() => new Question(null as any)).toThrow('Question data is required');
    });

    it('should throw error for missing required fields', () => {
      const requiredFields: (keyof QuestionData)[] = [
        'id', 'attackingType', 'defendingType', 'correctAnswer', 'difficulty'
      ];

      requiredFields.forEach(field => {
        const invalidData = { ...validSingleTypeQuestion };
        delete (invalidData as any)[field];
        
        expect(() => new Question(invalidData)).toThrow();
      });
    });

    it('should throw error for empty ID', () => {
      const invalidData = { ...validSingleTypeQuestion, id: '' };
      expect(() => new Question(invalidData)).toThrow('Question ID is required and cannot be empty');
    });

    it('should throw error for non-array defending type', () => {
      const invalidData = { ...validSingleTypeQuestion, defendingType: 'water' as any };
      expect(() => new Question(invalidData)).toThrow('Defending type must be an array');
    });

    it('should throw error for empty defending type array', () => {
      const invalidData = { ...validSingleTypeQuestion, defendingType: [] };
      expect(() => new Question(invalidData)).toThrow('Defending type array cannot be empty');
    });

    it('should throw error for more than 2 defending types', () => {
      const invalidData = { 
        ...validSingleTypeQuestion, 
        defendingType: ['water', 'fire', 'grass'] as TypeId[] 
      };
      expect(() => new Question(invalidData)).toThrow('Defending type array cannot have more than 2 types');
    });

    it('should throw error for duplicate defending types', () => {
      const invalidData = { 
        ...validDualTypeQuestion, 
        defendingType: ['water', 'water'] as TypeId[] 
      };
      expect(() => new Question(invalidData)).toThrow('Dual-type defending types must be different');
    });

    it('should throw error for invalid type IDs', () => {
      const invalidAttacking = { ...validSingleTypeQuestion, attackingType: 'invalid' as TypeId };
      expect(() => new Question(invalidAttacking)).toThrow('Invalid type: invalid');

      const invalidDefending = { 
        ...validSingleTypeQuestion, 
        defendingType: ['invalid'] as TypeId[] 
      };
      expect(() => new Question(invalidDefending)).toThrow('Invalid defendingType[0]: invalid');
    });

    it('should throw error for invalid effectiveness value', () => {
      const invalidData = { 
        ...validSingleTypeQuestion, 
        correctAnswer: 'INVALID' as EffectivenessValue 
      };
      expect(() => new Question(invalidData)).toThrow('Invalid effectiveness value: INVALID');
    });

    it('should throw error for invalid difficulty', () => {
      const invalidData = { 
        ...validSingleTypeQuestion, 
        difficulty: 'invalid' as DifficultyLevel 
      };
      expect(() => new Question(invalidData)).toThrow('Invalid difficulty: invalid');
    });
  });

  describe('Difficulty Constraints', () => {
    it('should require dual-type for hard difficulty', () => {
      const invalidHard = { 
        ...validSingleTypeQuestion, 
        difficulty: 'hard' as DifficultyLevel 
      };
      expect(() => new Question(invalidHard)).toThrow(
        'Hard difficulty questions must have dual-type defending Pokemon'
      );
    });

    it('should require single-type for easy difficulty', () => {
      const invalidEasy = { 
        ...validDualTypeQuestion, 
        difficulty: 'easy' as DifficultyLevel 
      };
      expect(() => new Question(invalidEasy)).toThrow(
        'easy difficulty questions must have single-type defending Pokemon'
      );
    });

    it('should require single-type for normal difficulty', () => {
      const invalidNormal = { 
        ...validDualTypeQuestion, 
        difficulty: 'normal' as DifficultyLevel 
      };
      expect(() => new Question(invalidNormal)).toThrow(
        'normal difficulty questions must have single-type defending Pokemon'
      );
    });
  });

  describe('Instance Methods', () => {
    let singleTypeQuestion: Question;

    beforeEach(() => {
      singleTypeQuestion = new Question(validSingleTypeQuestion);
    });

    describe('getter methods', () => {
      it('should return correct attacking type', () => {
        expect(singleTypeQuestion.getAttackingType()).toBe('fire');
        
        // Create dual-type question manually to ensure hard difficulty
        const hardDualTypeQuestion = new Question({
          id: 'q_hard',
          attackingType: 'ice',
          defendingType: ['dragon', 'ground'],
          correctAnswer: 'ULTRA_EFFECTIVE',
          difficulty: 'hard'
        });
        expect(hardDualTypeQuestion.getAttackingType()).toBe('ice');
      });

      it('should return correct defending types', () => {
        expect(singleTypeQuestion.getDefendingTypes()).toEqual(['water']);
        
        // Create dual-type question manually to ensure hard difficulty
        const hardDualTypeQuestion = new Question({
          id: 'q_hard',
          attackingType: 'ice',
          defendingType: ['dragon', 'ground'],
          correctAnswer: 'ULTRA_EFFECTIVE',
          difficulty: 'hard'
        });
        expect(hardDualTypeQuestion.getDefendingTypes()).toEqual(['dragon', 'ground']);
      });

      it('should return immutable defending types', () => {
        const types = singleTypeQuestion.getDefendingTypes();
        types.push('electric' as TypeId);
        expect(singleTypeQuestion.getDefendingTypes()).toEqual(['water']);
      });

      it('should return correct difficulty', () => {
        expect(singleTypeQuestion.getDifficulty()).toBe('normal');
        
        // Create dual-type question manually to ensure hard difficulty
        const hardDualTypeQuestion = new Question({
          id: 'q_hard',
          attackingType: 'ice',
          defendingType: ['dragon', 'ground'],
          correctAnswer: 'ULTRA_EFFECTIVE',
          difficulty: 'hard'
        });
        expect(hardDualTypeQuestion.getDifficulty()).toBe('hard');
      });

      it('should return correct ID', () => {
        expect(singleTypeQuestion.getId()).toBe('q001');
        
        // Create dual-type question manually to ensure hard difficulty
        const hardDualTypeQuestion = new Question({
          id: 'q_hard',
          attackingType: 'ice',
          defendingType: ['dragon', 'ground'],
          correctAnswer: 'ULTRA_EFFECTIVE',
          difficulty: 'hard'
        });
        expect(hardDualTypeQuestion.getId()).toBe('q_hard');
      });
    });

    describe('type checking methods', () => {
      it('should correctly identify single-type questions', () => {
        expect(singleTypeQuestion.isSingleType()).toBe(true);
        expect(singleTypeQuestion.isDualType()).toBe(false);
      });

      it('should correctly identify dual-type questions', () => {
        // Create dual-type question manually to ensure hard difficulty
        const hardDualTypeQuestion = new Question({
          id: 'q_hard',
          attackingType: 'ice',
          defendingType: ['dragon', 'ground'],
          correctAnswer: 'ULTRA_EFFECTIVE',
          difficulty: 'hard'
        });
        expect(hardDualTypeQuestion.isDualType()).toBe(true);
        expect(hardDualTypeQuestion.isSingleType()).toBe(false);
      });
    });

    describe('getCorrectAnswerEffectiveness()', () => {
      it('should return correct TypeEffectiveness instance', () => {
        const effectiveness = singleTypeQuestion.getCorrectAnswerEffectiveness();
        expect(effectiveness).toBe(TypeEffectiveness.HALF_EFFECTIVE);
        
        // Create dual-type question manually to ensure hard difficulty
        const hardDualTypeQuestion = new Question({
          id: 'q_hard',
          attackingType: 'ice',
          defendingType: ['dragon', 'ground'],
          correctAnswer: 'ULTRA_EFFECTIVE',
          difficulty: 'hard'
        });
        const dualEffectiveness = hardDualTypeQuestion.getCorrectAnswerEffectiveness();
        expect(dualEffectiveness).toBe(TypeEffectiveness.ULTRA_EFFECTIVE);
      });
    });

    describe('isCorrectAnswer()', () => {
      it('should return true for correct answers', () => {
        expect(singleTypeQuestion.isCorrectAnswer(TypeEffectiveness.HALF_EFFECTIVE)).toBe(true);
        
        // Create dual-type question manually to ensure hard difficulty
        const hardDualTypeQuestion = new Question({
          id: 'q_hard',
          attackingType: 'ice',
          defendingType: ['dragon', 'ground'],
          correctAnswer: 'ULTRA_EFFECTIVE',
          difficulty: 'hard'
        });
        expect(hardDualTypeQuestion.isCorrectAnswer(TypeEffectiveness.ULTRA_EFFECTIVE)).toBe(true);
      });

      it('should return false for incorrect answers', () => {
        expect(singleTypeQuestion.isCorrectAnswer(TypeEffectiveness.SUPER_EFFECTIVE)).toBe(false);
        
        // Create dual-type question manually to ensure hard difficulty
        const hardDualTypeQuestion = new Question({
          id: 'q_hard',
          attackingType: 'ice',
          defendingType: ['dragon', 'ground'],
          correctAnswer: 'ULTRA_EFFECTIVE',
          difficulty: 'hard'
        });
        expect(hardDualTypeQuestion.isCorrectAnswer(TypeEffectiveness.NORMAL_EFFECTIVE)).toBe(false);
      });
    });

    describe('getQuestionText()', () => {
      it('should generate correct text for single-type', () => {
        const text = singleTypeQuestion.getQuestionText();
        expect(text).toBe('fireタイプの技をwaterタイプのポケモンに使った時の効果は？');
      });

      it('should generate correct text for dual-type', () => {
        // Create dual-type question manually to ensure hard difficulty
        const hardDualTypeQuestion = new Question({
          id: 'q_hard',
          attackingType: 'ice',
          defendingType: ['dragon', 'ground'],
          correctAnswer: 'ULTRA_EFFECTIVE',
          difficulty: 'hard'
        });
        const text = hardDualTypeQuestion.getQuestionText();
        expect(text).toBe('iceタイプの技をdragon・groundタイプのポケモンに使った時の効果は？');
      });
    });

    describe('equals()', () => {
      it('should return true for same questions', () => {
        const otherQuestion = new Question(validSingleTypeQuestion);
        expect(singleTypeQuestion.equals(otherQuestion)).toBe(true);
      });

      it('should return false for different questions', () => {
        const waterQuestion = new Question({
          id: 'q_water',
          attackingType: 'water',
          defendingType: ['fire'],
          correctAnswer: 'SUPER_EFFECTIVE',
          difficulty: 'normal'
        });
        expect(singleTypeQuestion.equals(waterQuestion)).toBe(false);
      });
    });

    describe('serialization methods', () => {
      it('should convert to data object correctly', () => {
        const data = singleTypeQuestion.toData();
        expect(data).toEqual(validSingleTypeQuestion);
      });

      it('should convert to JSON correctly', () => {
        const json = singleTypeQuestion.toJSON();
        expect(json).toEqual(validSingleTypeQuestion);
      });

      it('should work with JSON.stringify', () => {
        const jsonString = JSON.stringify(singleTypeQuestion);
        const parsed = JSON.parse(jsonString);
        expect(parsed).toEqual(validSingleTypeQuestion);
      });
    });

    describe('toString()', () => {
      it('should return formatted string', () => {
        expect(singleTypeQuestion.toString()).toBe('Question(q001: fire -> water)');
        
        // Create dual-type question manually to ensure hard difficulty
        const hardDualTypeQuestion = new Question({
          id: 'q_hard',
          attackingType: 'ice',
          defendingType: ['dragon', 'ground'],
          correctAnswer: 'ULTRA_EFFECTIVE',
          difficulty: 'hard'
        });
        expect(hardDualTypeQuestion.toString()).toBe('Question(q_hard: ice -> dragon/ground)');
      });
    });
  });

  describe('Static Methods', () => {
    describe('generateId()', () => {
      it('should generate correct ID for single type', () => {
        const id = Question.generateId('fire', ['water']);
        expect(id).toBe('q_fire_vs_water');
      });

      it('should generate correct ID for dual type with sorted types', () => {
        const id1 = Question.generateId('ice', ['dragon', 'ground']);
        const id2 = Question.generateId('ice', ['ground', 'dragon']);
        expect(id1).toBe('q_ice_vs_dragon-ground');
        expect(id2).toBe('q_ice_vs_dragon-ground');
        expect(id1).toBe(id2);
      });
    });

    describe('validateQuestionsArray()', () => {
      it('should validate valid questions array', () => {
        // Use only single-type questions to avoid difficulty mismatch
        const waterQuestion: QuestionData = {
          id: 'q003',
          attackingType: 'water',
          defendingType: ['fire'],
          correctAnswer: 'SUPER_EFFECTIVE',
          difficulty: 'normal'
        };
        const questions = [validSingleTypeQuestion, waterQuestion];
        expect(() => Question.validateQuestionsArray(questions)).not.toThrow();
        expect(Question.validateQuestionsArray(questions)).toBe(true);
      });

      it('should throw error for non-array input', () => {
        expect(() => Question.validateQuestionsArray({} as any)).toThrow(
          'Questions must be an array'
        );
      });

      it('should throw error for empty array', () => {
        expect(() => Question.validateQuestionsArray([])).toThrow(
          'Questions array cannot be empty'
        );
      });

      it('should throw error for duplicate IDs', () => {
        const questions = [validSingleTypeQuestion, validSingleTypeQuestion];
        expect(() => Question.validateQuestionsArray(questions)).toThrow(
          'Duplicate question IDs found'
        );
      });

      it('should throw error for invalid question in array', () => {
        const invalidQuestion = { ...validSingleTypeQuestion, id: '' };
        const questions = [validSingleTypeQuestion, invalidQuestion];
        expect(() => Question.validateQuestionsArray(questions)).toThrow(
          'Invalid question at index 1'
        );
      });
    });
  });
});
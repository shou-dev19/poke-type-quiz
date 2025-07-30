/**
 * GameState Entity Unit Tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GameState } from '@/domain/entities/GameState';
import { Question } from '@/domain/entities/Question';
import { TypeEffectiveness } from '@/domain/entities/TypeEffectiveness';
import type { GameConfig, Question as QuestionData } from '@/domain/types';

describe('GameState', () => {
  const mockQuestionData1: QuestionData = {
    id: 'q001',
    attackingType: 'fire',
    defendingType: ['water'],
    correctAnswer: 'HALF_EFFECTIVE',
    difficulty: 'normal'
  };

  const mockQuestionData2: QuestionData = {
    id: 'q002',
    attackingType: 'water',
    defendingType: ['fire'],
    correctAnswer: 'SUPER_EFFECTIVE',
    difficulty: 'normal'
  };

  const validConfig: GameConfig = {
    difficulty: 'normal',
    questionCount: 2
  };

  let questions: Question[];
  let gameState: GameState;

  beforeEach(() => {
    questions = [
      new Question(mockQuestionData1),
      new Question(mockQuestionData2)
    ];
    gameState = new GameState(validConfig, questions);
  });

  describe('Constructor and Creation', () => {
    it('should create a valid GameState instance', () => {
      expect(gameState).toBeInstanceOf(GameState);
      expect(gameState.getTotalQuestions()).toBe(2);
      expect(gameState.getDifficulty()).toBe('normal');
    });

    it('should create instance using static create method', () => {
      const state = GameState.create(validConfig, questions);
      expect(state).toBeInstanceOf(GameState);
    });

    it('should initialize with correct default values', () => {
      expect(gameState.getCurrentQuestionIndex()).toBe(0);
      expect(gameState.getScore()).toBe(0);
      expect(gameState.hasStarted()).toBe(false);
      expect(gameState.hasCompleted()).toBe(false);
      expect(gameState.isInProgress()).toBe(false);
    });
  });

  describe('Configuration Validation', () => {
    it('should throw error for null config', () => {
      expect(() => new GameState(null as any, questions)).toThrow(
        'Game configuration is required'
      );
    });

    it('should throw error for missing difficulty', () => {
      const invalidConfig = { questionCount: 2 } as GameConfig;
      expect(() => new GameState(invalidConfig, questions)).toThrow(
        'Difficulty is required in game configuration'
      );
    });

    it('should throw error for invalid difficulty', () => {
      const invalidConfig = { ...validConfig, difficulty: 'invalid' as any };
      expect(() => new GameState(invalidConfig, questions)).toThrow(
        'Invalid difficulty: invalid'
      );
    });

    it('should throw error for invalid question count', () => {
      const invalidConfig1 = { ...validConfig, questionCount: 0 };
      expect(() => new GameState(invalidConfig1, questions)).toThrow(
        'Question count must be a positive number'
      );

      const invalidConfig2 = { ...validConfig, questionCount: 101 };
      expect(() => new GameState(invalidConfig2, questions)).toThrow(
        'Question count cannot exceed 100'
      );
    });
  });

  describe('Questions Validation', () => {
    it('should throw error for non-array questions', () => {
      expect(() => new GameState(validConfig, {} as any)).toThrow(
        'Questions must be an array'
      );
    });

    it('should throw error for empty questions array', () => {
      expect(() => new GameState(validConfig, [])).toThrow(
        'Questions array cannot be empty'
      );
    });

    it('should throw error for question count mismatch', () => {
      const mismatchConfig = { ...validConfig, questionCount: 3 };
      expect(() => new GameState(mismatchConfig, questions)).toThrow(
        'Question count mismatch: expected 3, got 2'
      );
    });

    it('should throw error for difficulty mismatch', () => {
      const hardQuestion = new Question({
        ...mockQuestionData1,
        difficulty: 'hard',
        defendingType: ['water', 'grass']
      });
      const mixedQuestions = [questions[0], hardQuestion];
      
      expect(() => new GameState(validConfig, mixedQuestions)).toThrow(
        'Question 1 difficulty mismatch: expected normal, got hard'
      );
    });
  });

  describe('Game Flow', () => {
    describe('start()', () => {
      it('should start the game correctly', () => {
        const startTime = new Date();
        vi.setSystemTime(startTime);
        
        gameState.start();
        
        expect(gameState.hasStarted()).toBe(true);
        expect(gameState.hasCompleted()).toBe(false);
        expect(gameState.isInProgress()).toBe(true);
        expect(gameState.getStartTime()).toEqual(startTime);
        expect(gameState.getCurrentQuestionIndex()).toBe(0);
        expect(gameState.getScore()).toBe(0);
      });

      it('should throw error if already started', () => {
        gameState.start();
        expect(() => gameState.start()).toThrow('Game has already been started');
      });
    });

    describe('submitAnswer()', () => {
      beforeEach(() => {
        gameState.start();
      });

      it('should submit correct answer successfully', () => {
        const result = gameState.submitAnswer(TypeEffectiveness.HALF_EFFECTIVE, 1000);
        
        expect(result).toBe(true);
        expect(gameState.getScore()).toBe(1);
        expect(gameState.getCurrentQuestionIndex()).toBe(1);
        expect(gameState.getUserAnswers()).toHaveLength(1);
        
        const userAnswer = gameState.getUserAnswers()[0];
        expect(userAnswer.questionId).toBe('q001');
        expect(userAnswer.selectedAnswer).toBe('HALF_EFFECTIVE');
        expect(userAnswer.isCorrect).toBe(true);
        expect(userAnswer.timeSpent).toBe(1000);
      });

      it('should submit incorrect answer successfully', () => {
        const result = gameState.submitAnswer(TypeEffectiveness.SUPER_EFFECTIVE, 2000);
        
        expect(result).toBe(false);
        expect(gameState.getScore()).toBe(0);
        expect(gameState.getCurrentQuestionIndex()).toBe(1);
        
        const userAnswer = gameState.getUserAnswers()[0];
        expect(userAnswer.isCorrect).toBe(false);
        expect(userAnswer.timeSpent).toBe(2000);
      });

      it('should handle negative time spent', () => {
        gameState.submitAnswer(TypeEffectiveness.HALF_EFFECTIVE, -500);
        
        const userAnswer = gameState.getUserAnswers()[0];
        expect(userAnswer.timeSpent).toBe(0);
      });

      it('should complete game after last question', () => {
        const endTime = new Date();
        vi.setSystemTime(endTime);
        
        // Answer first question
        gameState.submitAnswer(TypeEffectiveness.HALF_EFFECTIVE);
        expect(gameState.hasCompleted()).toBe(false);
        
        // Answer second question (last)
        gameState.submitAnswer(TypeEffectiveness.SUPER_EFFECTIVE);
        expect(gameState.hasCompleted()).toBe(true);
        expect(gameState.isInProgress()).toBe(false);
        expect(gameState.getEndTime()).toEqual(endTime);
      });

      it('should throw error if not started', () => {
        const freshState = GameState.create(validConfig, questions);
        expect(() => 
          freshState.submitAnswer(TypeEffectiveness.HALF_EFFECTIVE)
        ).toThrow('Game has not been started');
      });

      it('should throw error if already completed', () => {
        // Complete the game
        gameState.submitAnswer(TypeEffectiveness.HALF_EFFECTIVE);
        gameState.submitAnswer(TypeEffectiveness.SUPER_EFFECTIVE);
        
        expect(() => 
          gameState.submitAnswer(TypeEffectiveness.NORMAL_EFFECTIVE)
        ).toThrow('Game has already been completed');
      });
    });
  });

  describe('Question Access', () => {
    beforeEach(() => {
      gameState.start();
    });

    describe('getCurrentQuestion()', () => {
      it('should return current question', () => {
        const currentQuestion = gameState.getCurrentQuestion();
        expect(currentQuestion?.getId()).toBe('q001');
      });

      it('should return null when no more questions', () => {
        gameState.submitAnswer(TypeEffectiveness.HALF_EFFECTIVE);
        gameState.submitAnswer(TypeEffectiveness.SUPER_EFFECTIVE);
        
        expect(gameState.getCurrentQuestion()).toBeNull();
      });
    });

    describe('getQuestion()', () => {
      it('should return question by index', () => {
        const question = gameState.getQuestion(1);
        expect(question.getId()).toBe('q002');
      });

      it('should throw error for invalid index', () => {
        expect(() => gameState.getQuestion(-1)).toThrow(
          'Question index -1 is out of bounds'
        );
        expect(() => gameState.getQuestion(2)).toThrow(
          'Question index 2 is out of bounds'
        );
      });
    });

    describe('getAllQuestions()', () => {
      it('should return all questions as immutable array', () => {
        const allQuestions = gameState.getAllQuestions();
        expect(allQuestions).toHaveLength(2);
        expect(allQuestions[0].getId()).toBe('q001');
        expect(allQuestions[1].getId()).toBe('q002');
        
        // Modifying returned array should not affect original
        allQuestions.pop();
        expect(gameState.getAllQuestions()).toHaveLength(2);
      });
    });
  });

  describe('Progress and Statistics', () => {
    beforeEach(() => {
      gameState.start();
    });

    describe('progress tracking', () => {
      it('should track question numbers correctly', () => {
        expect(gameState.getCurrentQuestionNumber()).toBe(1);
        expect(gameState.getRemainingQuestions()).toBe(2);
        
        gameState.submitAnswer(TypeEffectiveness.HALF_EFFECTIVE);
        expect(gameState.getCurrentQuestionNumber()).toBe(2);
        expect(gameState.getRemainingQuestions()).toBe(1);
        
        gameState.submitAnswer(TypeEffectiveness.SUPER_EFFECTIVE);
        expect(gameState.getCurrentQuestionNumber()).toBe(3);
        expect(gameState.getRemainingQuestions()).toBe(0);
      });

      it('should calculate progress percentage', () => {
        expect(gameState.getProgress()).toBe(0);
        
        gameState.submitAnswer(TypeEffectiveness.HALF_EFFECTIVE);
        expect(gameState.getProgress()).toBe(50);
        
        gameState.submitAnswer(TypeEffectiveness.SUPER_EFFECTIVE);
        expect(gameState.getProgress()).toBe(100);
      });
    });

    describe('accuracy calculation', () => {
      it('should calculate accuracy correctly', () => {
        expect(gameState.getAccuracy()).toBe(0);
        
        // Answer first correctly
        gameState.submitAnswer(TypeEffectiveness.HALF_EFFECTIVE);
        expect(gameState.getAccuracy()).toBe(100);
        
        // Answer second incorrectly
        gameState.submitAnswer(TypeEffectiveness.HALF_EFFECTIVE);
        expect(gameState.getAccuracy()).toBe(50);
      });
    });

    describe('time tracking', () => {
      it('should track elapsed time', () => {
        const startTime = new Date('2024-01-01T10:00:00Z');
        const endTime = new Date('2024-01-01T10:05:00Z');
        
        // Create fresh game state to avoid "already started" error
        const freshGameState = GameState.create(validConfig, questions);
        
        vi.setSystemTime(startTime);
        freshGameState.start();
        
        vi.setSystemTime(endTime);
        freshGameState.submitAnswer(TypeEffectiveness.HALF_EFFECTIVE);
        freshGameState.submitAnswer(TypeEffectiveness.SUPER_EFFECTIVE);
        
        expect(freshGameState.getElapsedTime()).toBe(5 * 60 * 1000); // 5 minutes
      });

      it('should return 0 elapsed time if not started', () => {
        const freshState = GameState.create(validConfig, questions);
        expect(freshState.getElapsedTime()).toBe(0);
      });
    });

    describe('getStatistics()', () => {
      it('should generate correct statistics', () => {
        // Answer both questions (one correct, one incorrect)
        gameState.submitAnswer(TypeEffectiveness.HALF_EFFECTIVE); // correct
        gameState.submitAnswer(TypeEffectiveness.HALF_EFFECTIVE); // incorrect
        
        const stats = gameState.getStatistics();
        expect(stats.totalQuestions).toBe(2);
        expect(stats.correctAnswers).toBe(1);
        expect(stats.accuracy).toBe(50);
        expect(stats.difficultyBreakdown).toEqual({
          easy: 0,
          normal: 2,
          hard: 0
        });
      });
    });
  });

  describe('User Answer Management', () => {
    beforeEach(() => {
      gameState.start();
      gameState.submitAnswer(TypeEffectiveness.HALF_EFFECTIVE, 1500);
    });

    describe('getUserAnswers()', () => {
      it('should return immutable user answers array', () => {
        const answers = gameState.getUserAnswers();
        expect(answers).toHaveLength(1);
        
        answers.pop();
        expect(gameState.getUserAnswers()).toHaveLength(1);
      });
    });

    describe('getUserAnswer()', () => {
      it('should return specific user answer', () => {
        const answer = gameState.getUserAnswer('q001');
        expect(answer).toBeTruthy();
        expect(answer?.questionId).toBe('q001');
        expect(answer?.timeSpent).toBe(1500);
      });

      it('should return null for non-existent question', () => {
        const answer = gameState.getUserAnswer('nonexistent');
        expect(answer).toBeNull();
      });
    });
  });

  describe('reset()', () => {
    it('should reset game state to initial values', () => {
      gameState.start();
      gameState.submitAnswer(TypeEffectiveness.HALF_EFFECTIVE);
      
      gameState.reset();
      
      expect(gameState.hasStarted()).toBe(false);
      expect(gameState.hasCompleted()).toBe(false);
      expect(gameState.isInProgress()).toBe(false);
      expect(gameState.getCurrentQuestionIndex()).toBe(0);
      expect(gameState.getScore()).toBe(0);
      expect(gameState.getUserAnswers()).toHaveLength(0);
      expect(gameState.getStartTime()).toBeNull();
      expect(gameState.getEndTime()).toBeNull();
    });
  });

  describe('Configuration Access', () => {
    it('should return immutable config', () => {
      const config = gameState.getConfig();
      expect(config).toEqual(validConfig);
      
      config.difficulty = 'hard';
      expect(gameState.getDifficulty()).toBe('normal');
    });
  });
});
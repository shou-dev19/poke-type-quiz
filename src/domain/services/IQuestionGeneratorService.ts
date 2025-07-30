/**
 * Question Generator Service Interface
 * Domain service interface for generating quiz questions
 */

import type { TypeId, DifficultyLevel, GameConfig, Question as QuestionData } from '../types';
import { Question } from '../entities/Question';

/**
 * Configuration options for question generation
 */
export interface QuestionGenerationOptions {
  /** Number of questions to generate */
  count: number;
  /** Difficulty level */
  difficulty: DifficultyLevel;
  /** Types to focus on (optional) */
  focusTypes?: TypeId[];
  /** Types to exclude (optional) */
  excludeTypes?: TypeId[];
  /** Whether to allow duplicate questions (default: false) */
  allowDuplicates?: boolean;
  /** Minimum effectiveness variety (default: 3) */
  minEffectivenessVariety?: number;
  /** Random seed for reproducible generation (optional) */
  seed?: string;
}

/**
 * Question generation result with metadata
 */
export interface QuestionGenerationResult {
  /** Generated questions */
  questions: Question[];
  /** Generation metadata */
  metadata: {
    /** Total generation attempts */
    totalAttempts: number;
    /** Number of duplicate questions skipped */
    duplicatesSkipped: number;
    /** Types used in questions */
    typesUsed: TypeId[];
    /** Effectiveness distribution */
    effectivenessDistribution: Record<string, number>;
    /** Generation time in milliseconds */
    generationTime: number;
  };
}

/**
 * Interface for generating quiz questions
 */
export interface IQuestionGeneratorService {
  /**
   * Generate questions based on game configuration
   * @param config - Game configuration containing difficulty and question count
   * @returns Array of generated Question entities
   */
  generateQuestions(config: GameConfig): Promise<Question[]>;

  /**
   * Generate questions with detailed options
   * @param options - Detailed generation options
   * @returns Question generation result with metadata
   */
  generateQuestionsWithOptions(options: QuestionGenerationOptions): Promise<QuestionGenerationResult>;

  /**
   * Generate a single random question
   * @param difficulty - Difficulty level
   * @param excludeTypes - Types to exclude from generation
   * @returns Single Question entity
   */
  generateSingleQuestion(difficulty: DifficultyLevel, excludeTypes?: TypeId[]): Promise<Question>;

  /**
   * Generate questions for specific type matchup
   * @param attackingType - The attacking type
   * @param defendingTypes - The defending type(s)
   * @param difficulty - Difficulty level (must match defending type count)
   * @returns Question entity for the specific matchup
   */
  generateQuestionForMatchup(
    attackingType: TypeId,
    defendingTypes: TypeId[],
    difficulty: DifficultyLevel
  ): Promise<Question>;

  /**
   * Generate balanced question set
   * Ensures good distribution of effectiveness types and Pokemon types
   * @param count - Number of questions to generate
   * @param difficulty - Difficulty level
   * @returns Array of balanced Question entities
   */
  generateBalancedQuestions(count: number, difficulty: DifficultyLevel): Promise<Question[]>;

  /**
   * Generate questions focusing on specific types
   * @param focusTypes - Types to emphasize in question generation
   * @param count - Number of questions to generate
   * @param difficulty - Difficulty level
   * @returns Array of Question entities focusing on specified types
   */
  generateFocusedQuestions(focusTypes: TypeId[], count: number, difficulty: DifficultyLevel): Promise<Question[]>;

  /**
   * Generate questions with specific effectiveness outcomes
   * @param targetEffectiveness - Target effectiveness values to generate
   * @param count - Number of questions to generate
   * @param difficulty - Difficulty level
   * @returns Array of Question entities with specified effectiveness
   */
  generateQuestionsWithEffectiveness(
    targetEffectiveness: string[],
    count: number,
    difficulty: DifficultyLevel
  ): Promise<Question[]>;

  /**
   * Validate question generation parameters
   * @param config - Game configuration to validate
   * @returns True if parameters are valid
   * @throws Error if parameters are invalid
   */
  validateGenerationConfig(config: GameConfig): Promise<boolean>;

  /**
   * Get generation statistics
   * @returns Object containing generator statistics
   */
  getGenerationStatistics(): Promise<{
    totalQuestionsGenerated: number;
    generationsByDifficulty: Record<DifficultyLevel, number>;
    averageGenerationTime: number;
    mostUsedTypes: TypeId[];
    leastUsedTypes: TypeId[];
    effectivenessDistribution: Record<string, number>;
  }>;

  /**
   * Estimate generation time for given parameters
   * @param count - Number of questions to generate
   * @param difficulty - Difficulty level
   * @returns Estimated generation time in milliseconds
   */
  estimateGenerationTime(count: number, difficulty: DifficultyLevel): Promise<number>;

  /**
   * Check if specific matchup is valid for difficulty
   * @param attackingType - The attacking type
   * @param defendingTypes - The defending type(s)
   * @param difficulty - Difficulty level
   * @returns True if matchup is valid for the difficulty
   */
  isValidMatchupForDifficulty(
    attackingType: TypeId,
    defendingTypes: TypeId[],
    difficulty: DifficultyLevel
  ): Promise<boolean>;

  /**
   * Get available matchups for difficulty level
   * @param difficulty - Difficulty level
   * @param limit - Maximum number of matchups to return (optional)
   * @returns Array of available type matchups
   */
  getAvailableMatchups(difficulty: DifficultyLevel, limit?: number): Promise<{
    attacking: TypeId;
    defending: TypeId[];
  }[]>;

  /**
   * Reset generation statistics and cache
   * @returns Promise that resolves when reset is complete
   */
  reset(): Promise<void>;
}
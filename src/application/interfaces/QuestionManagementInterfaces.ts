/**
 * Question Management Use Case Interfaces
 * Defines input/output DTOs and contracts for question management operations
 */

import type { DifficultyLevel, TypeId } from '@/domain/types';

// DTOs (Data Transfer Objects)

export interface SearchQuestionsRequest {
  /**
   * Filter by difficulty level
   */
  difficulty?: DifficultyLevel;
  
  /**
   * Filter by attacking type
   */
  attackingType?: TypeId;
  
  /**
   * Filter by defending types (must include all specified types)
   */
  defendingTypes?: TypeId[];
  
  /**
   * Filter by effectiveness
   */
  effectiveness?: string;
  
  /**
   * Search in question text
   */
  searchText?: string;
  
  /**
   * Pagination: page number (1-based)
   */
  page?: number;
  
  /**
   * Pagination: items per page
   */
  limit?: number;
  
  /**
   * Sorting field
   */
  sortBy?: 'difficulty' | 'attackingType' | 'defendingType' | 'effectiveness' | 'created';
  
  /**
   * Sort order
   */
  sortOrder?: 'asc' | 'desc';
}

export interface SearchQuestionsResponse {
  questions: QuestionSummaryDTO[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface GetQuestionDetailRequest {
  questionId: string;
}

export interface GetQuestionDetailResponse {
  question: QuestionDetailDTO;
}

export interface GetQuestionStatisticsRequest {
  /**
   * Get statistics for specific difficulty
   */
  difficulty?: DifficultyLevel;
  
  /**
   * Get statistics for specific type combinations
   */
  typeFilter?: {
    attackingType?: TypeId;
    defendingTypes?: TypeId[];
  };
}

export interface GetQuestionStatisticsResponse {
  totalQuestions: number;
  difficultyDistribution: Record<DifficultyLevel, number>;
  typeDistribution: {
    attackingTypes: Record<string, number>;
    defendingTypes: Record<string, number>;
    typeMatches: Array<{
      attackingType: string;
      defendingType: string[];
      count: number;
    }>;
  };
  effectivenessDistribution: Record<string, number>;
  averageGenerationTime: number;
}

export interface ValidateQuestionRequest {
  attackingType: TypeId;
  defendingType: TypeId[];
  difficulty: DifficultyLevel;
}

export interface ValidateQuestionResponse {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
  estimatedDifficulty: DifficultyLevel;
  calculatedEffectiveness: string;
}

export interface GetSimilarQuestionsRequest {
  attackingType: TypeId;
  defendingType: TypeId[];
  difficulty?: DifficultyLevel;
  limit?: number;
}

export interface GetSimilarQuestionsResponse {
  similarQuestions: QuestionSummaryDTO[];
  matchReasons: Array<{
    questionId: string;
    reasons: ('same_attacking_type' | 'same_defending_type' | 'same_effectiveness' | 'same_difficulty')[];
  }>;
}

export interface GetQuestionPoolRequest {
  poolSize: number;
  difficulty: DifficultyLevel;
  focusTypes?: TypeId[];
  excludeTypes?: TypeId[];
  balanceEffectiveness?: boolean;
  seed?: string;
}

export interface GetQuestionPoolResponse {
  questions: QuestionSummaryDTO[];
  poolMetadata: {
    requestedSize: number;
    actualSize: number;
    difficultyDistribution: Record<DifficultyLevel, number>;
    effectivenessDistribution: Record<string, number>;
    typeDistribution: Record<string, number>;
    duplicatesRemoved: number;
    generationTime: number;
  };
}

// Shared DTOs

export interface QuestionSummaryDTO {
  id: string;
  attackingType: string;
  defendingType: string[];
  difficulty: DifficultyLevel;
  effectiveness: string;
  effectivenessMultiplier: number;
  questionText: string;
  createdAt?: Date;
  tags?: string[];
}

export interface QuestionDetailDTO extends QuestionSummaryDTO {
  correctAnswer: string;
  explanation: string;
  choices: Array<{
    value: string;
    label: string;
    description: string;
    multiplier: number;
  }>;
  metadata: {
    generationMethod: string;
    generationTime: number;
    typeCompatibility: {
      isMonoType: boolean;
      isDualType: boolean;
      hasResistance: boolean;
      hasWeakness: boolean;
      hasImmunity: boolean;
    };
    difficultyFactors: {
      typeComplexity: number;
      effectivenessClarity: number;
      commonKnowledge: number;
    };
  };
}

// Use Case Interface

export interface IQuestionManagementUseCase {
  /**
   * Search for questions with various filters
   */
  searchQuestions(request: SearchQuestionsRequest): Promise<SearchQuestionsResponse>;

  /**
   * Get detailed information about a specific question
   */
  getQuestionDetail(request: GetQuestionDetailRequest): Promise<GetQuestionDetailResponse>;

  /**
   * Get question generation statistics
   */
  getQuestionStatistics(request: GetQuestionStatisticsRequest): Promise<GetQuestionStatisticsResponse>;

  /**
   * Validate a question configuration before generation
   */
  validateQuestion(request: ValidateQuestionRequest): Promise<ValidateQuestionResponse>;

  /**
   * Find questions similar to given type combination
   */
  getSimilarQuestions(request: GetSimilarQuestionsRequest): Promise<GetSimilarQuestionsResponse>;

  /**
   * Generate a pool of questions with specific criteria
   */
  getQuestionPool(request: GetQuestionPoolRequest): Promise<GetQuestionPoolResponse>;
}
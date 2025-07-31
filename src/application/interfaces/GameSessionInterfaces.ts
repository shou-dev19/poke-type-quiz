/**
 * Game Session Use Case Interfaces
 * Defines input/output DTOs and contracts for game session management
 */

import type { DifficultyLevel, GameStatistics, UserAnswer } from '@/domain/types';
import { Question } from '@/domain/entities/Question';

// DTOs (Data Transfer Objects)

export interface CreateGameSessionRequest {
  difficulty: DifficultyLevel;
  questionCount: number;
  focusTypes?: string[];
  excludeTypes?: string[];
  seed?: string;
}

export interface CreateGameSessionResponse {
  sessionId: string;
  config: {
    difficulty: DifficultyLevel;
    questionCount: number;
    estimatedTime: number;
  };
  metadata: {
    totalQuestions: number;
    typesUsed: string[];
    effectivenessDistribution: Record<string, number>;
  };
}

export interface StartGameRequest {
  sessionId: string;
}

export interface StartGameResponse {
  sessionId: string;
  startTime: Date;
  currentQuestion: QuestionDTO;
  progress: {
    currentQuestionNumber: number;
    totalQuestions: number;
    progressPercentage: number;
  };
}

export interface SubmitAnswerRequest {
  sessionId: string;
  answer: string; // EffectivenessValue
  timeSpent?: number;
}

export interface SubmitAnswerResponse {
  sessionId: string;
  isCorrect: boolean;
  correctAnswer: string;
  explanation?: string;
  nextQuestion?: QuestionDTO;
  progress: {
    currentQuestionNumber: number;
    totalQuestions: number;
    progressPercentage: number;
    score: number;
    accuracy: number;
  };
  isGameCompleted: boolean;
  finalResults?: GameResultsDTO;
}

export interface GetCurrentQuestionRequest {
  sessionId: string;
}

export interface GetCurrentQuestionResponse {
  sessionId: string;
  currentQuestion: QuestionDTO | null;
  progress: {
    currentQuestionNumber: number;
    totalQuestions: number;
    progressPercentage: number;
    remainingQuestions: number;
  };
}

export interface GetGameStatusRequest {
  sessionId: string;
}

export interface GetGameStatusResponse {
  sessionId: string;
  status: 'not_started' | 'in_progress' | 'completed';
  config: {
    difficulty: DifficultyLevel;
    questionCount: number;
  };
  progress: {
    currentQuestionNumber: number;
    totalQuestions: number;
    progressPercentage: number;
    score: number;
    accuracy: number;
  };
  timing: {
    startTime?: Date;
    endTime?: Date;
    elapsedTime: number;
  };
  isCompleted: boolean;
  results?: GameResultsDTO;
}

export interface EndGameRequest {
  sessionId: string;
}

export interface EndGameResponse {
  sessionId: string;
  results: GameResultsDTO;
}

export interface ResetGameRequest {
  sessionId: string;
}

export interface ResetGameResponse {
  sessionId: string;
  status: 'reset';
}

// Shared DTOs

export interface QuestionDTO {
  id: string;
  attackingType: string;
  defendingType: string[];
  difficulty: DifficultyLevel;
  questionText: string;
  choices: EffectivenessChoiceDTO[];
}

export interface EffectivenessChoiceDTO {
  value: string; // EffectivenessValue
  label: string;
  description: string;
  multiplier: number;
}

export interface GameResultsDTO {
  sessionId: string;
  finalScore: number;
  totalQuestions: number;
  accuracy: number;
  timeElapsed: number;
  difficulty: DifficultyLevel;
  statistics: GameStatistics;
  userAnswers: UserAnswerDTO[];
  performance: {
    rank: 'S' | 'A' | 'B' | 'C' | 'D';
    message: string;
    suggestions: string[];
  };
}

export interface UserAnswerDTO {
  questionId: string;
  questionText: string;
  selectedAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  timeSpent: number;
  explanation: string;
}

// Use Case Interface

export interface IGameSessionUseCase {
  /**
   * Create a new game session
   */
  createSession(request: CreateGameSessionRequest): Promise<CreateGameSessionResponse>;

  /**
   * Start an existing game session
   */
  startGame(request: StartGameRequest): Promise<StartGameResponse>;

  /**
   * Submit an answer for the current question
   */
  submitAnswer(request: SubmitAnswerRequest): Promise<SubmitAnswerResponse>;

  /**
   * Get the current question
   */
  getCurrentQuestion(request: GetCurrentQuestionRequest): Promise<GetCurrentQuestionResponse>;

  /**
   * Get the current game status
   */
  getGameStatus(request: GetGameStatusRequest): Promise<GetGameStatusResponse>;

  /**
   * End the current game session
   */
  endGame(request: EndGameRequest): Promise<EndGameResponse>;

  /**
   * Reset the current game session
   */
  resetGame(request: ResetGameRequest): Promise<ResetGameResponse>;

  /**
   * Check if a session exists and is valid
   */
  sessionExists(sessionId: string): Promise<boolean>;

  /**
   * Clean up expired sessions
   */
  cleanupExpiredSessions(): Promise<number>;
}
/**
 * Domain Types
 * Core type definitions for the Pokemon Type Quiz application
 */

// Pokemon Type IDs (18 official types)
export type TypeId =
  | 'normal'
  | 'fire'
  | 'water'
  | 'electric'
  | 'grass'
  | 'ice'
  | 'fighting'
  | 'poison'
  | 'ground'
  | 'flying'
  | 'psychic'
  | 'bug'
  | 'rock'
  | 'ghost'
  | 'dragon'
  | 'dark'
  | 'steel'
  | 'fairy';

// Quiz difficulty levels
export type DifficultyLevel = 'easy' | 'normal' | 'hard';

// Type effectiveness values
export type EffectivenessValue =
  | 'NONE'
  | 'QUARTER_EFFECTIVE'
  | 'HALF_EFFECTIVE'
  | 'NORMAL_EFFECTIVE'
  | 'SUPER_EFFECTIVE'
  | 'ULTRA_EFFECTIVE';

// Screen types for navigation
export type ScreenType = 'start' | 'quiz' | 'result' | 'end';

// Animation types
export type AnimationType =
  | 'idle'
  | 'attack'
  | 'defense'
  | 'damage'
  | 'victory'
  | 'defeat';

/**
 * Pokemon Type Data Interface
 */
export interface PokemonTypeData {
  id: TypeId;
  nameJa: string;
  color: string;
  colorLight: string;
  symbol: string;
  animation: string;
}

/**
 * Quiz Question Interface
 */
export interface Question {
  id: string;
  attackingType: TypeId;
  defendingType: TypeId[]; // Array for dual-type support
  correctAnswer: EffectivenessValue;
  difficulty: DifficultyLevel;
}

/**
 * Game Configuration Interface
 */
export interface GameConfig {
  difficulty: DifficultyLevel;
  questionCount: number;
}

/**
 * Game Statistics Interface
 */
export interface GameStatistics {
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number;
  timeElapsed: number;
  difficultyBreakdown: Record<DifficultyLevel, number>;
}

/**
 * Animation Configuration Interface
 */
export interface AnimationConfig {
  duration: number;
  easing: string;
  delay?: number;
  iterations?: number | 'infinite';
}

/**
 * Error Types
 */
export interface AppError {
  code: string;
  message: string;
  details?: any;
}

/**
 * API Response Interface
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: AppError;
}

/**
 * Type Effectiveness Data Structure
 */
export type TypeEffectivenessMatrix = Record<TypeId, Record<TypeId, number>>;

/**
 * User Answer Interface
 */
export interface UserAnswer {
  questionId: string;
  selectedAnswer: EffectivenessValue;
  isCorrect: boolean;
  timeSpent: number;
}

/**
 * Quiz Result Interface
 */
export interface QuizResult {
  isCorrect: boolean;
  correctAnswer: EffectivenessValue;
  userAnswer: EffectivenessValue;
  explanation: string;
}

/**
 * Theme Configuration
 */
export interface ThemeConfig {
  name: string;
  colors: Record<string, string>;
  animations: Record<string, AnimationConfig>;
}
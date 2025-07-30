/**
 * GameState Entity
 * Domain entity representing the current state of the quiz game
 */

import type { DifficultyLevel, Question as QuestionData, GameConfig, GameStatistics, UserAnswer } from '../types';
import { Question } from './Question';
import { TypeEffectiveness } from './TypeEffectiveness';

/**
 * Game State Entity
 * Manages the current state of a quiz session
 */
export class GameState {
  private currentQuestionIndex: number = 0;
  private score: number = 0;
  private userAnswers: UserAnswer[] = [];
  private startTime: Date | null = null;
  private endTime: Date | null = null;
  private isCompleted: boolean = false;
  private isStarted: boolean = false;

  constructor(
    private readonly config: GameConfig,
    private readonly questions: Question[]
  ) {
    this.validateGameConfig(config);
    this.validateQuestions(questions);
  }

  /**
   * Create GameState from configuration and questions
   * @param config - Game configuration
   * @param questions - Array of questions
   * @returns New GameState instance
   */
  static create(config: GameConfig, questions: Question[]): GameState {
    return new GameState(config, questions);
  }

  /**
   * Start the game
   * @throws Error if game is already started
   */
  start(): void {
    if (this.isStarted) {
      throw new Error('Game has already been started');
    }

    this.isStarted = true;
    this.startTime = new Date();
    this.currentQuestionIndex = 0;
    this.score = 0;
    this.userAnswers = [];
    this.isCompleted = false;
    this.endTime = null;
  }

  /**
   * Submit an answer for the current question
   * @param answer - User's selected answer
   * @param timeSpent - Time spent on the question in milliseconds
   * @returns True if answer is correct
   * @throws Error if game is not started or completed
   */
  submitAnswer(answer: TypeEffectiveness, timeSpent: number = 0): boolean {
    if (!this.isStarted) {
      throw new Error('Game has not been started');
    }

    if (this.isCompleted) {
      throw new Error('Game has already been completed');
    }

    if (this.currentQuestionIndex >= this.questions.length) {
      throw new Error('No more questions available');
    }

    const currentQuestion = this.questions[this.currentQuestionIndex];
    const isCorrect = currentQuestion.isCorrectAnswer(answer);

    // Record the answer
    const userAnswer: UserAnswer = {
      questionId: currentQuestion.getId(),
      selectedAnswer: answer.value,
      isCorrect,
      timeSpent: Math.max(0, timeSpent)
    };

    this.userAnswers.push(userAnswer);

    // Update score
    if (isCorrect) {
      this.score++;
    }

    // Move to next question
    this.currentQuestionIndex++;

    // Check if game is completed
    if (this.currentQuestionIndex >= this.questions.length) {
      this.complete();
    }

    return isCorrect;
  }

  /**
   * Complete the game
   */
  private complete(): void {
    this.isCompleted = true;
    this.endTime = new Date();
  }

  /**
   * Get current question
   * @returns Current question or null if no more questions
   */
  getCurrentQuestion(): Question | null {
    if (this.currentQuestionIndex >= this.questions.length) {
      return null;
    }
    return this.questions[this.currentQuestionIndex];
  }

  /**
   * Get question by index
   * @param index - Question index
   * @returns Question at the specified index
   * @throws Error if index is out of bounds
   */
  getQuestion(index: number): Question {
    if (index < 0 || index >= this.questions.length) {
      throw new Error(`Question index ${index} is out of bounds`);
    }
    return this.questions[index];
  }

  /**
   * Get all questions
   * @returns Array of all questions
   */
  getAllQuestions(): Question[] {
    return [...this.questions];
  }

  /**
   * Get current question index (0-based)
   * @returns Current question index
   */
  getCurrentQuestionIndex(): number {
    return this.currentQuestionIndex;
  }

  /**
   * Get current question number (1-based)
   * @returns Current question number
   */
  getCurrentQuestionNumber(): number {
    return this.currentQuestionIndex + 1;
  }

  /**
   * Get total number of questions
   * @returns Total question count
   */
  getTotalQuestions(): number {
    return this.questions.length;
  }

  /**
   * Get current score
   * @returns Current score (number of correct answers)
   */
  getScore(): number {
    return this.score;
  }

  /**
   * Get accuracy percentage
   * @returns Accuracy as percentage (0-100)
   */
  getAccuracy(): number {
    if (this.userAnswers.length === 0) {
      return 0;
    }
    return (this.score / this.userAnswers.length) * 100;
  }

  /**
   * Get game configuration
   * @returns Game configuration
   */
  getConfig(): GameConfig {
    return { ...this.config };
  }

  /**
   * Get difficulty level
   * @returns Difficulty level
   */
  getDifficulty(): DifficultyLevel {
    return this.config.difficulty;
  }

  /**
   * Get all user answers
   * @returns Array of user answers
   */
  getUserAnswers(): UserAnswer[] {
    return [...this.userAnswers];
  }

  /**
   * Get user answer for a specific question
   * @param questionId - Question ID
   * @returns User answer or null if not found
   */
  getUserAnswer(questionId: string): UserAnswer | null {
    return this.userAnswers.find(answer => answer.questionId === questionId) || null;
  }

  /**
   * Check if game has started
   * @returns True if game has started
   */
  hasStarted(): boolean {
    return this.isStarted;
  }

  /**
   * Check if game is completed
   * @returns True if game is completed
   */
  hasCompleted(): boolean {
    return this.isCompleted;
  }

  /**
   * Check if game is in progress
   * @returns True if game is started but not completed
   */
  isInProgress(): boolean {
    return this.isStarted && !this.isCompleted;
  }

  /**
   * Get start time
   * @returns Start time or null if not started
   */
  getStartTime(): Date | null {
    return this.startTime ? new Date(this.startTime) : null;
  }

  /**
   * Get end time
   * @returns End time or null if not completed
   */
  getEndTime(): Date | null {
    return this.endTime ? new Date(this.endTime) : null;
  }

  /**
   * Get elapsed time in milliseconds
   * @returns Elapsed time or 0 if not started
   */
  getElapsedTime(): number {
    if (!this.startTime) {
      return 0;
    }

    const endTime = this.endTime || new Date();
    return endTime.getTime() - this.startTime.getTime();
  }

  /**
   * Get game progress percentage
   * @returns Progress as percentage (0-100)
   */
  getProgress(): number {
    return (this.currentQuestionIndex / this.questions.length) * 100;
  }

  /**
   * Get remaining questions count
   * @returns Number of remaining questions
   */
  getRemainingQuestions(): number {
    return Math.max(0, this.questions.length - this.currentQuestionIndex);
  }

  /**
   * Generate game statistics
   * @returns Game statistics object
   */
  getStatistics(): GameStatistics {
    const difficultyBreakdown: Record<DifficultyLevel, number> = {
      easy: 0,
      normal: 0,
      hard: 0
    };

    // Count questions by difficulty
    this.questions.forEach(question => {
      difficultyBreakdown[question.getDifficulty()]++;
    });

    return {
      totalQuestions: this.questions.length,
      correctAnswers: this.score,
      accuracy: this.getAccuracy(),
      timeElapsed: this.getElapsedTime(),
      difficultyBreakdown
    };
  }

  /**
   * Reset the game state
   */
  reset(): void {
    this.currentQuestionIndex = 0;
    this.score = 0;
    this.userAnswers = [];
    this.startTime = null;
    this.endTime = null;
    this.isCompleted = false;
    this.isStarted = false;
  }

  /**
   * Validate game configuration
   * @param config - Configuration to validate
   * @throws Error if configuration is invalid
   */
  private validateGameConfig(config: GameConfig): void {
    if (!config) {
      throw new Error('Game configuration is required');
    }

    if (!config.difficulty) {
      throw new Error('Difficulty is required in game configuration');
    }

    const validDifficulties: DifficultyLevel[] = ['easy', 'normal', 'hard'];
    if (!validDifficulties.includes(config.difficulty)) {
      throw new Error(`Invalid difficulty: ${config.difficulty}`);
    }

    if (!config.questionCount || config.questionCount <= 0) {
      throw new Error('Question count must be a positive number');
    }

    if (config.questionCount > 100) {
      throw new Error('Question count cannot exceed 100');
    }
  }

  /**
   * Validate questions array
   * @param questions - Questions to validate
   * @throws Error if questions are invalid
   */
  private validateQuestions(questions: Question[]): void {
    if (!Array.isArray(questions)) {
      throw new Error('Questions must be an array');
    }

    if (questions.length === 0) {
      throw new Error('Questions array cannot be empty');
    }

    if (questions.length !== this.config.questionCount) {
      throw new Error(
        `Question count mismatch: expected ${this.config.questionCount}, got ${questions.length}`
      );
    }

    // Validate that all questions match the configured difficulty
    questions.forEach((question, index) => {
      if (question.getDifficulty() !== this.config.difficulty) {
        throw new Error(
          `Question ${index} difficulty mismatch: expected ${this.config.difficulty}, got ${question.getDifficulty()}`
        );
      }
    });
  }
}
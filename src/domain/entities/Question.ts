/**
 * Question Entity
 * Domain entity representing a quiz question
 */

import type { TypeId, DifficultyLevel, EffectivenessValue, Question as QuestionData } from '../types';
import { TypeEffectiveness } from './TypeEffectiveness';

/**
 * Quiz Question Entity
 * Represents a single question in the Pokemon type quiz
 */
export class Question {
  public readonly id: string;
  public readonly attackingType: TypeId;
  public readonly defendingType: TypeId[];
  public readonly correctAnswer: EffectivenessValue;
  public readonly difficulty: DifficultyLevel;

  constructor(data: QuestionData) {
    this.validateQuestionData(data);
    
    this.id = data.id;
    this.attackingType = data.attackingType;
    this.defendingType = [...data.defendingType];
    this.correctAnswer = data.correctAnswer;
    this.difficulty = data.difficulty;
  }

  /**
   * Create Question from raw data
   * @param data - Raw question data
   * @returns New Question instance
   */
  static create(data: QuestionData): Question {
    return new Question(data);
  }

  /**
   * Get the attacking type
   * @returns The attacking TypeId
   */
  getAttackingType(): TypeId {
    return this.attackingType;
  }

  /**
   * Get the defending types
   * @returns Array of defending TypeIds
   */
  getDefendingTypes(): TypeId[] {
    return [...this.defendingType];
  }

  /**
   * Check if this is a dual-type question
   * @returns True if defending type has 2 types
   */
  isDualType(): boolean {
    return this.defendingType.length === 2;
  }

  /**
   * Check if this is a single-type question
   * @returns True if defending type has 1 type
   */
  isSingleType(): boolean {
    return this.defendingType.length === 1;
  }

  /**
   * Get the correct answer as TypeEffectiveness
   * @returns TypeEffectiveness instance for the correct answer
   */
  getCorrectAnswerEffectiveness(): TypeEffectiveness {
    return TypeEffectiveness.fromValue(this.correctAnswer);
  }

  /**
   * Get question difficulty
   * @returns DifficultyLevel
   */
  getDifficulty(): DifficultyLevel {
    return this.difficulty;
  }

  /**
   * Get question ID
   * @returns Question identifier
   */
  getId(): string {
    return this.id;
  }

  /**
   * Check if a user answer is correct
   * @param userAnswer - User's selected effectiveness
   * @returns True if the answer is correct
   */
  isCorrectAnswer(userAnswer: TypeEffectiveness): boolean {
    return userAnswer.value === this.correctAnswer;
  }

  /**
   * Generate question text for display
   * @returns Human-readable question text
   */
  getQuestionText(): string {
    const defendingText = this.isDualType() 
      ? `${this.defendingType[0]}・${this.defendingType[1]}`
      : this.defendingType[0];
    
    return `${this.attackingType}タイプの技を${defendingText}タイプのポケモンに使った時の効果は？`;
  }

  /**
   * Convert to plain object
   * @returns QuestionData object
   */
  toData(): QuestionData {
    return {
      id: this.id,
      attackingType: this.attackingType,
      defendingType: [...this.defendingType],
      correctAnswer: this.correctAnswer,
      difficulty: this.difficulty,
    };
  }

  /**
   * String representation
   * @returns String representation of the question
   */
  toString(): string {
    return `Question(${this.id}: ${this.attackingType} -> ${this.defendingType.join('/')})`;
  }

  /**
   * JSON serialization
   * @returns JSON representation
   */
  toJSON(): QuestionData {
    return this.toData();
  }

  /**
   * Compare with another question
   * @param other - Other question to compare
   * @returns True if questions are the same
   */
  equals(other: Question): boolean {
    return this.id === other.id &&
           this.attackingType === other.attackingType &&
           this.defendingType.length === other.defendingType.length &&
           this.defendingType.every((type, index) => type === other.defendingType[index]);
  }

  /**
   * Validate question data
   * @param data - Data to validate
   * @throws Error if data is invalid
   */
  private validateQuestionData(data: QuestionData): void {
    if (!data) {
      throw new Error('Question data is required');
    }

    // Validate required fields
    if (!data.id || data.id.trim().length === 0) {
      throw new Error('Question ID is required and cannot be empty');
    }

    if (!data.attackingType) {
      throw new Error('Attacking type is required');
    }

    if (!data.defendingType || !Array.isArray(data.defendingType)) {
      throw new Error('Defending type must be an array');
    }

    if (data.defendingType.length === 0) {
      throw new Error('Defending type array cannot be empty');
    }

    if (data.defendingType.length > 2) {
      throw new Error('Defending type array cannot have more than 2 types');
    }

    if (!data.correctAnswer) {
      throw new Error('Correct answer is required');
    }

    if (!data.difficulty) {
      throw new Error('Difficulty is required');
    }

    // Validate attacking type
    this.validateTypeId(data.attackingType);

    // Validate defending types
    data.defendingType.forEach((type, index) => {
      this.validateTypeId(type, `defendingType[${index}]`);
    });

    // Check for duplicate defending types in dual-type
    if (data.defendingType.length === 2 && data.defendingType[0] === data.defendingType[1]) {
      throw new Error('Dual-type defending types must be different');
    }

    // Validate effectiveness value
    this.validateEffectivenessValue(data.correctAnswer);

    // Validate difficulty
    this.validateDifficulty(data.difficulty);

    // Validate difficulty constraints
    this.validateDifficultyConstraints(data);
  }

  /**
   * Validate type ID
   * @param typeId - Type ID to validate
   * @param fieldName - Field name for error messages
   * @throws Error if type ID is invalid
   */
  private validateTypeId(typeId: TypeId, fieldName: string = 'type'): void {
    const validTypes: TypeId[] = [
      'normal', 'fire', 'water', 'electric', 'grass', 'ice',
      'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
      'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
    ];

    if (!validTypes.includes(typeId)) {
      throw new Error(`Invalid ${fieldName}: ${typeId}`);
    }
  }

  /**
   * Validate effectiveness value
   * @param value - Effectiveness value to validate
   * @throws Error if value is invalid
   */
  private validateEffectivenessValue(value: EffectivenessValue): void {
    const validValues: EffectivenessValue[] = [
      'NONE', 'QUARTER_EFFECTIVE', 'HALF_EFFECTIVE', 
      'NORMAL_EFFECTIVE', 'SUPER_EFFECTIVE', 'ULTRA_EFFECTIVE'
    ];

    if (!validValues.includes(value)) {
      throw new Error(`Invalid effectiveness value: ${value}`);
    }
  }

  /**
   * Validate difficulty level
   * @param difficulty - Difficulty to validate
   * @throws Error if difficulty is invalid
   */
  private validateDifficulty(difficulty: DifficultyLevel): void {
    const validDifficulties: DifficultyLevel[] = ['easy', 'normal', 'hard'];

    if (!validDifficulties.includes(difficulty)) {
      throw new Error(`Invalid difficulty: ${difficulty}`);
    }
  }

  /**
   * Validate difficulty-specific constraints
   * @param data - Question data to validate
   * @throws Error if constraints are violated
   */
  private validateDifficultyConstraints(data: QuestionData): void {
    if (data.difficulty === 'hard') {
      // Hard difficulty should only have dual-type questions
      if (data.defendingType.length !== 2) {
        throw new Error('Hard difficulty questions must have dual-type defending Pokemon');
      }
    }

    if (data.difficulty === 'easy' || data.difficulty === 'normal') {
      // Easy and normal should only have single-type questions
      if (data.defendingType.length !== 1) {
        throw new Error(`${data.difficulty} difficulty questions must have single-type defending Pokemon`);
      }
    }
  }

  // Static helper methods

  /**
   * Generate a unique question ID
   * @param attackingType - Attacking type
   * @param defendingTypes - Defending types
   * @returns Unique question ID
   */
  static generateId(attackingType: TypeId, defendingTypes: TypeId[]): string {
    const defendingTypeString = defendingTypes.sort().join('-');
    return `q_${attackingType}_vs_${defendingTypeString}`;
  }

  /**
   * Validate multiple question data objects
   * @param questions - Array of question data to validate
   * @returns True if all questions are valid
   * @throws Error if any question is invalid
   */
  static validateQuestionsArray(questions: QuestionData[]): boolean {
    if (!Array.isArray(questions)) {
      throw new Error('Questions must be an array');
    }

    if (questions.length === 0) {
      throw new Error('Questions array cannot be empty');
    }

    // Check for duplicate IDs
    const ids = questions.map(q => q.id);
    const uniqueIds = new Set(ids);
    
    if (ids.length !== uniqueIds.size) {
      throw new Error('Duplicate question IDs found');
    }

    // Validate each question
    questions.forEach((questionData, index) => {
      try {
        new Question(questionData);
      } catch (error) {
        throw new Error(`Invalid question at index ${index}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    });

    return true;
  }
}
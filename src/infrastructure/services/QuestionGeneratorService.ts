/**
 * Question Generator Service Implementation
 * Concrete implementation of IQuestionGeneratorService
 */

import type { TypeId, DifficultyLevel, GameConfig, Question as QuestionData } from '@/domain/types';
import type { 
  IQuestionGeneratorService, 
  ITypeEffectivenessService, 
  ITypeRepository,
  QuestionGenerationOptions,
  QuestionGenerationResult
} from '@/domain/services';
import { Question } from '@/domain/entities/Question';

/**
 * Question generation service
 * Generates balanced, random quiz questions based on type effectiveness
 */
export class QuestionGeneratorService implements IQuestionGeneratorService {
  private generationStats = {
    totalGenerated: 0,
    generationsByDifficulty: { easy: 0, normal: 0, hard: 0 } as Record<DifficultyLevel, number>,
    totalGenerationTime: 0,
    typeUsageCount: new Map<TypeId, number>(),
    effectivenessCount: new Map<string, number>()
  };

  constructor(
    private readonly typeEffectivenessService: ITypeEffectivenessService,
    private readonly typeRepository: ITypeRepository
  ) {}

  /**
   * Generate questions based on game configuration
   */
  async generateQuestions(config: GameConfig): Promise<Question[]> {
    await this.validateGenerationConfig(config);
    
    const options: QuestionGenerationOptions = {
      count: config.questionCount,
      difficulty: config.difficulty,
      minEffectivenessVariety: config.questionCount >= 3 ? 2 : 1 // Only require variety for 3+ questions
    };

    const result = await this.generateQuestionsWithOptions(options);
    return result.questions;
  }

  /**
   * Generate questions with detailed options
   */
  async generateQuestionsWithOptions(options: QuestionGenerationOptions): Promise<QuestionGenerationResult> {
    const startTime = Date.now();
    
    const questions: Question[] = [];
    const usedQuestionIds = new Set<string>();
    const typesUsed = new Set<TypeId>();
    const effectivenessDistribution = new Map<string, number>();
    let totalAttempts = 0;
    let duplicatesSkipped = 0;

    // Set up pseudo-random generator if seed is provided
    if (options.seed) {
      this.setSeed(options.seed);
    }

    // Get available types for the difficulty level
    const availableTypes = await this.getTypesForDifficulty(options.difficulty, options.focusTypes, options.excludeTypes);
    
    if (availableTypes.length === 0) {
      throw new Error('No types available for question generation with the given constraints');
    }

    // Generate questions
    while (questions.length < options.count) {
      totalAttempts++;
      
      if (totalAttempts > options.count * 100) {
        throw new Error(`Could not generate ${options.count} questions after ${totalAttempts} attempts. Consider relaxing constraints.`);
      }

      try {
        const questionData = await this.generateSingleQuestionData(
          options.difficulty,
          availableTypes,
          options.excludeTypes || []
        );

        const questionId = Question.generateId(questionData.attackingType, questionData.defendingType);
        
        // Skip duplicates if not allowed
        if (!options.allowDuplicates && usedQuestionIds.has(questionId)) {
          duplicatesSkipped++;
          continue;
        }

        const question = new Question(questionData);
        questions.push(question);
        usedQuestionIds.add(questionId);
        
        // Track statistics
        typesUsed.add(questionData.attackingType);
        questionData.defendingType.forEach(type => typesUsed.add(type));
        
        const effectivenessCount = effectivenessDistribution.get(questionData.correctAnswer) || 0;
        effectivenessDistribution.set(questionData.correctAnswer, effectivenessCount + 1);

      } catch (error) {
        // Skip invalid questions and continue
        continue;
      }
    }

    // Validate effectiveness variety if required
    if (options.minEffectivenessVariety && effectivenessDistribution.size < options.minEffectivenessVariety) {
      throw new Error(
        `Generated questions do not meet minimum effectiveness variety requirement: ` +
        `${effectivenessDistribution.size} < ${options.minEffectivenessVariety}`
      );
    }

    const generationTime = Date.now() - startTime;
    
    // Update global statistics
    this.updateStatistics(options, questions, generationTime, Array.from(typesUsed));

    return {
      questions,
      metadata: {
        totalAttempts,
        duplicatesSkipped,
        typesUsed: Array.from(typesUsed),
        effectivenessDistribution: Object.fromEntries(effectivenessDistribution),
        generationTime
      }
    };
  }

  /**
   * Generate a single random question
   */
  async generateSingleQuestion(difficulty: DifficultyLevel, excludeTypes: TypeId[] = []): Promise<Question> {
    const availableTypes = await this.getTypesForDifficulty(difficulty, undefined, excludeTypes);
    
    if (availableTypes.length === 0) {
      throw new Error('No types available for question generation');
    }

    const questionData = await this.generateSingleQuestionData(difficulty, availableTypes, excludeTypes);
    return new Question(questionData);
  }

  /**
   * Generate questions for specific type matchup
   */
  async generateQuestionForMatchup(
    attackingType: TypeId,
    defendingTypes: TypeId[],
    difficulty: DifficultyLevel
  ): Promise<Question> {
    // Validate inputs
    if (!await this.typeRepository.exists(attackingType)) {
      throw new Error(`Invalid attacking type: ${attackingType}`);
    }

    for (const defendingType of defendingTypes) {
      if (!await this.typeRepository.exists(defendingType)) {
        throw new Error(`Invalid defending type: ${defendingType}`);
      }
    }

    if (!await this.isValidMatchupForDifficulty(attackingType, defendingTypes, difficulty)) {
      throw new Error(`Matchup ${attackingType} vs ${defendingTypes.join('/')} is not valid for ${difficulty} difficulty`);
    }

    // Calculate correct answer
    const effectiveness = this.typeEffectivenessService.calculateEffectiveness(attackingType, defendingTypes);
    
    const questionData: QuestionData = {
      id: Question.generateId(attackingType, defendingTypes),
      attackingType,
      defendingType: [...defendingTypes],
      correctAnswer: effectiveness.value,
      difficulty
    };

    return new Question(questionData);
  }

  /**
   * Generate balanced question set
   */
  async generateBalancedQuestions(count: number, difficulty: DifficultyLevel): Promise<Question[]> {
    const options: QuestionGenerationOptions = {
      count,
      difficulty,
      minEffectivenessVariety: Math.min(3, Math.max(1, Math.floor(count / 3))), // More reasonable variety
      allowDuplicates: false
    };

    const result = await this.generateQuestionsWithOptions(options);
    return result.questions;
  }

  /**
   * Generate questions focusing on specific types
   */
  async generateFocusedQuestions(focusTypes: TypeId[], count: number, difficulty: DifficultyLevel): Promise<Question[]> {
    const options: QuestionGenerationOptions = {
      count,
      difficulty,
      focusTypes,
      allowDuplicates: true, // Allow duplicates for focused generation to increase success rate
      minEffectivenessVariety: 1 // Relax variety requirement
    };

    const result = await this.generateQuestionsWithOptions(options);
    return result.questions;
  }

  /**
   * Generate questions with specific effectiveness outcomes
   */
  async generateQuestionsWithEffectiveness(
    targetEffectiveness: string[],
    count: number,
    difficulty: DifficultyLevel
  ): Promise<Question[]> {
    const questions: Question[] = [];
    const availableTypes = await this.getTypesForDifficulty(difficulty);
    
    const questionsPerEffectiveness = Math.ceil(count / targetEffectiveness.length);
    
    for (const effectiveness of targetEffectiveness) {
      let generated = 0;
      let attempts = 0;
      const maxAttempts = 1000;

      while (generated < questionsPerEffectiveness && questions.length < count && attempts < maxAttempts) {
        attempts++;
        
        try {
          const questionData = await this.generateSingleQuestionData(difficulty, availableTypes, []);
          
          if (questionData.correctAnswer === effectiveness) {
            const question = new Question(questionData);
            questions.push(question);
            generated++;
          }
        } catch (error) {
          continue;
        }
      }
    }

    if (questions.length === 0) {
      throw new Error(`Could not generate questions with target effectiveness: ${targetEffectiveness.join(', ')}`);
    }

    return questions.slice(0, count);
  }

  /**
   * Validate question generation parameters
   */
  async validateGenerationConfig(config: GameConfig): Promise<boolean> {
    if (!config) {
      throw new Error('Game configuration is required');
    }

    if (!config.difficulty) {
      throw new Error('Difficulty is required');
    }

    const validDifficulties: DifficultyLevel[] = ['easy', 'normal', 'hard'];
    if (!validDifficulties.includes(config.difficulty)) {
      throw new Error(`Invalid difficulty: ${config.difficulty}`);
    }

    if (!config.questionCount || config.questionCount <= 0) {
      throw new Error('Question count must be positive');
    }

    if (config.questionCount > 100) {
      throw new Error('Question count cannot exceed 100');
    }

    return true;
  }

  /**
   * Get generation statistics
   */
  async getGenerationStatistics(): Promise<{
    totalQuestionsGenerated: number;
    generationsByDifficulty: Record<DifficultyLevel, number>;
    averageGenerationTime: number;
    mostUsedTypes: TypeId[];
    leastUsedTypes: TypeId[];
    effectivenessDistribution: Record<string, number>;
  }> {
    const allTypes = await this.typeRepository.getAllTypes();
    const allTypeIds = allTypes.map(type => type.id as TypeId);
    
    // Find most and least used types
    const sortedByUsage = Array.from(this.generationStats.typeUsageCount.entries())
      .sort(([, a], [, b]) => b - a);
    
    const mostUsedTypes = sortedByUsage.slice(0, 5).map(([type]) => type);
    const leastUsedTypes = allTypeIds
      .filter(type => !this.generationStats.typeUsageCount.has(type))
      .concat(sortedByUsage.slice(-5).map(([type]) => type))
      .slice(0, 5);

    return {
      totalQuestionsGenerated: this.generationStats.totalGenerated,
      generationsByDifficulty: { ...this.generationStats.generationsByDifficulty },
      averageGenerationTime: this.generationStats.totalGenerated > 0 
        ? this.generationStats.totalGenerationTime / this.generationStats.totalGenerated 
        : 0,
      mostUsedTypes,
      leastUsedTypes,
      effectivenessDistribution: Object.fromEntries(this.generationStats.effectivenessCount)
    };
  }

  /**
   * Estimate generation time for given parameters
   */
  async estimateGenerationTime(count: number, difficulty: DifficultyLevel): Promise<number> {
    const baseTimePerQuestion = 10; // Base time in milliseconds
    const difficultyMultiplier = difficulty === 'hard' ? 2 : difficulty === 'normal' ? 1.5 : 1;
    
    return Math.ceil(count * baseTimePerQuestion * difficultyMultiplier);
  }

  /**
   * Check if specific matchup is valid for difficulty
   */
  async isValidMatchupForDifficulty(
    attackingType: TypeId,
    defendingTypes: TypeId[],
    difficulty: DifficultyLevel
  ): Promise<boolean> {
    if (difficulty === 'hard') {
      return defendingTypes.length === 2;
    } else {
      return defendingTypes.length === 1;
    }
  }

  /**
   * Get available matchups for difficulty level
   */
  async getAvailableMatchups(difficulty: DifficultyLevel, limit?: number): Promise<{
    attacking: TypeId;
    defending: TypeId[];
  }[]> {
    const availableTypes = await this.getTypesForDifficulty(difficulty);
    const matchups: { attacking: TypeId; defending: TypeId[] }[] = [];

    for (const attackingType of availableTypes) {
      if (difficulty === 'hard') {
        // Generate dual-type combinations
        for (let i = 0; i < availableTypes.length; i++) {
          for (let j = i + 1; j < availableTypes.length; j++) {
            matchups.push({
              attacking: attackingType.id as TypeId,
              defending: [availableTypes[i].id as TypeId, availableTypes[j].id as TypeId]
            });
          }
        }
      } else {
        // Generate single-type combinations
        for (const defendingType of availableTypes) {
          matchups.push({
            attacking: attackingType.id as TypeId,
            defending: [defendingType.id as TypeId]
          });
        }
      }
    }

    // Shuffle and limit results
    const shuffled = this.shuffleArray(matchups);
    return limit ? shuffled.slice(0, limit) : shuffled;
  }

  /**
   * Reset generation statistics and cache
   */
  async reset(): Promise<void> {
    this.generationStats = {
      totalGenerated: 0,
      generationsByDifficulty: { easy: 0, normal: 0, hard: 0 },
      totalGenerationTime: 0,
      typeUsageCount: new Map(),
      effectivenessCount: new Map()
    };
  }

  /**
   * Generate single question data
   */
  private async generateSingleQuestionData(
    difficulty: DifficultyLevel,
    availableTypes: any[],
    excludeTypes: TypeId[]
  ): Promise<QuestionData> {
    const filteredTypes = availableTypes.filter(type => 
      !excludeTypes.includes(type.id as TypeId)
    );

    if (filteredTypes.length === 0) {
      throw new Error('No types available after filtering');
    }

    // Select random attacking type
    const attackingType = this.selectRandomType(filteredTypes);
    
    // Select defending type(s) based on difficulty
    const defendingTypes = difficulty === 'hard' 
      ? this.selectRandomDualTypes(filteredTypes)
      : [this.selectRandomType(filteredTypes)];

    // Calculate correct answer
    const effectiveness = this.typeEffectivenessService.calculateEffectiveness(
      attackingType.id as TypeId, 
      defendingTypes.map(t => t.id as TypeId)
    );

    return {
      id: Question.generateId(attackingType.id as TypeId, defendingTypes.map(t => t.id as TypeId)),
      attackingType: attackingType.id as TypeId,
      defendingType: defendingTypes.map(t => t.id as TypeId),
      correctAnswer: effectiveness.value,
      difficulty
    };
  }

  /**
   * Get types available for difficulty level
   */
  private async getTypesForDifficulty(
    difficulty: DifficultyLevel,
    focusTypes?: TypeId[],
    excludeTypes?: TypeId[]
  ) {
    let availableTypes = await this.typeRepository.getTypesForDifficulty(difficulty);

    if (focusTypes && focusTypes.length > 0) {
      const focusTypeObjects = await this.typeRepository.getTypesByIds(focusTypes);
      availableTypes = focusTypeObjects;
    }

    if (excludeTypes && excludeTypes.length > 0) {
      availableTypes = availableTypes.filter(type => 
        !excludeTypes.includes(type.id as TypeId)
      );
    }

    return availableTypes;
  }

  /**
   * Select random type from available types
   */
  private selectRandomType(types: any[]): any {
    return types[Math.floor(Math.random() * types.length)];
  }

  /**
   * Select two different random types for dual-type
   */
  private selectRandomDualTypes(types: any[]): any[] {
    if (types.length < 2) {
      throw new Error('Need at least 2 types to generate dual-type question');
    }

    const first = this.selectRandomType(types);
    const remaining = types.filter(type => type.id !== first.id);
    const second = this.selectRandomType(remaining);

    return [first, second];
  }

  /**
   * Update generation statistics
   */
  private updateStatistics(
    options: QuestionGenerationOptions,
    questions: Question[],
    generationTime: number,
    typesUsed: TypeId[]
  ): void {
    this.generationStats.totalGenerated += questions.length;
    this.generationStats.generationsByDifficulty[options.difficulty] += questions.length;
    this.generationStats.totalGenerationTime += generationTime;

    // Update type usage
    for (const typeId of typesUsed) {
      const count = this.generationStats.typeUsageCount.get(typeId) || 0;
      this.generationStats.typeUsageCount.set(typeId, count + 1);
    }

    // Update effectiveness distribution
    for (const question of questions) {
      const effectiveness = question.correctAnswer;
      const count = this.generationStats.effectivenessCount.get(effectiveness) || 0;
      this.generationStats.effectivenessCount.set(effectiveness, count + 1);
    }
  }

  /**
   * Shuffle array using Fisher-Yates algorithm
   */
  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  /**
   * Set seed for pseudo-random generation (simplified implementation)
   */
  private setSeed(seed: string): void {
    // Simple seed-based pseudo-random implementation
    // In a real implementation, you might want to use a proper PRNG library
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      const char = seed.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    
    // Override Math.random with seeded version (simplified)
    // Note: This is a basic implementation for demonstration
    Math.random = () => {
      hash = ((hash * 9301) + 49297) % 233280;
      return hash / 233280;
    };
  }
}
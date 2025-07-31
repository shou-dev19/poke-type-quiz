/**
 * Question Management Use Case Implementation
 * Handles question searching, filtering, validation, and metadata operations
 */

import type {
  IQuestionManagementUseCase,
  SearchQuestionsRequest,
  SearchQuestionsResponse,
  GetQuestionDetailRequest,
  GetQuestionDetailResponse,
  GetQuestionStatisticsRequest,
  GetQuestionStatisticsResponse,
  ValidateQuestionRequest,
  ValidateQuestionResponse,
  GetSimilarQuestionsRequest,
  GetSimilarQuestionsResponse,
  GetQuestionPoolRequest,
  GetQuestionPoolResponse,
  QuestionSummaryDTO,
  QuestionDetailDTO
} from '@/application/interfaces/QuestionManagementInterfaces';

import type { 
  IQuestionGeneratorService, 
  ITypeEffectivenessService,
  ITypeRepository 
} from '@/domain/services';
import { Question } from '@/domain/entities/Question';
import { TypeEffectiveness } from '@/domain/entities/TypeEffectiveness';
import type { TypeId, DifficultyLevel } from '@/domain/types';

/**
 * Question Management Use Case
 * Provides comprehensive question management capabilities
 */
export class QuestionManagementUseCase implements IQuestionManagementUseCase {
  // Cache for frequently accessed data
  private questionCache: Map<string, Question> = new Map();
  private statisticsCache: Map<string, any> = new Map();
  private cacheExpiry: Map<string, number> = new Map();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  constructor(
    private readonly questionGenerator: IQuestionGeneratorService,
    private readonly typeEffectivenessService: ITypeEffectivenessService,
    private readonly typeRepository: ITypeRepository
  ) {}

  /**
   * Search for questions with various filters
   */
  async searchQuestions(request: SearchQuestionsRequest): Promise<SearchQuestionsResponse> {
    // Set defaults
    const page = request.page || 1;
    const limit = Math.min(request.limit || 20, 100); // Max 100 per page
    const offset = (page - 1) * limit;

    // Generate a small pool of questions to search from
    const poolSize = Math.min(30, Math.max(15, limit * 2)); // Small, realistic pool size
    const generationOptions = {
      count: poolSize,
      difficulty: request.difficulty || 'normal',
      focusTypes: request.attackingType ? [request.attackingType] : [],
      excludeTypes: [],
      allowDuplicates: true, // Allow duplicates to meet count requirements
      minEffectivenessVariety: 1 // Minimal variety requirement
    };

    const generationResult = await this.questionGenerator.generateQuestionsWithOptions(generationOptions);
    let questions = generationResult.questions;

    // Apply filters
    questions = this.applyFilters(questions, request);

    // Apply text search
    if (request.searchText) {
      const searchLower = request.searchText.toLowerCase();
      questions = questions.filter(q => 
        q.getQuestionText().toLowerCase().includes(searchLower) ||
        q.attackingType.toLowerCase().includes(searchLower) ||
        q.defendingType.some(t => t.toLowerCase().includes(searchLower))
      );
    }

    // Apply sorting
    questions = this.applySorting(questions, request.sortBy, request.sortOrder);

    // Calculate pagination
    const totalCount = questions.length;
    const totalPages = Math.ceil(totalCount / limit);
    const paginatedQuestions = questions.slice(offset, offset + limit);

    // Convert to DTOs
    const questionDTOs = await Promise.all(
      paginatedQuestions.map(q => this.convertToSummaryDTO(q))
    );

    return {
      questions: questionDTOs,
      totalCount,
      currentPage: page,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1
    };
  }

  /**
   * Get detailed information about a specific question
   */
  async getQuestionDetail(request: GetQuestionDetailRequest): Promise<GetQuestionDetailResponse> {
    // Try to get from cache first
    let question = this.questionCache.get(request.questionId);
    
    if (!question) {
      // Generate a single question with the given ID characteristics
      // Since we can't lookup by ID directly, we'll generate and find similar
      throw new Error('Question detail lookup requires implementation of question persistence');
    }

    const questionDetailDTO = await this.convertToDetailDTO(question);

    return {
      question: questionDetailDTO
    };
  }

  /**
   * Get question generation statistics
   */
  async getQuestionStatistics(request: GetQuestionStatisticsRequest): Promise<GetQuestionStatisticsResponse> {
    const cacheKey = `stats_${JSON.stringify(request)}`;
    
    // Check cache
    if (this.isValidCache(cacheKey)) {
      return this.statisticsCache.get(cacheKey);
    }

    // Generate sample questions for statistics
    const sampleSize = 20;
    const difficulty = request.difficulty || 'normal';
    
    const generationOptions = {
      count: sampleSize,
      difficulty,
      focusTypes: request.typeFilter?.attackingType ? [request.typeFilter.attackingType] : [],
      excludeTypes: [],
      allowDuplicates: true,
      minEffectivenessVariety: 1
    };

    const startTime = Date.now();
    const generationResult = await this.questionGenerator.generateQuestionsWithOptions(generationOptions);
    const generationTime = Date.now() - startTime;

    // Analyze the generated questions
    const statistics = this.analyzeQuestions(generationResult.questions, Math.max(1, generationTime));

    // Cache the results
    this.cacheResults(cacheKey, statistics);

    return statistics;
  }

  /**
   * Validate a question configuration before generation
   */
  async validateQuestion(request: ValidateQuestionRequest): Promise<ValidateQuestionResponse> {
    const errors: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];

    // Validate types exist
    const allTypes = await this.typeRepository.getAllTypes();
    const typeIds = allTypes.map(t => t.id);

    if (!typeIds.includes(request.attackingType)) {
      errors.push(`Invalid attacking type: ${request.attackingType}`);
    }

    for (const defendingType of request.defendingType) {
      if (!typeIds.includes(defendingType)) {
        errors.push(`Invalid defending type: ${defendingType}`);
      }
    }

    // Validate defending type count
    if (request.defendingType.length === 0) {
      errors.push('At least one defending type is required');
    } else if (request.defendingType.length > 2) {
      errors.push('Maximum of 2 defending types allowed');
    }

    // Check for duplicate defending types
    if (request.defendingType.length !== new Set(request.defendingType).size) {
      errors.push('Duplicate defending types are not allowed');
    }

    if (errors.length > 0) {
      return {
        isValid: false,
        errors,
        warnings,
        suggestions,
        estimatedDifficulty: request.difficulty,
        calculatedEffectiveness: 'UNKNOWN'
      };
    }

    // Calculate effectiveness
    const calculatedEffectiveness = this.typeEffectivenessService.calculateEffectiveness(
      request.attackingType,
      request.defendingType
    );

    // Estimate difficulty
    const estimatedDifficulty = this.estimateDifficulty(
      request.attackingType,
      request.defendingType,
      calculatedEffectiveness
    );

    // Generate warnings and suggestions
    if (estimatedDifficulty !== request.difficulty) {
      warnings.push(
        `Estimated difficulty (${estimatedDifficulty}) differs from requested (${request.difficulty})`
      );
    }

    if (request.defendingType.length === 1 && request.difficulty === 'hard') {
      suggestions.push('Consider using dual-type defenders for hard difficulty questions');
    }

    if (calculatedEffectiveness.isNeutral() && request.difficulty === 'easy') {
      suggestions.push('Neutral effectiveness might be too complex for easy difficulty');
    }

    return {
      isValid: true,
      errors,
      warnings,
      suggestions,
      estimatedDifficulty,
      calculatedEffectiveness: calculatedEffectiveness.value
    };
  }

  /**
   * Find questions similar to given type combination
   */
  async getSimilarQuestions(request: GetSimilarQuestionsRequest): Promise<GetSimilarQuestionsResponse> {
    const generationOptions = {
      count: Math.min(15, Math.max(10, (request.limit || 5) * 2)),
      difficulty: request.difficulty || 'normal',
      focusTypes: [request.attackingType],
      excludeTypes: [],
      allowDuplicates: true,
      minEffectivenessVariety: 1
    };

    const generationResult = await this.questionGenerator.generateQuestionsWithOptions(generationOptions);
    
    // Find similar questions and calculate match reasons
    const similarityResults = this.findSimilarQuestions(
      generationResult.questions,
      request.attackingType,
      request.defendingType,
      request.difficulty
    );

    // Limit results
    const limitedResults = similarityResults.slice(0, request.limit || 10);

    const questionDTOs = await Promise.all(
      limitedResults.map(result => this.convertToSummaryDTO(result.question))
    );

    const matchReasons = limitedResults.map(result => ({
      questionId: result.question.getId(),
      reasons: result.reasons
    }));

    return {
      similarQuestions: questionDTOs,
      matchReasons
    };
  }

  /**
   * Generate a pool of questions with specific criteria
   */
  async getQuestionPool(request: GetQuestionPoolRequest): Promise<GetQuestionPoolResponse> {
    const startTime = Date.now();

    const generationOptions = {
      count: request.poolSize,
      difficulty: request.difficulty,
      focusTypes: request.focusTypes || [],
      excludeTypes: request.excludeTypes || [],
      seed: request.seed || undefined,
      allowDuplicates: true, // Allow duplicates to meet requirements
      minEffectivenessVariety: 1 // Minimal variety to avoid generation failures
    };

    const generationResult = await this.questionGenerator.generateQuestionsWithOptions(generationOptions);
    const generationTime = Date.now() - startTime;

    // Convert to DTOs
    const questionDTOs = await Promise.all(
      generationResult.questions.map(q => this.convertToSummaryDTO(q))
    );

    // Calculate metadata
    const poolMetadata = {
      requestedSize: request.poolSize,
      actualSize: generationResult.questions.length,
      difficultyDistribution: this.calculateDifficultyDistribution(generationResult.questions),
      effectivenessDistribution: generationResult.metadata.effectivenessDistribution,
      typeDistribution: this.calculateTypeDistribution(generationResult.questions),
      duplicatesRemoved: generationResult.metadata.duplicatesRemoved || 0,
      generationTime: Math.max(1, generationTime)
    };

    return {
      questions: questionDTOs,
      poolMetadata
    };
  }

  /**
   * Apply filters to question list
   */
  private applyFilters(questions: Question[], request: SearchQuestionsRequest): Question[] {
    let filtered = questions;

    if (request.difficulty) {
      filtered = filtered.filter(q => q.difficulty === request.difficulty);
    }

    if (request.attackingType) {
      filtered = filtered.filter(q => q.attackingType === request.attackingType);
    }

    if (request.defendingTypes && request.defendingTypes.length > 0) {
      filtered = filtered.filter(q => 
        request.defendingTypes!.every(type => q.defendingType.includes(type))
      );
    }

    if (request.effectiveness) {
      filtered = filtered.filter(q => {
        const effectiveness = this.typeEffectivenessService.calculateEffectiveness(
          q.attackingType as TypeId,
          q.defendingType as TypeId[]
        );
        return effectiveness.value === request.effectiveness;
      });
    }

    return filtered;
  }

  /**
   * Apply sorting to question list
   */
  private applySorting(
    questions: Question[], 
    sortBy?: string, 
    sortOrder: 'asc' | 'desc' = 'asc'
  ): Question[] {
    if (!sortBy) return questions;

    const multiplier = sortOrder === 'desc' ? -1 : 1;

    return questions.sort((a, b) => {
      switch (sortBy) {
        case 'difficulty':
          const difficultyOrder = { easy: 1, normal: 2, hard: 3 };
          return (difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]) * multiplier;
        
        case 'attackingType':
          return a.attackingType.localeCompare(b.attackingType) * multiplier;
        
        case 'defendingType':
          return a.defendingType.join(',').localeCompare(b.defendingType.join(',')) * multiplier;
        
        default:
          return 0;
      }
    });
  }

  /**
   * Find similar questions to given type combination
   */
  private findSimilarQuestions(
    questions: Question[],
    attackingType: TypeId,
    defendingTypes: TypeId[],
    difficulty?: DifficultyLevel
  ): Array<{
    question: Question;
    reasons: ('same_attacking_type' | 'same_defending_type' | 'same_effectiveness' | 'same_difficulty')[];
  }> {
    const targetEffectiveness = this.typeEffectivenessService.calculateEffectiveness(
      attackingType,
      defendingTypes
    );

    return questions.map(question => {
      const reasons: ('same_attacking_type' | 'same_defending_type' | 'same_effectiveness' | 'same_difficulty')[] = [];

      if (question.attackingType === attackingType) {
        reasons.push('same_attacking_type');
      }

      if (question.defendingType.some(t => defendingTypes.includes(t as TypeId))) {
        reasons.push('same_defending_type');
      }

      const questionEffectiveness = this.typeEffectivenessService.calculateEffectiveness(
        question.attackingType as TypeId,
        question.defendingType as TypeId[]
      );

      if (questionEffectiveness.value === targetEffectiveness.value) {
        reasons.push('same_effectiveness');
      }

      if (difficulty && question.difficulty === difficulty) {
        reasons.push('same_difficulty');
      }

      return { question, reasons };
    })
    .filter(result => result.reasons.length > 0)
    .sort((a, b) => b.reasons.length - a.reasons.length);
  }

  /**
   * Analyze questions to generate statistics
   */
  private analyzeQuestions(questions: Question[], generationTime: number): GetQuestionStatisticsResponse {
    const difficultyDistribution: Record<DifficultyLevel, number> = {
      easy: 0,
      normal: 0,
      hard: 0
    };

    const attackingTypes: Record<string, number> = {};
    const defendingTypes: Record<string, number> = {};
    const effectivenessDistribution: Record<string, number> = {};
    const typeMatches: Array<{ attackingType: string; defendingType: string[]; count: number }> = [];

    for (const question of questions) {
      // Difficulty distribution
      difficultyDistribution[question.difficulty]++;

      // Type distribution
      attackingTypes[question.attackingType] = (attackingTypes[question.attackingType] || 0) + 1;
      
      for (const defendingType of question.defendingType) {
        defendingTypes[defendingType] = (defendingTypes[defendingType] || 0) + 1;
      }

      // Effectiveness distribution
      const effectiveness = this.typeEffectivenessService.calculateEffectiveness(
        question.attackingType as TypeId,
        question.defendingType as TypeId[]
      );
      effectivenessDistribution[effectiveness.value] = (effectivenessDistribution[effectiveness.value] || 0) + 1;

      // Type matches
      const matchKey = `${question.attackingType}-${question.defendingType.join(',')}`;
      const existingMatch = typeMatches.find(m => 
        m.attackingType === question.attackingType && 
        JSON.stringify(m.defendingType) === JSON.stringify(question.defendingType)
      );
      
      if (existingMatch) {
        existingMatch.count++;
      } else {
        typeMatches.push({
          attackingType: question.attackingType,
          defendingType: [...question.defendingType],
          count: 1
        });
      }
    }

    return {
      totalQuestions: questions.length,
      difficultyDistribution,
      typeDistribution: {
        attackingTypes,
        defendingTypes,
        typeMatches
      },
      effectivenessDistribution,
      averageGenerationTime: generationTime / questions.length
    };
  }

  /**
   * Estimate difficulty based on type combination and effectiveness
   */
  private estimateDifficulty(
    attackingType: TypeId,
    defendingTypes: TypeId[],
    effectiveness: TypeEffectiveness
  ): DifficultyLevel {
    let complexityScore = 0;

    // Dual type increases complexity
    if (defendingTypes.length === 2) {
      complexityScore += 2;
    }

    // Neutral effectiveness is harder to remember
    if (effectiveness.isNeutral()) {
      complexityScore += 1;
    }

    // Extreme effectiveness (0x, 4x) might be easier due to memorability
    if (effectiveness.multiplier === 0 || effectiveness.multiplier === 4) {
      complexityScore -= 1;
    }

    // Common type combinations are easier
    const commonTypes = ['fire', 'water', 'grass', 'electric', 'normal'];
    if (commonTypes.includes(attackingType) && 
        defendingTypes.every(t => commonTypes.includes(t))) {
      complexityScore -= 1;
    }

    if (complexityScore <= 0) return 'easy';
    if (complexityScore <= 2) return 'normal';
    return 'hard';
  }

  /**
   * Convert Question to Summary DTO
   */
  private async convertToSummaryDTO(question: Question): Promise<QuestionSummaryDTO> {
    const effectiveness = this.typeEffectivenessService.calculateEffectiveness(
      question.attackingType as TypeId,
      question.defendingType as TypeId[]
    );

    return {
      id: question.getId(),
      attackingType: question.attackingType,
      defendingType: [...question.defendingType],
      difficulty: question.difficulty,
      effectiveness: effectiveness.value,
      effectivenessMultiplier: effectiveness.multiplier,
      questionText: question.getQuestionText(),
      createdAt: new Date(),
      tags: this.generateQuestionTags(question, effectiveness)
    };
  }

  /**
   * Convert Question to Detail DTO
   */
  private async convertToDetailDTO(question: Question): Promise<QuestionDetailDTO> {
    const summaryDTO = await this.convertToSummaryDTO(question);
    const effectiveness = this.typeEffectivenessService.calculateEffectiveness(
      question.attackingType as TypeId,
      question.defendingType as TypeId[]
    );

    const choices = TypeEffectiveness.getAllValues().map(eff => ({
      value: eff.value,
      label: eff.displayText,
      description: eff.description,
      multiplier: eff.multiplier
    }));

    return {
      ...summaryDTO,
      correctAnswer: question.correctAnswer,
      explanation: `${question.attackingType}タイプの技は${question.defendingType.join('・')}タイプに対して${effectiveness.displayText}（${effectiveness.multiplier}倍）です。`,
      choices,
      metadata: {
        generationMethod: 'automatic',
        generationTime: 0,
        typeCompatibility: {
          isMonoType: question.defendingType.length === 1,
          isDualType: question.defendingType.length === 2,
          hasResistance: effectiveness.multiplier < 1,
          hasWeakness: effectiveness.multiplier > 1,
          hasImmunity: effectiveness.multiplier === 0
        },
        difficultyFactors: {
          typeComplexity: question.defendingType.length === 2 ? 0.8 : 0.5,
          effectivenessClarity: effectiveness.isNeutral() ? 0.3 : 0.7,
          commonKnowledge: 0.5
        }
      }
    };
  }

  /**
   * Generate tags for a question
   */
  private generateQuestionTags(question: Question, effectiveness: TypeEffectiveness): string[] {
    const tags: string[] = [];

    tags.push(question.difficulty);
    tags.push(question.attackingType);
    question.defendingType.forEach(type => tags.push(type));

    if (effectiveness.multiplier > 1) tags.push('super-effective');
    else if (effectiveness.multiplier < 1) tags.push('not-very-effective');
    else tags.push('normal-effective');

    if (question.defendingType.length === 2) tags.push('dual-type');
    else tags.push('mono-type');

    return tags;
  }

  /**
   * Calculate difficulty distribution
   */
  private calculateDifficultyDistribution(questions: Question[]): Record<DifficultyLevel, number> {
    const distribution: Record<DifficultyLevel, number> = { easy: 0, normal: 0, hard: 0 };
    
    for (const question of questions) {
      distribution[question.difficulty]++;
    }

    return distribution;
  }

  /**
   * Calculate type distribution
   */
  private calculateTypeDistribution(questions: Question[]): Record<string, number> {
    const distribution: Record<string, number> = {};

    for (const question of questions) {
      distribution[question.attackingType] = (distribution[question.attackingType] || 0) + 1;
      
      for (const defendingType of question.defendingType) {
        distribution[defendingType] = (distribution[defendingType] || 0) + 1;
      }
    }

    return distribution;
  }

  /**
   * Check if cache entry is valid
   */
  private isValidCache(key: string): boolean {
    const expiry = this.cacheExpiry.get(key);
    return expiry ? Date.now() < expiry : false;
  }

  /**
   * Cache results with TTL
   */
  private cacheResults(key: string, data: any): void {
    this.statisticsCache.set(key, data);
    this.cacheExpiry.set(key, Date.now() + this.CACHE_TTL);
  }
}
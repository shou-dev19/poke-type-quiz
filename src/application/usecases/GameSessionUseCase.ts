/**
 * Game Session Use Case Implementation
 * Manages game sessions, including creation, progression, and completion
 */

import type { 
  IGameSessionUseCase,
  CreateGameSessionRequest,
  CreateGameSessionResponse,
  StartGameRequest,
  StartGameResponse,
  SubmitAnswerRequest,
  SubmitAnswerResponse,
  GetCurrentQuestionRequest,
  GetCurrentQuestionResponse,
  GetGameStatusRequest,
  GetGameStatusResponse,
  EndGameRequest,
  EndGameResponse,
  ResetGameRequest,
  ResetGameResponse,
  QuestionDTO,
  EffectivenessChoiceDTO,
  GameResultsDTO,
  UserAnswerDTO
} from '@/application/interfaces/GameSessionInterfaces';

import type { IQuestionGeneratorService, ITypeEffectivenessService } from '@/domain/services';
import { GameState } from '@/domain/entities/GameState';
import { Question } from '@/domain/entities/Question';
import { TypeEffectiveness } from '@/domain/entities/TypeEffectiveness';
import type { TypeId, DifficultyLevel, GameConfig } from '@/domain/types';

/**
 * Game Session Use Case
 * Orchestrates game flow and manages session state
 */
export class GameSessionUseCase implements IGameSessionUseCase {
  private readonly sessions: Map<string, GameState> = new Map();
  private readonly sessionMetadata: Map<string, any> = new Map();

  constructor(
    private readonly questionGenerator: IQuestionGeneratorService,
    private readonly typeEffectivenessService: ITypeEffectivenessService
  ) {}

  /**
   * Create a new game session
   */
  async createSession(request: CreateGameSessionRequest): Promise<CreateGameSessionResponse> {
    // Validate request
    this.validateCreateSessionRequest(request);

    // Generate session ID
    const sessionId = this.generateSessionId();

    // Create game configuration
    const config: GameConfig = {
      difficulty: request.difficulty,
      questionCount: request.questionCount
    };

    // Generate questions
    const generationOptions = {
      count: request.questionCount,
      difficulty: request.difficulty,
      focusTypes: request.focusTypes as TypeId[],
      excludeTypes: request.excludeTypes as TypeId[],
      seed: request.seed,
      allowDuplicates: false,
      minEffectivenessVariety: Math.min(3, Math.max(1, Math.floor(request.questionCount / 3)))
    };

    const generationResult = await this.questionGenerator.generateQuestionsWithOptions(generationOptions);

    // Create game state
    const gameState = new GameState(config, generationResult.questions);

    // Store session
    this.sessions.set(sessionId, gameState);
    this.sessionMetadata.set(sessionId, {
      createdAt: new Date(),
      lastAccessed: new Date(),
      generationMetadata: generationResult.metadata
    });

    // Estimate completion time
    const estimatedTime = await this.questionGenerator.estimateGenerationTime(
      request.questionCount, 
      request.difficulty
    );

    return {
      sessionId,
      config: {
        difficulty: request.difficulty,
        questionCount: request.questionCount,
        estimatedTime
      },
      metadata: {
        totalQuestions: generationResult.questions.length,
        typesUsed: generationResult.metadata.typesUsed,
        effectivenessDistribution: generationResult.metadata.effectivenessDistribution
      }
    };
  }

  /**
   * Start an existing game session
   */
  async startGame(request: StartGameRequest): Promise<StartGameResponse> {
    const gameState = this.getSessionOrThrow(request.sessionId);

    // Start the game
    gameState.start();
    this.updateSessionAccess(request.sessionId);

    // Get current question
    const currentQuestion = gameState.getCurrentQuestion();
    if (!currentQuestion) {
      throw new Error('No questions available to start the game');
    }

    const questionDTO = this.convertQuestionToDTO(currentQuestion);

    return {
      sessionId: request.sessionId,
      startTime: gameState.getStartTime()!,
      currentQuestion: questionDTO,
      progress: {
        currentQuestionNumber: gameState.getCurrentQuestionNumber(),
        totalQuestions: gameState.getTotalQuestions(),
        progressPercentage: gameState.getProgress()
      }
    };
  }

  /**
   * Submit an answer for the current question
   */
  async submitAnswer(request: SubmitAnswerRequest): Promise<SubmitAnswerResponse> {
    const gameState = this.getSessionOrThrow(request.sessionId);
    this.updateSessionAccess(request.sessionId);

    // Get current question before submitting answer
    const currentQuestion = gameState.getCurrentQuestion();
    if (!currentQuestion) {
      throw new Error('No current question available');
    }

    // Convert answer string to TypeEffectiveness
    const answerEffectiveness = TypeEffectiveness.fromValue(request.answer as any);
    
    // Submit answer
    const isCorrect = gameState.submitAnswer(answerEffectiveness, request.timeSpent);

    // Prepare response
    const response: SubmitAnswerResponse = {
      sessionId: request.sessionId,
      isCorrect,
      correctAnswer: currentQuestion.correctAnswer,
      explanation: this.generateExplanation(currentQuestion, isCorrect),
      progress: {
        currentQuestionNumber: gameState.getCurrentQuestionNumber(),
        totalQuestions: gameState.getTotalQuestions(),
        progressPercentage: gameState.getProgress(),
        score: gameState.getScore(),
        accuracy: gameState.getAccuracy()
      },
      isGameCompleted: gameState.hasCompleted()
    };

    // Add next question if game is not completed
    if (!gameState.hasCompleted()) {
      const nextQuestion = gameState.getCurrentQuestion();
      if (nextQuestion) {
        response.nextQuestion = this.convertQuestionToDTO(nextQuestion);
      }
    } else {
      // Game completed, generate final results
      response.finalResults = await this.generateGameResults(request.sessionId, gameState);
    }

    return response;
  }

  /**
   * Get the current question
   */
  async getCurrentQuestion(request: GetCurrentQuestionRequest): Promise<GetCurrentQuestionResponse> {
    const gameState = this.getSessionOrThrow(request.sessionId);
    this.updateSessionAccess(request.sessionId);

    const currentQuestion = gameState.getCurrentQuestion();

    return {
      sessionId: request.sessionId,
      currentQuestion: currentQuestion ? this.convertQuestionToDTO(currentQuestion) : null,
      progress: {
        currentQuestionNumber: gameState.getCurrentQuestionNumber(),
        totalQuestions: gameState.getTotalQuestions(),
        progressPercentage: gameState.getProgress(),
        remainingQuestions: gameState.getRemainingQuestions()
      }
    };
  }

  /**
   * Get the current game status
   */
  async getGameStatus(request: GetGameStatusRequest): Promise<GetGameStatusResponse> {
    const gameState = this.getSessionOrThrow(request.sessionId);
    this.updateSessionAccess(request.sessionId);

    let status: 'not_started' | 'in_progress' | 'completed';
    if (gameState.hasCompleted()) {
      status = 'completed';
    } else if (gameState.hasStarted()) {
      status = 'in_progress';
    } else {
      status = 'not_started';
    }

    const response: GetGameStatusResponse = {
      sessionId: request.sessionId,
      status,
      config: {
        difficulty: gameState.getDifficulty(),
        questionCount: gameState.getTotalQuestions()
      },
      progress: {
        currentQuestionNumber: gameState.getCurrentQuestionNumber(),
        totalQuestions: gameState.getTotalQuestions(),
        progressPercentage: gameState.getProgress(),
        score: gameState.getScore(),
        accuracy: gameState.getAccuracy()
      },
      timing: {
        startTime: gameState.getStartTime(),
        endTime: gameState.getEndTime(),
        elapsedTime: gameState.getElapsedTime()
      },
      isCompleted: gameState.hasCompleted()
    };

    if (gameState.hasCompleted()) {
      response.results = await this.generateGameResults(request.sessionId, gameState);
    }

    return response;
  }

  /**
   * End the current game session
   */
  async endGame(request: EndGameRequest): Promise<EndGameResponse> {
    const gameState = this.getSessionOrThrow(request.sessionId);
    this.updateSessionAccess(request.sessionId);

    // Force complete the game if it's in progress
    if (gameState.isInProgress()) {
      // Complete remaining questions as unanswered
      while (!gameState.hasCompleted() && gameState.getCurrentQuestion()) {
        gameState.submitAnswer(TypeEffectiveness.NORMAL_EFFECTIVE, 0); // Default answer
      }
    }

    const results = await this.generateGameResults(request.sessionId, gameState);

    return {
      sessionId: request.sessionId,
      results
    };
  }

  /**
   * Reset the current game session
   */
  async resetGame(request: ResetGameRequest): Promise<ResetGameResponse> {
    const gameState = this.getSessionOrThrow(request.sessionId);
    
    gameState.reset();
    this.updateSessionAccess(request.sessionId);

    return {
      sessionId: request.sessionId,
      status: 'reset'
    };
  }

  /**
   * Check if a session exists and is valid
   */
  async sessionExists(sessionId: string): Promise<boolean> {
    return this.sessions.has(sessionId);
  }

  /**
   * Clean up expired sessions
   */
  async cleanupExpiredSessions(): Promise<number> {
    const expiredSessions: string[] = [];
    const expirationTime = 24 * 60 * 60 * 1000; // 24 hours
    const now = Date.now();

    for (const [sessionId, metadata] of this.sessionMetadata.entries()) {
      if (now - metadata.lastAccessed.getTime() > expirationTime) {
        expiredSessions.push(sessionId);
      }
    }

    // Remove expired sessions
    for (const sessionId of expiredSessions) {
      this.sessions.delete(sessionId);
      this.sessionMetadata.delete(sessionId);
    }

    return expiredSessions.length;
  }

  /**
   * Get session or throw error
   */
  private getSessionOrThrow(sessionId: string): GameState {
    const gameState = this.sessions.get(sessionId);
    if (!gameState) {
      throw new Error(`Session not found: ${sessionId}`);
    }
    return gameState;
  }

  /**
   * Update session access time
   */
  private updateSessionAccess(sessionId: string): void {
    const metadata = this.sessionMetadata.get(sessionId);
    if (metadata) {
      metadata.lastAccessed = new Date();
    }
  }

  /**
   * Generate unique session ID
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Validate create session request
   */
  private validateCreateSessionRequest(request: CreateGameSessionRequest): void {
    if (!request.difficulty) {
      throw new Error('Difficulty is required');
    }

    if (!request.questionCount || request.questionCount <= 0) {
      throw new Error('Question count must be positive');
    }

    if (request.questionCount > 100) {
      throw new Error('Question count cannot exceed 100');
    }

    const validDifficulties: DifficultyLevel[] = ['easy', 'normal', 'hard'];
    if (!validDifficulties.includes(request.difficulty)) {
      throw new Error(`Invalid difficulty: ${request.difficulty}`);
    }
  }

  /**
   * Convert Question entity to DTO
   */
  private convertQuestionToDTO(question: Question): QuestionDTO {
    return {
      id: question.getId(),
      attackingType: question.attackingType,
      defendingType: question.defendingType,
      difficulty: question.difficulty,
      questionText: question.getQuestionText(),
      choices: this.generateEffectivenessChoices(question.difficulty)
    };
  }

  /**
   * Generate effectiveness choices for question
   */
  private generateEffectivenessChoices(difficulty: DifficultyLevel): EffectivenessChoiceDTO[] {
    const allChoices = TypeEffectiveness.getAllValues();
    
    // For easy/normal, show fewer choices
    if (difficulty === 'easy') {
      return allChoices
        .filter(eff => ['HALF_EFFECTIVE', 'NORMAL_EFFECTIVE', 'SUPER_EFFECTIVE'].includes(eff.value))
        .map(eff => ({
          value: eff.value,
          label: eff.displayText,
          description: eff.description,
          multiplier: eff.multiplier
        }));
    }

    // For normal, exclude extreme values
    if (difficulty === 'normal') {
      return allChoices
        .filter(eff => !['NONE', 'ULTRA_EFFECTIVE'].includes(eff.value))
        .map(eff => ({
          value: eff.value,
          label: eff.displayText,
          description: eff.description,
          multiplier: eff.multiplier
        }));
    }

    // For hard, show all choices
    return allChoices.map(eff => ({
      value: eff.value,
      label: eff.displayText,
      description: eff.description,
      multiplier: eff.multiplier
    }));
  }

  /**
   * Generate explanation for answer
   */
  private generateExplanation(question: Question, isCorrect: boolean): string {
    const attackingType = question.attackingType;
    const defendingTypes = question.defendingType;
    const correctEffectiveness = question.getCorrectAnswerEffectiveness();

    if (isCorrect) {
      return `正解！${attackingType}タイプの技は${defendingTypes.join('・')}タイプに対して${correctEffectiveness.displayText}（${correctEffectiveness.multiplier}倍）です。`;
    } else {
      return `不正解。${attackingType}タイプの技は${defendingTypes.join('・')}タイプに対して${correctEffectiveness.displayText}（${correctEffectiveness.multiplier}倍）が正解です。`;
    }
  }

  /**
   * Generate final game results
   */
  private async generateGameResults(sessionId: string, gameState: GameState): Promise<GameResultsDTO> {
    const statistics = gameState.getStatistics();
    const userAnswers = gameState.getUserAnswers();

    // Convert user answers to DTOs
    const userAnswerDTOs: UserAnswerDTO[] = [];
    for (const userAnswer of userAnswers) {
      const question = gameState.getAllQuestions().find(q => q.getId() === userAnswer.questionId);
      if (question) {
        userAnswerDTOs.push({
          questionId: userAnswer.questionId,
          questionText: question.getQuestionText(),
          selectedAnswer: userAnswer.selectedAnswer,
          correctAnswer: question.correctAnswer,
          isCorrect: userAnswer.isCorrect,
          timeSpent: userAnswer.timeSpent,
          explanation: this.generateExplanation(question, userAnswer.isCorrect)
        });
      }
    }

    // Calculate performance rank
    const performance = this.calculatePerformance(statistics);

    return {
      sessionId,
      finalScore: gameState.getScore(),
      totalQuestions: gameState.getTotalQuestions(),
      accuracy: gameState.getAccuracy(),
      timeElapsed: gameState.getElapsedTime(),
      difficulty: gameState.getDifficulty(),
      statistics,
      userAnswers: userAnswerDTOs,
      performance
    };
  }

  /**
   * Calculate performance rank and feedback
   */
  private calculatePerformance(statistics: any): {
    rank: 'S' | 'A' | 'B' | 'C' | 'D';
    message: string;
    suggestions: string[];
  } {
    const accuracy = statistics.accuracy;
    
    let rank: 'S' | 'A' | 'B' | 'C' | 'D';
    let message: string;
    let suggestions: string[] = [];

    if (accuracy >= 90) {
      rank = 'S';
      message = '素晴らしい！完璧なタイプ相性の知識です。';
      suggestions = ['より高い難易度に挑戦してみましょう', '他のプレイヤーに教えてあげましょう'];
    } else if (accuracy >= 75) {
      rank = 'A';
      message = 'とても良くできました！タイプ相性をよく理解しています。';
      suggestions = ['苦手なタイプの組み合わせを重点的に学習しましょう', '複合タイプの相性に挑戦してみましょう'];
    } else if (accuracy >= 60) {
      rank = 'B';
      message = '良い結果です！基本的なタイプ相性は理解できています。';
      suggestions = ['基本タイプの相性を復習しましょう', 'より多くの問題に挑戦してみましょう'];
    } else if (accuracy >= 40) {
      rank = 'C';
      message = 'もう少し頑張りましょう。基本から復習することをお勧めします。';
      suggestions = ['基本的なタイプ相性表を確認しましょう', '易しい難易度から始めてみましょう'];
    } else {
      rank = 'D';
      message = 'タイプ相性の基本を学び直しましょう。';
      suggestions = ['タイプ相性の基本ルールを学習しましょう', '少ない問題数から始めてみましょう'];
    }

    return { rank, message, suggestions };
  }
}
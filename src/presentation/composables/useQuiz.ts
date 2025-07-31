import { ref, computed, inject } from 'vue';
import type { Application } from '@/application';
import type { DifficultyLevel } from '@/domain/types';

interface QuizConfig {
  difficulty: DifficultyLevel;
  questionCount: number;
}

interface GameSession {
  sessionId: string;
  config: any;
  progress: {
    currentQuestionNumber: number;
    totalQuestions: number;
    progressPercentage?: number;
    score: number;
  };
  status?: string;
}

interface Question {
  questionText: string;
  attackingType?: string;
  defendingType?: string;
  choices: Array<{
    value: string;
    label: string;
    description?: string;
    multiplier: number;
  }>;
}

export function useQuiz() {
  const app = inject<Application>('app')!;
  
  // State
  const isLoading = ref(false);
  const loadingMessage = ref('');
  const gameSession = ref<GameSession | null>(null);
  const currentQuestion = ref<Question | null>(null);
  const selectedAnswer = ref<string>('');
  const hasAnswered = ref(false);
  const isCorrect = ref(false);
  const correctAnswer = ref<string>('');
  const explanation = ref<string>('');
  const finalResults = ref<any>(null);
  
  // Computed
  const currentQuestionNumber = computed(() => 
    gameSession.value?.progress?.currentQuestionNumber || 1
  );
  
  const totalQuestions = computed(() => 
    gameSession.value?.config?.questionCount || 0
  );
  
  const progressPercentage = computed(() => {
    if (!gameSession.value?.progress) return 0;
    return (gameSession.value.progress.currentQuestionNumber - 1) / totalQuestions.value * 100;
  });
  
  const isLastQuestion = computed(() => 
    currentQuestionNumber.value >= totalQuestions.value
  );
  
  const isQuizCompleted = computed(() => 
    gameSession.value?.status === 'completed' || finalResults.value !== null
  );
  
  // Methods
  async function startQuiz(config: QuizConfig) {
    try {
      isLoading.value = true;
      loadingMessage.value = 'Creating quiz session...';

      const gameSessionUseCase = app.getGameSessionUseCase();
      
      // Create session
      const createResponse = await gameSessionUseCase.createSession({
        difficulty: config.difficulty,
        questionCount: config.questionCount
      });

      gameSession.value = {
        sessionId: createResponse.sessionId,
        config: createResponse.config,
        progress: {
          currentQuestionNumber: 1,
          totalQuestions: createResponse.config.questionCount,
          score: 0
        }
      };

      loadingMessage.value = 'Starting quiz...';

      // Start the game
      const startResponse = await gameSessionUseCase.startGame({
        sessionId: gameSession.value.sessionId
      });

      gameSession.value.progress = {
        currentQuestionNumber: startResponse.progress.currentQuestionNumber,
        totalQuestions: startResponse.progress.totalQuestions,
        progressPercentage: startResponse.progress.progressPercentage,
        score: 0
      };

      currentQuestion.value = startResponse.currentQuestion;
      
    } catch (error) {
      console.error('Failed to start quiz:', error);
      throw new Error('Failed to start quiz. Please try again.');
    } finally {
      isLoading.value = false;
    }
  }
  
  async function submitAnswer(answer: string) {
    if (hasAnswered.value) return;

    try {
      selectedAnswer.value = answer;
      hasAnswered.value = true;
      isLoading.value = true;
      loadingMessage.value = 'Checking answer...';

      const gameSessionUseCase = app.getGameSessionUseCase();
      
      const submitResponse = await gameSessionUseCase.submitAnswer({
        sessionId: gameSession.value!.sessionId,
        answer,
        timeSpent: 2000 // Mock time spent
      });

      isCorrect.value = submitResponse.isCorrect;
      correctAnswer.value = submitResponse.correctAnswer;
      explanation.value = submitResponse.explanation || '';

      // Update progress
      gameSession.value!.progress = submitResponse.progress;

      // Check if quiz is completed
      if (submitResponse.isGameCompleted && submitResponse.finalResults) {
        finalResults.value = submitResponse.finalResults;
        gameSession.value!.status = 'completed';
      } else if (submitResponse.nextQuestion) {
        // Queue next question
        setTimeout(() => {
          currentQuestion.value = submitResponse.nextQuestion;
        }, 100);
      }

    } catch (error) {
      console.error('Failed to submit answer:', error);
      throw new Error('Failed to submit answer. Please try again.');
    } finally {
      isLoading.value = false;
    }
  }
  
  async function nextQuestion() {
    if (!hasAnswered.value) return;

    try {
      isLoading.value = true;
      loadingMessage.value = 'Loading next question...';

      // If this was the last question, the quiz should be completed
      if (isLastQuestion.value && !finalResults.value) {
        const gameSessionUseCase = app.getGameSessionUseCase();
        const endResponse = await gameSessionUseCase.endGame({
          sessionId: gameSession.value!.sessionId
        });
        
        finalResults.value = endResponse.results;
        gameSession.value!.status = 'completed';
      }

      // Reset question state
      selectedAnswer.value = '';
      hasAnswered.value = false;
      isCorrect.value = false;
      correctAnswer.value = '';
      explanation.value = '';

    } catch (error) {
      console.error('Failed to proceed to next question:', error);
      throw new Error('Failed to load next question. Please try again.');
    } finally {
      isLoading.value = false;
    }
  }
  
  async function endQuiz() {
    try {
      isLoading.value = true;
      loadingMessage.value = 'Ending quiz...';

      const gameSessionUseCase = app.getGameSessionUseCase();
      const endResponse = await gameSessionUseCase.endGame({
        sessionId: gameSession.value!.sessionId
      });

      finalResults.value = endResponse.results;
      gameSession.value!.status = 'completed';

    } catch (error) {
      console.error('Failed to end quiz:', error);
      throw new Error('Failed to end quiz. Please try again.');
    } finally {
      isLoading.value = false;
    }
  }
  
  function resetQuiz() {
    gameSession.value = null;
    currentQuestion.value = null;
    selectedAnswer.value = '';
    hasAnswered.value = false;
    isCorrect.value = false;
    correctAnswer.value = '';
    explanation.value = '';
    finalResults.value = null;
    isLoading.value = false;
    loadingMessage.value = '';
  }
  
  return {
    // State
    isLoading,
    loadingMessage,
    gameSession,
    currentQuestion,
    selectedAnswer,
    hasAnswered,
    isCorrect,
    correctAnswer,
    explanation,
    finalResults,
    
    // Computed
    currentQuestionNumber,
    totalQuestions,
    progressPercentage,
    isLastQuestion,
    isQuizCompleted,
    
    // Methods
    startQuiz,
    submitAnswer,
    nextQuestion,
    endQuiz,
    resetQuiz
  };
}
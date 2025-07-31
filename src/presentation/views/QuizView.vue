<template>
  <div class="quiz-view">
    <!-- Quiz Setup (if no active session) -->
    <div v-if="!gameSession" class="max-w-2xl mx-auto">
      <div class="card">
        <div class="card-header">
          <h1 class="text-3xl font-bold text-gray-900">Start New Quiz</h1>
          <p class="text-gray-600 mt-2">
            Configure your quiz settings and test your Pokemon type knowledge
          </p>
        </div>

        <form @submit.prevent="startQuiz" class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Difficulty Level
            </label>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button
                v-for="level in difficultyLevels"
                :key="level.value"
                type="button"
                @click="quizConfig.difficulty = level.value"
                :class="[
                  'p-4 border-2 rounded-lg text-left transition-all',
                  quizConfig.difficulty === level.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                ]"
              >
                <div class="flex items-center mb-2">
                  <span class="text-2xl mr-2">{{ level.icon }}</span>
                  <span class="font-medium">{{ level.label }}</span>
                </div>
                <p class="text-sm text-gray-600">{{ level.description }}</p>
              </button>
            </div>
          </div>

          <div>
            <label for="questionCount" class="block text-sm font-medium text-gray-700 mb-2">
              Number of Questions: {{ quizConfig.questionCount }}
            </label>
            <input
              id="questionCount"
              v-model.number="quizConfig.questionCount"
              type="range"
              min="5"
              max="20"
              class="w-full"
            >
            <div class="flex justify-between text-sm text-gray-500 mt-1">
              <span>5</span>
              <span>20</span>
            </div>
          </div>

          <div class="flex gap-4">
            <button
              type="submit"
              :disabled="isLoading"
              class="btn btn-primary flex-1"
            >
              <span v-if="isLoading">Starting Quiz...</span>
              <span v-else>Start Quiz 🚀</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Active Quiz Session -->
    <div v-else class="max-w-4xl mx-auto">
      <!-- Progress Bar -->
      <div class="mb-8">
        <div class="flex justify-between items-center mb-2">
          <span class="text-sm font-medium text-gray-700">
            Question {{ currentQuestionNumber }} of {{ totalQuestions }}
          </span>
          <span class="text-sm text-gray-500">
            Score: {{ gameSession.progress?.score || 0 }}
          </span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div
            class="bg-blue-600 h-2 rounded-full transition-all duration-300"
            :style="{ width: `${progressPercentage}%` }"
          ></div>
        </div>
      </div>

      <!-- Current Question -->
      <div v-if="currentQuestion" class="quiz-question mb-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">
          {{ currentQuestion.questionText }}
        </h2>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            v-for="choice in currentQuestion.choices"
            :key="choice.value"
            @click="selectAnswer(choice.value)"
            :disabled="hasAnswered"
            :class="[
              'quiz-option',
              {
                'selected': selectedAnswer === choice.value && !hasAnswered,
                'correct': hasAnswered && choice.value === correctAnswer,
                'incorrect': hasAnswered && selectedAnswer === choice.value && choice.value !== correctAnswer
              }
            ]"
          >
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <div class="font-medium">{{ choice.label }}</div>
                <div class="text-sm text-gray-600 mt-1">{{ choice.description }}</div>
              </div>
              <div class="text-lg font-bold ml-4">
                {{ choice.multiplier }}x
              </div>
            </div>
          </button>
        </div>

        <div v-if="hasAnswered" class="mt-6 p-4 rounded-lg bg-gray-50">
          <div class="flex items-start">
            <div class="mr-3">
              {{ isCorrect ? '✅' : '❌' }}
            </div>
            <div>
              <p class="font-medium mb-2">
                {{ isCorrect ? 'Correct!' : 'Incorrect' }}
              </p>
              <p class="text-gray-700">{{ explanation }}</p>
            </div>
          </div>
        </div>

        <div class="mt-8 flex justify-between">
          <button
            @click="endQuiz"
            class="btn btn-secondary"
          >
            End Quiz
          </button>
          
          <button
            v-if="hasAnswered"
            @click="nextQuestion"
            :disabled="isLoading"
            class="btn btn-primary"
          >
            {{ isLastQuestion ? 'Finish Quiz' : 'Next Question' }} →
          </button>
        </div>
      </div>

      <!-- Quiz Completed -->
      <div v-if="isQuizCompleted" class="card text-center">
        <div class="text-6xl mb-4">🎉</div>
        <h2 class="text-3xl font-bold text-gray-900 mb-4">Quiz Completed!</h2>
        
        <div v-if="finalResults" class="mb-8">
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
            <div>
              <div class="text-3xl font-bold text-blue-600">{{ finalResults.finalScore }}</div>
              <div class="text-gray-600">Final Score</div>
            </div>
            <div>
              <div class="text-3xl font-bold text-green-600">{{ Math.round(finalResults.accuracy) }}%</div>
              <div class="text-gray-600">Accuracy</div>
            </div>
            <div>
              <div class="text-3xl font-bold text-purple-600">{{ finalResults.performance.rank }}</div>
              <div class="text-gray-600">Rank</div>
            </div>
          </div>

          <div class="bg-gray-50 rounded-lg p-6 mb-6">
            <h3 class="font-bold text-lg mb-2">{{ finalResults.performance.message }}</h3>
            <ul class="text-left text-gray-700">
              <li v-for="suggestion in finalResults.performance.suggestions" :key="suggestion" class="mb-1">
                • {{ suggestion }}
              </li>
            </ul>
          </div>
        </div>

        <div class="flex gap-4 justify-center">
          <button @click="startNewQuiz" class="btn btn-primary">
            New Quiz 🆕
          </button>
          <router-link to="/statistics" class="btn btn-secondary">
            View Statistics 📊
          </router-link>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-8 text-center">
        <div class="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p class="text-gray-600">{{ loadingMessage }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, inject, onMounted } from 'vue';
import type { Application } from '@/application';
import type { DifficultyLevel } from '@/domain/types';

// Inject application instance
const app = inject<Application>('app')!;

// Reactive state
const isLoading = ref(false);
const loadingMessage = ref('');
const gameSession = ref<any>(null);
const currentQuestion = ref<any>(null);
const selectedAnswer = ref<string>('');
const hasAnswered = ref(false);
const isCorrect = ref(false);
const correctAnswer = ref<string>('');
const explanation = ref<string>('');
const finalResults = ref<any>(null);

// Quiz configuration
const quizConfig = ref({
  difficulty: 'normal' as DifficultyLevel,
  questionCount: 10
});

// Difficulty levels configuration
const difficultyLevels = [
  {
    value: 'easy' as DifficultyLevel,
    label: 'Easy',
    icon: '😊',
    description: 'Single-type Pokemon, basic effectiveness'
  },
  {
    value: 'normal' as DifficultyLevel,
    label: 'Normal',
    icon: '🤔',
    description: 'Mixed types, moderate complexity'
  },
  {
    value: 'hard' as DifficultyLevel,
    label: 'Hard',
    icon: '😤',
    description: 'Dual-type Pokemon, advanced knowledge'
  }
];

// Computed properties
const currentQuestionNumber = computed(() => 
  gameSession.value?.progress?.currentQuestionNumber || 1
);

const totalQuestions = computed(() => 
  gameSession.value?.config?.questionCount || quizConfig.value.questionCount
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
async function startQuiz() {
  try {
    isLoading.value = true;
    loadingMessage.value = 'Creating quiz session...';

    const gameSessionUseCase = app.getGameSessionUseCase();
    
    // Create session
    const createResponse = await gameSessionUseCase.createSession({
      difficulty: quizConfig.value.difficulty,
      questionCount: quizConfig.value.questionCount
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
    alert('Failed to start quiz. Please try again.');
  } finally {
    isLoading.value = false;
  }
}

async function selectAnswer(answer: string) {
  if (hasAnswered.value) return;

  try {
    selectedAnswer.value = answer;
    hasAnswered.value = true;
    isLoading.value = true;
    loadingMessage.value = 'Checking answer...';

    const gameSessionUseCase = app.getGameSessionUseCase();
    
    const submitResponse = await gameSessionUseCase.submitAnswer({
      sessionId: gameSession.value.sessionId,
      answer,
      timeSpent: 2000 // Mock time spent
    });

    isCorrect.value = submitResponse.isCorrect;
    correctAnswer.value = submitResponse.correctAnswer;
    explanation.value = submitResponse.explanation || '';

    // Update progress
    gameSession.value.progress = submitResponse.progress;

    // Check if quiz is completed
    if (submitResponse.isGameCompleted && submitResponse.finalResults) {
      finalResults.value = submitResponse.finalResults;
      gameSession.value.status = 'completed';
    } else if (submitResponse.nextQuestion) {
      // Queue next question
      setTimeout(() => {
        currentQuestion.value = submitResponse.nextQuestion;
      }, 100);
    }

  } catch (error) {
    console.error('Failed to submit answer:', error);
    alert('Failed to submit answer. Please try again.');
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
        sessionId: gameSession.value.sessionId
      });
      
      finalResults.value = endResponse.results;
      gameSession.value.status = 'completed';
    }

    // Reset question state
    selectedAnswer.value = '';
    hasAnswered.value = false;
    isCorrect.value = false;
    correctAnswer.value = '';
    explanation.value = '';

  } catch (error) {
    console.error('Failed to proceed to next question:', error);
    alert('Failed to load next question. Please try again.');
  } finally {
    isLoading.value = false;
  }
}

async function endQuiz() {
  if (!confirm('Are you sure you want to end the quiz?')) return;

  try {
    isLoading.value = true;
    loadingMessage.value = 'Ending quiz...';

    const gameSessionUseCase = app.getGameSessionUseCase();
    const endResponse = await gameSessionUseCase.endGame({
      sessionId: gameSession.value.sessionId
    });

    finalResults.value = endResponse.results;
    gameSession.value.status = 'completed';

  } catch (error) {
    console.error('Failed to end quiz:', error);
    alert('Failed to end quiz. Please try again.');
  } finally {
    isLoading.value = false;
  }
}

function startNewQuiz() {
  gameSession.value = null;
  currentQuestion.value = null;
  selectedAnswer.value = '';
  hasAnswered.value = false;
  isCorrect.value = false;
  correctAnswer.value = '';
  explanation.value = '';
  finalResults.value = null;
}

onMounted(() => {
  document.title = 'Pokemon Type Quiz - Quiz';
});
</script>

<style scoped>
.quiz-view {
  min-height: 80vh;
}

.quiz-option.correct {
  background-color: #dcfce7;
  border-color: #16a34a;
}

.quiz-option.incorrect {
  background-color: #fef2f2;
  border-color: #dc2626;
}

.quiz-option:disabled {
  cursor: not-allowed;
}
</style>
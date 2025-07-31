<template>
  <div class="quiz-view">
    <!-- Quiz Setup Screen -->
    <div v-if="!gameSession" class="quiz-setup">
      <div class="max-w-2xl mx-auto">
        <div class="setup-header text-center mb-8">
          <div class="setup-icon">🎯</div>
          <h1 class="setup-title">Start New Quiz</h1>
          <p class="setup-description">
            Configure your quiz settings and test your Pokemon type knowledge
          </p>
        </div>

        <form @submit.prevent="handleStartQuiz" class="setup-form">
          <!-- Difficulty Selection -->
          <div class="form-section">
            <label class="form-label">Difficulty Level</label>
            <div class="difficulty-grid">
              <button
                v-for="level in difficultyLevels"
                :key="level.value"
                type="button"
                @click="quizConfig.difficulty = level.value"
                :class="getDifficultyButtonClass(level.value)"
              >
                <div class="difficulty-icon">{{ level.icon }}</div>
                <div class="difficulty-label">{{ level.label }}</div>
                <div class="difficulty-description">{{ level.description }}</div>
              </button>
            </div>
          </div>

          <!-- Question Count -->
          <div class="form-section">
            <label for="questionCount" class="form-label">
              Number of Questions: {{ quizConfig.questionCount }}
            </label>
            <div class="question-count-control">
              <input
                id="questionCount"
                v-model.number="quizConfig.questionCount"
                type="range"
                min="5"
                max="20"
                class="question-slider"
              >
              <div class="slider-labels">
                <span>5 Questions</span>
                <span>{{ quizConfig.questionCount }} Questions</span>
                <span>20 Questions</span>
              </div>
            </div>
          </div>

          <!-- Start Button -->
          <button
            type="submit"
            :disabled="isLoading"
            class="start-quiz-btn"
          >
            <span v-if="isLoading">Starting Quiz...</span>
            <span v-else>🚀 Start Quiz</span>
          </button>
        </form>
      </div>
    </div>

    <!-- Active Quiz Session -->
    <div v-else-if="!isQuizCompleted" class="quiz-session">
      <!-- Quiz Header with Progress -->
      <div class="quiz-header">
        <div class="progress-info">
          <div class="question-counter">
            Question {{ currentQuestionNumber }} of {{ totalQuestions }}
          </div>
          <div class="score-display">
            <span class="score-label">Score:</span>
            <span class="score-value">{{ gameSession.progress?.score || 0 }}</span>
          </div>
        </div>
        
        <div class="progress-bar-container">
          <div class="progress-bar">
            <div
              class="progress-fill"
              :style="{ width: `${progressPercentage}%` }"
            ></div>
          </div>
          <div class="progress-text">{{ Math.round(progressPercentage) }}% Complete</div>
        </div>
      </div>

      <!-- Question Card -->
      <QuestionCard
        v-if="currentQuestion"
        :question="currentQuestion"
        :question-number="currentQuestionNumber"
        :total-questions="totalQuestions"
        :selected-choice="selectedAnswer"
        :correct-answer="correctAnswer"
        :explanation="explanation"
        :show-results="hasAnswered"
        :disabled="hasAnswered"
        @choice-selected="handleAnswerSelect"
      />

      <!-- Quiz Controls -->
      <div class="quiz-controls">
        <button
          @click="handleEndQuiz"
          class="control-btn secondary"
        >
          <span class="btn-icon">🏁</span>
          End Quiz
        </button>
        
        <button
          v-if="hasAnswered"
          @click="handleNextQuestion"
          :disabled="isLoading"
          class="control-btn primary"
        >
          <span class="btn-text">
            {{ isLastQuestion ? 'Finish Quiz' : 'Next Question' }}
          </span>
          <span class="btn-icon">{{ isLastQuestion ? '🎉' : '→' }}</span>
        </button>
      </div>
    </div>

    <!-- Quiz Results Screen -->
    <div v-else-if="finalResults" class="quiz-results">
      <div class="results-header">
        <div class="celebration-icon">🎉</div>
        <h2 class="results-title">Quiz Completed!</h2>
        <p class="results-subtitle">Great job! Here are your results:</p>
      </div>

      <!-- Results Stats -->
      <div class="results-stats">
        <StatsCard
          :value="finalResults.finalScore"
          label="Final Score"
          color="blue"
          icon="🎯"
          size="lg"
          animated
        />
        <StatsCard
          :value="`${Math.round(finalResults.accuracy)}%`"
          label="Accuracy"
          color="green"
          icon="✅"
          size="lg"
          animated
        />
        <StatsCard
          :value="finalResults.performance.rank"
          label="Rank"
          color="purple"
          icon="🏆"
          size="lg"
          animated
        />
      </div>

      <!-- Performance Feedback -->
      <div class="performance-feedback">
        <h3 class="feedback-title">{{ finalResults.performance.message }}</h3>
        <ul class="feedback-suggestions">
          <li 
            v-for="suggestion in finalResults.performance.suggestions" 
            :key="suggestion"
            class="suggestion-item"
          >
            <span class="suggestion-bullet">•</span>
            <span class="suggestion-text">{{ suggestion }}</span>
          </li>
        </ul>
      </div>

      <!-- Action Buttons -->
      <div class="results-actions">
        <button @click="resetQuiz" class="action-btn primary">
          <span class="btn-icon">🆕</span>
          New Quiz
        </button>
        <router-link to="/statistics" class="action-btn secondary">
          <span class="btn-icon">📊</span>
          View Statistics
        </router-link>
        <router-link to="/types" class="action-btn secondary">
          <span class="btn-icon">📚</span>
          Study Types
        </router-link>
      </div>
    </div>

    <!-- Loading Overlay -->
    <LoadingSpinner
      v-if="isLoading"
      :message="loadingMessage"
      overlay
      color="white"
      size="lg"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { QuestionCard, LoadingSpinner, StatsCard } from '@/presentation/components';
import { useQuiz } from '@/presentation/composables';
import type { DifficultyLevel } from '@/domain/types';

// Use the quiz composable
const {
  // State
  isLoading,
  loadingMessage,
  gameSession,
  currentQuestion,
  selectedAnswer,
  hasAnswered,
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
} = useQuiz();

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

// Methods for handling UI interactions
async function handleStartQuiz() {
  try {
    await startQuiz(quizConfig.value);
  } catch (error) {
    console.error('Failed to start quiz:', error);
    alert('Failed to start quiz. Please try again.');
  }
}

async function handleAnswerSelect(answer: string) {
  try {
    await submitAnswer(answer);
  } catch (error) {
    console.error('Failed to submit answer:', error);
    alert('Failed to submit answer. Please try again.');
  }
}

async function handleNextQuestion() {
  try {
    await nextQuestion();
  } catch (error) {
    console.error('Failed to proceed to next question:', error);
    alert('Failed to load next question. Please try again.');
  }
}

async function handleEndQuiz() {
  if (!confirm('Are you sure you want to end the quiz?')) return;
  
  try {
    await endQuiz();
  } catch (error) {
    console.error('Failed to end quiz:', error);
    alert('Failed to end quiz. Please try again.');
  }
}

// Helper functions for styling
function getDifficultyButtonClass(value: DifficultyLevel) {
  const baseClasses = 'difficulty-btn';
  const selectedClass = quizConfig.value.difficulty === value ? 'selected' : '';
  return `${baseClasses} ${selectedClass}`;
}

onMounted(() => {
  document.title = 'Pokemon Type Quiz - Quiz';
});
</script>

<style scoped>
.quiz-view {
  @apply min-h-screen bg-gradient-to-br from-blue-50 to-purple-50;
}

/* Quiz Setup Styles */
.quiz-setup {
  @apply min-h-screen flex items-center justify-center p-4;
}

.setup-header {
  @apply text-center mb-8;
}

.setup-icon {
  @apply text-6xl mb-4 animate-pulse;
}

.setup-title {
  @apply text-4xl font-bold text-gray-900 mb-4;
}

.setup-description {
  @apply text-lg text-gray-600 max-w-md mx-auto;
}

.setup-form {
  @apply bg-white rounded-2xl shadow-xl p-8 space-y-8;
}

.form-section {
  @apply space-y-4;
}

.form-label {
  @apply block text-sm font-medium text-gray-700 mb-4;
}

.difficulty-grid {
  @apply grid grid-cols-1 sm:grid-cols-3 gap-4;
}

.difficulty-btn {
  @apply p-6 border-2 border-gray-200 rounded-xl text-center transition-all duration-200 hover:border-gray-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent;
}

.difficulty-btn.selected {
  @apply border-blue-500 bg-blue-50 shadow-md;
}

.difficulty-icon {
  @apply text-3xl mb-3;
}

.difficulty-label {
  @apply font-semibold text-gray-900 mb-2;
}

.difficulty-description {
  @apply text-sm text-gray-600;
}

.question-count-control {
  @apply space-y-3;
}

.question-slider {
  @apply w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer;
}

.question-slider::-webkit-slider-thumb {
  @apply appearance-none w-6 h-6 bg-blue-600 rounded-full cursor-pointer;
}

.question-slider::-moz-range-thumb {
  @apply w-6 h-6 bg-blue-600 rounded-full cursor-pointer border-0;
}

.slider-labels {
  @apply flex justify-between text-sm text-gray-500;
}

.start-quiz-btn {
  @apply w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 px-8 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none;
}

/* Quiz Session Styles */
.quiz-session {
  @apply min-h-screen p-4 max-w-6xl mx-auto;
}

.quiz-header {
  @apply bg-white rounded-2xl shadow-lg p-6 mb-8;
}

.progress-info {
  @apply flex justify-between items-center mb-4;
}

.question-counter {
  @apply text-lg font-semibold text-gray-900;
}

.score-display {
  @apply flex items-center gap-2;
}

.score-label {
  @apply text-gray-600;
}

.score-value {
  @apply font-bold text-xl text-blue-600;
}

.progress-bar-container {
  @apply space-y-2;
}

.progress-bar {
  @apply w-full bg-gray-200 rounded-full h-3 overflow-hidden;
}

.progress-fill {
  @apply h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500 ease-out;
}

.progress-text {
  @apply text-center text-sm text-gray-600 font-medium;
}

.quiz-controls {
  @apply flex justify-between items-center mt-8 gap-4;
}

.control-btn {
  @apply px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center gap-2;
}

.control-btn.primary {
  @apply bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transform hover:scale-105;
}

.control-btn.secondary {
  @apply bg-gray-100 text-gray-700 hover:bg-gray-200;
}

.btn-icon {
  @apply text-lg;
}

/* Quiz Results Styles */
.quiz-results {
  @apply min-h-screen flex flex-col items-center justify-center p-4 max-w-4xl mx-auto;
}

.results-header {
  @apply text-center mb-8;
}

.celebration-icon {
  @apply text-8xl mb-4 animate-bounce;
}

.results-title {
  @apply text-4xl font-bold text-gray-900 mb-2;
}

.results-subtitle {
  @apply text-lg text-gray-600;
}

.results-stats {
  @apply grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8 w-full;
}

.performance-feedback {
  @apply bg-white rounded-2xl shadow-lg p-8 mb-8 w-full text-center;
}

.feedback-title {
  @apply text-2xl font-bold text-gray-900 mb-4;
}

.feedback-suggestions {
  @apply text-left space-y-2 max-w-md mx-auto;
}

.suggestion-item {
  @apply flex items-start gap-2;
}

.suggestion-bullet {
  @apply text-blue-600 font-bold;
}

.suggestion-text {
  @apply text-gray-700;
}

.results-actions {
  @apply flex flex-wrap gap-4 justify-center;
}

.action-btn {
  @apply px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 text-decoration-none;
}

.action-btn.primary {
  @apply bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transform hover:scale-105;
}

.action-btn.secondary {
  @apply bg-gray-100 text-gray-700 hover:bg-gray-200;
}

/* Responsive Design */
@media (max-width: 640px) {
  .quiz-controls {
    @apply flex-col;
  }
  
  .control-btn {
    @apply w-full justify-center;
  }
  
  .results-actions {
    @apply flex-col w-full;
  }
  
  .action-btn {
    @apply w-full justify-center;
  }
}

/* Animation Classes */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.quiz-session,
.quiz-results {
  animation: slideIn 0.5s ease-out;
}
</style>
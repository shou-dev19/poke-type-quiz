<template>
  <div class="question-card">
    <div class="question-header">
      <div class="question-number">
        Question {{ questionNumber }} of {{ totalQuestions }}
      </div>
      <div v-if="timeRemaining" class="time-remaining">
        ⏱️ {{ formatTime(timeRemaining) }}
      </div>
    </div>
    
    <div class="question-content">
      <h2 class="question-text">{{ question.questionText }}</h2>
      
      <div class="question-context" v-if="question.attackingType || question.defendingType">
        <div class="type-display">
          <div v-if="question.attackingType" class="attacking-type">
            <span class="type-label">Attacking:</span>
            <TypeBadge 
              :type="question.attackingType" 
              size="lg" 
              show-icon 
            />
          </div>
          <div class="vs-separator">VS</div>
          <div v-if="question.defendingType" class="defending-type">
            <span class="type-label">Defending:</span>
            <TypeBadge 
              :type="question.defendingType" 
              size="lg" 
              show-icon 
            />
          </div>
        </div>
      </div>
    </div>
    
    <div class="choices-container">
      <button
        v-for="choice in question.choices"
        :key="choice.value"
        @click="handleChoiceSelect(choice.value)"
        :disabled="disabled || selectedChoice !== null"
        :class="getChoiceClass(choice)"
        class="choice-button"
      >
        <div class="choice-content">
          <div class="choice-main">
            <span class="choice-label">{{ choice.label }}</span>
            <span class="choice-multiplier">{{ choice.multiplier }}×</span>
          </div>
          <p v-if="choice.description" class="choice-description">
            {{ choice.description }}
          </p>
        </div>
        <div v-if="showResults && selectedChoice === choice.value" class="choice-indicator">
          {{ selectedChoice === correctAnswer ? '✅' : '❌' }}
        </div>
        <div v-else-if="showResults && choice.value === correctAnswer" class="choice-indicator">
          ✅
        </div>
      </button>
    </div>
    
    <div v-if="showResults && explanation" class="explanation">
      <div class="explanation-header">
        <span class="explanation-icon">
          {{ selectedChoice === correctAnswer ? '🎉' : '📝' }}
        </span>
        <span class="explanation-title">
          {{ selectedChoice === correctAnswer ? 'Correct!' : 'Explanation' }}
        </span>
      </div>
      <p class="explanation-text">{{ explanation }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import TypeBadge from './TypeBadge.vue';

interface QuestionChoice {
  value: string;
  label: string;
  description?: string;
  multiplier: number;
}

interface Question {
  questionText: string;
  attackingType?: string;
  defendingType?: string;
  choices: QuestionChoice[];
}

interface Props {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  selectedChoice?: string | null;
  correctAnswer?: string;
  explanation?: string;
  showResults?: boolean;
  disabled?: boolean;
  timeRemaining?: number;
}

interface Emits {
  (e: 'choice-selected', choice: string): void;
}

const props = withDefaults(defineProps<Props>(), {
  selectedChoice: null,
  showResults: false,
  disabled: false
});

const emit = defineEmits<Emits>();

function handleChoiceSelect(choice: string) {
  if (!props.disabled && props.selectedChoice === null) {
    emit('choice-selected', choice);
  }
}

function getChoiceClass(choice: QuestionChoice) {
  const baseClasses = 'choice-button';
  
  if (!props.showResults) {
    return `${baseClasses} ${props.selectedChoice === choice.value ? 'selected' : ''}`;
  }
  
  if (choice.value === props.correctAnswer) {
    return `${baseClasses} correct`;
  }
  
  if (props.selectedChoice === choice.value && choice.value !== props.correctAnswer) {
    return `${baseClasses} incorrect`;
  }
  
  return baseClasses;
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
</script>

<style scoped>
.question-card {
  @apply bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto;
}

.question-header {
  @apply flex justify-between items-center mb-6 text-sm text-gray-600;
}

.question-number {
  @apply font-medium;
}

.time-remaining {
  @apply bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full font-medium;
}

.question-content {
  @apply mb-8;
}

.question-text {
  @apply text-2xl font-bold text-gray-900 mb-6 text-center;
}

.question-context {
  @apply flex justify-center;
}

.type-display {
  @apply flex items-center gap-6;
}

.attacking-type,
.defending-type {
  @apply flex flex-col items-center gap-2;
}

.type-label {
  @apply text-sm font-medium text-gray-600;
}

.vs-separator {
  @apply text-2xl font-bold text-gray-400 flex items-center;
}

.choices-container {
  @apply grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6;
}

.choice-button {
  @apply relative p-4 border-2 border-gray-200 rounded-lg transition-all duration-200 hover:border-gray-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent;
}

.choice-button.selected {
  @apply border-blue-500 bg-blue-50;
}

.choice-button.correct {
  @apply border-green-500 bg-green-50;
}

.choice-button.incorrect {
  @apply border-red-500 bg-red-50;
}

.choice-button:disabled {
  @apply cursor-not-allowed opacity-75;
}

.choice-content {
  @apply text-left;
}

.choice-main {
  @apply flex justify-between items-center mb-2;
}

.choice-label {
  @apply font-medium text-gray-900;
}

.choice-multiplier {
  @apply text-lg font-bold text-blue-600;
}

.choice-description {
  @apply text-sm text-gray-600;
}

.choice-indicator {
  @apply absolute -top-2 -right-2 text-2xl;
}

.explanation {
  @apply bg-gray-50 rounded-lg p-4;
}

.explanation-header {
  @apply flex items-center gap-2 mb-2;
}

.explanation-icon {
  @apply text-xl;
}

.explanation-title {
  @apply font-medium text-gray-900;
}

.explanation-text {
  @apply text-gray-700;
}
</style>
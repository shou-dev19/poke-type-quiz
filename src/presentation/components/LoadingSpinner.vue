<template>
  <div v-if="overlay" class="loading-overlay">
    <div class="spinner-container">
      <div :class="spinnerClass"></div>
      <p v-if="message" class="loading-message">{{ message }}</p>
    </div>
  </div>
  <div v-else :class="containerClass">
    <div :class="spinnerClass"></div>
    <p v-if="message" class="loading-message">{{ message }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  overlay?: boolean;
  color?: 'primary' | 'secondary' | 'white';
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  overlay: false,
  color: 'primary'
});

const spinnerClass = computed(() => {
  const baseClasses = 'animate-spin rounded-full border-solid border-t-transparent';
  
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-4',
    lg: 'w-12 h-12 border-4'
  };
  
  const colorClasses = {
    primary: 'border-blue-600',
    secondary: 'border-gray-600',
    white: 'border-white'
  };
  
  return `${baseClasses} ${sizeClasses[props.size]} ${colorClasses[props.color]}`;
});

const containerClass = computed(() => {
  const baseClasses = 'flex flex-col items-center justify-center';
  const spacingClasses = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6'
  };
  
  return `${baseClasses} ${spacingClasses[props.size]}`;
});
</script>

<style scoped>
.loading-overlay {
  @apply fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50;
}

.spinner-container {
  @apply bg-white rounded-lg p-8 text-center;
}

.loading-message {
  @apply text-gray-600 text-center;
}
</style>
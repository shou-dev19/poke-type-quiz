<template>
  <div :class="cardClass">
    <div v-if="icon" class="stats-icon">{{ icon }}</div>
    <div class="stats-content">
      <div class="stats-value" :style="valueStyle">{{ displayValue }}</div>
      <div class="stats-label">{{ label }}</div>
      <div v-if="description" class="stats-description">{{ description }}</div>
      <div v-if="trend" class="stats-trend" :class="trendClass">
        <span class="trend-icon">{{ trendIcon }}</span>
        <span class="trend-text">{{ trend.text }}</span>
      </div>
    </div>
    <div v-if="$slots.action" class="stats-action">
      <slot name="action"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Trend {
  direction: 'up' | 'down' | 'neutral';
  text: string;
}

interface Props {
  value: string | number;
  label: string;
  description?: string;
  icon?: string;
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'gray';
  size?: 'sm' | 'md' | 'lg';
  trend?: Trend;
  animated?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  color: 'blue',
  size: 'md',
  animated: false
});

const cardClass = computed(() => {
  const baseClasses = 'stats-card bg-white rounded-lg shadow p-6 text-center';
  const sizeClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };
  const animatedClass = props.animated ? 'hover:shadow-lg transition-shadow duration-200' : '';
  
  return `${baseClasses} ${sizeClasses[props.size]} ${animatedClass}`;
});

const valueStyle = computed(() => {
  const colorMap = {
    blue: '#3b82f6',
    green: '#10b981',
    red: '#ef4444',
    yellow: '#f59e0b',
    purple: '#8b5cf6',
    gray: '#6b7280'
  };
  
  return {
    color: colorMap[props.color]
  };
});

const displayValue = computed(() => {
  return props.value;
});

const trendClass = computed(() => {
  if (!props.trend) return '';
  
  const trendClasses = {
    up: 'text-green-600',
    down: 'text-red-600',
    neutral: 'text-gray-600'
  };
  
  return trendClasses[props.trend.direction];
});

const trendIcon = computed(() => {
  if (!props.trend) return '';
  
  const trendIcons = {
    up: '↗️',
    down: '↘️',
    neutral: '➡️'
  };
  
  return trendIcons[props.trend.direction];
});
</script>

<style scoped>
.stats-card {
  @apply relative;
}

.stats-icon {
  @apply text-4xl mb-4;
}

.stats-content {
  @apply space-y-2;
}

.stats-value {
  @apply text-3xl font-bold;
}

.stats-label {
  @apply text-gray-600 font-medium;
}

.stats-description {
  @apply text-sm text-gray-500;
}

.stats-trend {
  @apply flex items-center justify-center gap-1 text-sm font-medium;
}

.trend-icon {
  @apply text-base;
}

.stats-action {
  @apply mt-4;
}

/* Size variants */
.stats-card.p-4 .stats-value {
  @apply text-2xl;
}

.stats-card.p-4 .stats-icon {
  @apply text-3xl mb-2;
}

.stats-card.p-8 .stats-value {
  @apply text-4xl;
}

.stats-card.p-8 .stats-icon {
  @apply text-5xl mb-6;
}
</style>
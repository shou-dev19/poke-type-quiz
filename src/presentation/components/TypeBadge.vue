<template>
  <span
    :class="[
      'type-badge',
      `type-${type}`,
      sizeClass,
      {
        'cursor-pointer hover:shadow-md transition-shadow': clickable
      }
    ]"
    @click="handleClick"
  >
    <span v-if="showIcon" class="type-icon">
      {{ getTypeIcon(type) }}
    </span>
    <span class="type-name">{{ displayName }}</span>
    <span v-if="showMultiplier && multiplier" class="type-multiplier">
      {{ multiplier }}×
    </span>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { TypeId } from '@/domain/types';

interface Props {
  type: TypeId;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  showMultiplier?: boolean;
  multiplier?: number;
  clickable?: boolean;
  displayName?: string;
}

interface Emits {
  (e: 'click', type: TypeId): void;
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  showIcon: false,
  showMultiplier: false,
  clickable: false
});

const emit = defineEmits<Emits>();

const sizeClass = computed(() => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-2'
  };
  return sizeClasses[props.size];
});

const displayName = computed(() => {
  return props.displayName || props.type.toUpperCase();
});

function getTypeIcon(type: TypeId): string {
  const typeIcons: Record<TypeId, string> = {
    normal: '⚪',
    fire: '🔥',
    water: '💧',
    electric: '⚡',
    grass: '🌿',
    ice: '❄️',
    fighting: '👊',
    poison: '☠️',
    ground: '🌍',
    flying: '🦅',
    psychic: '🔮',
    bug: '🐛',
    rock: '🗿',
    ghost: '👻',
    dragon: '🐉',
    dark: '🌙',
    steel: '⚙️',
    fairy: '🧚'
  };
  return typeIcons[type] || '❓';
}

function handleClick() {
  if (props.clickable) {
    emit('click', props.type);
  }
}
</script>

<style scoped>
.type-badge {
  @apply inline-flex items-center rounded-full font-medium text-white;
  background-color: var(--type-color);
}

.type-icon {
  @apply mr-1;
}

.type-multiplier {
  @apply ml-1 font-bold;
}

/* Type-specific colors */
.type-normal { @apply bg-gray-400; }
.type-fire { @apply bg-red-500; }
.type-water { @apply bg-blue-500; }
.type-electric { @apply bg-yellow-400 text-gray-900; }
.type-grass { @apply bg-green-500; }
.type-ice { @apply bg-cyan-400; }
.type-fighting { @apply bg-red-700; }
.type-poison { @apply bg-purple-600; }
.type-ground { @apply bg-yellow-600; }
.type-flying { @apply bg-indigo-400; }
.type-psychic { @apply bg-pink-500; }
.type-bug { @apply bg-lime-500; }
.type-rock { @apply bg-yellow-800; }
.type-ghost { @apply bg-purple-700; }
.type-dragon { @apply bg-indigo-700; }
.type-dark { @apply bg-gray-800; }
.type-steel { @apply bg-gray-500; }
.type-fairy { @apply bg-pink-400; }
</style>
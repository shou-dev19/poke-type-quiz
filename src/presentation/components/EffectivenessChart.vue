<template>
  <div class="effectiveness-chart">
    <div class="chart-header">
      <h3 class="chart-title">{{ title }}</h3>
      <div v-if="showToggle" class="view-toggle">
        <button
          v-for="mode in viewModes"
          :key="mode.value"
          @click="currentViewMode = mode.value"
          :class="[
            'toggle-btn',
            currentViewMode === mode.value ? 'active' : ''
          ]"
        >
          {{ mode.label }}
        </button>
      </div>
    </div>
    
    <!-- Compact Grid View -->
    <div v-if="currentViewMode === 'grid'" class="grid-container">
      <div class="grid grid-cols-6 sm:grid-cols-9 md:grid-cols-12 gap-1">
        <div
          v-for="item in gridData"
          :key="`${item.attacking}-${item.defending}`"
          :class="getGridCellClass(item.multiplier)"
          :title="`${item.attacking} vs ${item.defending}: ${item.multiplier}×`"
        >
          <span class="multiplier-text">{{ item.multiplier }}×</span>
        </div>
      </div>
    </div>
    
    <!-- Matrix Table View -->
    <div v-else-if="currentViewMode === 'matrix'" class="matrix-container">
      <div class="overflow-x-auto">
        <table class="effectiveness-table">
          <thead>
            <tr>
              <th class="corner-cell">ATK \ DEF</th>
              <th
                v-for="defendingType in types"
                :key="`def-${defendingType}`"
                class="type-header"
              >
                <TypeBadge :type="defendingType" size="sm" />
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, attackingIndex) in matrixData" :key="`row-${attackingIndex}`">
              <td class="type-header">
                <TypeBadge :type="types[attackingIndex]" size="sm" />
              </td>
              <td
                v-for="(cell, defendingIndex) in row"
                :key="`cell-${attackingIndex}-${defendingIndex}`"
                :class="getMatrixCellClass(cell.multiplier)"
              >
                {{ cell.multiplier }}×
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <!-- Bar Chart View -->
    <div v-else-if="currentViewMode === 'bars'" class="bars-container">
      <div class="space-y-3">
        <div
          v-for="bar in barData"
          :key="bar.label"
          class="bar-item"
        >
          <div class="bar-label">{{ bar.label }}</div>
          <div class="bar-track">
            <div
              class="bar-fill"
              :class="bar.colorClass"
              :style="{ width: `${bar.percentage}%` }"
            >
              <span class="bar-value">{{ bar.value }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Legend -->
    <div class="chart-legend">
      <div class="legend-item">
        <div class="legend-color super-effective"></div>
        <span>Super Effective (2×+)</span>
      </div>
      <div class="legend-item">
        <div class="legend-color normal"></div>
        <span>Normal (1×)</span>
      </div>
      <div class="legend-item">
        <div class="legend-color not-very-effective"></div>
        <span>Not Very Effective (0.5×)</span>
      </div>
      <div class="legend-item">
        <div class="legend-color no-effect"></div>
        <span>No Effect (0×)</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import TypeBadge from './TypeBadge.vue';
import type { TypeId } from '@/domain/types';

interface EffectivenessData {
  attacking: TypeId;
  defending: TypeId;
  multiplier: number;
}

interface Props {
  data: EffectivenessData[];
  types: TypeId[];
  title?: string;
  defaultViewMode?: 'grid' | 'matrix' | 'bars';
  showToggle?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Type Effectiveness Chart',
  defaultViewMode: 'grid',
  showToggle: true
});

const currentViewMode = ref(props.defaultViewMode);

const viewModes = [
  { value: 'grid', label: 'Grid' },
  { value: 'matrix', label: 'Matrix' },
  { value: 'bars', label: 'Bars' }
];

// Computed data for different view modes
const gridData = computed(() => {
  return props.data.map(item => ({
    attacking: item.attacking,
    defending: item.defending,
    multiplier: item.multiplier
  }));
});

const matrixData = computed(() => {
  const matrix: Array<Array<{ multiplier: number }>> = [];
  
  props.types.forEach((attackingType, attackingIndex) => {
    matrix[attackingIndex] = [];
    props.types.forEach((defendingType, defendingIndex) => {
      const effectiveness = props.data.find(
        item => item.attacking === attackingType && item.defending === defendingType
      );
      matrix[attackingIndex][defendingIndex] = {
        multiplier: effectiveness?.multiplier || 1
      };
    });
  });
  
  return matrix;
});

const barData = computed(() => {
  // Count effectiveness categories
  const counts = {
    superEffective: 0,
    normal: 0,
    notVeryEffective: 0,
    noEffect: 0
  };
  
  props.data.forEach(item => {
    if (item.multiplier > 1) counts.superEffective++;
    else if (item.multiplier === 1) counts.normal++;
    else if (item.multiplier > 0) counts.notVeryEffective++;
    else counts.noEffect++;
  });
  
  const total = props.data.length;
  
  return [
    {
      label: 'Super Effective',
      value: counts.superEffective,
      percentage: (counts.superEffective / total) * 100,
      colorClass: 'bg-red-500'
    },
    {
      label: 'Normal',
      value: counts.normal,
      percentage: (counts.normal / total) * 100,
      colorClass: 'bg-gray-400'
    },
    {
      label: 'Not Very Effective',
      value: counts.notVeryEffective,
      percentage: (counts.notVeryEffective / total) * 100,
      colorClass: 'bg-blue-500'
    },
    {
      label: 'No Effect',
      value: counts.noEffect,
      percentage: (counts.noEffect / total) * 100,
      colorClass: 'bg-gray-800'
    }
  ];
});

// Helper functions
function getGridCellClass(multiplier: number): string {
  const baseClass = 'grid-cell';
  if (multiplier > 1) return `${baseClass} super-effective`;
  if (multiplier < 1 && multiplier > 0) return `${baseClass} not-very-effective`;
  if (multiplier === 0) return `${baseClass} no-effect`;
  return `${baseClass} normal`;
}

function getMatrixCellClass(multiplier: number): string {
  const baseClass = 'matrix-cell';
  if (multiplier > 1) return `${baseClass} super-effective`;
  if (multiplier < 1 && multiplier > 0) return `${baseClass} not-very-effective`;
  if (multiplier === 0) return `${baseClass} no-effect`;
  return `${baseClass} normal`;
}
</script>

<style scoped>
.effectiveness-chart {
  @apply bg-white rounded-lg shadow p-6;
}

.chart-header {
  @apply flex justify-between items-center mb-6;
}

.chart-title {
  @apply text-xl font-bold text-gray-900;
}

.view-toggle {
  @apply flex bg-gray-100 rounded-lg p-1;
}

.toggle-btn {
  @apply px-3 py-1 text-sm font-medium text-gray-600 rounded-md transition-colors;
}

.toggle-btn.active {
  @apply bg-white text-gray-900 shadow-sm;
}

.grid-container {
  @apply mb-6;
}

.grid-cell {
  @apply aspect-square flex items-center justify-center text-xs font-bold text-white rounded transition-opacity hover:opacity-80;
}

.grid-cell.super-effective {
  @apply bg-red-500;
}

.grid-cell.normal {
  @apply bg-gray-400;
}

.grid-cell.not-very-effective {
  @apply bg-blue-500;
}

.grid-cell.no-effect {
  @apply bg-gray-800;
}

.multiplier-text {
  @apply text-xs;
}

.matrix-container {
  @apply mb-6;
}

.effectiveness-table {
  @apply w-full border-collapse;
}

.corner-cell {
  @apply p-2 text-center font-medium text-gray-600 bg-gray-50;
}

.type-header {
  @apply p-2 text-center bg-gray-50;
}

.matrix-cell {
  @apply p-2 text-center text-sm font-bold text-white;
}

.matrix-cell.super-effective {
  @apply bg-red-500;
}

.matrix-cell.normal {
  @apply bg-gray-400;
}

.matrix-cell.not-very-effective {
  @apply bg-blue-500;
}

.matrix-cell.no-effect {
  @apply bg-gray-800;
}

.bars-container {
  @apply mb-6;
}

.bar-item {
  @apply flex items-center gap-4;
}

.bar-label {
  @apply w-32 text-sm font-medium text-gray-700;
}

.bar-track {
  @apply flex-1 bg-gray-200 rounded-full h-6 relative;
}

.bar-fill {
  @apply h-full rounded-full flex items-center justify-end pr-2 min-w-0;
}

.bar-value {
  @apply text-white text-xs font-bold;
}

.chart-legend {
  @apply flex flex-wrap gap-4 justify-center text-sm;
}

.legend-item {
  @apply flex items-center gap-2;
}

.legend-color {
  @apply w-4 h-4 rounded;
}

.legend-color.super-effective {
  @apply bg-red-500;
}

.legend-color.normal {
  @apply bg-gray-400;
}

.legend-color.not-very-effective {
  @apply bg-blue-500;
}

.legend-color.no-effect {
  @apply bg-gray-800;
}
</style>
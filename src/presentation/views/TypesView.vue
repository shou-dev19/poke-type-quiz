<template>
  <div class="types-view">
    <!-- Header Section -->
    <div class="types-header">
      <div class="header-content">
        <div class="header-icon">📚</div>
        <h1 class="header-title">Pokemon Types</h1>
        <p class="header-description">
          Explore comprehensive information about all Pokemon types and their effectiveness relationships
        </p>
      </div>
    </div>

    <!-- Search and View Controls -->
    <div class="controls-section">
      <div class="search-container">
        <div class="search-input-wrapper">
          <div class="search-icon">🔍</div>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search types by name..."
            class="search-input"
          >
          <button
            v-if="searchQuery"
            @click="searchQuery = ''"
            class="clear-search"
          >
            ×
          </button>
        </div>
      </div>
      
      <div class="view-controls">
        <div class="view-mode-toggle">
          <button
            v-for="mode in viewModes"
            :key="mode.value"
            @click="viewMode = mode.value"
            :class="getViewModeClass(mode.value)"
          >
            <span class="mode-icon">{{ mode.icon }}</span>
            <span class="mode-label">{{ mode.label }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <LoadingSpinner
      v-if="isLoading"
      message="Loading Pokemon types..."
      size="lg"
    />

    <!-- Content Area -->
    <div v-else class="content-area">
      <!-- Grid View -->
      <div v-if="viewMode === 'grid'" class="types-grid">
        <div
          v-for="type in filteredTypes"
          :key="type.id"
          class="type-card"
          @click="handleTypeSelect(type)"
        >
          <div class="type-card-content">
            <div class="type-icon-container">
              <TypeBadge
                :type="type.id"
                size="lg"
                show-icon
                clickable
                @click="handleTypeSelect(type)"
              />
            </div>
            <h3 class="type-name">{{ type.nameJa }}</h3>
            <p class="type-description">{{ type.description || 'Pokemon type' }}</p>
            <div class="type-id-badge">
              {{ type.id.toUpperCase() }}
            </div>
          </div>
        </div>
      </div>

      <!-- List View -->
      <div v-else-if="viewMode === 'list'" class="types-list">
        <div
          v-for="type in filteredTypes"
          :key="type.id"
          class="type-list-item"
          @click="handleTypeSelect(type)"
        >
          <div class="list-item-content">
            <TypeBadge
              :type="type.id"
              size="md"
              show-icon
            />
            <div class="list-item-info">
              <h3 class="list-item-name">{{ type.nameJa }}</h3>
              <p class="list-item-description">{{ type.description || 'Pokemon type' }}</p>
            </div>
            <div class="list-item-badge">
              {{ type.id.toUpperCase() }}
            </div>
          </div>
        </div>
      </div>

      <!-- Matrix View -->
      <div v-else-if="viewMode === 'matrix'" class="matrix-container">
        <div class="matrix-header">
          <h3 class="matrix-title">Type Effectiveness Matrix</h3>
          <p class="matrix-description">
            Interactive type effectiveness chart showing all type interactions
          </p>
        </div>
        
        <EffectivenessChart
          v-if="effectivenessMatrix && matrixData.length"
          :data="matrixData"
          :types="matrixTypes"
          title="Complete Type Effectiveness Matrix"
          default-view-mode="matrix"
          :show-toggle="true"
        />
        
        <LoadingSpinner
          v-else
          message="Loading effectiveness matrix..."
          size="md"
        />
      </div>

      <!-- Empty State -->
      <div v-if="filteredTypes.length === 0 && !isLoading" class="empty-state">
        <div class="empty-icon">🔍</div>
        <h3 class="empty-title">No types found</h3>
        <p class="empty-description">
          Try adjusting your search term or clearing the search to see all types.
        </p>
        <button @click="searchQuery = ''" class="clear-search-btn">
          Clear Search
        </button>
      </div>
    </div>

    <!-- Type Detail Modal -->
    <Modal
      :show="!!selectedType"
      :title="selectedType?.nameJa"
      size="lg"
      @close="clearSelectedType"
    >
      <template #header>
        <div class="modal-header-content">
          <TypeBadge
            v-if="selectedType"
            :type="selectedType.id"
            size="lg"
            show-icon
          />
          <div class="modal-title-info">
            <h2 class="modal-title">{{ selectedType?.nameJa }}</h2>
            <p class="modal-subtitle">{{ selectedType?.id.toUpperCase() }} Type</p>
          </div>
        </div>
      </template>

      <div v-if="selectedType" class="type-detail-content">
        <!-- Description -->
        <div class="detail-section">
          <h3 class="detail-section-title">Description</h3>
          <p class="detail-description">
            {{ selectedType.description || 'A unique Pokemon type with distinctive characteristics and battle properties.' }}
          </p>
        </div>

        <!-- Type Effectiveness -->
        <div v-if="selectedTypeDetail" class="effectiveness-section">
          <h3 class="detail-section-title">Type Effectiveness</h3>
          
          <div class="effectiveness-grid">
            <!-- Strong Against -->
            <div v-if="selectedTypeDetail.effectiveness?.strongAgainst?.length" class="effectiveness-category">
              <h4 class="category-title strong">
                <span class="category-icon">⚔️</span>
                Strong Against
              </h4>
              <div class="type-badges-container">
                <TypeBadge
                  v-for="type in selectedTypeDetail.effectiveness.strongAgainst"
                  :key="type"
                  :type="type"
                  size="sm"
                  show-icon
                  clickable
                  @click="handleRelatedTypeClick(type)"
                />
              </div>
            </div>

            <!-- Weak Against -->
            <div v-if="selectedTypeDetail.effectiveness?.weakAgainst?.length" class="effectiveness-category">
              <h4 class="category-title weak">
                <span class="category-icon">💥</span>
                Weak Against
              </h4>
              <div class="type-badges-container">
                <TypeBadge
                  v-for="type in selectedTypeDetail.effectiveness.weakAgainst"
                  :key="type"
                  :type="type"
                  size="sm"
                  show-icon
                  clickable
                  @click="handleRelatedTypeClick(type)"
                />
              </div>
            </div>

            <!-- Resistant To -->
            <div v-if="selectedTypeDetail.effectiveness?.resistantTo?.length" class="effectiveness-category">
              <h4 class="category-title resistant">
                <span class="category-icon">🛡️</span>
                Resistant To
              </h4>
              <div class="type-badges-container">
                <TypeBadge
                  v-for="type in selectedTypeDetail.effectiveness.resistantTo"
                  :key="type"
                  :type="type"
                  size="sm"
                  show-icon
                  clickable
                  @click="handleRelatedTypeClick(type)"
                />
              </div>
            </div>

            <!-- Vulnerable To -->
            <div v-if="selectedTypeDetail.effectiveness?.vulnerableTo?.length" class="effectiveness-category">
              <h4 class="category-title vulnerable">
                <span class="category-icon">🎯</span>
                Vulnerable To
              </h4>
              <div class="type-badges-container">
                <TypeBadge
                  v-for="type in selectedTypeDetail.effectiveness.vulnerableTo"
                  :key="type"
                  :type="type"
                  size="sm"
                  show-icon
                  clickable
                  @click="handleRelatedTypeClick(type)"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Loading Type Details -->
        <LoadingSpinner
          v-else
          message="Loading type details..."
          size="sm"
        />
      </div>

      <template #footer>
        <div class="modal-actions">
          <button @click="clearSelectedType" class="modal-btn secondary">
            Close
          </button>
          <router-link
            :to="`/quiz?focus=${selectedType?.id}`"
            class="modal-btn primary"
          >
            <span class="btn-icon">🎯</span>
            Practice This Type
          </router-link>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { TypeBadge, LoadingSpinner, Modal, EffectivenessChart } from '@/presentation/components';
import { useTypes } from '@/presentation/composables';
import type { TypeId } from '@/domain/types';

// Use the types composable
const {
  // State
  isLoading,
  types,
  selectedType,
  selectedTypeDetail,
  effectivenessMatrix,
  searchQuery,
  
  // Computed
  filteredTypes,
  matrixTypes,
  
  // Methods
  loadTypes,
  loadEffectivenessMatrix,
  selectType,
  clearSelectedType
} = useTypes();

// Local state for view mode
const viewMode = ref<'grid' | 'list' | 'matrix'>('grid');

// View mode configuration
const viewModes = [
  { value: 'grid', label: 'Grid', icon: '🏢' },
  { value: 'list', label: 'List', icon: '📋' },
  { value: 'matrix', label: 'Matrix', icon: '📊' }
];

// Computed properties for matrix data
const matrixData = computed(() => {
  if (!effectivenessMatrix.value?.matrix || !matrixTypes.value.length) return [];
  
  const data: Array<{
    attacking: TypeId;
    defending: TypeId;
    multiplier: number;
  }> = [];
  
  matrixTypes.value.forEach((attackingType, attackingIndex) => {
    matrixTypes.value.forEach((defendingType, defendingIndex) => {
      const cell = effectivenessMatrix.value.matrix[attackingIndex]?.[defendingIndex];
      if (cell) {
        data.push({
          attacking: attackingType,
          defending: defendingType,
          multiplier: cell.multiplier
        });
      }
    });
  });
  
  return data;
});

// Methods for handling UI interactions
async function handleTypeSelect(type: any) {
  try {
    await selectType(type);
  } catch (error) {
    console.error('Failed to load type details:', error);
    alert('Failed to load type details. Please try again.');
  }
}

async function handleRelatedTypeClick(typeId: TypeId) {
  // Find the type in our types array and select it
  const relatedType = types.value.find(t => t.id === typeId);
  if (relatedType) {
    await handleTypeSelect(relatedType);
  }
}

// Helper functions for styling
function getViewModeClass(mode: string) {
  const baseClasses = 'view-mode-btn';
  const activeClass = viewMode.value === mode ? 'active' : '';
  return `${baseClasses} ${activeClass}`;
}

// Lifecycle
onMounted(async () => {
  document.title = 'Pokemon Type Quiz - Types';
  try {
    await loadTypes();
    await loadEffectivenessMatrix();
  } catch (error) {
    console.error('Failed to load data:', error);
  }
});
</script>

<style scoped>
.types-view {
  @apply min-h-screen bg-gradient-to-br from-green-50 to-blue-50;
}

/* Header Section */
.types-header {
  @apply bg-gradient-to-r from-green-600 to-blue-600 text-white py-16;
}

.header-content {
  @apply container-lg text-center;
}

.header-icon {
  @apply text-6xl mb-4 animate-pulse;
}

.header-title {
  @apply text-4xl font-bold mb-4;
}

.header-description {
  @apply text-xl text-green-100 max-w-2xl mx-auto;
}

/* Controls Section */
.controls-section {
  @apply container-lg py-8 flex flex-col lg:flex-row gap-6 items-center;
}

.search-container {
  @apply flex-1 max-w-md;
}

.search-input-wrapper {
  @apply relative;
}

.search-icon {
  @apply absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg;
}

.search-input {
  @apply w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors bg-white shadow-sm;
}

.clear-search {
  @apply absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xl font-light transition-colors;
}

.view-controls {
  @apply flex-shrink-0;
}

.view-mode-toggle {
  @apply flex bg-white rounded-xl shadow-lg p-1 border border-gray-200;
}

.view-mode-btn {
  @apply px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900;
}

.view-mode-btn.active {
  @apply bg-blue-600 text-white shadow-md;
}

.mode-icon {
  @apply text-base;
}

.mode-label {
  @apply hidden sm:inline;
}

/* Content Area */
.content-area {
  @apply container-lg pb-8;
}

/* Grid View */
.types-grid {
  @apply grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6;
}

.type-card {
  @apply bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105;
}

.type-card-content {
  @apply p-6 text-center;
}

.type-icon-container {
  @apply mb-4 flex justify-center;
}

.type-name {
  @apply text-xl font-bold text-gray-900 mb-2;
}

.type-description {
  @apply text-sm text-gray-600 mb-4 h-12 flex items-center justify-center;
}

.type-id-badge {
  @apply inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium;
}

/* List View */
.types-list {
  @apply space-y-4;
}

.type-list-item {
  @apply bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer;
}

.list-item-content {
  @apply p-6 flex items-center gap-4;
}

.list-item-info {
  @apply flex-1;
}

.list-item-name {
  @apply text-lg font-bold text-gray-900 mb-1;
}

.list-item-description {
  @apply text-sm text-gray-600;
}

.list-item-badge {
  @apply px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium;
}

/* Matrix View */
.matrix-container {
  @apply bg-white rounded-2xl shadow-lg p-8;
}

.matrix-header {
  @apply text-center mb-8;
}

.matrix-title {
  @apply text-2xl font-bold text-gray-900 mb-2;
}

.matrix-description {
  @apply text-gray-600;
}

/* Empty State */
.empty-state {
  @apply text-center py-16;
}

.empty-icon {
  @apply text-6xl mb-4 opacity-50;
}

.empty-title {
  @apply text-2xl font-bold text-gray-900 mb-2;
}

.empty-description {
  @apply text-gray-600 mb-6 max-w-md mx-auto;
}

.clear-search-btn {
  @apply bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors;
}

/* Modal Styles */
.modal-header-content {
  @apply flex items-center gap-4;
}

.modal-title-info {
  @apply flex-1;
}

.modal-title {
  @apply text-2xl font-bold text-gray-900 mb-1;
}

.modal-subtitle {
  @apply text-gray-600;
}

.type-detail-content {
  @apply space-y-8;
}

.detail-section {
  @apply space-y-4;
}

.detail-section-title {
  @apply text-lg font-bold text-gray-900 border-b border-gray-200 pb-2;
}

.detail-description {
  @apply text-gray-700 leading-relaxed;
}

.effectiveness-section {
  @apply space-y-6;
}

.effectiveness-grid {
  @apply grid grid-cols-1 md:grid-cols-2 gap-6;
}

.effectiveness-category {
  @apply bg-gray-50 rounded-xl p-4;
}

.category-title {
  @apply flex items-center gap-2 font-bold mb-3;
}

.category-title.strong {
  @apply text-green-600;
}

.category-title.weak {
  @apply text-red-600;
}

.category-title.resistant {
  @apply text-blue-600;
}

.category-title.vulnerable {
  @apply text-orange-600;
}

.category-icon {
  @apply text-lg;
}

.type-badges-container {
  @apply flex flex-wrap gap-2;
}

.modal-actions {
  @apply flex gap-4 justify-end;
}

.modal-btn {
  @apply px-6 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 text-decoration-none;
}

.modal-btn.primary {
  @apply bg-blue-600 text-white hover:bg-blue-700;
}

.modal-btn.secondary {
  @apply bg-gray-100 text-gray-700 hover:bg-gray-200;
}

.btn-icon {
  @apply text-base;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .controls-section {
    @apply flex-col items-stretch;
  }
  
  .search-container {
    @apply max-w-full;
  }
  
  .view-mode-toggle {
    @apply w-full justify-center;
  }
}

@media (max-width: 640px) {
  .types-grid {
    @apply grid-cols-1;
  }
  
  .list-item-content {
    @apply flex-col text-center gap-3;
  }
  
  .effectiveness-grid {
    @apply grid-cols-1;
  }
  
  .modal-actions {
    @apply flex-col;
  }
  
  .modal-btn {
    @apply w-full justify-center;
  }
}

/* Animation Classes */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.type-card,
.type-list-item {
  animation: fadeInUp 0.5s ease-out;
}

.type-card:nth-child(odd) {
  animation-delay: 0.1s;
}

.type-card:nth-child(even) {
  animation-delay: 0.2s;
}
</style>
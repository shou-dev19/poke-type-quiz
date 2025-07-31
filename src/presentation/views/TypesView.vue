<template>
  <div class="types-view">
    <div class="container-lg">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-4">Pokemon Types</h1>
        <p class="text-lg text-gray-600">
          Explore comprehensive information about all Pokemon types and their effectiveness relationships
        </p>
      </div>

      <!-- Search and Filters -->
      <div class="card mb-8">
        <div class="flex flex-col sm:flex-row gap-4">
          <div class="flex-1">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search types..."
              class="input"
            >
          </div>
          <div class="flex gap-2">
            <button
              @click="viewMode = 'grid'"
              :class="[
                'btn',
                viewMode === 'grid' ? 'btn-primary' : 'btn-secondary'
              ]"
            >
              Grid
            </button>
            <button
              @click="viewMode = 'list'"
              :class="[
                'btn',
                viewMode === 'list' ? 'btn-primary' : 'btn-secondary'
              ]"
            >
              List
            </button>
            <button
              @click="viewMode = 'matrix'"
              :class="[
                'btn',
                viewMode === 'matrix' ? 'btn-primary' : 'btn-secondary'
              ]"
            >
              Matrix
            </button>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="text-center py-12">
        <div class="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p class="text-gray-600">Loading types...</p>
      </div>

      <!-- Grid View -->
      <div v-else-if="viewMode === 'grid'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div
          v-for="type in filteredTypes"
          :key="type.id"
          class="card hover:shadow-lg transition-shadow cursor-pointer"
          @click="selectType(type)"
        >
          <div class="text-center">
            <div
              class="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold"
              :class="`type-${type.id}`"
            >
              {{ type.symbol || type.nameJa.charAt(0) }}
            </div>
            <h3 class="text-lg font-bold text-gray-900 mb-2">{{ type.nameJa }}</h3>
            <p class="text-sm text-gray-600 mb-4">{{ type.description || 'Pokemon type' }}</p>
            <div
              class="type-badge"
              :class="`type-${type.id}`"
            >
              {{ type.id.toUpperCase() }}
            </div>
          </div>
        </div>
      </div>

      <!-- List View -->
      <div v-else-if="viewMode === 'list'" class="space-y-4">
        <div
          v-for="type in filteredTypes"
          :key="type.id"
          class="card hover:shadow-lg transition-shadow cursor-pointer"
          @click="selectType(type)"
        >
          <div class="flex items-center space-x-4">
            <div
              class="w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-bold"
              :class="`type-${type.id}`"
            >
              {{ type.symbol || type.nameJa.charAt(0) }}
            </div>
            <div class="flex-1">
              <h3 class="text-lg font-bold text-gray-900">{{ type.nameJa }}</h3>
              <p class="text-sm text-gray-600">{{ type.description || 'Pokemon type' }}</p>
            </div>
            <div
              class="type-badge px-3 py-1 text-sm"
              :class="`type-${type.id}`"
            >
              {{ type.id.toUpperCase() }}
            </div>
          </div>
        </div>
      </div>

      <!-- Effectiveness Matrix View -->
      <div v-else-if="viewMode === 'matrix'" class="card overflow-x-auto">
        <h3 class="text-xl font-bold text-gray-900 mb-6">Type Effectiveness Matrix</h3>
        
        <div v-if="effectivenessMatrix" class="min-w-max">
          <table class="w-full">
            <thead>
              <tr>
                <th class="p-2 text-center font-medium text-gray-600">ATK \ DEF</th>
                <th
                  v-for="defendingType in matrixTypes"
                  :key="`def-${defendingType}`"
                  class="p-2 text-center"
                >
                  <div
                    class="w-8 h-8 rounded-full mx-auto flex items-center justify-center text-white text-xs font-bold"
                    :class="`type-${defendingType}`"
                  >
                    {{ getTypeSymbol(defendingType) }}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, attackingTypeIndex) in effectivenessMatrix.matrix" :key="`row-${attackingTypeIndex}`">
                <td class="p-2 text-center">
                  <div
                    class="w-8 h-8 rounded-full mx-auto flex items-center justify-center text-white text-xs font-bold"
                    :class="`type-${matrixTypes[attackingTypeIndex]}`"
                  >
                    {{ getTypeSymbol(matrixTypes[attackingTypeIndex]) }}
                  </div>
                </td>
                <td
                  v-for="(cell, defendingTypeIndex) in row"
                  :key="`cell-${attackingTypeIndex}-${defendingTypeIndex}`"
                  class="p-2 text-center"
                >
                  <div
                    class="w-8 h-8 rounded flex items-center justify-center text-sm font-bold text-white"
                    :class="getEffectivenessColor(cell.multiplier)"
                  >
                    {{ cell.multiplier }}×
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          
          <div class="mt-6 flex flex-wrap gap-4 justify-center text-sm">
            <div class="flex items-center space-x-2">
              <div class="w-4 h-4 bg-red-500 rounded"></div>
              <span>Super Effective (2×+)</span>
            </div>
            <div class="flex items-center space-x-2">
              <div class="w-4 h-4 bg-gray-400 rounded"></div>
              <span>Normal (1×)</span>
            </div>
            <div class="flex items-center space-x-2">
              <div class="w-4 h-4 bg-blue-500 rounded"></div>
              <span>Not Very Effective (0.5×)</span>
            </div>
            <div class="flex items-center space-x-2">
              <div class="w-4 h-4 bg-gray-800 rounded"></div>
              <span>No Effect (0×)</span>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-8">
          <div class="animate-spin w-6 h-6 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p class="text-gray-600">Loading effectiveness matrix...</p>
        </div>
      </div>

      <!-- Type Detail Modal -->
      <div
        v-if="selectedType"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        @click.self="closeTypeDetail"
      >
        <div class="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto">
          <div class="p-6">
            <div class="flex items-center justify-between mb-6">
              <div class="flex items-center space-x-4">
                <div
                  class="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold"
                  :class="`type-${selectedType.id}`"
                >
                  {{ selectedType.symbol || selectedType.nameJa.charAt(0) }}
                </div>
                <div>
                  <h2 class="text-2xl font-bold text-gray-900">{{ selectedType.nameJa }}</h2>
                  <p class="text-gray-600">{{ selectedType.id.toUpperCase() }} Type</p>
                </div>
              </div>
              <button
                @click="closeTypeDetail"
                class="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            <div v-if="selectedTypeDetail" class="space-y-6">
              <div>
                <h3 class="text-lg font-bold text-gray-900 mb-3">Description</h3>
                <p class="text-gray-700">{{ selectedType.description || 'A unique Pokemon type with distinctive characteristics.' }}</p>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div v-if="selectedTypeDetail.effectiveness?.strongAgainst?.length">
                  <h4 class="font-bold text-green-600 mb-2">Strong Against</h4>
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="type in selectedTypeDetail.effectiveness.strongAgainst"
                      :key="type"
                      class="type-badge text-sm"
                      :class="`type-${type}`"
                    >
                      {{ type }}
                    </span>
                  </div>
                </div>

                <div v-if="selectedTypeDetail.effectiveness?.weakAgainst?.length">
                  <h4 class="font-bold text-red-600 mb-2">Weak Against</h4>
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="type in selectedTypeDetail.effectiveness.weakAgainst"
                      :key="type"
                      class="type-badge text-sm"
                      :class="`type-${type}`"
                    >
                      {{ type }}
                    </span>
                  </div>
                </div>

                <div v-if="selectedTypeDetail.effectiveness?.resistantTo?.length">
                  <h4 class="font-bold text-blue-600 mb-2">Resistant To</h4>
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="type in selectedTypeDetail.effectiveness.resistantTo"
                      :key="type"
                      class="type-badge text-sm"
                      :class="`type-${type}`"
                    >
                      {{ type }}
                    </span>
                  </div>
                </div>

                <div v-if="selectedTypeDetail.effectiveness?.vulnerableTo?.length">
                  <h4 class="font-bold text-orange-600 mb-2">Vulnerable To</h4>
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="type in selectedTypeDetail.effectiveness.vulnerableTo"
                      :key="type"
                      class="type-badge text-sm"
                      :class="`type-${type}`"
                    >
                      {{ type }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div v-else class="text-center py-8">
              <div class="animate-spin w-6 h-6 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p class="text-gray-600">Loading type details...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, inject, onMounted } from 'vue';
import type { Application } from '@/application';

// Inject application instance
const app = inject<Application>('app')!;

// Reactive state
const isLoading = ref(true);
const types = ref<any[]>([]);
const searchQuery = ref('');
const viewMode = ref<'grid' | 'list' | 'matrix'>('grid');
const selectedType = ref<any>(null);
const selectedTypeDetail = ref<any>(null);
const effectivenessMatrix = ref<any>(null);

// Computed properties
const filteredTypes = computed(() => {
  if (!searchQuery.value) return types.value;
  
  const query = searchQuery.value.toLowerCase();
  return types.value.filter(type =>
    type.id.toLowerCase().includes(query) ||
    type.nameJa.toLowerCase().includes(query)
  );
});

const matrixTypes = computed(() => {
  return effectivenessMatrix.value?.types || [];
});

// Methods
async function loadTypes() {
  try {
    isLoading.value = true;
    const typeManagementUseCase = app.getTypeManagementUseCase();
    
    const response = await typeManagementUseCase.getAllTypes({
      language: 'ja',
      includeMetadata: true
    });
    
    types.value = response.types;
  } catch (error) {
    console.error('Failed to load types:', error);
    alert('Failed to load types. Please try again.');
  } finally {
    isLoading.value = false;
  }
}

async function loadEffectivenessMatrix() {
  try {
    const typeManagementUseCase = app.getTypeManagementUseCase();
    
    const response = await typeManagementUseCase.getTypeEffectivenessMatrix({
      format: 'full'
    });
    
    effectivenessMatrix.value = response;
  } catch (error) {
    console.error('Failed to load effectiveness matrix:', error);
  }
}

async function selectType(type: any) {
  selectedType.value = type;
  selectedTypeDetail.value = null; // Reset detail
  
  try {
    const typeManagementUseCase = app.getTypeManagementUseCase();
    
    const response = await typeManagementUseCase.getTypeDetails({
      typeId: type.id,
      language: 'ja',
      includeEffectiveness: true
    });
    
    selectedTypeDetail.value = response;
  } catch (error) {
    console.error('Failed to load type details:', error);
  }
}

function closeTypeDetail() {
  selectedType.value = null;
  selectedTypeDetail.value = null;
}

function getTypeSymbol(typeId: string): string {
  const type = types.value.find(t => t.id === typeId);
  return type?.symbol || type?.nameJa?.charAt(0) || typeId.charAt(0).toUpperCase();
}

function getEffectivenessColor(multiplier: number): string {
  if (multiplier > 1) return 'bg-red-500'; // Super effective
  if (multiplier < 1 && multiplier > 0) return 'bg-blue-500'; // Not very effective
  if (multiplier === 0) return 'bg-gray-800'; // No effect
  return 'bg-gray-400'; // Normal effectiveness
}

// Lifecycle
onMounted(async () => {
  document.title = 'Pokemon Type Quiz - Types';
  await loadTypes();
  await loadEffectivenessMatrix();
});
</script>

<style scoped>
.types-view {
  min-height: 80vh;
}

/* Type-specific background colors are defined in the global CSS */
</style>
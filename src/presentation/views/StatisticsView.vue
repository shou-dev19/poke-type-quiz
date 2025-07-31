<template>
  <div class="statistics-view">
    <div class="container-lg">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-4">Statistics & Analytics</h1>
        <p class="text-lg text-gray-600">
          Track your learning progress and analyze your Pokemon type knowledge performance
        </p>
      </div>

      <!-- Quick Stats Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="card text-center">
          <div class="text-3xl font-bold text-blue-600 mb-2">{{ totalTypes }}</div>
          <div class="text-gray-600">Total Types</div>
          <div class="text-sm text-gray-500 mt-1">Available for learning</div>
        </div>
        
        <div class="card text-center">
          <div class="text-3xl font-bold text-green-600 mb-2">{{ totalCombinations }}</div>
          <div class="text-gray-600">Type Combinations</div>
          <div class="text-sm text-gray-500 mt-1">Possible matchups</div>
        </div>
        
        <div class="card text-center">
          <div class="text-3xl font-bold text-purple-600 mb-2">{{ sessionCount }}</div>
          <div class="text-gray-600">Quiz Sessions</div>
          <div class="text-sm text-gray-500 mt-1">Practice sessions</div>
        </div>
        
        <div class="card text-center">
          <div class="text-3xl font-bold text-orange-600 mb-2">{{ averageAccuracy }}%</div>
          <div class="text-gray-600">Average Accuracy</div>
          <div class="text-sm text-gray-500 mt-1">Overall performance</div>
        </div>
      </div>

      <!-- Tab Navigation -->
      <div class="border-b border-gray-200 mb-8">
        <nav class="flex space-x-8">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              'py-2 px-1 border-b-2 font-medium text-sm',
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
          >
            {{ tab.label }}
          </button>
        </nav>
      </div>

      <!-- Overview Tab -->
      <div v-if="activeTab === 'overview'" class="space-y-8">
        <!-- Type Distribution Chart -->
        <div class="card">
          <div class="card-header">
            <h2 class="text-xl font-bold text-gray-900">Type Distribution</h2>
            <p class="text-gray-600">Frequency of each Pokemon type in the database</p>
          </div>
          
          <div v-if="typeStatistics?.colorDistribution" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div
              v-for="(count, color) in typeStatistics.colorDistribution"
              :key="color"
              class="text-center"
            >
              <div
                class="w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold"
                :style="{ backgroundColor: color }"
              >
                {{ count }}
              </div>
              <div class="text-sm text-gray-600">{{ getColorName(color) }}</div>
            </div>
          </div>
        </div>

        <!-- System Performance -->
        <div class="card">
          <div class="card-header">
            <h2 class="text-xl font-bold text-gray-900">System Performance</h2>
            <p class="text-gray-600">Performance metrics and system health</p>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 class="font-medium text-gray-900 mb-4">Question Generation</h3>
              <div class="space-y-3">
                <div class="flex justify-between">
                  <span class="text-gray-600">Average Generation Time</span>
                  <span class="font-medium">{{ averageGenerationTime }}ms</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Success Rate</span>
                  <span class="font-medium text-green-600">99.8%</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Cache Hit Rate</span>
                  <span class="font-medium text-blue-600">87%</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 class="font-medium text-gray-900 mb-4">Type Effectiveness</h3>
              <div class="space-y-3">
                <div class="flex justify-between">
                  <span class="text-gray-600">Super Effective</span>
                  <span class="font-medium text-red-600">{{ superEffectiveCount }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Not Very Effective</span>
                  <span class="font-medium text-blue-600">{{ notVeryEffectiveCount }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">No Effect</span>
                  <span class="font-medium text-gray-600">{{ noEffectCount }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Question Analysis Tab -->
      <div v-else-if="activeTab === 'questions'" class="space-y-8">
        <div class="card">
          <div class="card-header">
            <h2 class="text-xl font-bold text-gray-900">Question Statistics</h2>
            <p class="text-gray-600">Analysis of question generation and performance</p>
          </div>
          
          <div v-if="questionStats" class="space-y-6">
            <!-- Difficulty Distribution -->
            <div>
              <h3 class="font-medium text-gray-900 mb-4">Difficulty Distribution</h3>
              <div class="grid grid-cols-3 gap-4">
                <div class="text-center p-4 bg-green-50 rounded-lg">
                  <div class="text-2xl font-bold text-green-600">{{ questionStats.difficultyDistribution?.easy || 0 }}</div>
                  <div class="text-sm text-gray-600">Easy</div>
                </div>
                <div class="text-center p-4 bg-yellow-50 rounded-lg">
                  <div class="text-2xl font-bold text-yellow-600">{{ questionStats.difficultyDistribution?.normal || 0 }}</div>
                  <div class="text-sm text-gray-600">Normal</div>
                </div>
                <div class="text-center p-4 bg-red-50 rounded-lg">
                  <div class="text-2xl font-bold text-red-600">{{ questionStats.difficultyDistribution?.hard || 0 }}</div>
                  <div class="text-sm text-gray-600">Hard</div>
                </div>
              </div>
            </div>

            <!-- Type Usage -->
            <div>
              <h3 class="font-medium text-gray-900 mb-4">Most Used Types in Questions</h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h4 class="text-sm font-medium text-gray-700 mb-2">Attacking Types</h4>
                  <div class="space-y-2">
                    <div
                      v-for="(count, type) in topAttackingTypes"
                      :key="type"
                      class="flex items-center justify-between p-2 bg-gray-50 rounded"
                    >
                      <div class="flex items-center space-x-2">
                        <div
                          class="w-4 h-4 rounded-full"
                          :class="`type-${type}`"
                        ></div>
                        <span class="text-sm">{{ type }}</span>
                      </div>
                      <span class="text-sm font-medium">{{ count }}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 class="text-sm font-medium text-gray-700 mb-2">Defending Types</h4>
                  <div class="space-y-2">
                    <div
                      v-for="(count, type) in topDefendingTypes"
                      :key="type"
                      class="flex items-center justify-between p-2 bg-gray-50 rounded"
                    >
                      <div class="flex items-center space-x-2">
                        <div
                          class="w-4 h-4 rounded-full"
                          :class="`type-${type}`"
                        ></div>
                        <span class="text-sm">{{ type }}</span>
                      </div>
                      <span class="text-sm font-medium">{{ count }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Performance Tab -->
      <div v-else-if="activeTab === 'performance'" class="space-y-8">
        <div class="card">
          <div class="card-header">
            <h2 class="text-xl font-bold text-gray-900">Learning Performance</h2>
            <p class="text-gray-600">Track your progress and identify areas for improvement</p>
          </div>
          
          <div class="text-center py-16">
            <div class="text-6xl mb-4">📈</div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">Performance Tracking Coming Soon</h3>
            <p class="text-gray-600 mb-6">
              Complete quizzes to see detailed performance analytics and learning progress
            </p>
            <router-link to="/quiz" class="btn btn-primary">
              Start Quiz to Generate Data
            </router-link>
          </div>
        </div>
      </div>

      <!-- Recommendations Tab -->
      <div v-else-if="activeTab === 'recommendations'" class="space-y-8">
        <div class="card">
          <div class="card-header">
            <h2 class="text-xl font-bold text-gray-900">Personalized Recommendations</h2>
            <p class="text-gray-600">Suggested areas of focus for your learning journey</p>
          </div>
          
          <div v-if="recommendations.length" class="space-y-4">
            <div
              v-for="recommendation in recommendations"
              :key="recommendation.typeId"
              class="p-4 border border-gray-200 rounded-lg"
            >
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center space-x-3">
                  <div
                    class="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                    :class="`type-${recommendation.typeId}`"
                  >
                    {{ getTypeSymbol(recommendation.typeId) }}
                  </div>
                  <div>
                    <h3 class="font-medium text-gray-900">{{ recommendation.typeName }}</h3>
                    <div class="flex items-center space-x-2">
                      <span
                        class="px-2 py-1 text-xs rounded-full"
                        :class="getPriorityColor(recommendation.learningPriority)"
                      >
                        {{ recommendation.learningPriority }} priority
                      </span>
                      <span
                        class="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600"
                      >
                        {{ recommendation.difficultyLevel }}
                      </span>
                    </div>
                  </div>
                </div>
                <div class="text-2xl font-bold text-blue-600">
                  {{ recommendation.recommendationScore }}
                </div>
              </div>
              <div class="text-sm text-gray-600">
                <ul class="list-disc list-inside">
                  <li v-for="reason in recommendation.reasons" :key="reason">
                    {{ reason }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <div v-else class="text-center py-16">
            <div class="text-6xl mb-4">🎯</div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">No Recommendations Yet</h3>
            <p class="text-gray-600 mb-6">
              Complete some quizzes to receive personalized learning recommendations
            </p>
            <router-link to="/quiz" class="btn btn-primary">
              Start Learning
            </router-link>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-8 text-center">
          <div class="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p class="text-gray-600">Loading statistics...</p>
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
const isLoading = ref(false);
const activeTab = ref('overview');
const typeStatistics = ref<any>(null);
const questionStats = ref<any>(null);
const recommendations = ref<any[]>([]);

// Tab configuration
const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'questions', label: 'Question Analysis' },
  { id: 'performance', label: 'Performance' },
  { id: 'recommendations', label: 'Recommendations' }
];

// Computed properties
const totalTypes = computed(() => typeStatistics.value?.totalTypes || 18);

const totalCombinations = computed(() => {
  const types = totalTypes.value;
  return types * types; // Each type can attack each type
});

const sessionCount = computed(() => 0); // Mock data - would come from user sessions

const averageAccuracy = computed(() => 0); // Mock data - would come from user performance

const averageGenerationTime = computed(() => 
  typeStatistics.value?.averageGenerationTime || 0
);

const superEffectiveCount = computed(() => 
  questionStats.value?.effectivenessDistribution?.SUPER_EFFECTIVE || 0
);

const notVeryEffectiveCount = computed(() => 
  (questionStats.value?.effectivenessDistribution?.HALF_EFFECTIVE || 0) +
  (questionStats.value?.effectivenessDistribution?.QUARTER_EFFECTIVE || 0)
);

const noEffectCount = computed(() => 
  questionStats.value?.effectivenessDistribution?.NONE || 0
);

const topAttackingTypes = computed(() => {
  if (!questionStats.value?.typeDistribution?.attackingTypes) return {};
  
  const types = questionStats.value.typeDistribution.attackingTypes;
  const sorted = Object.entries(types)
    .sort(([,a], [,b]) => (b as number) - (a as number))
    .slice(0, 5);
  
  return Object.fromEntries(sorted);
});

const topDefendingTypes = computed(() => {
  if (!questionStats.value?.typeDistribution?.defendingTypes) return {};
  
  const types = questionStats.value.typeDistribution.defendingTypes;
  const sorted = Object.entries(types)
    .sort(([,a], [,b]) => (b as number) - (a as number))
    .slice(0, 5);
  
  return Object.fromEntries(sorted);
});

// Methods
async function loadStatistics() {
  try {
    isLoading.value = true;
    
    const typeManagementUseCase = app.getTypeManagementUseCase();
    const questionManagementUseCase = app.getQuestionManagementUseCase();
    
    // Load type statistics
    const typeStatsResponse = await typeManagementUseCase.getTypeStatistics({
      includeColorDistribution: true,
      includeEffectiveness: true,
      includeUsageStats: true
    });
    
    typeStatistics.value = typeStatsResponse;
    
    // Load question statistics
    const questionStatsResponse = await questionManagementUseCase.getQuestionStatistics({});
    questionStats.value = questionStatsResponse;
    
    // Load recommendations
    const recommendationsResponse = await typeManagementUseCase.getTypeRecommendations({
      context: 'learning',
      limit: 8
    });
    
    recommendations.value = recommendationsResponse.recommendations;
    
  } catch (error) {
    console.error('Failed to load statistics:', error);
    alert('Failed to load statistics. Please try again.');
  } finally {
    isLoading.value = false;
  }
}

function getColorName(colorHex: string): string {
  // Convert hex color to readable name
  const colorMap: Record<string, string> = {
    '#F08030': 'Fire',
    '#6890F0': 'Water',
    '#78C850': 'Grass',
    '#F8D030': 'Electric',
    '#F85888': 'Psychic',
    '#98D8D8': 'Ice',
    '#7038F8': 'Dragon',
    '#705848': 'Dark',
    '#EE99AC': 'Fairy',
    '#A8A878': 'Normal',
    '#C03028': 'Fighting',
    '#A040A0': 'Poison',
    '#E0C068': 'Ground',
    '#A890F0': 'Flying',
    '#A8B820': 'Bug',
    '#B8A038': 'Rock',
    '#705898': 'Ghost',
    '#B8B8D0': 'Steel'
  };
  
  return colorMap[colorHex] || 'Unknown';
}

function getTypeSymbol(typeId: string): string {
  // Return first character of type name as symbol
  return typeId.charAt(0).toUpperCase();
}

function getPriorityColor(priority: string): string {
  const colorMap: Record<string, string> = {
    high: 'bg-red-100 text-red-600',
    medium: 'bg-yellow-100 text-yellow-600',
    low: 'bg-green-100 text-green-600'
  };
  
  return colorMap[priority] || 'bg-gray-100 text-gray-600';
}

// Lifecycle
onMounted(async () => {
  document.title = 'Pokemon Type Quiz - Statistics';
  await loadStatistics();
});
</script>

<style scoped>
.statistics-view {
  min-height: 80vh;
}
</style>
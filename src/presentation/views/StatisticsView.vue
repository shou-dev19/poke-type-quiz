<template>
  <div class="statistics-view">
    <!-- Header Section -->
    <div class="statistics-header">
      <div class="header-content">
        <div class="header-icon">📊</div>
        <h1 class="header-title">Statistics & Analytics</h1>
        <p class="header-description">
          Track your learning progress and analyze your Pokemon type knowledge performance
        </p>
      </div>
    </div>

    <!-- Quick Stats Overview -->
    <div class="stats-overview">
      <div class="overview-container">
        <StatsCard
          :value="totalTypes"
          label="Total Types"
          description="Available for learning"
          icon="🎯"
          color="blue"
          size="lg"
          animated
        />
        
        <StatsCard
          :value="totalCombinations"
          label="Type Combinations"
          description="Possible matchups"
          icon="⚔️"
          color="green"
          size="lg"
          animated
        />
        
        <StatsCard
          :value="sessionCount"
          label="Quiz Sessions"
          description="Practice sessions"
          icon="🎮"
          color="purple"
          size="lg"
          animated
        />
        
        <StatsCard
          :value="`${averageAccuracy}%`"
          label="Average Accuracy"
          description="Overall performance"
          icon="✅"
          color="yellow"
          size="lg"
          animated
          :trend="accuracyTrend"
        />
      </div>
    </div>

    <!-- Tab Navigation -->
    <div class="tabs-section">
      <div class="tabs-container">
        <div class="tabs-nav">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="getTabClass(tab.id)"
          >
            <span class="tab-icon">{{ tab.icon }}</span>
            <span class="tab-label">{{ tab.label }}</span>
            <span v-if="tab.badge" class="tab-badge">{{ tab.badge }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <LoadingSpinner
      v-if="isLoading"
      message="Loading statistics..."
      overlay
      color="white"
      size="lg"
    />

    <!-- Tab Content -->
    <div v-else class="tab-content">
      <!-- Overview Tab -->
      <div v-if="activeTab === 'overview'" class="tab-pane overview-pane">
        <!-- Type Distribution Chart -->
        <div class="content-card">
          <div class="card-header">
            <div class="header-info">
              <h2 class="card-title">Type Distribution</h2>
              <p class="card-description">Frequency of each Pokemon type in the database</p>
            </div>
            <div class="header-actions">
              <button class="action-btn" @click="handleRefreshTypeStats">
                <span class="btn-icon">🔄</span>
                Refresh
              </button>
            </div>
          </div>
          
          <div v-if="typeStatistics?.colorDistribution" class="type-distribution">
            <div
              v-for="(count, color) in typeStatistics.colorDistribution"
              :key="color"
              class="distribution-item"
            >
              <div
                class="distribution-circle"
                :style="{ backgroundColor: color }"
              >
                {{ count }}
              </div>
              <div class="distribution-label">{{ getColorName(color) }}</div>
            </div>
          </div>
        </div>

        <!-- System Performance -->
        <div class="content-card">
          <div class="card-header">
            <div class="header-info">
              <h2 class="card-title">System Performance</h2>
              <p class="card-description">Performance metrics and system health</p>
            </div>
          </div>
          
          <div class="performance-grid">
            <div class="performance-section">
              <h3 class="section-title">Question Generation</h3>
              <div class="metrics-list">
                <div class="metric-item">
                  <span class="metric-label">Average Generation Time</span>
                  <span class="metric-value">{{ averageGenerationTime }}ms</span>
                </div>
                <div class="metric-item">
                  <span class="metric-label">Success Rate</span>
                  <span class="metric-value success">99.8%</span>
                </div>
                <div class="metric-item">
                  <span class="metric-label">Cache Hit Rate</span>
                  <span class="metric-value info">87%</span>
                </div>
              </div>
            </div>
            
            <div class="performance-section">
              <h3 class="section-title">Type Effectiveness</h3>
              <div class="metrics-list">
                <div class="metric-item">
                  <span class="metric-label">Super Effective</span>
                  <span class="metric-value danger">{{ superEffectiveCount }}</span>
                </div>
                <div class="metric-item">
                  <span class="metric-label">Not Very Effective</span>
                  <span class="metric-value info">{{ notVeryEffectiveCount }}</span>
                </div>
                <div class="metric-item">
                  <span class="metric-label">No Effect</span>
                  <span class="metric-value muted">{{ noEffectCount }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Question Analysis Tab -->
      <div v-else-if="activeTab === 'questions'" class="tab-pane questions-pane">
        <div class="content-card">
          <div class="card-header">
            <div class="header-info">
              <h2 class="card-title">Question Statistics</h2>
              <p class="card-description">Analysis of question generation and performance</p>
            </div>
          </div>
          
          <div v-if="questionStats" class="questions-content">
            <!-- Difficulty Distribution -->
            <div class="analysis-section">
              <h3 class="section-title">Difficulty Distribution</h3>
              <div class="difficulty-stats">
                <StatsCard
                  :value="questionStats.difficultyDistribution?.easy || 0"
                  label="Easy Questions"
                  icon="😊"
                  color="green"
                  size="md"
                  animated
                />
                <StatsCard
                  :value="questionStats.difficultyDistribution?.normal || 0"
                  label="Normal Questions"
                  icon="🤔"
                  color="yellow"
                  size="md"
                  animated
                />
                <StatsCard
                  :value="questionStats.difficultyDistribution?.hard || 0"
                  label="Hard Questions"
                  icon="😤"
                  color="red"
                  size="md"
                  animated
                />
              </div>
            </div>

            <!-- Type Usage -->
            <div class="analysis-section">
              <h3 class="section-title">Most Used Types in Questions</h3>
              <div class="type-usage-grid">
                <div class="usage-column">
                  <h4 class="column-title">Attacking Types</h4>
                  <div class="type-list">
                    <div
                      v-for="(count, type) in topAttackingTypes"
                      :key="type"
                      class="type-item"
                    >
                      <TypeBadge
                        :type="type"
                        size="sm"
                        show-icon
                      />
                      <span class="type-count">{{ count }}</span>
                    </div>
                  </div>
                </div>
                
                <div class="usage-column">
                  <h4 class="column-title">Defending Types</h4>
                  <div class="type-list">
                    <div
                      v-for="(count, type) in topDefendingTypes"
                      :key="type"
                      class="type-item"
                    >
                      <TypeBadge
                        :type="type"
                        size="sm"
                        show-icon
                      />
                      <span class="type-count">{{ count }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Performance Tab -->
      <div v-else-if="activeTab === 'performance'" class="tab-pane performance-pane">
        <div class="content-card">
          <div class="card-header">
            <div class="header-info">
              <h2 class="card-title">Learning Performance</h2>
              <p class="card-description">Track your progress and identify areas for improvement</p>
            </div>
          </div>
          
          <div class="empty-state">
            <div class="empty-icon">📈</div>
            <h3 class="empty-title">Performance Tracking Coming Soon</h3>
            <p class="empty-description">
              Complete quizzes to see detailed performance analytics and learning progress
            </p>
            <div class="empty-actions">
              <router-link to="/quiz" class="action-btn primary">
                <span class="btn-icon">🚀</span>
                Start Quiz to Generate Data
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <!-- Recommendations Tab -->
      <div v-else-if="activeTab === 'recommendations'" class="tab-pane recommendations-pane">
        <div class="content-card">
          <div class="card-header">
            <div class="header-info">
              <h2 class="card-title">Personalized Recommendations</h2>
              <p class="card-description">Suggested areas of focus for your learning journey</p>
            </div>
            <div class="header-actions">
              <button class="action-btn" @click="handleRefreshRecommendations">
                <span class="btn-icon">🔄</span>
                Refresh
              </button>
            </div>
          </div>
          
          <div v-if="recommendations.length" class="recommendations-list">
            <div
              v-for="recommendation in recommendations"
              :key="recommendation.typeId"
              class="recommendation-card"
            >
              <div class="recommendation-header">
                <div class="recommendation-info">
                  <TypeBadge
                    :type="recommendation.typeId"
                    size="lg"
                    show-icon
                  />
                  <div class="info-details">
                    <h3 class="recommendation-title">{{ recommendation.typeName }}</h3>
                    <div class="recommendation-tags">
                      <span
                        class="priority-tag"
                        :class="getPriorityClass(recommendation.learningPriority)"
                      >
                        {{ recommendation.learningPriority }} priority
                      </span>
                      <span class="difficulty-tag">
                        {{ recommendation.difficultyLevel }}
                      </span>
                    </div>
                  </div>
                </div>
                <div class="recommendation-score">
                  {{ recommendation.recommendationScore }}
                </div>
              </div>
              <div class="recommendation-reasons">
                <ul class="reasons-list">
                  <li v-for="reason in recommendation.reasons" :key="reason" class="reason-item">
                    <span class="reason-bullet">•</span>
                    <span class="reason-text">{{ reason }}</span>
                  </li>
                </ul>
              </div>
              <div class="recommendation-actions">
                <router-link
                  :to="`/quiz?focus=${recommendation.typeId}`"
                  class="action-btn primary small"
                >
                  <span class="btn-icon">🎯</span>
                  Practice This Type
                </router-link>
              </div>
            </div>
          </div>
          
          <div v-else class="empty-state">
            <div class="empty-icon">🎯</div>
            <h3 class="empty-title">No Recommendations Yet</h3>
            <p class="empty-description">
              Complete some quizzes to receive personalized learning recommendations
            </p>
            <div class="empty-actions">
              <router-link to="/quiz" class="action-btn primary">
                <span class="btn-icon">🚀</span>
                Start Learning
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { StatsCard, LoadingSpinner, TypeBadge } from '@/presentation/components';
import { useStatistics } from '@/presentation/composables';

// Use the statistics composable
const {
  // State
  isLoading,
  typeStatistics,
  questionStats,
  recommendations,
  
  // Computed
  totalTypes,
  totalCombinations,
  sessionCount,
  averageAccuracy,
  accuracyTrend,
  averageGenerationTime,
  superEffectiveCount,
  notVeryEffectiveCount,
  noEffectCount,
  topAttackingTypes,
  topDefendingTypes,
  
  // Methods
  loadStatistics,
  refreshTypeStats,
  refreshRecommendations,
  getColorName,
  getPriorityClass
} = useStatistics();

// Local state for active tab
const activeTab = ref('overview');

// Tab configuration
const tabs = [
  { 
    id: 'overview', 
    label: 'Overview', 
    icon: '📊',
    badge: null
  },
  { 
    id: 'questions', 
    label: 'Question Analysis', 
    icon: '❓',
    badge: null
  },
  { 
    id: 'performance', 
    label: 'Performance', 
    icon: '📈',
    badge: 'Soon'
  },
  { 
    id: 'recommendations', 
    label: 'Recommendations', 
    icon: '🎯',
    badge: recommendations.value.length || null
  }
];

// Methods for handling UI interactions
async function handleRefreshTypeStats() {
  try {
    await refreshTypeStats();
  } catch (error) {
    console.error('Failed to refresh type statistics:', error);
    alert('Failed to refresh type statistics. Please try again.');
  }
}

async function handleRefreshRecommendations() {
  try {
    await refreshRecommendations();
  } catch (error) {
    console.error('Failed to refresh recommendations:', error);
    alert('Failed to refresh recommendations. Please try again.');
  }
}

// Helper functions for styling
function getTabClass(tabId: string) {
  const baseClasses = 'tab-button';
  const activeClass = activeTab.value === tabId ? 'active' : '';
  return `${baseClasses} ${activeClass}`;
}

// Lifecycle
onMounted(async () => {
  document.title = 'Pokemon Type Quiz - Statistics';
  try {
    await loadStatistics();
  } catch (error) {
    console.error('Failed to load statistics:', error);
    alert('Failed to load statistics. Please try again.');
  }
});
</script>

<style scoped>
.statistics-view {
  @apply min-h-screen bg-gradient-to-br from-purple-50 to-pink-50;
}

/* Header Section */
.statistics-header {
  @apply bg-gradient-to-r from-purple-600 to-pink-600 text-white py-16;
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
  @apply text-xl text-purple-100 max-w-2xl mx-auto;
}

/* Stats Overview */
.stats-overview {
  @apply py-12;
}

.overview-container {
  @apply container-lg grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6;
}

/* Tabs Section */
.tabs-section {
  @apply bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10;
}

.tabs-container {
  @apply container-lg;
}

.tabs-nav {
  @apply flex overflow-x-auto scrollbar-hide;
}

.tab-button {
  @apply flex-shrink-0 px-6 py-4 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 transition-all duration-200 flex items-center gap-3 font-medium;
}

.tab-button.active {
  @apply border-purple-500 text-purple-600;
}

.tab-icon {
  @apply text-lg;
}

.tab-label {
  @apply whitespace-nowrap;
}

.tab-badge {
  @apply px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full;
}

.tab-button.active .tab-badge {
  @apply bg-purple-100 text-purple-600;
}

/* Tab Content */
.tab-content {
  @apply container-lg py-8;
}

.tab-pane {
  @apply space-y-8;
}

/* Content Cards */
.content-card {
  @apply bg-white rounded-2xl shadow-lg overflow-hidden;
}

.card-header {
  @apply p-6 border-b border-gray-100 flex items-center justify-between;
}

.header-info {
  @apply flex-1;
}

.card-title {
  @apply text-xl font-bold text-gray-900 mb-1;
}

.card-description {
  @apply text-gray-600;
}

.header-actions {
  @apply flex-shrink-0;
}

.action-btn {
  @apply px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2 font-medium text-sm;
}

.action-btn.primary {
  @apply bg-purple-600 text-white hover:bg-purple-700;
}

.action-btn.small {
  @apply px-3 py-1 text-xs;
}

.btn-icon {
  @apply text-base;
}

/* Type Distribution */
.type-distribution {
  @apply p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4;
}

.distribution-item {
  @apply text-center;
}

.distribution-circle {
  @apply w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold text-sm;
}

.distribution-label {
  @apply text-sm text-gray-600;
}

/* Performance Grid */
.performance-grid {
  @apply p-6 grid grid-cols-1 md:grid-cols-2 gap-8;
}

.performance-section {
  @apply space-y-4;
}

.section-title {
  @apply font-bold text-gray-900 text-lg border-b border-gray-200 pb-2;
}

.metrics-list {
  @apply space-y-3;
}

.metric-item {
  @apply flex justify-between items-center;
}

.metric-label {
  @apply text-gray-600;
}

.metric-value {
  @apply font-bold;
}

.metric-value.success {
  @apply text-green-600;
}

.metric-value.info {
  @apply text-blue-600;
}

.metric-value.danger {
  @apply text-red-600;
}

.metric-value.muted {
  @apply text-gray-600;
}

/* Questions Content */
.questions-content {
  @apply p-6 space-y-8;
}

.analysis-section {
  @apply space-y-6;
}

.difficulty-stats {
  @apply grid grid-cols-1 sm:grid-cols-3 gap-6;
}

.type-usage-grid {
  @apply grid grid-cols-1 sm:grid-cols-2 gap-8;
}

.usage-column {
  @apply space-y-4;
}

.column-title {
  @apply font-medium text-gray-700 text-sm;
}

.type-list {
  @apply space-y-3;
}

.type-item {
  @apply flex items-center justify-between p-3 bg-gray-50 rounded-lg;
}

.type-count {
  @apply font-bold text-gray-900;
}

/* Recommendations */
.recommendations-list {
  @apply p-6 space-y-6;
}

.recommendation-card {
  @apply border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow;
}

.recommendation-header {
  @apply flex items-center justify-between mb-4;
}

.recommendation-info {
  @apply flex items-center gap-4;
}

.info-details {
  @apply space-y-2;
}

.recommendation-title {
  @apply font-bold text-gray-900;
}

.recommendation-tags {
  @apply flex items-center gap-2;
}

.priority-tag {
  @apply px-2 py-1 text-xs rounded-full font-medium;
}

.priority-tag.high-priority {
  @apply bg-red-100 text-red-600;
}

.priority-tag.medium-priority {
  @apply bg-yellow-100 text-yellow-600;
}

.priority-tag.low-priority {
  @apply bg-green-100 text-green-600;
}

.difficulty-tag {
  @apply px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600;
}

.recommendation-score {
  @apply text-2xl font-bold text-purple-600;
}

.recommendation-reasons {
  @apply mb-4;
}

.reasons-list {
  @apply space-y-1;
}

.reason-item {
  @apply flex items-start gap-2 text-sm text-gray-700;
}

.reason-bullet {
  @apply text-purple-600 font-bold;
}

.reason-text {
  @apply flex-1;
}

.recommendation-actions {
  @apply pt-4 border-t border-gray-100;
}

/* Empty State */
.empty-state {
  @apply text-center py-16;
}

.empty-icon {
  @apply text-6xl mb-4 opacity-75;
}

.empty-title {
  @apply text-2xl font-bold text-gray-900 mb-2;
}

.empty-description {
  @apply text-gray-600 mb-6 max-w-md mx-auto;
}

.empty-actions {
  @apply flex justify-center;
}

/* Responsive Design */
@media (max-width: 768px) {
  .performance-grid {
    @apply grid-cols-1;
  }
  
  .type-usage-grid {
    @apply grid-cols-1;
  }
  
  .recommendation-header {
    @apply flex-col items-start gap-4;
  }
  
  .recommendation-info {
    @apply w-full;
  }
  
  .recommendation-score {
    @apply self-end;
  }
}

@media (max-width: 640px) {
  .overview-container {
    @apply grid-cols-1;
  }
  
  .difficulty-stats {
    @apply grid-cols-1;
  }
  
  .type-distribution {
    @apply grid-cols-2;
  }
}

/* Animation Classes */
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.content-card {
  animation: slideInUp 0.5s ease-out;
}

.content-card:nth-child(even) {
  animation-delay: 0.1s;
}

.recommendation-card {
  animation: slideInUp 0.3s ease-out;
}

.recommendation-card:nth-child(n) {
  animation-delay: calc(var(--item-index, 0) * 0.1s);
}

/* Scrollbar Hide */
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
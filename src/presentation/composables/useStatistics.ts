import { ref, computed, inject } from 'vue';
import type { Application } from '@/application';

interface StatisticsData {
  totalTypes?: number;
  colorDistribution?: Record<string, number>;
  averageGenerationTime?: number;
}

interface QuestionStats {
  difficultyDistribution?: {
    easy?: number;
    normal?: number;
    hard?: number;
  };
  effectivenessDistribution?: {
    SUPER_EFFECTIVE?: number;
    HALF_EFFECTIVE?: number;
    QUARTER_EFFECTIVE?: number;
    NONE?: number;
  };
  typeDistribution?: {
    attackingTypes?: Record<string, number>;
    defendingTypes?: Record<string, number>;
  };
}

interface Recommendation {
  typeId: string;
  typeName: string;
  learningPriority: 'high' | 'medium' | 'low';
  difficultyLevel: string;
  recommendationScore: number;
  reasons: string[];
}

export function useStatistics() {
  const app = inject<Application>('app')!;
  
  // State
  const isLoading = ref(false);
  const typeStatistics = ref<StatisticsData | null>(null);
  const questionStats = ref<QuestionStats | null>(null);
  const recommendations = ref<Recommendation[]>([]);
  
  // Computed properties
  const totalTypes = computed(() => typeStatistics.value?.totalTypes || 18);
  
  const totalCombinations = computed(() => {
    const types = totalTypes.value;
    return types * types; // Each type can attack each type
  });
  
  const sessionCount = computed(() => 0); // Mock data - would come from user sessions
  
  const averageAccuracy = computed(() => 0); // Mock data - would come from user performance
  
  const accuracyTrend = computed(() => ({
    direction: 'up' as const,
    text: 'Improving'
  }));
  
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
      throw new Error('Failed to load statistics. Please try again.');
    } finally {
      isLoading.value = false;
    }
  }
  
  async function refreshTypeStats() {
    try {
      const typeManagementUseCase = app.getTypeManagementUseCase();
      
      const typeStatsResponse = await typeManagementUseCase.getTypeStatistics({
        includeColorDistribution: true,
        includeEffectiveness: true,
        includeUsageStats: true
      });
      
      typeStatistics.value = typeStatsResponse;
    } catch (error) {
      console.error('Failed to refresh type statistics:', error);
      throw error;
    }
  }
  
  async function refreshRecommendations() {
    try {
      const typeManagementUseCase = app.getTypeManagementUseCase();
      
      const recommendationsResponse = await typeManagementUseCase.getTypeRecommendations({
        context: 'learning',
        limit: 8
      });
      
      recommendations.value = recommendationsResponse.recommendations;
    } catch (error) {
      console.error('Failed to refresh recommendations:', error);
      throw error;
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
  
  function getPriorityClass(priority: string): string {
    const classMap: Record<string, string> = {
      high: 'high-priority',
      medium: 'medium-priority',
      low: 'low-priority'
    };
    
    return classMap[priority] || 'medium-priority';
  }
  
  return {
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
  };
}
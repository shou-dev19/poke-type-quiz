import { ref, computed, inject } from 'vue';
import type { Application } from '@/application';
import type { TypeId } from '@/domain/types';

interface PokemonType {
  id: TypeId;
  nameJa: string;
  description?: string;
  color: string;
  symbol?: string;
}

interface TypeDetails {
  effectiveness?: {
    strongAgainst?: TypeId[];
    weakAgainst?: TypeId[];
    resistantTo?: TypeId[];
    vulnerableTo?: TypeId[];
  };
}

interface EffectivenessMatrix {
  types: TypeId[];
  matrix: Array<Array<{
    multiplier: number;
  }>>;
}

export function useTypes() {
  const app = inject<Application>('app')!;
  
  // State
  const isLoading = ref(false);
  const types = ref<PokemonType[]>([]);
  const selectedType = ref<PokemonType | null>(null);
  const selectedTypeDetail = ref<TypeDetails | null>(null);
  const effectivenessMatrix = ref<EffectivenessMatrix | null>(null);
  const searchQuery = ref('');
  
  // Computed
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
      throw new Error('Failed to load types. Please try again.');
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
      throw error;
    }
  }
  
  async function selectType(type: PokemonType) {
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
      throw error;
    }
  }
  
  function clearSelectedType() {
    selectedType.value = null;
    selectedTypeDetail.value = null;
  }
  
  function getTypeSymbol(typeId: TypeId): string {
    const type = types.value.find(t => t.id === typeId);
    return type?.symbol || type?.nameJa?.charAt(0) || typeId.charAt(0).toUpperCase();
  }
  
  function getEffectivenessColor(multiplier: number): string {
    if (multiplier > 1) return 'bg-red-500'; // Super effective
    if (multiplier < 1 && multiplier > 0) return 'bg-blue-500'; // Not very effective
    if (multiplier === 0) return 'bg-gray-800'; // No effect
    return 'bg-gray-400'; // Normal effectiveness
  }
  
  function getTypeColor(typeId: TypeId): string {
    const type = types.value.find(t => t.id === typeId);
    return type?.color || '#6b7280';
  }
  
  function getTypeName(typeId: TypeId): string {
    const type = types.value.find(t => t.id === typeId);
    return type?.nameJa || typeId;
  }
  
  return {
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
    clearSelectedType,
    getTypeSymbol,
    getEffectivenessColor,
    getTypeColor,
    getTypeName
  };
}
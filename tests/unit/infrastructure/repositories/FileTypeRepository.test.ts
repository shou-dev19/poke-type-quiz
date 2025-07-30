/**
 * FileTypeRepository Unit Tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { FileTypeRepository } from '@/infrastructure/repositories/FileTypeRepository';
import { PokemonType } from '@/domain/entities/PokemonType';
import type { TypeId, PokemonTypeData } from '@/domain/types';

describe('FileTypeRepository', () => {
  let repository: FileTypeRepository;

  beforeEach(() => {
    repository = new FileTypeRepository();
  });

  describe('getAllTypes', () => {
    it('should return all 18 Pokemon types', async () => {
      const types = await repository.getAllTypes();
      
      expect(types).toHaveLength(18);
      expect(types.every(type => type instanceof PokemonType)).toBe(true);
      
      // Check that all expected types are present
      const typeIds = types.map(type => type.id);
      const expectedTypes: TypeId[] = [
        'normal', 'fire', 'water', 'electric', 'grass', 'ice',
        'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
        'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
      ];
      
      for (const expectedType of expectedTypes) {
        expect(typeIds).toContain(expectedType);
      }
    });

    it('should return immutable array', async () => {
      const types1 = await repository.getAllTypes();
      const types2 = await repository.getAllTypes();
      
      expect(types1).not.toBe(types2); // Different array instances
      expect(types1).toEqual(types2); // Same content
    });
  });

  describe('getTypeById', () => {
    it('should return correct type for valid ID', async () => {
      const fireType = await repository.getTypeById('fire');
      
      expect(fireType).toBeInstanceOf(PokemonType);
      expect(fireType?.id).toBe('fire');
      expect(fireType?.nameJa).toBe('ほのお');
      expect(fireType?.color).toBe('#F08030');
    });

    it('should return null for invalid ID', async () => {
      const invalidType = await repository.getTypeById('invalid' as TypeId);
      expect(invalidType).toBeNull();
    });

    it('should cache results', async () => {
      const fireType1 = await repository.getTypeById('fire');
      const fireType2 = await repository.getTypeById('fire');
      
      expect(fireType1).toBe(fireType2); // Same instance due to caching
    });
  });

  describe('getTypesByIds', () => {
    it('should return multiple types for valid IDs', async () => {
      const types = await repository.getTypesByIds(['fire', 'water', 'grass']);
      
      expect(types).toHaveLength(3);
      expect(types[0].id).toBe('fire');
      expect(types[1].id).toBe('water');
      expect(types[2].id).toBe('grass');
    });

    it('should skip invalid IDs', async () => {
      const types = await repository.getTypesByIds(['fire', 'invalid' as TypeId, 'water']);
      
      expect(types).toHaveLength(2);
      expect(types[0].id).toBe('fire');
      expect(types[1].id).toBe('water');
    });

    it('should return empty array for empty input', async () => {
      const types = await repository.getTypesByIds([]);
      expect(types).toHaveLength(0);
    });
  });

  describe('exists', () => {
    it('should return true for valid type ID', async () => {
      const exists = await repository.exists('fire');
      expect(exists).toBe(true);
    });

    it('should return false for invalid type ID', async () => {
      const exists = await repository.exists('invalid' as TypeId);
      expect(exists).toBe(false);
    });
  });

  describe('getBasicTypes', () => {
    it('should return 8 basic types', async () => {
      const basicTypes = await repository.getBasicTypes();
      
      expect(basicTypes).toHaveLength(8);
      
      const basicTypeIds = basicTypes.map(type => type.id);
      const expectedBasicTypes: TypeId[] = [
        'normal', 'fire', 'water', 'electric', 'grass', 'ice', 'fighting', 'poison'
      ];
      
      for (const expectedType of expectedBasicTypes) {
        expect(basicTypeIds).toContain(expectedType);
      }
    });

    it('should not include advanced types', async () => {
      const basicTypes = await repository.getBasicTypes();
      const basicTypeIds = basicTypes.map(type => type.id);
      
      const advancedTypes: TypeId[] = ['ground', 'flying', 'psychic', 'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'];
      
      for (const advancedType of advancedTypes) {
        expect(basicTypeIds).not.toContain(advancedType);
      }
    });
  });

  describe('getAdvancedTypes', () => {
    it('should return 10 advanced types', async () => {
      const advancedTypes = await repository.getAdvancedTypes();
      
      expect(advancedTypes).toHaveLength(10);
      
      const advancedTypeIds = advancedTypes.map(type => type.id);
      const expectedAdvancedTypes: TypeId[] = [
        'ground', 'flying', 'psychic', 'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
      ];
      
      for (const expectedType of expectedAdvancedTypes) {
        expect(advancedTypeIds).toContain(expectedType);
      }
    });

    it('should not include basic types', async () => {
      const advancedTypes = await repository.getAdvancedTypes();
      const advancedTypeIds = advancedTypes.map(type => type.id);
      
      const basicTypes: TypeId[] = ['normal', 'fire', 'water', 'electric', 'grass', 'ice', 'fighting', 'poison'];
      
      for (const basicType of basicTypes) {
        expect(advancedTypeIds).not.toContain(basicType);
      }
    });
  });

  describe('searchByName', () => {
    it('should find types by exact match', async () => {
      const types = await repository.searchByName('ほのお', true);
      
      expect(types).toHaveLength(1);
      expect(types[0].id).toBe('fire');
      expect(types[0].nameJa).toBe('ほのお');
    });

    it('should find types by partial match', async () => {
      const types = await repository.searchByName('エ', false);
      
      expect(types.length).toBeGreaterThan(0);
      expect(types.some(type => type.nameJa.includes('エ'))).toBe(true);
    });

    it('should return empty array for no matches', async () => {
      const types = await repository.searchByName('存在しないタイプ', true);
      expect(types).toHaveLength(0);
    });

    it('should return empty array for empty query', async () => {
      const types = await repository.searchByName('', false);
      expect(types).toHaveLength(0);
    });

    it('should handle whitespace in query', async () => {
      const types = await repository.searchByName('  ほのお  ', true);
      
      expect(types).toHaveLength(1);
      expect(types[0].id).toBe('fire');
    });
  });

  describe('filterByColor', () => {
    it('should find types with similar colors', async () => {
      // Use fire type's actual color for exact match
      const types = await repository.filterByColor('#F08030', 50);
      
      expect(types.length).toBeGreaterThan(0);
      expect(types.some(type => type.id === 'fire')).toBe(true);
    });

    it('should respect tolerance parameter', async () => {
      const strictTypes = await repository.filterByColor('#F08030', 10); // Very strict
      const lenientTypes = await repository.filterByColor('#F08030', 100); // More lenient
      
      expect(strictTypes.length).toBeLessThanOrEqual(lenientTypes.length);
    });

    it('should throw error for invalid color format', async () => {
      await expect(repository.filterByColor('invalid-color')).rejects.toThrow('Invalid color format');
    });

    it('should throw error for invalid tolerance', async () => {
      await expect(repository.filterByColor('#FF0000', -1)).rejects.toThrow('Color tolerance must be between 0 and 255');
      await expect(repository.filterByColor('#FF0000', 256)).rejects.toThrow('Color tolerance must be between 0 and 255');
    });
  });

  describe('getTypesForDifficulty', () => {
    it('should return appropriate types for easy difficulty', async () => {
      const easyTypes = await repository.getTypesForDifficulty('easy');
      
      expect(easyTypes.length).toBeGreaterThan(0);
      expect(easyTypes.length).toBeLessThanOrEqual(8); // Should be subset of basic types
      
      // All should have short names (4 characters or less)
      expect(easyTypes.every(type => type.nameJa.length <= 4)).toBe(true);
    });

    it('should return basic types for normal difficulty', async () => {
      const normalTypes = await repository.getTypesForDifficulty('normal');
      const basicTypes = await repository.getBasicTypes();
      
      expect(normalTypes).toEqual(basicTypes);
    });

    it('should return all types for hard difficulty', async () => {
      const hardTypes = await repository.getTypesForDifficulty('hard');
      const allTypes = await repository.getAllTypes();
      
      expect(hardTypes).toEqual(allTypes);
    });

    it('should throw error for invalid difficulty', async () => {
      await expect(repository.getTypesForDifficulty('invalid' as any)).rejects.toThrow('Invalid difficulty level');
    });
  });

  describe('getRandomType', () => {
    it('should return a random type', async () => {
      const randomType = await repository.getRandomType();
      
      expect(randomType).toBeInstanceOf(PokemonType);
      expect(randomType).not.toBeNull();
    });

    it('should exclude specified types', async () => {
      const excludeTypes: TypeId[] = ['fire', 'water', 'grass'];
      const randomType = await repository.getRandomType(excludeTypes);
      
      expect(randomType).not.toBeNull();
      expect(excludeTypes).not.toContain(randomType!.id as TypeId);
    });

    it('should return null when all types are excluded', async () => {
      const allTypes = await repository.getAllTypes();
      const allTypeIds = allTypes.map(type => type.id as TypeId);
      
      const randomType = await repository.getRandomType(allTypeIds);
      expect(randomType).toBeNull();
    });
  });

  describe('getRandomTypes', () => {
    it('should return specified number of random types', async () => {
      const randomTypes = await repository.getRandomTypes(5);
      
      expect(randomTypes).toHaveLength(5);
      expect(randomTypes.every(type => type instanceof PokemonType)).toBe(true);
    });

    it('should return unique types by default', async () => {
      const randomTypes = await repository.getRandomTypes(5, false);
      
      const typeIds = randomTypes.map(type => type.id);
      const uniqueTypeIds = new Set(typeIds);
      
      expect(uniqueTypeIds.size).toBe(5);
    });

    it('should allow duplicates when specified', async () => {
      const randomTypes = await repository.getRandomTypes(25, true); // More than total types
      
      expect(randomTypes).toHaveLength(25);
      expect(randomTypes.every(type => type instanceof PokemonType)).toBe(true);
    });

    it('should respect exclude list', async () => {
      const excludeTypes: TypeId[] = ['fire', 'water'];
      const randomTypes = await repository.getRandomTypes(3, false, excludeTypes);
      
      expect(randomTypes).toHaveLength(3);
      
      const typeIds = randomTypes.map(type => type.id as TypeId);
      for (const excludeType of excludeTypes) {
        expect(typeIds).not.toContain(excludeType);
      }
    });

    it('should return empty array for count 0', async () => {
      const randomTypes = await repository.getRandomTypes(0);
      expect(randomTypes).toHaveLength(0);
    });

    it('should throw error for negative count', async () => {
      await expect(repository.getRandomTypes(-1)).rejects.toThrow('Count must be non-negative');
    });

    it('should throw error when requesting more unique types than available', async () => {
      await expect(repository.getRandomTypes(20, false)).rejects.toThrow('Cannot get 20 unique types');
    });
  });

  describe('validateTypeData', () => {
    it('should validate correct type data', async () => {
      const validData: PokemonTypeData = {
        id: 'fire', // Use existing valid type ID
        nameJa: 'テスト',
        color: '#123456',
        colorLight: '#789ABC',
        symbol: 'テ',
        animation: 'test-animation'
      };
      
      const isValid = await repository.validateTypeData(validData);
      expect(isValid).toBe(true);
    });

    it('should throw error for invalid type data', async () => {
      const invalidData = {
        id: 'invalid',
        nameJa: 'テスト',
        color: 'not-a-color', // Invalid color
        colorLight: '#789ABC',
        symbol: 'テ',
        animation: 'test-animation'
      } as PokemonTypeData;
      
      await expect(repository.validateTypeData(invalidData)).rejects.toThrow('Invalid type data');
    });
  });

  describe('getStatistics', () => {
    it('should return correct statistics', async () => {
      const stats = await repository.getStatistics();
      
      expect(stats.totalTypes).toBe(18);
      expect(stats.basicTypes).toBe(8);
      expect(stats.advancedTypes).toBe(10);
      expect(stats.cacheHitRate).toBe(100);
      expect(stats.lastUpdated).toBeInstanceOf(Date);
    });
  });

  describe('refreshCache', () => {
    it('should successfully refresh cache', async () => {
      // Ensure repository is initialized first
      await repository.getAllTypes();
      
      const refreshResult = await repository.refreshCache();
      expect(refreshResult).toBe(true);
      
      // Should still work after refresh
      const types = await repository.getAllTypes();
      expect(types).toHaveLength(18);
    });
  });

  describe('preload', () => {
    it('should preload data without errors', async () => {
      await expect(repository.preload()).resolves.not.toThrow();
      
      // Data should be available immediately after preload
      const types = await repository.getAllTypes();
      expect(types).toHaveLength(18);
    });
  });
});
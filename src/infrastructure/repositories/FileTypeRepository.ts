/**
 * File Type Repository Implementation
 * Concrete implementation of ITypeRepository using JSON file data
 */

import type { TypeId, PokemonTypeData } from '@/domain/types';
import type { ITypeRepository } from '@/domain/services';
import { PokemonType } from '@/domain/entities/PokemonType';
import typeData from '../data/types.json';

/**
 * File-based type repository
 * Loads Pokemon type data from JSON file with caching and validation
 */
export class FileTypeRepository implements ITypeRepository {
  private readonly typeCache: Map<TypeId, PokemonType>;
  private readonly allTypes: PokemonType[];
  private readonly basicTypeIds: TypeId[];
  private isInitialized: boolean = false;
  private loadTime: Date | null = null;

  constructor() {
    this.typeCache = new Map();
    this.allTypes = [];
    this.basicTypeIds = [
      'normal', 'fire', 'water', 'electric', 
      'grass', 'ice', 'fighting', 'poison'
    ];
  }

  /**
   * Get all Pokemon types
   */
  async getAllTypes(): Promise<PokemonType[]> {
    await this.ensureInitialized();
    return [...this.allTypes];
  }

  /**
   * Get Pokemon type by ID
   */
  async getTypeById(typeId: TypeId): Promise<PokemonType | null> {
    await this.ensureInitialized();
    return this.typeCache.get(typeId) || null;
  }

  /**
   * Get multiple Pokemon types by IDs
   */
  async getTypesByIds(typeIds: TypeId[]): Promise<PokemonType[]> {
    await this.ensureInitialized();
    
    const types: PokemonType[] = [];
    for (const typeId of typeIds) {
      const type = this.typeCache.get(typeId);
      if (type) {
        types.push(type);
      }
    }
    
    return types;
  }

  /**
   * Check if a type ID exists
   */
  async exists(typeId: TypeId): Promise<boolean> {
    await this.ensureInitialized();
    return this.typeCache.has(typeId);
  }

  /**
   * Get basic types (first 8 types introduced in Generation I)
   */
  async getBasicTypes(): Promise<PokemonType[]> {
    await this.ensureInitialized();
    
    const basicTypes: PokemonType[] = [];
    for (const typeId of this.basicTypeIds) {
      const type = this.typeCache.get(typeId);
      if (type) {
        basicTypes.push(type);
      }
    }
    
    return basicTypes;
  }

  /**
   * Get advanced types (types introduced after Generation I)
   */
  async getAdvancedTypes(): Promise<PokemonType[]> {
    await this.ensureInitialized();
    
    return this.allTypes.filter(type => 
      !this.basicTypeIds.includes(type.id as TypeId)
    );
  }

  /**
   * Search types by name (Japanese)
   */
  async searchByName(nameQuery: string, exactMatch: boolean = false): Promise<PokemonType[]> {
    await this.ensureInitialized();
    
    if (!nameQuery || nameQuery.trim().length === 0) {
      return [];
    }

    const query = nameQuery.trim();
    
    return this.allTypes.filter(type => {
      if (exactMatch) {
        return type.nameJa === query;
      } else {
        return type.nameJa.includes(query);
      }
    });
  }

  /**
   * Filter types by color range
   */
  async filterByColor(colorQuery: string, tolerance: number = 50): Promise<PokemonType[]> {
    await this.ensureInitialized();
    
    if (!this.isValidHexColor(colorQuery)) {
      throw new Error(`Invalid color format: ${colorQuery}`);
    }

    if (tolerance < 0 || tolerance > 255) {
      throw new Error(`Color tolerance must be between 0 and 255, got: ${tolerance}`);
    }

    const targetRgb = this.hexToRgb(colorQuery);
    if (!targetRgb) {
      throw new Error(`Could not parse color: ${colorQuery}`);
    }

    return this.allTypes.filter(type => {
      const typeRgb = this.hexToRgb(type.color);
      if (!typeRgb) return false;

      const distance = Math.sqrt(
        Math.pow(targetRgb.r - typeRgb.r, 2) +
        Math.pow(targetRgb.g - typeRgb.g, 2) +
        Math.pow(targetRgb.b - typeRgb.b, 2)
      );

      return distance <= tolerance;
    });
  }

  /**
   * Get types suitable for specific difficulty level
   */
  async getTypesForDifficulty(difficulty: 'easy' | 'normal' | 'hard'): Promise<PokemonType[]> {
    await this.ensureInitialized();
    
    switch (difficulty) {
      case 'easy':
        // Easy mode uses only basic types with clear names
        return this.allTypes.filter(type => 
          this.basicTypeIds.includes(type.id as TypeId) &&
          type.nameJa.length <= 4 // Short names for beginners
        );
      
      case 'normal':
        // Normal mode uses all basic types
        return await this.getBasicTypes();
      
      case 'hard':
        // Hard mode uses all types including advanced ones
        return [...this.allTypes];
      
      default:
        throw new Error(`Invalid difficulty level: ${difficulty}`);
    }
  }

  /**
   * Get random type
   */
  async getRandomType(excludeTypes: TypeId[] = []): Promise<PokemonType | null> {
    await this.ensureInitialized();
    
    const availableTypes = this.allTypes.filter(type => 
      !excludeTypes.includes(type.id as TypeId)
    );

    if (availableTypes.length === 0) {
      return null;
    }

    const randomIndex = Math.floor(Math.random() * availableTypes.length);
    return availableTypes[randomIndex];
  }

  /**
   * Get random types
   */
  async getRandomTypes(
    count: number, 
    allowDuplicates: boolean = false, 
    excludeTypes: TypeId[] = []
  ): Promise<PokemonType[]> {
    await this.ensureInitialized();
    
    if (count < 0) {
      throw new Error(`Count must be non-negative, got: ${count}`);
    }

    if (count === 0) {
      return [];
    }

    const availableTypes = this.allTypes.filter(type => 
      !excludeTypes.includes(type.id as TypeId)
    );

    if (!allowDuplicates && count > availableTypes.length) {
      throw new Error(
        `Cannot get ${count} unique types. Only ${availableTypes.length} types available after exclusions.`
      );
    }

    const result: PokemonType[] = [];
    const used = new Set<TypeId>();

    for (let i = 0; i < count; i++) {
      let attempts = 0;
      const maxAttempts = allowDuplicates ? 10 : availableTypes.length;

      while (attempts < maxAttempts) {
        const randomIndex = Math.floor(Math.random() * availableTypes.length);
        const selectedType = availableTypes[randomIndex];
        
        if (allowDuplicates || !used.has(selectedType.id as TypeId)) {
          result.push(selectedType);
          used.add(selectedType.id as TypeId);
          break;
        }
        
        attempts++;
      }

      if (attempts >= maxAttempts) {
        throw new Error(`Could not find enough unique types after ${maxAttempts} attempts`);
      }
    }

    return result;
  }

  /**
   * Validate type data
   */
  async validateTypeData(typeData: PokemonTypeData): Promise<boolean> {
    try {
      new PokemonType(typeData);
      return true;
    } catch (error) {
      throw new Error(`Invalid type data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get type statistics
   */
  async getStatistics(): Promise<{
    totalTypes: number;
    basicTypes: number;
    advancedTypes: number;
    cacheHitRate?: number;
    lastUpdated?: Date;
  }> {
    await this.ensureInitialized();
    
    const basicTypes = await this.getBasicTypes();
    const advancedTypes = await this.getAdvancedTypes();

    return {
      totalTypes: this.allTypes.length,
      basicTypes: basicTypes.length,
      advancedTypes: advancedTypes.length,
      cacheHitRate: 100, // File-based repository has 100% cache hit rate after initialization
      lastUpdated: this.loadTime || undefined
    };
  }

  /**
   * Refresh cache (reload data from file)
   */
  async refreshCache(): Promise<boolean> {
    try {
      this.isInitialized = false;
      this.typeCache.clear();
      this.allTypes.length = 0;
      this.loadTime = null;
      
      await this.ensureInitialized();
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Preload all type data into memory
   */
  async preload(): Promise<void> {
    await this.ensureInitialized();
  }

  /**
   * Ensure repository is initialized
   */
  private async ensureInitialized(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    try {
      this.loadTime = new Date();
      
      // Validate that typeData is an array
      if (!Array.isArray(typeData)) {
        throw new Error('Type data must be an array');
      }

      // Validate and load each type
      for (const data of typeData) {
        await this.validateTypeData(data);
        
        const pokemonType = new PokemonType(data);
        this.allTypes.push(pokemonType);
        this.typeCache.set(pokemonType.id as TypeId, pokemonType);
      }

      // Validate that we have all expected types
      const expectedTypeCount = 18;
      if (this.allTypes.length !== expectedTypeCount) {
        throw new Error(`Expected ${expectedTypeCount} types, but loaded ${this.allTypes.length}`);
      }

      // Validate that all basic types are present
      for (const basicTypeId of this.basicTypeIds) {
        if (!this.typeCache.has(basicTypeId)) {
          throw new Error(`Missing basic type: ${basicTypeId}`);
        }
      }

      this.isInitialized = true;
    } catch (error) {
      this.isInitialized = false;
      this.typeCache.clear();
      this.allTypes.length = 0;
      this.loadTime = null;
      
      throw new Error(`Failed to initialize type repository: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Check if string is valid hex color
   */
  private isValidHexColor(color: string): boolean {
    const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    return hexColorRegex.test(color);
  }

  /**
   * Convert hex color to RGB
   */
  private hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }
}
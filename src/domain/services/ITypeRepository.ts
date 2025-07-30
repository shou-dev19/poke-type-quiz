/**
 * Type Repository Interface
 * Domain repository interface for Pokemon type data access
 */

import type { TypeId, PokemonTypeData } from '../types';
import { PokemonType } from '../entities/PokemonType';

/**
 * Repository interface for accessing Pokemon type data
 */
export interface ITypeRepository {
  /**
   * Get all Pokemon types
   * @returns Array of all PokemonType entities
   */
  getAllTypes(): Promise<PokemonType[]>;

  /**
   * Get Pokemon type by ID
   * @param typeId - The type identifier
   * @returns PokemonType entity or null if not found
   */
  getTypeById(typeId: TypeId): Promise<PokemonType | null>;

  /**
   * Get multiple Pokemon types by IDs
   * @param typeIds - Array of type identifiers
   * @returns Array of PokemonType entities (excludes not found types)
   */
  getTypesByIds(typeIds: TypeId[]): Promise<PokemonType[]>;

  /**
   * Check if a type ID exists
   * @param typeId - The type identifier to check
   * @returns True if type exists
   */
  exists(typeId: TypeId): Promise<boolean>;

  /**
   * Get basic types (first 8 types introduced in Generation I)
   * @returns Array of basic PokemonType entities
   */
  getBasicTypes(): Promise<PokemonType[]>;

  /**
   * Get advanced types (types introduced after Generation I)
   * @returns Array of advanced PokemonType entities
   */
  getAdvancedTypes(): Promise<PokemonType[]>;

  /**
   * Search types by name (Japanese)
   * @param nameQuery - Search query for Japanese name
   * @param exactMatch - Whether to perform exact match (default: false)
   * @returns Array of matching PokemonType entities
   */
  searchByName(nameQuery: string, exactMatch?: boolean): Promise<PokemonType[]>;

  /**
   * Filter types by color range
   * @param colorQuery - Hex color to match against
   * @param tolerance - Color matching tolerance (0-255, default: 50)
   * @returns Array of PokemonType entities with similar colors
   */
  filterByColor(colorQuery: string, tolerance?: number): Promise<PokemonType[]>;

  /**
   * Get types suitable for specific difficulty level
   * @param difficulty - Difficulty level ('easy', 'normal', 'hard')
   * @returns Array of appropriate PokemonType entities
   */
  getTypesForDifficulty(difficulty: 'easy' | 'normal' | 'hard'): Promise<PokemonType[]>;

  /**
   * Get random type
   * @param excludeTypes - Array of type IDs to exclude from selection
   * @returns Random PokemonType entity
   */
  getRandomType(excludeTypes?: TypeId[]): Promise<PokemonType | null>;

  /**
   * Get random types
   * @param count - Number of types to return
   * @param allowDuplicates - Whether to allow duplicate types (default: false)
   * @param excludeTypes - Array of type IDs to exclude from selection
   * @returns Array of random PokemonType entities
   */
  getRandomTypes(count: number, allowDuplicates?: boolean, excludeTypes?: TypeId[]): Promise<PokemonType[]>;

  /**
   * Validate type data
   * @param typeData - Raw type data to validate
   * @returns True if data is valid
   * @throws Error if data is invalid
   */
  validateTypeData(typeData: PokemonTypeData): Promise<boolean>;

  /**
   * Get type statistics
   * @returns Object containing repository statistics
   */
  getStatistics(): Promise<{
    totalTypes: number;
    basicTypes: number;
    advancedTypes: number;
    cacheHitRate?: number;
    lastUpdated?: Date;
  }>;

  /**
   * Refresh cache (if applicable)
   * @returns True if cache was refreshed successfully
   */
  refreshCache(): Promise<boolean>;

  /**
   * Preload all type data into memory
   * @returns Promise that resolves when preloading is complete
   */
  preload(): Promise<void>;
}
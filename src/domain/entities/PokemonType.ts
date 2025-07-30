/**
 * PokemonType Entity
 * Domain entity representing a Pokemon type with its metadata
 */

import type { TypeId, PokemonTypeData } from '../types';

/**
 * Pokemon Type Entity
 * Represents a Pokemon type with validation and business logic
 */
export class PokemonType {
  public readonly id: TypeId;
  public readonly nameJa: string;
  public readonly color: string;
  public readonly colorLight: string;
  public readonly symbol: string;
  public readonly animation: string;

  constructor(data: PokemonTypeData) {
    this.validateTypeData(data);
    
    this.id = data.id;
    this.nameJa = data.nameJa;
    this.color = data.color;
    this.colorLight = data.colorLight;
    this.symbol = data.symbol;
    this.animation = data.animation;
  }

  /**
   * Create PokemonType from raw data
   * @param data - Raw Pokemon type data
   * @returns New PokemonType instance
   * @throws Error if data is invalid
   */
  static create(data: PokemonTypeData): PokemonType {
    return new PokemonType(data);
  }

  /**
   * Get display name in Japanese
   * @returns Japanese name of the type
   */
  getDisplayName(): string {
    return this.nameJa;
  }

  /**
   * Get CSS color value
   * @returns Hex color string
   */
  getColor(): string {
    return this.color;
  }

  /**
   * Get light variant CSS color value
   * @returns Light hex color string
   */
  getLightColor(): string {
    return this.colorLight;
  }

  /**
   * Get type symbol/icon identifier
   * @returns Symbol string for UI display
   */
  getSymbol(): string {
    return this.symbol;
  }

  /**
   * Get animation name
   * @returns Animation identifier string
   */
  getAnimation(): string {
    return this.animation;
  }

  /**
   * Check if this type is the same as another
   * @param other - Other PokemonType to compare
   * @returns True if types are the same
   */
  equals(other: PokemonType): boolean {
    return this.id === other.id;
  }

  /**
   * Convert to plain object
   * @returns PokemonTypeData object
   */
  toData(): PokemonTypeData {
    return {
      id: this.id,
      nameJa: this.nameJa,
      color: this.color,
      colorLight: this.colorLight,
      symbol: this.symbol,
      animation: this.animation,
    };
  }

  /**
   * String representation
   * @returns String representation of the type
   */
  toString(): string {
    return `PokemonType(${this.id}: ${this.nameJa})`;
  }

  /**
   * JSON serialization
   * @returns JSON representation
   */
  toJSON(): PokemonTypeData {
    return this.toData();
  }

  /**
   * Validate type data
   * @param data - Data to validate
   * @throws Error if data is invalid
   */
  private validateTypeData(data: PokemonTypeData): void {
    if (!data) {
      throw new Error('Pokemon type data is required');
    }

    // Validate required fields
    const requiredFields: (keyof PokemonTypeData)[] = [
      'id', 'nameJa', 'color', 'colorLight', 'symbol', 'animation'
    ];

    for (const field of requiredFields) {
      if (!data[field]) {
        throw new Error(`Pokemon type field '${field}' is required`);
      }
    }

    // Validate ID format
    this.validateTypeId(data.id);

    // Validate colors
    this.validateColor(data.color, 'color');
    this.validateColor(data.colorLight, 'colorLight');

    // Validate strings are not empty
    if (data.nameJa.trim().length === 0) {
      throw new Error('Pokemon type nameJa cannot be empty');
    }
    if (data.symbol.trim().length === 0) {
      throw new Error('Pokemon type symbol cannot be empty');
    }
    if (data.animation.trim().length === 0) {
      throw new Error('Pokemon type animation cannot be empty');
    }
  }

  /**
   * Validate type ID
   * @param id - Type ID to validate
   * @throws Error if ID is invalid
   */
  private validateTypeId(id: TypeId): void {
    const validTypes: TypeId[] = [
      'normal', 'fire', 'water', 'electric', 'grass', 'ice',
      'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
      'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
    ];

    if (!validTypes.includes(id)) {
      throw new Error(
        `Invalid type ID: ${id}. Valid types are: ${validTypes.join(', ')}`
      );
    }
  }

  /**
   * Validate color format (hex color)
   * @param color - Color string to validate
   * @param fieldName - Name of the field for error messages
   * @throws Error if color format is invalid
   */
  private validateColor(color: string, fieldName: string): void {
    const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    
    if (!hexColorRegex.test(color)) {
      throw new Error(
        `Invalid ${fieldName} format: ${color}. Expected hex color format (#RRGGBB or #RGB)`
      );
    }
  }

  // Static helper methods

  /**
   * Get all valid type IDs
   * @returns Array of all valid TypeId values
   */
  static getAllTypeIds(): TypeId[] {
    return [
      'normal', 'fire', 'water', 'electric', 'grass', 'ice',
      'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
      'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
    ];
  }

  /**
   * Check if a type ID is valid
   * @param id - Type ID to check
   * @returns True if the ID is valid
   */
  static isValidTypeId(id: string): id is TypeId {
    return PokemonType.getAllTypeIds().includes(id as TypeId);
  }

  /**
   * Get basic types (for easy difficulty)
   * @returns Array of basic type IDs
   */
  static getBasicTypeIds(): TypeId[] {
    return ['normal', 'fire', 'water', 'electric', 'grass', 'ice', 'fighting', 'poison'];
  }

  /**
   * Check if a type is considered basic
   * @param id - Type ID to check
   * @returns True if the type is basic
   */
  static isBasicType(id: TypeId): boolean {
    return PokemonType.getBasicTypeIds().includes(id);
  }

  /**
   * Validate multiple type data objects
   * @param dataArray - Array of type data to validate
   * @returns True if all data is valid
   * @throws Error if any data is invalid
   */
  static validateTypeDataArray(dataArray: PokemonTypeData[]): boolean {
    if (!Array.isArray(dataArray)) {
      throw new Error('Type data must be an array');
    }

    if (dataArray.length === 0) {
      throw new Error('Type data array cannot be empty');
    }

    // Check for duplicate IDs
    const ids = dataArray.map(data => data.id);
    const uniqueIds = new Set(ids);
    
    if (ids.length !== uniqueIds.size) {
      throw new Error('Duplicate type IDs found in data array');
    }

    // Validate each type data
    dataArray.forEach((data, index) => {
      try {
        new PokemonType(data);
      } catch (error) {
        throw new Error(`Invalid type data at index ${index}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    });

    return true;
  }
}
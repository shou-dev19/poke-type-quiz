/**
 * TypeEffectiveness Entity
 * Domain entity representing Pokemon type effectiveness values
 * Implements Enum-like pattern for type-safe effectiveness calculations
 */

import type { EffectivenessValue, DifficultyLevel } from '../types';

/**
 * Type Effectiveness Entity
 * Represents the effectiveness multiplier of one Pokemon type against another
 */
export class TypeEffectiveness {
  private constructor(
    public readonly value: EffectivenessValue,
    public readonly multiplier: number,
    private readonly displayKey: string
  ) {}

  /**
   * Convert to string representation
   * @returns The effectiveness value as string
   */
  toString(): string {
    return this.value;
  }

  /**
   * Get numeric multiplier value
   * @returns The effectiveness multiplier
   */
  toNumber(): number {
    return this.multiplier;
  }

  /**
   * Get localized display text
   * @returns Japanese display text with multiplier
   */
  getDisplayText(): string {
    return TypeEffectiveness.DISPLAY_TEXTS[this.displayKey];
  }

  /**
   * Get effectiveness description
   * @returns Detailed description of the effectiveness
   */
  getDescription(): string {
    return this.getEffectivenessDescription();
  }

  /**
   * Check if this effectiveness is the same as another
   * @param other - Other TypeEffectiveness to compare
   * @returns True if values are equal
   */
  equals(other: TypeEffectiveness): boolean {
    return this.value === other.value && this.multiplier === other.multiplier;
  }

  /**
   * Check if this effectiveness is greater than another
   * @param other - Other TypeEffectiveness to compare
   * @returns True if this multiplier is greater
   */
  isGreaterThan(other: TypeEffectiveness): boolean {
    return this.multiplier > other.multiplier;
  }

  /**
   * Check if this effectiveness is less than another
   * @param other - Other TypeEffectiveness to compare
   * @returns True if this multiplier is less
   */
  isLessThan(other: TypeEffectiveness): boolean {
    return this.multiplier < other.multiplier;
  }

  // Static effectiveness constants
  static readonly NONE = new TypeEffectiveness('NONE', 0, 'none');
  static readonly QUARTER_EFFECTIVE = new TypeEffectiveness(
    'QUARTER_EFFECTIVE',
    0.25,
    'quarter'
  );
  static readonly HALF_EFFECTIVE = new TypeEffectiveness(
    'HALF_EFFECTIVE',
    0.5,
    'half'
  );
  static readonly NORMAL_EFFECTIVE = new TypeEffectiveness(
    'NORMAL_EFFECTIVE',
    1.0,
    'normal'
  );
  static readonly SUPER_EFFECTIVE = new TypeEffectiveness(
    'SUPER_EFFECTIVE',
    2.0,
    'super'
  );
  static readonly ULTRA_EFFECTIVE = new TypeEffectiveness(
    'ULTRA_EFFECTIVE',
    4.0,
    'ultra'
  );

  // Display text mapping
  private static readonly DISPLAY_TEXTS: Record<string, string> = {
    none: 'こうかなし(0倍)',
    quarter: 'こうかいまひとつ(0.25倍)',
    half: 'こうかいまひとつ(0.5倍)',
    normal: 'ふつう(1倍)',
    super: 'こうかばつぐん(2倍)',
    ultra: 'こうかばつぐん(4倍)',
  };

  /**
   * Get all effectiveness values as array
   * @returns Array of all TypeEffectiveness instances
   */
  static getAllValues(): TypeEffectiveness[] {
    return [
      TypeEffectiveness.NONE,
      TypeEffectiveness.QUARTER_EFFECTIVE,
      TypeEffectiveness.HALF_EFFECTIVE,
      TypeEffectiveness.NORMAL_EFFECTIVE,
      TypeEffectiveness.SUPER_EFFECTIVE,
      TypeEffectiveness.ULTRA_EFFECTIVE,
    ];
  }

  /**
   * Create TypeEffectiveness from numeric multiplier
   * @param multiplier - Numeric effectiveness multiplier
   * @returns Corresponding TypeEffectiveness instance
   * @throws Error if multiplier doesn't match any known value
   */
  static fromMultiplier(multiplier: number): TypeEffectiveness {
    const effectiveness = TypeEffectiveness.getAllValues().find(
      e => Math.abs(e.multiplier - multiplier) < 0.01
    );

    if (!effectiveness) {
      throw new Error(
        `Invalid multiplier: ${multiplier}. Valid values are: 0, 0.25, 0.5, 1.0, 2.0, 4.0`
      );
    }

    return effectiveness;
  }

  /**
   * Create TypeEffectiveness from string value
   * @param value - String effectiveness value
   * @returns Corresponding TypeEffectiveness instance
   * @throws Error if value doesn't match any known effectiveness
   */
  static fromValue(value: EffectivenessValue): TypeEffectiveness {
    const effectiveness = TypeEffectiveness.getAllValues().find(
      e => e.value === value
    );

    if (!effectiveness) {
      throw new Error(
        `Invalid effectiveness value: ${value}. Valid values are: ${TypeEffectiveness.getAllValues()
          .map(e => e.value)
          .join(', ')}`
      );
    }

    return effectiveness;
  }

  /**
   * Get available choices for a given difficulty level
   * @param difficulty - Quiz difficulty level
   * @returns Array of TypeEffectiveness choices for the difficulty
   * @throws Error if difficulty is invalid
   */
  static getChoicesForDifficulty(
    difficulty: DifficultyLevel
  ): TypeEffectiveness[] {
    switch (difficulty) {
      case 'easy':
      case 'normal':
        return [
          TypeEffectiveness.NONE,
          TypeEffectiveness.HALF_EFFECTIVE,
          TypeEffectiveness.NORMAL_EFFECTIVE,
          TypeEffectiveness.SUPER_EFFECTIVE,
        ];
      case 'hard':
        return TypeEffectiveness.getAllValues();
      default:
        throw new Error(
          `Invalid difficulty: ${difficulty}. Valid values are: easy, normal, hard`
        );
    }
  }

  /**
   * Calculate combined effectiveness for dual-type Pokemon
   * @param effectiveness1 - First type effectiveness
   * @param effectiveness2 - Second type effectiveness
   * @returns Combined effectiveness (product of multipliers)
   */
  static combineEffectiveness(
    effectiveness1: TypeEffectiveness,
    effectiveness2: TypeEffectiveness
  ): TypeEffectiveness {
    const combinedMultiplier = effectiveness1.multiplier * effectiveness2.multiplier;
    return TypeEffectiveness.fromMultiplier(combinedMultiplier);
  }

  /**
   * Get effectiveness level description
   * @returns Human-readable effectiveness description
   */
  getEffectivenessDescription(): string {
    if (this.multiplier === 0) return '効果なし';
    if (this.multiplier < 1) return '効果いまひとつ';
    if (this.multiplier === 1) return '普通の効果';
    if (this.multiplier > 1) return '効果抜群';
    return '不明な効果';
  }

  /**
   * Check if this is a critical effectiveness (0x or 4x)
   * @returns True if effectiveness is 0 or 4
   */
  isCritical(): boolean {
    return this.multiplier === 0 || this.multiplier === 4.0;
  }

  /**
   * Check if this is a neutral effectiveness (1x)
   * @returns True if effectiveness is exactly 1.0
   */
  isNeutral(): boolean {
    return this.multiplier === 1.0;
  }

  /**
   * Check if this is a positive effectiveness (>1x)
   * @returns True if effectiveness is greater than 1.0
   */
  isPositive(): boolean {
    return this.multiplier > 1.0;
  }

  /**
   * Check if this is a negative effectiveness (<1x, but not 0)
   * @returns True if effectiveness is between 0 and 1.0
   */
  isNegative(): boolean {
    return this.multiplier > 0 && this.multiplier < 1.0;
  }
}
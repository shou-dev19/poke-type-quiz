/**
 * Type Effectiveness Service Interface
 * Domain service interface for type effectiveness calculations
 */

import type { TypeId, EffectivenessValue } from '../types';
import { TypeEffectiveness } from '../entities/TypeEffectiveness';

/**
 * Interface for calculating Pokemon type effectiveness
 */
export interface ITypeEffectivenessService {
  /**
   * Calculate effectiveness when attacking type hits defending type(s)
   * @param attackingType - The attacking Pokemon type
   * @param defendingTypes - The defending Pokemon type(s) (1-2 types)
   * @returns TypeEffectiveness representing the calculated effectiveness
   */
  calculateEffectiveness(attackingType: TypeId, defendingTypes: TypeId[]): TypeEffectiveness;

  /**
   * Get effectiveness multiplier for type matchup
   * @param attackingType - The attacking Pokemon type
   * @param defendingType - The defending Pokemon type (single)
   * @returns Numerical multiplier (0, 0.25, 0.5, 1.0, 2.0, 4.0)
   */
  getEffectivenessMultiplier(attackingType: TypeId, defendingType: TypeId): number;

  /**
   * Check if attack has no effect (0x damage)
   * @param attackingType - The attacking Pokemon type
   * @param defendingTypes - The defending Pokemon type(s)
   * @returns True if attack has no effect
   */
  hasNoEffect(attackingType: TypeId, defendingTypes: TypeId[]): boolean;

  /**
   * Check if attack is super effective (>1x damage)
   * @param attackingType - The attacking Pokemon type
   * @param defendingTypes - The defending Pokemon type(s)
   * @returns True if attack is super effective
   */
  isSuperEffective(attackingType: TypeId, defendingTypes: TypeId[]): boolean;

  /**
   * Check if attack is not very effective (<1x damage)
   * @param attackingType - The attacking Pokemon type
   * @param defendingTypes - The defending Pokemon type(s)
   * @returns True if attack is not very effective
   */
  isNotVeryEffective(attackingType: TypeId, defendingTypes: TypeId[]): boolean;

  /**
   * Get all type matchups for a specific attacking type
   * @param attackingType - The attacking Pokemon type
   * @returns Map of defending types to their effectiveness values
   */
  getAllMatchupsForAttackingType(attackingType: TypeId): Map<TypeId, EffectivenessValue>;

  /**
   * Get all type matchups for a specific defending type
   * @param defendingType - The defending Pokemon type
   * @returns Map of attacking types to their effectiveness values
   */
  getAllMatchupsForDefendingType(defendingType: TypeId): Map<TypeId, EffectivenessValue>;

  /**
   * Calculate combined effectiveness for dual-type defending Pokemon
   * @param attackingType - The attacking Pokemon type
   * @param firstDefendingType - First defending type
   * @param secondDefendingType - Second defending type
   * @returns Combined TypeEffectiveness
   */
  calculateDualTypeEffectiveness(
    attackingType: TypeId,
    firstDefendingType: TypeId,
    secondDefendingType: TypeId
  ): TypeEffectiveness;

  /**
   * Get weaknesses for a Pokemon type combination
   * @param defendingTypes - The defending Pokemon type(s)
   * @returns Array of attacking types that are super effective
   */
  getWeaknesses(defendingTypes: TypeId[]): TypeId[];

  /**
   * Get resistances for a Pokemon type combination
   * @param defendingTypes - The defending Pokemon type(s)
   * @returns Array of attacking types that are not very effective
   */
  getResistances(defendingTypes: TypeId[]): TypeId[];

  /**
   * Get immunities for a Pokemon type combination
   * @param defendingTypes - The defending Pokemon type(s)
   * @returns Array of attacking types that have no effect
   */
  getImmunities(defendingTypes: TypeId[]): TypeId[];
}
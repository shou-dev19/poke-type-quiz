/**
 * Type Effectiveness Service Implementation
 * Concrete implementation of ITypeEffectivenessService
 */

import type { TypeId, EffectivenessValue } from '@/domain/types';
import type { ITypeEffectivenessService } from '@/domain/services';
import { TypeEffectiveness } from '@/domain/entities/TypeEffectiveness';

/**
 * Type effectiveness calculation service
 * Implements Pokemon type matchup calculations based on standard effectiveness rules
 */
export class TypeEffectivenessService implements ITypeEffectivenessService {
  private readonly effectivenessChart: Map<string, number>;
  private readonly memoCache: Map<string, TypeEffectiveness>;

  constructor() {
    this.effectivenessChart = this.initializeEffectivenessChart();
    this.memoCache = new Map();
  }

  /**
   * Calculate effectiveness when attacking type hits defending type(s)
   */
  calculateEffectiveness(attackingType: TypeId, defendingTypes: TypeId[]): TypeEffectiveness {
    this.validateTypeId(attackingType);
    this.validateDefendingTypes(defendingTypes);

    const cacheKey = `${attackingType}->${defendingTypes.sort().join(',')}`;
    const cached = this.memoCache.get(cacheKey);
    if (cached) {
      return cached;
    }

    let multiplier = 1.0;

    if (defendingTypes.length === 1) {
      multiplier = this.getSingleTypeMultiplier(attackingType, defendingTypes[0]);
    } else if (defendingTypes.length === 2) {
      multiplier = this.calculateDualTypeMultiplier(attackingType, defendingTypes[0], defendingTypes[1]);
    }

    const result = TypeEffectiveness.fromMultiplier(multiplier);
    this.memoCache.set(cacheKey, result);
    return result;
  }

  /**
   * Get effectiveness multiplier for single type matchup
   */
  getEffectivenessMultiplier(attackingType: TypeId, defendingType: TypeId): number {
    this.validateTypeId(attackingType);
    this.validateTypeId(defendingType);

    return this.getSingleTypeMultiplier(attackingType, defendingType);
  }

  /**
   * Check if attack has no effect (0x damage)
   */
  hasNoEffect(attackingType: TypeId, defendingTypes: TypeId[]): boolean {
    const effectiveness = this.calculateEffectiveness(attackingType, defendingTypes);
    return effectiveness.multiplier === 0;
  }

  /**
   * Check if attack is super effective (>1x damage)
   */
  isSuperEffective(attackingType: TypeId, defendingTypes: TypeId[]): boolean {
    const effectiveness = this.calculateEffectiveness(attackingType, defendingTypes);
    return effectiveness.multiplier > 1.0;
  }

  /**
   * Check if attack is not very effective (<1x damage)
   */
  isNotVeryEffective(attackingType: TypeId, defendingTypes: TypeId[]): boolean {
    const effectiveness = this.calculateEffectiveness(attackingType, defendingTypes);
    return effectiveness.multiplier > 0 && effectiveness.multiplier < 1.0;
  }

  /**
   * Get all type matchups for a specific attacking type
   */
  getAllMatchupsForAttackingType(attackingType: TypeId): Map<TypeId, EffectivenessValue> {
    this.validateTypeId(attackingType);
    
    const matchups = new Map<TypeId, EffectivenessValue>();
    const allTypes = this.getAllTypeIds();

    for (const defendingType of allTypes) {
      const effectiveness = this.calculateEffectiveness(attackingType, [defendingType]);
      matchups.set(defendingType, effectiveness.value);
    }

    return matchups;
  }

  /**
   * Get all type matchups for a specific defending type
   */
  getAllMatchupsForDefendingType(defendingType: TypeId): Map<TypeId, EffectivenessValue> {
    this.validateTypeId(defendingType);
    
    const matchups = new Map<TypeId, EffectivenessValue>();
    const allTypes = this.getAllTypeIds();

    for (const attackingType of allTypes) {
      const effectiveness = this.calculateEffectiveness(attackingType, [defendingType]);
      matchups.set(attackingType, effectiveness.value);
    }

    return matchups;
  }

  /**
   * Calculate combined effectiveness for dual-type defending Pokemon
   */
  calculateDualTypeEffectiveness(
    attackingType: TypeId,
    firstDefendingType: TypeId,
    secondDefendingType: TypeId
  ): TypeEffectiveness {
    return this.calculateEffectiveness(attackingType, [firstDefendingType, secondDefendingType]);
  }

  /**
   * Get weaknesses for a Pokemon type combination
   */
  getWeaknesses(defendingTypes: TypeId[]): TypeId[] {
    this.validateDefendingTypes(defendingTypes);
    
    const weaknesses: TypeId[] = [];
    const allTypes = this.getAllTypeIds();

    for (const attackingType of allTypes) {
      if (this.isSuperEffective(attackingType, defendingTypes)) {
        weaknesses.push(attackingType);
      }
    }

    return weaknesses;
  }

  /**
   * Get resistances for a Pokemon type combination
   */
  getResistances(defendingTypes: TypeId[]): TypeId[] {
    this.validateDefendingTypes(defendingTypes);
    
    const resistances: TypeId[] = [];
    const allTypes = this.getAllTypeIds();

    for (const attackingType of allTypes) {
      if (this.isNotVeryEffective(attackingType, defendingTypes)) {
        resistances.push(attackingType);
      }
    }

    return resistances;
  }

  /**
   * Get immunities for a Pokemon type combination
   */
  getImmunities(defendingTypes: TypeId[]): TypeId[] {
    this.validateDefendingTypes(defendingTypes);
    
    const immunities: TypeId[] = [];
    const allTypes = this.getAllTypeIds();

    for (const attackingType of allTypes) {
      if (this.hasNoEffect(attackingType, defendingTypes)) {
        immunities.push(attackingType);
      }
    }

    return immunities;
  }

  /**
   * Get single type effectiveness multiplier
   */
  private getSingleTypeMultiplier(attackingType: TypeId, defendingType: TypeId): number {
    const key = `${attackingType}-${defendingType}`;
    return this.effectivenessChart.get(key) ?? 1.0;
  }

  /**
   * Calculate dual-type effectiveness multiplier
   */
  private calculateDualTypeMultiplier(
    attackingType: TypeId,
    firstDefendingType: TypeId,
    secondDefendingType: TypeId
  ): number {
    const multiplier1 = this.getSingleTypeMultiplier(attackingType, firstDefendingType);
    const multiplier2 = this.getSingleTypeMultiplier(attackingType, secondDefendingType);
    return multiplier1 * multiplier2;
  }

  /**
   * Initialize the type effectiveness chart
   */
  private initializeEffectivenessChart(): Map<string, number> {
    const chart = new Map<string, number>();

    // Normal type effectiveness
    chart.set('normal-rock', 0.5);
    chart.set('normal-ghost', 0);
    chart.set('normal-steel', 0.5);

    // Fire type effectiveness
    chart.set('fire-fire', 0.5);
    chart.set('fire-water', 0.5);
    chart.set('fire-grass', 2.0);
    chart.set('fire-ice', 2.0);
    chart.set('fire-bug', 2.0);
    chart.set('fire-rock', 0.5);
    chart.set('fire-dragon', 0.5);
    chart.set('fire-steel', 2.0);

    // Water type effectiveness
    chart.set('water-fire', 2.0);
    chart.set('water-water', 0.5);
    chart.set('water-grass', 0.5);
    chart.set('water-ground', 2.0);
    chart.set('water-rock', 2.0);
    chart.set('water-dragon', 0.5);

    // Electric type effectiveness
    chart.set('electric-water', 2.0);
    chart.set('electric-electric', 0.5);
    chart.set('electric-grass', 0.5);
    chart.set('electric-ground', 0);
    chart.set('electric-flying', 2.0);
    chart.set('electric-dragon', 0.5);

    // Grass type effectiveness
    chart.set('grass-fire', 0.5);
    chart.set('grass-water', 2.0);
    chart.set('grass-grass', 0.5);
    chart.set('grass-poison', 0.5);
    chart.set('grass-ground', 2.0);
    chart.set('grass-flying', 0.5);
    chart.set('grass-bug', 0.5);
    chart.set('grass-rock', 2.0);
    chart.set('grass-dragon', 0.5);
    chart.set('grass-steel', 0.5);

    // Ice type effectiveness
    chart.set('ice-fire', 0.5);
    chart.set('ice-water', 0.5);
    chart.set('ice-grass', 2.0);
    chart.set('ice-ice', 0.5);
    chart.set('ice-ground', 2.0);
    chart.set('ice-flying', 2.0);
    chart.set('ice-dragon', 2.0);
    chart.set('ice-steel', 0.5);

    // Fighting type effectiveness
    chart.set('fighting-normal', 2.0);
    chart.set('fighting-ice', 2.0);
    chart.set('fighting-poison', 0.5);
    chart.set('fighting-flying', 0.5);
    chart.set('fighting-psychic', 0.5);
    chart.set('fighting-bug', 0.5);
    chart.set('fighting-rock', 2.0);
    chart.set('fighting-ghost', 0);
    chart.set('fighting-dark', 2.0);
    chart.set('fighting-steel', 2.0);
    chart.set('fighting-fairy', 0.5);

    // Poison type effectiveness
    chart.set('poison-grass', 2.0);
    chart.set('poison-poison', 0.5);
    chart.set('poison-ground', 0.5);
    chart.set('poison-rock', 0.5);
    chart.set('poison-ghost', 0.5);
    chart.set('poison-steel', 0);
    chart.set('poison-fairy', 2.0);

    // Ground type effectiveness
    chart.set('ground-fire', 2.0);
    chart.set('ground-electric', 2.0);
    chart.set('ground-grass', 0.5);
    chart.set('ground-poison', 2.0);
    chart.set('ground-flying', 0);
    chart.set('ground-bug', 0.5);
    chart.set('ground-rock', 2.0);
    chart.set('ground-steel', 2.0);

    // Flying type effectiveness
    chart.set('flying-electric', 0.5);
    chart.set('flying-grass', 2.0);
    chart.set('flying-fighting', 2.0);
    chart.set('flying-bug', 2.0);
    chart.set('flying-rock', 0.5);
    chart.set('flying-steel', 0.5);

    // Psychic type effectiveness
    chart.set('psychic-fighting', 2.0);
    chart.set('psychic-poison', 2.0);
    chart.set('psychic-psychic', 0.5);
    chart.set('psychic-dark', 0);
    chart.set('psychic-steel', 0.5);

    // Bug type effectiveness
    chart.set('bug-fire', 0.5);
    chart.set('bug-grass', 2.0);
    chart.set('bug-fighting', 0.5);
    chart.set('bug-poison', 0.5);
    chart.set('bug-flying', 0.5);
    chart.set('bug-psychic', 2.0);
    chart.set('bug-ghost', 0.5);
    chart.set('bug-dark', 2.0);
    chart.set('bug-steel', 0.5);
    chart.set('bug-fairy', 0.5);

    // Rock type effectiveness
    chart.set('rock-fire', 2.0);
    chart.set('rock-ice', 2.0);
    chart.set('rock-fighting', 0.5);
    chart.set('rock-ground', 0.5);
    chart.set('rock-flying', 2.0);
    chart.set('rock-bug', 2.0);
    chart.set('rock-steel', 0.5);

    // Ghost type effectiveness
    chart.set('ghost-normal', 0);
    chart.set('ghost-psychic', 2.0);
    chart.set('ghost-ghost', 2.0);
    chart.set('ghost-dark', 0.5);

    // Dragon type effectiveness
    chart.set('dragon-dragon', 2.0);
    chart.set('dragon-steel', 0.5);
    chart.set('dragon-fairy', 0);

    // Dark type effectiveness
    chart.set('dark-fighting', 0.5);
    chart.set('dark-psychic', 2.0);
    chart.set('dark-ghost', 2.0);
    chart.set('dark-dark', 0.5);
    chart.set('dark-fairy', 0.5);

    // Steel type effectiveness
    chart.set('steel-fire', 0.5);
    chart.set('steel-water', 0.5);
    chart.set('steel-electric', 0.5);
    chart.set('steel-ice', 2.0);
    chart.set('steel-rock', 2.0);
    chart.set('steel-steel', 0.5);
    chart.set('steel-fairy', 2.0);

    // Fairy type effectiveness
    chart.set('fairy-fire', 0.5);
    chart.set('fairy-fighting', 2.0);
    chart.set('fairy-poison', 0.5);
    chart.set('fairy-dragon', 2.0);
    chart.set('fairy-dark', 2.0);
    chart.set('fairy-steel', 0.5);

    return chart;
  }

  /**
   * Get all valid type IDs
   */
  private getAllTypeIds(): TypeId[] {
    return [
      'normal', 'fire', 'water', 'electric', 'grass', 'ice',
      'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
      'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
    ];
  }

  /**
   * Validate type ID
   */
  private validateTypeId(typeId: TypeId): void {
    const validTypes = this.getAllTypeIds();
    if (!validTypes.includes(typeId)) {
      throw new Error(`Invalid type ID: ${typeId}`);
    }
  }

  /**
   * Validate defending types array
   */
  private validateDefendingTypes(defendingTypes: TypeId[]): void {
    if (!Array.isArray(defendingTypes)) {
      throw new Error('Defending types must be an array');
    }

    if (defendingTypes.length === 0) {
      throw new Error('Defending types array cannot be empty');
    }

    if (defendingTypes.length > 2) {
      throw new Error('Defending types array cannot have more than 2 types');
    }

    for (const typeId of defendingTypes) {
      this.validateTypeId(typeId);
    }

    if (defendingTypes.length === 2 && defendingTypes[0] === defendingTypes[1]) {
      throw new Error('Dual-type defending types must be different');
    }
  }
}
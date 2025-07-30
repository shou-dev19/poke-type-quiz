/**
 * TypeEffectivenessService Unit Tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { TypeEffectivenessService } from '@/infrastructure/services/TypeEffectivenessService';
import { TypeEffectiveness } from '@/domain/entities/TypeEffectiveness';
import type { TypeId } from '@/domain/types';

describe('TypeEffectivenessService', () => {
  let service: TypeEffectivenessService;

  beforeEach(() => {
    service = new TypeEffectivenessService();
  });

  describe('calculateEffectiveness', () => {
    it('should calculate single-type effectiveness correctly', () => {
      // Fire vs Grass - Super Effective (2x)
      const fireVsGrass = service.calculateEffectiveness('fire', ['grass']);
      expect(fireVsGrass).toBe(TypeEffectiveness.SUPER_EFFECTIVE);
      expect(fireVsGrass.multiplier).toBe(2.0);

      // Water vs Fire - Super Effective (2x)
      const waterVsFire = service.calculateEffectiveness('water', ['fire']);
      expect(waterVsFire).toBe(TypeEffectiveness.SUPER_EFFECTIVE);
      expect(waterVsFire.multiplier).toBe(2.0);

      // Fire vs Water - Not Very Effective (0.5x)
      const fireVsWater = service.calculateEffectiveness('fire', ['water']);
      expect(fireVsWater).toBe(TypeEffectiveness.HALF_EFFECTIVE);
      expect(fireVsWater.multiplier).toBe(0.5);

      // Normal vs Ghost - No Effect (0x)
      const normalVsGhost = service.calculateEffectiveness('normal', ['ghost']);
      expect(normalVsGhost).toBe(TypeEffectiveness.NONE);
      expect(normalVsGhost.multiplier).toBe(0);

      // Normal vs Normal - Normal Effective (1x)
      const normalVsNormal = service.calculateEffectiveness('normal', ['normal']);
      expect(normalVsNormal).toBe(TypeEffectiveness.NORMAL_EFFECTIVE);
      expect(normalVsNormal.multiplier).toBe(1.0);
    });

    it('should calculate dual-type effectiveness correctly', () => {
      // Ice vs Dragon/Ground - Ultra Effective (4x = 2x * 2x)
      const iceVsDragonGround = service.calculateEffectiveness('ice', ['dragon', 'ground']);
      expect(iceVsDragonGround).toBe(TypeEffectiveness.ULTRA_EFFECTIVE);
      expect(iceVsDragonGround.multiplier).toBe(4.0);

      // Fire vs Grass/Steel - Ultra Effective (4x = 2x * 2x)
      const fireVsGrassSteel = service.calculateEffectiveness('fire', ['grass', 'steel']);
      expect(fireVsGrassSteel).toBe(TypeEffectiveness.ULTRA_EFFECTIVE);
      expect(fireVsGrassSteel.multiplier).toBe(4.0);

      // Water vs Fire/Rock - Ultra Effective (4x = 2x * 2x)
      const waterVsFireRock = service.calculateEffectiveness('water', ['fire', 'rock']);
      expect(waterVsFireRock).toBe(TypeEffectiveness.ULTRA_EFFECTIVE);
      expect(waterVsFireRock.multiplier).toBe(4.0);

      // Fire vs Water/Rock - Quarter Effective (0.25x = 0.5x * 0.5x)
      const fireVsWaterRock = service.calculateEffectiveness('fire', ['water', 'rock']);
      expect(fireVsWaterRock).toBe(TypeEffectiveness.QUARTER_EFFECTIVE);
      expect(fireVsWaterRock.multiplier).toBe(0.25);

      // Electric vs Water/Ground - No Effect (0x = 2x * 0x)
      const electricVsWaterGround = service.calculateEffectiveness('electric', ['water', 'ground']);
      expect(electricVsWaterGround).toBe(TypeEffectiveness.NONE);
      expect(electricVsWaterGround.multiplier).toBe(0);
    });

    it('should use memoization for repeated calculations', () => {
      // First calculation
      const result1 = service.calculateEffectiveness('fire', ['grass']);
      
      // Second calculation (should use cache)
      const result2 = service.calculateEffectiveness('fire', ['grass']);
      
      expect(result1).toBe(result2);
      expect(result1.multiplier).toBe(2.0);
    });

    it('should handle type order independence for dual types', () => {
      const result1 = service.calculateEffectiveness('ice', ['dragon', 'ground']);
      const result2 = service.calculateEffectiveness('ice', ['ground', 'dragon']);
      
      expect(result1).toBe(result2);
      expect(result1.multiplier).toBe(4.0);
    });
  });

  describe('getEffectivenessMultiplier', () => {
    it('should return correct multipliers for single type matchups', () => {
      expect(service.getEffectivenessMultiplier('fire', 'grass')).toBe(2.0);
      expect(service.getEffectivenessMultiplier('fire', 'water')).toBe(0.5);
      expect(service.getEffectivenessMultiplier('normal', 'ghost')).toBe(0);
      expect(service.getEffectivenessMultiplier('normal', 'normal')).toBe(1.0);
    });
  });

  describe('effectiveness check methods', () => {
    it('should correctly identify no effect', () => {
      expect(service.hasNoEffect('normal', ['ghost'])).toBe(true);
      expect(service.hasNoEffect('electric', ['ground'])).toBe(true);
      expect(service.hasNoEffect('fire', ['grass'])).toBe(false);
    });

    it('should correctly identify super effective', () => {
      expect(service.isSuperEffective('fire', ['grass'])).toBe(true);
      expect(service.isSuperEffective('ice', ['dragon', 'ground'])).toBe(true);
      expect(service.isSuperEffective('fire', ['water'])).toBe(false);
      expect(service.isSuperEffective('normal', ['ghost'])).toBe(false);
    });

    it('should correctly identify not very effective', () => {
      expect(service.isNotVeryEffective('fire', ['water'])).toBe(true);
      expect(service.isNotVeryEffective('fire', ['water', 'rock'])).toBe(true);
      expect(service.isNotVeryEffective('fire', ['grass'])).toBe(false);
      expect(service.isNotVeryEffective('normal', ['ghost'])).toBe(false);
    });
  });

  describe('matchup retrieval methods', () => {
    it('should get all matchups for attacking type', () => {
      const fireMatchups = service.getAllMatchupsForAttackingType('fire');
      
      expect(fireMatchups.get('grass')).toBe('SUPER_EFFECTIVE');
      expect(fireMatchups.get('water')).toBe('HALF_EFFECTIVE');
      expect(fireMatchups.get('normal')).toBe('NORMAL_EFFECTIVE');
      expect(fireMatchups.size).toBe(18); // All 18 types
    });

    it('should get all matchups for defending type', () => {
      const grassMatchups = service.getAllMatchupsForDefendingType('grass');
      
      expect(grassMatchups.get('fire')).toBe('SUPER_EFFECTIVE');
      expect(grassMatchups.get('water')).toBe('HALF_EFFECTIVE');
      expect(grassMatchups.get('normal')).toBe('NORMAL_EFFECTIVE');
      expect(grassMatchups.size).toBe(18); // All 18 types
    });
  });

  describe('calculateDualTypeEffectiveness', () => {
    it('should calculate dual-type effectiveness', () => {
      const result = service.calculateDualTypeEffectiveness('ice', 'dragon', 'ground');
      expect(result).toBe(TypeEffectiveness.ULTRA_EFFECTIVE);
      expect(result.multiplier).toBe(4.0);
    });
  });

  describe('weakness/resistance/immunity methods', () => {
    it('should get weaknesses correctly', () => {
      const grassWeaknesses = service.getWeaknesses(['grass']);
      expect(grassWeaknesses).toContain('fire');
      expect(grassWeaknesses).toContain('ice');
      expect(grassWeaknesses).toContain('flying');
      expect(grassWeaknesses).toContain('bug');
      expect(grassWeaknesses).not.toContain('water');
      expect(grassWeaknesses).not.toContain('electric');
    });

    it('should get resistances correctly', () => {
      const fireResistances = service.getResistances(['fire']);
      expect(fireResistances).toContain('fire');
      expect(fireResistances).toContain('grass');
      expect(fireResistances).toContain('ice');
      expect(fireResistances).not.toContain('water');
      expect(fireResistances).not.toContain('ground');
    });

    it('should get immunities correctly', () => {
      const ghostImmunities = service.getImmunities(['ghost']);
      expect(ghostImmunities).toContain('normal');
      expect(ghostImmunities).toContain('fighting');
      expect(ghostImmunities).not.toContain('ghost');
      expect(ghostImmunities).not.toContain('dark');
    });

    it('should handle dual-type weaknesses', () => {
      const dragonGroundWeaknesses = service.getWeaknesses(['dragon', 'ground']);
      expect(dragonGroundWeaknesses).toContain('ice'); // 4x weakness
      expect(dragonGroundWeaknesses).not.toContain('electric'); // Immunity from Ground
    });
  });

  describe('validation', () => {
    it('should throw error for invalid attacking type', () => {
      expect(() => {
        service.calculateEffectiveness('invalid' as TypeId, ['fire']);
      }).toThrow('Invalid type ID: invalid');
    });

    it('should throw error for invalid defending type', () => {
      expect(() => {
        service.calculateEffectiveness('fire', ['invalid' as TypeId]);
      }).toThrow('Invalid type ID: invalid');
    });

    it('should throw error for empty defending types', () => {
      expect(() => {
        service.calculateEffectiveness('fire', []);
      }).toThrow('Defending types array cannot be empty');
    });

    it('should throw error for more than 2 defending types', () => {
      expect(() => {
        service.calculateEffectiveness('fire', ['water', 'grass', 'electric'] as TypeId[]);
      }).toThrow('Defending types array cannot have more than 2 types');
    });

    it('should throw error for duplicate defending types', () => {
      expect(() => {
        service.calculateEffectiveness('fire', ['water', 'water']);
      }).toThrow('Dual-type defending types must be different');
    });

    it('should throw error for non-array defending types', () => {
      expect(() => {
        service.calculateEffectiveness('fire', 'water' as any);
      }).toThrow('Defending types must be an array');
    });
  });
});
/**
 * TypeEffectiveness Entity Unit Tests
 */

import { describe, it, expect } from 'vitest';
import { TypeEffectiveness } from '@/domain/entities/TypeEffectiveness';
import type { DifficultyLevel, EffectivenessValue } from '@/domain/types';

describe('TypeEffectiveness', () => {
  describe('Static Constants', () => {
    it('should have correct NONE values', () => {
      expect(TypeEffectiveness.NONE.value).toBe('NONE');
      expect(TypeEffectiveness.NONE.multiplier).toBe(0);
      expect(TypeEffectiveness.NONE.getDisplayText()).toBe('こうかなし(0倍)');
    });

    it('should have correct QUARTER_EFFECTIVE values', () => {
      expect(TypeEffectiveness.QUARTER_EFFECTIVE.value).toBe('QUARTER_EFFECTIVE');
      expect(TypeEffectiveness.QUARTER_EFFECTIVE.multiplier).toBe(0.25);
      expect(TypeEffectiveness.QUARTER_EFFECTIVE.getDisplayText()).toBe('こうかいまひとつ(0.25倍)');
    });

    it('should have correct HALF_EFFECTIVE values', () => {
      expect(TypeEffectiveness.HALF_EFFECTIVE.value).toBe('HALF_EFFECTIVE');
      expect(TypeEffectiveness.HALF_EFFECTIVE.multiplier).toBe(0.5);
      expect(TypeEffectiveness.HALF_EFFECTIVE.getDisplayText()).toBe('こうかいまひとつ(0.5倍)');
    });

    it('should have correct NORMAL_EFFECTIVE values', () => {
      expect(TypeEffectiveness.NORMAL_EFFECTIVE.value).toBe('NORMAL_EFFECTIVE');
      expect(TypeEffectiveness.NORMAL_EFFECTIVE.multiplier).toBe(1.0);
      expect(TypeEffectiveness.NORMAL_EFFECTIVE.getDisplayText()).toBe('ふつう(1倍)');
    });

    it('should have correct SUPER_EFFECTIVE values', () => {
      expect(TypeEffectiveness.SUPER_EFFECTIVE.value).toBe('SUPER_EFFECTIVE');
      expect(TypeEffectiveness.SUPER_EFFECTIVE.multiplier).toBe(2.0);
      expect(TypeEffectiveness.SUPER_EFFECTIVE.getDisplayText()).toBe('こうかばつぐん(2倍)');
    });

    it('should have correct ULTRA_EFFECTIVE values', () => {
      expect(TypeEffectiveness.ULTRA_EFFECTIVE.value).toBe('ULTRA_EFFECTIVE');
      expect(TypeEffectiveness.ULTRA_EFFECTIVE.multiplier).toBe(4.0);
      expect(TypeEffectiveness.ULTRA_EFFECTIVE.getDisplayText()).toBe('こうかばつぐん(4倍)');
    });
  });

  describe('Instance Methods', () => {
    describe('toString()', () => {
      it('should return the effectiveness value as string', () => {
        expect(TypeEffectiveness.SUPER_EFFECTIVE.toString()).toBe('SUPER_EFFECTIVE');
        expect(TypeEffectiveness.NONE.toString()).toBe('NONE');
      });
    });

    describe('toNumber()', () => {
      it('should return the multiplier value', () => {
        expect(TypeEffectiveness.SUPER_EFFECTIVE.toNumber()).toBe(2.0);
        expect(TypeEffectiveness.HALF_EFFECTIVE.toNumber()).toBe(0.5);
      });
    });

    describe('equals()', () => {
      it('should return true for same effectiveness', () => {
        expect(TypeEffectiveness.SUPER_EFFECTIVE.equals(TypeEffectiveness.SUPER_EFFECTIVE)).toBe(true);
      });

      it('should return false for different effectiveness', () => {
        expect(TypeEffectiveness.SUPER_EFFECTIVE.equals(TypeEffectiveness.HALF_EFFECTIVE)).toBe(false);
      });
    });

    describe('comparison methods', () => {
      it('should correctly compare effectiveness values', () => {
        expect(TypeEffectiveness.SUPER_EFFECTIVE.isGreaterThan(TypeEffectiveness.NORMAL_EFFECTIVE)).toBe(true);
        expect(TypeEffectiveness.HALF_EFFECTIVE.isLessThan(TypeEffectiveness.NORMAL_EFFECTIVE)).toBe(true);
        expect(TypeEffectiveness.NORMAL_EFFECTIVE.isGreaterThan(TypeEffectiveness.SUPER_EFFECTIVE)).toBe(false);
      });
    });
  });

  describe('Static Methods', () => {
    describe('getAllValues()', () => {
      it('should return all effectiveness values', () => {
        const allValues = TypeEffectiveness.getAllValues();
        expect(allValues).toHaveLength(6);
        expect(allValues).toContain(TypeEffectiveness.NONE);
        expect(allValues).toContain(TypeEffectiveness.QUARTER_EFFECTIVE);
        expect(allValues).toContain(TypeEffectiveness.HALF_EFFECTIVE);
        expect(allValues).toContain(TypeEffectiveness.NORMAL_EFFECTIVE);
        expect(allValues).toContain(TypeEffectiveness.SUPER_EFFECTIVE);
        expect(allValues).toContain(TypeEffectiveness.ULTRA_EFFECTIVE);
      });
    });

    describe('fromMultiplier()', () => {
      it('should return correct effectiveness for valid multipliers', () => {
        expect(TypeEffectiveness.fromMultiplier(0)).toBe(TypeEffectiveness.NONE);
        expect(TypeEffectiveness.fromMultiplier(0.25)).toBe(TypeEffectiveness.QUARTER_EFFECTIVE);
        expect(TypeEffectiveness.fromMultiplier(0.5)).toBe(TypeEffectiveness.HALF_EFFECTIVE);
        expect(TypeEffectiveness.fromMultiplier(1.0)).toBe(TypeEffectiveness.NORMAL_EFFECTIVE);
        expect(TypeEffectiveness.fromMultiplier(2.0)).toBe(TypeEffectiveness.SUPER_EFFECTIVE);
        expect(TypeEffectiveness.fromMultiplier(4.0)).toBe(TypeEffectiveness.ULTRA_EFFECTIVE);
      });

      it('should handle floating point precision', () => {
        expect(TypeEffectiveness.fromMultiplier(0.001)).toBe(TypeEffectiveness.NONE);
        expect(TypeEffectiveness.fromMultiplier(1.009)).toBe(TypeEffectiveness.NORMAL_EFFECTIVE);
      });

      it('should throw error for invalid multipliers', () => {
        expect(() => TypeEffectiveness.fromMultiplier(1.5)).toThrow('Invalid multiplier: 1.5');
        expect(() => TypeEffectiveness.fromMultiplier(-1)).toThrow('Invalid multiplier: -1');
        expect(() => TypeEffectiveness.fromMultiplier(3)).toThrow('Invalid multiplier: 3');
      });
    });

    describe('fromValue()', () => {
      it('should return correct effectiveness for valid values', () => {
        expect(TypeEffectiveness.fromValue('NONE')).toBe(TypeEffectiveness.NONE);
        expect(TypeEffectiveness.fromValue('SUPER_EFFECTIVE')).toBe(TypeEffectiveness.SUPER_EFFECTIVE);
      });

      it('should throw error for invalid values', () => {
        expect(() => TypeEffectiveness.fromValue('INVALID' as EffectivenessValue)).toThrow('Invalid effectiveness value: INVALID');
      });
    });

    describe('getChoicesForDifficulty()', () => {
      it('should return 4 choices for easy difficulty', () => {
        const choices = TypeEffectiveness.getChoicesForDifficulty('easy');
        expect(choices).toHaveLength(4);
        expect(choices).toContain(TypeEffectiveness.NONE);
        expect(choices).toContain(TypeEffectiveness.HALF_EFFECTIVE);
        expect(choices).toContain(TypeEffectiveness.NORMAL_EFFECTIVE);
        expect(choices).toContain(TypeEffectiveness.SUPER_EFFECTIVE);
        expect(choices).not.toContain(TypeEffectiveness.QUARTER_EFFECTIVE);
        expect(choices).not.toContain(TypeEffectiveness.ULTRA_EFFECTIVE);
      });

      it('should return 4 choices for normal difficulty', () => {
        const choices = TypeEffectiveness.getChoicesForDifficulty('normal');
        expect(choices).toHaveLength(4);
        expect(choices).toContain(TypeEffectiveness.NONE);
        expect(choices).toContain(TypeEffectiveness.HALF_EFFECTIVE);
        expect(choices).toContain(TypeEffectiveness.NORMAL_EFFECTIVE);
        expect(choices).toContain(TypeEffectiveness.SUPER_EFFECTIVE);
      });

      it('should return all 6 choices for hard difficulty', () => {
        const choices = TypeEffectiveness.getChoicesForDifficulty('hard');
        expect(choices).toHaveLength(6);
        expect(choices).toContain(TypeEffectiveness.NONE);
        expect(choices).toContain(TypeEffectiveness.QUARTER_EFFECTIVE);
        expect(choices).toContain(TypeEffectiveness.HALF_EFFECTIVE);
        expect(choices).toContain(TypeEffectiveness.NORMAL_EFFECTIVE);
        expect(choices).toContain(TypeEffectiveness.SUPER_EFFECTIVE);
        expect(choices).toContain(TypeEffectiveness.ULTRA_EFFECTIVE);
      });

      it('should throw error for invalid difficulty', () => {
        expect(() => TypeEffectiveness.getChoicesForDifficulty('invalid' as DifficultyLevel)).toThrow('Invalid difficulty: invalid');
      });
    });

    describe('combineEffectiveness()', () => {
      it('should correctly combine effectiveness values', () => {
        const result1 = TypeEffectiveness.combineEffectiveness(
          TypeEffectiveness.SUPER_EFFECTIVE,
          TypeEffectiveness.SUPER_EFFECTIVE
        );
        expect(result1).toBe(TypeEffectiveness.ULTRA_EFFECTIVE);

        const result2 = TypeEffectiveness.combineEffectiveness(
          TypeEffectiveness.SUPER_EFFECTIVE,
          TypeEffectiveness.HALF_EFFECTIVE
        );
        expect(result2).toBe(TypeEffectiveness.NORMAL_EFFECTIVE);

        const result3 = TypeEffectiveness.combineEffectiveness(
          TypeEffectiveness.NONE,
          TypeEffectiveness.SUPER_EFFECTIVE
        );
        expect(result3).toBe(TypeEffectiveness.NONE);
      });
    });
  });

  describe('Helper Methods', () => {
    describe('getEffectivenessDescription()', () => {
      it('should return correct descriptions', () => {
        expect(TypeEffectiveness.NONE.getEffectivenessDescription()).toBe('効果なし');
        expect(TypeEffectiveness.HALF_EFFECTIVE.getEffectivenessDescription()).toBe('効果いまひとつ');
        expect(TypeEffectiveness.NORMAL_EFFECTIVE.getEffectivenessDescription()).toBe('普通の効果');
        expect(TypeEffectiveness.SUPER_EFFECTIVE.getEffectivenessDescription()).toBe('効果抜群');
      });
    });

    describe('boolean check methods', () => {
      it('should correctly identify critical effectiveness', () => {
        expect(TypeEffectiveness.NONE.isCritical()).toBe(true);
        expect(TypeEffectiveness.ULTRA_EFFECTIVE.isCritical()).toBe(true);
        expect(TypeEffectiveness.NORMAL_EFFECTIVE.isCritical()).toBe(false);
      });

      it('should correctly identify neutral effectiveness', () => {
        expect(TypeEffectiveness.NORMAL_EFFECTIVE.isNeutral()).toBe(true);
        expect(TypeEffectiveness.SUPER_EFFECTIVE.isNeutral()).toBe(false);
      });

      it('should correctly identify positive effectiveness', () => {
        expect(TypeEffectiveness.SUPER_EFFECTIVE.isPositive()).toBe(true);
        expect(TypeEffectiveness.ULTRA_EFFECTIVE.isPositive()).toBe(true);
        expect(TypeEffectiveness.NORMAL_EFFECTIVE.isPositive()).toBe(false);
        expect(TypeEffectiveness.HALF_EFFECTIVE.isPositive()).toBe(false);
      });

      it('should correctly identify negative effectiveness', () => {
        expect(TypeEffectiveness.HALF_EFFECTIVE.isNegative()).toBe(true);
        expect(TypeEffectiveness.QUARTER_EFFECTIVE.isNegative()).toBe(true);
        expect(TypeEffectiveness.NONE.isNegative()).toBe(false);
        expect(TypeEffectiveness.NORMAL_EFFECTIVE.isNegative()).toBe(false);
        expect(TypeEffectiveness.SUPER_EFFECTIVE.isNegative()).toBe(false);
      });
    });
  });

  describe('Edge Cases', () => {
    it('should have consistent static instances', () => {
      const original = TypeEffectiveness.SUPER_EFFECTIVE;
      expect(original.value).toBe('SUPER_EFFECTIVE');
      expect(original.multiplier).toBe(2.0);
      
      // Static instances should be the same reference
      expect(TypeEffectiveness.SUPER_EFFECTIVE).toBe(original);
    });

    it('should maintain reference equality for static instances', () => {
      const instance1 = TypeEffectiveness.fromMultiplier(2.0);
      const instance2 = TypeEffectiveness.fromValue('SUPER_EFFECTIVE');
      expect(instance1).toBe(instance2);
      expect(instance1).toBe(TypeEffectiveness.SUPER_EFFECTIVE);
    });
  });
});
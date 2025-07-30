/**
 * PokemonType Entity Unit Tests
 */

import { describe, it, expect } from 'vitest';
import { PokemonType } from '@/domain/entities/PokemonType';
import type { PokemonTypeData, TypeId } from '@/domain/types';

describe('PokemonType', () => {
  const validTypeData: PokemonTypeData = {
    id: 'fire',
    nameJa: 'ほのお',
    color: '#F08030',
    colorLight: '#FF6030',
    symbol: '炎',
    animation: 'flame-flicker'
  };

  describe('Constructor and Creation', () => {
    it('should create a valid PokemonType instance', () => {
      const type = new PokemonType(validTypeData);
      
      expect(type.id).toBe('fire');
      expect(type.nameJa).toBe('ほのお');
      expect(type.color).toBe('#F08030');
      expect(type.colorLight).toBe('#FF6030');
      expect(type.symbol).toBe('炎');
      expect(type.animation).toBe('flame-flicker');
    });

    it('should create instance using static create method', () => {
      const type = PokemonType.create(validTypeData);
      expect(type).toBeInstanceOf(PokemonType);
      expect(type.id).toBe('fire');
    });

    it('should throw error for null data', () => {
      expect(() => new PokemonType(null as any)).toThrow('Pokemon type data is required');
    });

    it('should throw error for undefined data', () => {
      expect(() => new PokemonType(undefined as any)).toThrow('Pokemon type data is required');
    });
  });

  describe('Field Validation', () => {
    it('should throw error for missing required fields', () => {
      const requiredFields: (keyof PokemonTypeData)[] = [
        'id', 'nameJa', 'color', 'colorLight', 'symbol', 'animation'
      ];

      requiredFields.forEach(field => {
        const invalidData = { ...validTypeData };
        delete (invalidData as any)[field];
        
        expect(() => new PokemonType(invalidData)).toThrow(
          `Pokemon type field '${field}' is required`
        );
      });
    });

    it('should throw error for empty string fields', () => {
      const stringFields: (keyof PokemonTypeData)[] = ['nameJa', 'symbol', 'animation'];
      
      stringFields.forEach(field => {
        // Empty string is caught by required field validation
        const invalidData = { ...validTypeData, [field]: '' };
        expect(() => new PokemonType(invalidData)).toThrow(
          `Pokemon type field '${field}' is required`
        );

        // Whitespace-only string should be caught by empty validation
        const whitespaceData = { ...validTypeData, [field]: '   ' };
        expect(() => new PokemonType(whitespaceData)).toThrow(
          `Pokemon type ${field} cannot be empty`
        );
      });
    });

    it('should validate type ID', () => {
      const invalidData = { ...validTypeData, id: 'invalid' as TypeId };
      expect(() => new PokemonType(invalidData)).toThrow('Invalid type ID: invalid');
    });

    it('should validate color format', () => {
      const invalidColors = ['red', '#GGG', '#12345', 'rgb(255,0,0)', '123456'];
      
      invalidColors.forEach(color => {
        const invalidData = { ...validTypeData, color };
        expect(() => new PokemonType(invalidData)).toThrow(
          `Invalid color format: ${color}`
        );
      });
    });

    it('should validate colorLight format', () => {
      const invalidData = { ...validTypeData, colorLight: 'invalid' };
      expect(() => new PokemonType(invalidData)).toThrow(
        'Invalid colorLight format: invalid'
      );
    });

    it('should accept valid color formats', () => {
      const validColors = ['#F08030', '#ABC', '#123456', '#abc123'];
      
      validColors.forEach(color => {
        const validData = { ...validTypeData, color, colorLight: color };
        expect(() => new PokemonType(validData)).not.toThrow();
      });
    });
  });

  describe('Instance Methods', () => {
    let type: PokemonType;

    beforeEach(() => {
      type = new PokemonType(validTypeData);
    });

    describe('getter methods', () => {
      it('should return correct display name', () => {
        expect(type.getDisplayName()).toBe('ほのお');
      });

      it('should return correct color', () => {
        expect(type.getColor()).toBe('#F08030');
      });

      it('should return correct light color', () => {
        expect(type.getLightColor()).toBe('#FF6030');
      });

      it('should return correct symbol', () => {
        expect(type.getSymbol()).toBe('炎');
      });

      it('should return correct animation', () => {
        expect(type.getAnimation()).toBe('flame-flicker');
      });
    });

    describe('equals()', () => {
      it('should return true for same type', () => {
        const otherType = new PokemonType(validTypeData);
        expect(type.equals(otherType)).toBe(true);
      });

      it('should return false for different types', () => {
        const waterData: PokemonTypeData = {
          ...validTypeData,
          id: 'water',
          nameJa: 'みず'
        };
        const waterType = new PokemonType(waterData);
        expect(type.equals(waterType)).toBe(false);
      });
    });

    describe('toData()', () => {
      it('should return correct data object', () => {
        const data = type.toData();
        expect(data).toEqual(validTypeData);
      });

      it('should return a new object (not reference)', () => {
        const data = type.toData();
        expect(data).not.toBe(validTypeData);
        expect(data).toEqual(validTypeData);
      });
    });

    describe('toString()', () => {
      it('should return formatted string', () => {
        expect(type.toString()).toBe('PokemonType(fire: ほのお)');
      });
    });

    describe('toJSON()', () => {
      it('should return same as toData()', () => {
        expect(type.toJSON()).toEqual(type.toData());
      });

      it('should work with JSON.stringify', () => {
        const jsonString = JSON.stringify(type);
        const parsed = JSON.parse(jsonString);
        expect(parsed).toEqual(validTypeData);
      });
    });
  });

  describe('Static Methods', () => {
    describe('getAllTypeIds()', () => {
      it('should return all 18 type IDs', () => {
        const allTypes = PokemonType.getAllTypeIds();
        expect(allTypes).toHaveLength(18);
        expect(allTypes).toContain('fire');
        expect(allTypes).toContain('water');
        expect(allTypes).toContain('fairy');
      });

      it('should return expected types', () => {
        const expectedTypes: TypeId[] = [
          'normal', 'fire', 'water', 'electric', 'grass', 'ice',
          'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
          'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
        ];
        
        const allTypes = PokemonType.getAllTypeIds();
        expect(allTypes.sort()).toEqual(expectedTypes.sort());
      });
    });

    describe('isValidTypeId()', () => {
      it('should return true for valid type IDs', () => {
        expect(PokemonType.isValidTypeId('fire')).toBe(true);
        expect(PokemonType.isValidTypeId('water')).toBe(true);
        expect(PokemonType.isValidTypeId('fairy')).toBe(true);
      });

      it('should return false for invalid type IDs', () => {
        expect(PokemonType.isValidTypeId('invalid')).toBe(false);
        expect(PokemonType.isValidTypeId('')).toBe(false);
        expect(PokemonType.isValidTypeId('FIRE')).toBe(false);
      });
    });

    describe('getBasicTypeIds()', () => {
      it('should return 8 basic types', () => {
        const basicTypes = PokemonType.getBasicTypeIds();
        expect(basicTypes).toHaveLength(8);
      });

      it('should include expected basic types', () => {
        const basicTypes = PokemonType.getBasicTypeIds();
        const expectedBasic: TypeId[] = [
          'normal', 'fire', 'water', 'electric', 'grass', 'ice', 'fighting', 'poison'
        ];
        
        expect(basicTypes.sort()).toEqual(expectedBasic.sort());
      });
    });

    describe('isBasicType()', () => {
      it('should return true for basic types', () => {
        expect(PokemonType.isBasicType('fire')).toBe(true);
        expect(PokemonType.isBasicType('water')).toBe(true);
        expect(PokemonType.isBasicType('normal')).toBe(true);
      });

      it('should return false for advanced types', () => {
        expect(PokemonType.isBasicType('steel')).toBe(false);
        expect(PokemonType.isBasicType('fairy')).toBe(false);
        expect(PokemonType.isBasicType('dark')).toBe(false);
      });
    });

    describe('validateTypeDataArray()', () => {
      it('should validate valid array', () => {
        const dataArray: PokemonTypeData[] = [
          validTypeData,
          { ...validTypeData, id: 'water', nameJa: 'みず' }
        ];
        
        expect(() => PokemonType.validateTypeDataArray(dataArray)).not.toThrow();
        expect(PokemonType.validateTypeDataArray(dataArray)).toBe(true);
      });

      it('should throw error for non-array input', () => {
        expect(() => PokemonType.validateTypeDataArray({} as any)).toThrow(
          'Type data must be an array'
        );
      });

      it('should throw error for empty array', () => {
        expect(() => PokemonType.validateTypeDataArray([])).toThrow(
          'Type data array cannot be empty'
        );
      });

      it('should throw error for duplicate IDs', () => {
        const dataArray: PokemonTypeData[] = [
          validTypeData,
          validTypeData // Same ID
        ];
        
        expect(() => PokemonType.validateTypeDataArray(dataArray)).toThrow(
          'Duplicate type IDs found in data array'
        );
      });

      it('should throw error for invalid data in array', () => {
        const dataArray: PokemonTypeData[] = [
          validTypeData,
          { ...validTypeData, id: 'invalid' as TypeId }
        ];
        
        expect(() => PokemonType.validateTypeDataArray(dataArray)).toThrow(
          'Invalid type data at index 1'
        );
      });
    });
  });

  describe('Integration with TypeEffectiveness', () => {
    it('should work with all valid type IDs', () => {
      const allTypeIds = PokemonType.getAllTypeIds();
      
      allTypeIds.forEach(typeId => {
        const typeData: PokemonTypeData = {
          id: typeId,
          nameJa: `テスト${typeId}`,
          color: '#123456',
          colorLight: '#789ABC',
          symbol: 'テスト',
          animation: 'test-animation'
        };
        
        expect(() => new PokemonType(typeData)).not.toThrow();
      });
    });
  });
});
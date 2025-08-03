import { describe, it, expect } from 'vitest';
import { calculateDamage, generateQuestions, getAnswerChoices, getAnswerText, formatDefendType } from '../quizLogic';

describe('quizLogic', () => {
  describe('calculateDamage', () => {
    it('should calculate single type effectiveness correctly', () => {
      // Super effective
      expect(calculateDamage('ほのお', 'くさ')).toBe(2);
      expect(calculateDamage('みず', 'ほのお')).toBe(2);
      expect(calculateDamage('でんき', 'みず')).toBe(2);
      
      // Normal effectiveness
      expect(calculateDamage('ノーマル', 'ノーマル')).toBe(1);
      expect(calculateDamage('ほのお', 'でんき')).toBe(1);
      
      // Not very effective
      expect(calculateDamage('ほのお', 'みず')).toBe(0.5);
      expect(calculateDamage('みず', 'くさ')).toBe(0.5);
      
      // No effect
      expect(calculateDamage('ノーマル', 'ゴースト')).toBe(0);
      expect(calculateDamage('でんき', 'じめん')).toBe(0);
    });

    it('should calculate dual type effectiveness correctly', () => {
      // 4x effectiveness (2 * 2)
      expect(calculateDamage('いわ', ['ほのお', 'ひこう'])).toBe(4);
      expect(calculateDamage('でんき', ['みず', 'ひこう'])).toBe(4);
      
      // 2x effectiveness (2 * 1 or 1 * 2)
      expect(calculateDamage('ほのお', ['くさ', 'ノーマル'])).toBe(2);
      
      // 1x effectiveness (2 * 0.5 or 1 * 1)
      expect(calculateDamage('ほのお', ['くさ', 'みず'])).toBe(1);
      
      // 0.5x effectiveness (1 * 0.5 or 2 * 0.25)
      expect(calculateDamage('みず', ['くさ', 'ノーマル'])).toBe(0.5);
      
      // 0.25x effectiveness (0.5 * 0.5)
      expect(calculateDamage('くさ', ['ほのお', 'ひこう'])).toBe(0.25);
      
      // 0x effectiveness (any * 0)
      expect(calculateDamage('ノーマル', ['ゴースト', 'ほのお'])).toBe(0);
    });
  });

  describe('generateQuestions', () => {
    it('should generate correct number of questions', () => {
      const questions = generateQuestions('ふつう', 5);
      expect(questions).toHaveLength(5);
      
      const moreQuestions = generateQuestions('かんたん', 10);
      expect(moreQuestions).toHaveLength(10);
    });

    it('should generate unique questions without duplicates', () => {
      const questions = generateQuestions('ふつう', 10);
      const combinations = questions.map(q => 
        `${q.attackType}-${Array.isArray(q.defendType) ? q.defendType.join(',') : q.defendType}`
      );
      const uniqueCombinations = new Set(combinations);
      expect(combinations.length).toBe(uniqueCombinations.size);
    });

    it('should generate only basic types for easy mode', () => {
      const questions = generateQuestions('かんたん', 5);
      const basicTypes = ['ほのお', 'みず', 'くさ', 'でんき', 'こおり', 'かくとう', 'ひこう', 'いわ'];
      
      questions.forEach(question => {
        expect(basicTypes.includes(question.attackType)).toBe(true);
        if (Array.isArray(question.defendType)) {
          question.defendType.forEach(type => {
            expect(basicTypes.includes(type)).toBe(true);
          });
        } else {
          expect(basicTypes.includes(question.defendType)).toBe(true);
        }
      });
    });

    it('should generate only dual type questions for difficult mode', () => {
      const questions = generateQuestions('むずかしい', 5);
      questions.forEach(question => {
        expect(Array.isArray(question.defendType)).toBe(true);
        expect(question.defendType).toHaveLength(2);
        // Ensure the two types are different
        expect(question.defendType[0]).not.toBe(question.defendType[1]);
      });
    });

    it('should calculate correct answers for generated questions', () => {
      const questions = generateQuestions('ふつう', 3);
      questions.forEach(question => {
        const expectedAnswer = calculateDamage(question.attackType, question.defendType);
        expect(question.correctAnswer).toBe(expectedAnswer);
      });
    });
  });

  describe('getAnswerChoices', () => {
    it('should return correct choices for easy mode', () => {
      const choices = getAnswerChoices('かんたん');
      expect(choices).toEqual([2, 1, 0.5, 0]);
      expect(choices).toHaveLength(4);
    });

    it('should return correct choices for normal mode', () => {
      const choices = getAnswerChoices('ふつう');
      expect(choices).toEqual([2, 1, 0.5, 0]);
      expect(choices).toHaveLength(4);
    });

    it('should return correct choices for difficult mode', () => {
      const choices = getAnswerChoices('むずかしい');
      expect(choices).toEqual([4, 2, 1, 0.5, 0.25, 0]);
      expect(choices).toHaveLength(6);
    });
  });

  describe('getAnswerText', () => {
    it('should return correct Japanese text for each multiplier', () => {
      expect(getAnswerText(4)).toBe('こうかばつぐん(4倍)');
      expect(getAnswerText(2)).toBe('こうかばつぐん(2倍)');
      expect(getAnswerText(1)).toBe('ふつう(1倍)');
      expect(getAnswerText(0.5)).toBe('こうかいまひとつ(0.5倍)');
      expect(getAnswerText(0.25)).toBe('こうかいまひとつ(0.25倍)');
      expect(getAnswerText(0)).toBe('こうかなし(0倍)');
    });
  });

  describe('formatDefendType', () => {
    it('should format single type correctly', () => {
      expect(formatDefendType('ほのお')).toBe('ほのお');
      expect(formatDefendType('みず')).toBe('みず');
      expect(formatDefendType('でんき')).toBe('でんき');
    });

    it('should format dual type correctly', () => {
      expect(formatDefendType(['ほのお', 'ひこう'])).toBe('ほのお・ひこう');
      expect(formatDefendType(['みず', 'じめん'])).toBe('みず・じめん');
      expect(formatDefendType(['くさ', 'どく'])).toBe('くさ・どく');
    });
  });

  describe('edge cases and error handling', () => {
    it('should handle zero questions gracefully', () => {
      const questions = generateQuestions('ふつう', 0);
      expect(questions).toHaveLength(0);
      expect(Array.isArray(questions)).toBe(true);
    });

    it('should handle large number of questions', () => {
      // Test that it can generate many unique questions
      const questions = generateQuestions('ふつう', 50);
      expect(questions.length).toBeLessThanOrEqual(50);
      expect(questions.length).toBeGreaterThan(0);
    });
  });
});
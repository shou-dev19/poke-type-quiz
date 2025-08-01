import { 
  PokemonType, 
  QuizQuestion, 
  Difficulty, 
  DamageMultiplier, 
  POKEMON_TYPES, 
  TYPE_EFFECTIVENESS 
} from '../types/pokemon';

export function calculateDamage(
  attackType: PokemonType, 
  defendType: PokemonType | [PokemonType, PokemonType]
): DamageMultiplier {
  if (Array.isArray(defendType)) {
    // 複合タイプの場合、両方のタイプとの相性を掛け算
    const multiplier1 = TYPE_EFFECTIVENESS[attackType][defendType[0]];
    const multiplier2 = TYPE_EFFECTIVENESS[attackType][defendType[1]];
    const result = multiplier1 * multiplier2;
    
    // 結果を有効な倍率に変換
    if (result === 4) return 4;
    if (result === 2) return 2;
    if (result === 1) return 1;
    if (result === 0.5) return 0.5;
    if (result === 0.25) return 0.25;
    if (result === 0) return 0;
    return result as DamageMultiplier;
  } else {
    return TYPE_EFFECTIVENESS[attackType][defendType];
  }
}

export function generateQuestions(difficulty: Difficulty, count: number): QuizQuestion[] {
  const questions: QuizQuestion[] = [];
  const usedCombinations = new Set<string>();

  while (questions.length < count) {
    let attackType: PokemonType;
    let defendType: PokemonType | [PokemonType, PokemonType];

    // 難易度に応じて問題を生成
    switch (difficulty) {
      case 'かんたん':
        // 基本的なタイプのみ（効果的な相性がわかりやすいもの）
        const basicTypes: PokemonType[] = ['ほのお', 'みず', 'くさ', 'でんき', 'こおり', 'かくとう', 'ひこう', 'いわ'];
        attackType = basicTypes[Math.floor(Math.random() * basicTypes.length)];
        defendType = basicTypes[Math.floor(Math.random() * basicTypes.length)];
        break;
        
      case 'ふつう':
        // 全18タイプから選択
        attackType = POKEMON_TYPES[Math.floor(Math.random() * POKEMON_TYPES.length)];
        defendType = POKEMON_TYPES[Math.floor(Math.random() * POKEMON_TYPES.length)];
        break;
        
      case 'むずかしい':
        // 複合タイプのみ出題（100%）
        attackType = POKEMON_TYPES[Math.floor(Math.random() * POKEMON_TYPES.length)];
        // 必ず複合タイプを生成
        let type1 = POKEMON_TYPES[Math.floor(Math.random() * POKEMON_TYPES.length)];
        let type2 = POKEMON_TYPES[Math.floor(Math.random() * POKEMON_TYPES.length)];
        while (type1 === type2) {
          type2 = POKEMON_TYPES[Math.floor(Math.random() * POKEMON_TYPES.length)];
        }
        defendType = [type1, type2];
        break;
    }

    // 重複チェック
    const combination = `${attackType}-${Array.isArray(defendType) ? defendType.join(',') : defendType}`;
    if (usedCombinations.has(combination)) {
      continue;
    }

    usedCombinations.add(combination);
    const correctAnswer = calculateDamage(attackType, defendType);

    questions.push({
      attackType,
      defendType,
      correctAnswer
    });
  }

  return questions;
}

export function getAnswerChoices(difficulty: Difficulty): DamageMultiplier[] {
  switch (difficulty) {
    case 'かんたん':
    case 'ふつう':
      return [2, 1, 0.5, 0];
    case 'むずかしい':
      return [4, 2, 1, 0.5, 0.25, 0];
  }
}

export function getAnswerText(multiplier: DamageMultiplier): string {
  switch (multiplier) {
    case 4: return 'こうかばつぐん(4倍)';
    case 2: return 'こうかばつぐん(2倍)';
    case 1: return 'ふつう(1倍)';
    case 0.5: return 'こうかいまひとつ(0.5倍)';
    case 0.25: return 'こうかいまひとつ(0.25倍)';
    case 0: return 'こうかなし(0倍)';
  }
}

export function formatDefendType(defendType: PokemonType | [PokemonType, PokemonType]): string {
  if (Array.isArray(defendType)) {
    return `${defendType[0]}・${defendType[1]}`;
  }
  return defendType;
}
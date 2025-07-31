import { 
  PokemonType, 
  QuizQuestion, 
  Difficulty, 
  DamageMultiplier, 
  TYPE_EFFECTIVENESS, 
  DUAL_TYPES,
  DIFFICULTY_CONFIG 
} from '@/types/pokemon';

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
  const config = DIFFICULTY_CONFIG[difficulty];

  while (questions.length < count) {
    let attackType: PokemonType;
    let defendType: PokemonType | [PokemonType, PokemonType];

    // 設定に応じてタイプを選択
    const availableTypes = config.types;
    attackType = availableTypes[Math.floor(Math.random() * availableTypes.length)];

    if (config.dualTypes && Math.random() < 0.4) {
      // 複合タイプを使用
      defendType = DUAL_TYPES[Math.floor(Math.random() * DUAL_TYPES.length)];
    } else {
      defendType = availableTypes[Math.floor(Math.random() * availableTypes.length)];
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
  const config = DIFFICULTY_CONFIG[difficulty];
  
  if (config.choices === 4) {
    return [2, 1, 0.5, 0];
  } else {
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

// スコア計算関数
export function calculateScore(correctAnswers: number, totalQuestions: number, difficulty: Difficulty): number {
  const baseScore = (correctAnswers / totalQuestions) * 100;
  
  // 難易度ボーナス
  const difficultyMultiplier = {
    'かんたん': 1.0,
    'ふつう': 1.2,
    'むずかしい': 1.5
  };
  
  return Math.round(baseScore * difficultyMultiplier[difficulty]);
}

// 結果評価関数
export function getGradeInfo(percentage: number) {
  if (percentage >= 90) return { grade: 'S', color: 'text-yellow-500', message: 'ポケモンマスター！' };
  if (percentage >= 80) return { grade: 'A', color: 'text-green-500', message: 'すばらしい！' };
  if (percentage >= 70) return { grade: 'B', color: 'text-blue-500', message: 'よくできました！' };
  if (percentage >= 60) return { grade: 'C', color: 'text-orange-500', message: 'もう少し！' };
  return { grade: 'D', color: 'text-red-500', message: 'がんばろう！' };
}

// ヒント生成関数
export function generateHint(attackType: PokemonType, defendType: PokemonType | [PokemonType, PokemonType]): string {
  const hints: Record<string, string> = {
    'ほのお→くさ': 'ほのおタイプは くさタイプを よく燃やします',
    'みず→ほのお': 'みずタイプは ほのおタイプを 消火します',
    'くさ→みず': 'くさタイプは みずを よく吸収します',
    'でんき→みず': 'でんきタイプは みずタイプに よく流れます',
    'でんき→ひこう': 'でんきタイプは そらを飛ぶ ポケモンに よく当たります',
    'こおり→くさ': 'こおりタイプは くさタイプを 凍らせます',
    'こおり→ドラゴン': 'ドラゴンタイプは さむさが 苦手です',
    'かくとう→ノーマル': 'かくとうタイプは ノーマルタイプに 強いです',
    'どく→くさ': 'どくタイプは くさタイプを 枯らします',
    'じめん→でんき': 'じめんタイプは でんきを アースします',
    'ひこう→くさ': 'ひこうタイプは くさタイプを 踏みつけます',
    'エスパー→かくとう': 'エスパータイプは ちからより こころで 戦います',
    'むし→エスパー': 'むしタイプは エスパーの 集中力を 乱します',
    'いわ→ひこう': 'いわタイプは そらを飛ぶ ポケモンを 撃ち落とします',
    'ゴースト→エスパー': 'ゴーストタイプは エスパーの こころを 乱します',
    'あく→エスパー': 'あくタイプは エスパーの よみを 封じます',
    'はがね→こおり': 'はがねタイプは こおりを くだきます',
    'フェアリー→ドラゴン': 'フェアリータイプは ドラゴンを 魅了します'
  };

  if (Array.isArray(defendType)) {
    return '複合タイプの場合は 両方のタイプとの相性を かけ算します';
  }

  const key = `${attackType}→${defendType}`;
  return hints[key] || 'タイプ相性を よく考えてみましょう';
}

// 問題の難易度評価
export function getQuestionDifficulty(attackType: PokemonType, defendType: PokemonType | [PokemonType, PokemonType]): 'easy' | 'medium' | 'hard' {
  if (Array.isArray(defendType)) {
    return 'hard';
  }

  const effectiveness = TYPE_EFFECTIVENESS[attackType][defendType];
  
  // 基本的な相性（2倍、0.5倍、0倍）は簡単
  if (effectiveness === 2 || effectiveness === 0.5 || effectiveness === 0) {
    return 'easy';
  }
  
  // 等倍は中程度
  return 'medium';
}

// シャッフル用ユーティリティ関数
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
// ポケモンタイプ相性データ（完全版）
// 画像 type_table.png から作成
// 攻撃側タイプ → 防御側タイプ → 倍率

export const TYPE_EFFECTIVENESS = {
  // ノーマル
  "normal": {
    "normal": 1.0,
    "fire": 1.0,
    "water": 1.0,
    "electric": 1.0,
    "grass": 1.0,
    "ice": 1.0,
    "fighting": 1.0,
    "poison": 1.0,
    "ground": 1.0,
    "flying": 1.0,
    "psychic": 1.0,
    "bug": 1.0,
    "rock": 0.5,
    "ghost": 0.0,
    "dragon": 1.0,
    "dark": 1.0,
    "steel": 0.5,
    "fairy": 1.0
  },

  // ほのお
  "fire": {
    "normal": 1.0,
    "fire": 0.5,
    "water": 0.5,
    "electric": 1.0,
    "grass": 2.0,
    "ice": 2.0,
    "fighting": 1.0,
    "poison": 1.0,
    "ground": 1.0,
    "flying": 1.0,
    "psychic": 1.0,
    "bug": 2.0,
    "rock": 0.5,
    "ghost": 1.0,
    "dragon": 0.5,
    "dark": 1.0,
    "steel": 2.0,
    "fairy": 1.0
  },

  // みず
  "water": {
    "normal": 1.0,
    "fire": 2.0,
    "water": 0.5,
    "electric": 1.0,
    "grass": 0.5,
    "ice": 1.0,
    "fighting": 1.0,
    "poison": 1.0,
    "ground": 2.0,
    "flying": 1.0,
    "psychic": 1.0,
    "bug": 1.0,
    "rock": 2.0,
    "ghost": 1.0,
    "dragon": 0.5,
    "dark": 1.0,
    "steel": 1.0,
    "fairy": 1.0
  },

  // でんき
  "electric": {
    "normal": 1.0,
    "fire": 1.0,
    "water": 2.0,
    "electric": 0.5,
    "grass": 0.5,
    "ice": 1.0,
    "fighting": 1.0,
    "poison": 1.0,
    "ground": 0.0,
    "flying": 2.0,
    "psychic": 1.0,
    "bug": 1.0,
    "rock": 1.0,
    "ghost": 1.0,
    "dragon": 0.5,
    "dark": 1.0,
    "steel": 1.0,
    "fairy": 1.0
  },

  // くさ
  "grass": {
    "normal": 1.0,
    "fire": 0.5,
    "water": 2.0,
    "electric": 1.0,
    "grass": 0.5,
    "ice": 1.0,
    "fighting": 1.0,
    "poison": 0.5,
    "ground": 2.0,
    "flying": 0.5,
    "psychic": 1.0,
    "bug": 0.5,
    "rock": 2.0,
    "ghost": 1.0,
    "dragon": 0.5,
    "dark": 1.0,
    "steel": 0.5,
    "fairy": 1.0
  },

  // こおり
  "ice": {
    "normal": 1.0,
    "fire": 0.5,
    "water": 0.5,
    "electric": 1.0,
    "grass": 2.0,
    "ice": 0.5,
    "fighting": 1.0,
    "poison": 1.0,
    "ground": 2.0,
    "flying": 2.0,
    "psychic": 1.0,
    "bug": 1.0,
    "rock": 1.0,
    "ghost": 1.0,
    "dragon": 2.0,
    "dark": 1.0,
    "steel": 0.5,
    "fairy": 1.0
  },

  // かくとう
  "fighting": {
    "normal": 2.0,
    "fire": 1.0,
    "water": 1.0,
    "electric": 1.0,
    "grass": 1.0,
    "ice": 2.0,
    "fighting": 1.0,
    "poison": 0.5,
    "ground": 1.0,
    "flying": 0.5,
    "psychic": 0.5,
    "bug": 0.5,
    "rock": 2.0,
    "ghost": 0.0,
    "dragon": 1.0,
    "dark": 2.0,
    "steel": 2.0,
    "fairy": 0.5
  },

  // どく
  "poison": {
    "normal": 1.0,
    "fire": 1.0,
    "water": 1.0,
    "electric": 1.0,
    "grass": 2.0,
    "ice": 1.0,
    "fighting": 1.0,
    "poison": 0.5,
    "ground": 0.5,
    "flying": 1.0,
    "psychic": 1.0,
    "bug": 1.0,
    "rock": 0.5,
    "ghost": 0.5,
    "dragon": 1.0,
    "dark": 1.0,
    "steel": 0.0,
    "fairy": 2.0
  },

  // じめん
  "ground": {
    "normal": 1.0,
    "fire": 2.0,
    "water": 1.0,
    "electric": 2.0,
    "grass": 0.5,
    "ice": 1.0,
    "fighting": 1.0,
    "poison": 2.0,
    "ground": 1.0,
    "flying": 0.0,
    "psychic": 1.0,
    "bug": 0.5,
    "rock": 2.0,
    "ghost": 1.0,
    "dragon": 1.0,
    "dark": 1.0,
    "steel": 2.0,
    "fairy": 1.0
  },

  // ひこう
  "flying": {
    "normal": 1.0,
    "fire": 1.0,
    "water": 1.0,
    "electric": 0.5,
    "grass": 2.0,
    "ice": 1.0,
    "fighting": 2.0,
    "poison": 1.0,
    "ground": 1.0,
    "flying": 1.0,
    "psychic": 1.0,
    "bug": 2.0,
    "rock": 0.5,
    "ghost": 1.0,
    "dragon": 1.0,
    "dark": 1.0,
    "steel": 0.5,
    "fairy": 1.0
  },

  // エスパー
  "psychic": {
    "normal": 1.0,
    "fire": 1.0,
    "water": 1.0,
    "electric": 1.0,
    "grass": 1.0,
    "ice": 1.0,
    "fighting": 2.0,
    "poison": 2.0,
    "ground": 1.0,
    "flying": 1.0,
    "psychic": 0.5,
    "bug": 1.0,
    "rock": 1.0,
    "ghost": 1.0,
    "dragon": 1.0,
    "dark": 0.0,
    "steel": 0.5,
    "fairy": 1.0
  },

  // むし
  "bug": {
    "normal": 1.0,
    "fire": 0.5,
    "water": 1.0,
    "electric": 1.0,
    "grass": 2.0,
    "ice": 1.0,
    "fighting": 0.5,
    "poison": 0.5,
    "ground": 1.0,
    "flying": 0.5,
    "psychic": 2.0,
    "bug": 1.0,
    "rock": 1.0,
    "ghost": 0.5,
    "dragon": 1.0,
    "dark": 2.0,
    "steel": 0.5,
    "fairy": 0.5
  },

  // いわ
  "rock": {
    "normal": 1.0,
    "fire": 2.0,
    "water": 1.0,
    "electric": 1.0,
    "grass": 1.0,
    "ice": 2.0,
    "fighting": 0.5,
    "poison": 1.0,
    "ground": 0.5,
    "flying": 2.0,
    "psychic": 1.0,
    "bug": 2.0,
    "rock": 1.0,
    "ghost": 1.0,
    "dragon": 1.0,
    "dark": 1.0,
    "steel": 0.5,
    "fairy": 1.0
  },

  // ゴースト
  "ghost": {
    "normal": 0.0,
    "fire": 1.0,
    "water": 1.0,
    "electric": 1.0,
    "grass": 1.0,
    "ice": 1.0,
    "fighting": 1.0,
    "poison": 1.0,
    "ground": 1.0,
    "flying": 1.0,
    "psychic": 2.0,
    "bug": 1.0,
    "rock": 1.0,
    "ghost": 2.0,
    "dragon": 1.0,
    "dark": 0.5,
    "steel": 1.0,
    "fairy": 1.0
  },

  // ドラゴン
  "dragon": {
    "normal": 1.0,
    "fire": 1.0,
    "water": 1.0,
    "electric": 1.0,
    "grass": 1.0,
    "ice": 1.0,
    "fighting": 1.0,
    "poison": 1.0,
    "ground": 1.0,
    "flying": 1.0,
    "psychic": 1.0,
    "bug": 1.0,
    "rock": 1.0,
    "ghost": 1.0,
    "dragon": 2.0,
    "dark": 1.0,
    "steel": 0.5,
    "fairy": 0.0
  },

  // あく
  "dark": {
    "normal": 1.0,
    "fire": 1.0,
    "water": 1.0,
    "electric": 1.0,
    "grass": 1.0,
    "ice": 1.0,
    "fighting": 0.5,
    "poison": 1.0,
    "ground": 1.0,
    "flying": 1.0,
    "psychic": 2.0,
    "bug": 1.0,
    "rock": 1.0,
    "ghost": 2.0,
    "dragon": 1.0,
    "dark": 0.5,
    "steel": 1.0,
    "fairy": 0.5
  },

  // はがね
  "steel": {
    "normal": 1.0,
    "fire": 0.5,
    "water": 0.5,
    "electric": 0.5,
    "grass": 1.0,
    "ice": 2.0,
    "fighting": 1.0,
    "poison": 1.0,
    "ground": 1.0,
    "flying": 1.0,
    "psychic": 1.0,
    "bug": 1.0,
    "rock": 2.0,
    "ghost": 1.0,
    "dragon": 1.0,
    "dark": 1.0,
    "steel": 0.5,
    "fairy": 2.0
  },

  // フェアリー
  "fairy": {
    "normal": 1.0,
    "fire": 0.5,
    "water": 1.0,
    "electric": 1.0,
    "grass": 1.0,
    "ice": 1.0,
    "fighting": 2.0,
    "poison": 0.5,
    "ground": 1.0,
    "flying": 1.0,
    "psychic": 1.0,
    "bug": 1.0,
    "rock": 1.0,
    "ghost": 1.0,
    "dragon": 2.0,
    "dark": 2.0,
    "steel": 0.5,
    "fairy": 1.0
  }
};

// タイプ詳細情報（英語ID → 各種情報）
export const TYPE_DATA = {
  "normal": { nameJa: "ノーマル", color: "#A8A878", colorLight: "#C8C878", symbol: "丸", animation: "simple-pulse" },
  "fire": { nameJa: "ほのお", color: "#F08030", colorLight: "#FF6030", symbol: "炎", animation: "flame-flicker" },
  "water": { nameJa: "みず", color: "#6890F0", colorLight: "#88B0FF", symbol: "水滴", animation: "water-ripple" },
  "electric": { nameJa: "でんき", color: "#F8D030", colorLight: "#FFF030", symbol: "稲妻", animation: "electric-spark" },
  "grass": { nameJa: "くさ", color: "#78C850", colorLight: "#98E870", symbol: "葉", animation: "leaf-sway" },
  "ice": { nameJa: "こおり", color: "#98D8D8", colorLight: "#B8F8F8", symbol: "雪結晶", animation: "ice-sparkle" },
  "fighting": { nameJa: "かくとう", color: "#C03028", colorLight: "#E05048", symbol: "拳", animation: "punch-motion" },
  "poison": { nameJa: "どく", color: "#A040A0", colorLight: "#C060C0", symbol: "ドクロ", animation: "poison-bubble" },
  "ground": { nameJa: "じめん", color: "#E0C068", colorLight: "#FFE088", symbol: "山", animation: "ground-shake" },
  "flying": { nameJa: "ひこう", color: "#A890F0", colorLight: "#C8B0FF", symbol: "羽", animation: "wing-flap" },
  "psychic": { nameJa: "エスパー", color: "#F85888", colorLight: "#FF78A8", symbol: "目", animation: "psychic-glow" },
  "bug": { nameJa: "むし", color: "#A8B820", colorLight: "#C8D840", symbol: "昆虫", animation: "bug-flutter" },
  "rock": { nameJa: "いわ", color: "#B8A038", colorLight: "#D8C058", symbol: "岩", animation: "rock-fall" },
  "ghost": { nameJa: "ゴースト", color: "#705898", colorLight: "#9078B8", symbol: "幽霊", animation: "ghost-float" },
  "dragon": { nameJa: "ドラゴン", color: "#7038F8", colorLight: "#9058FF", symbol: "ドラゴン", animation: "dragon-aura" },
  "dark": { nameJa: "あく", color: "#705848", colorLight: "#906868", symbol: "邪悪", animation: "dark-emerge" },
  "steel": { nameJa: "はがね", color: "#B8B8D0", colorLight: "#D8D8F0", symbol: "金属", animation: "steel-shine" },
  "fairy": { nameJa: "フェアリー", color: "#EE99AC", colorLight: "#FFB9CC", symbol: "星", animation: "fairy-sparkle" }
};

// 後方互換性のための名前マッピング
export const TYPE_NAMES = Object.fromEntries(
  Object.entries(TYPE_DATA).map(([id, data]) => [id, data.nameJa])
);

// 使用例：効果倍率の取得
export function getEffectiveness(attackType, defendType) {
  return TYPE_EFFECTIVENESS[attackType]?.[defendType] ?? 1.0;
}

// 使用例：複合タイプに対する効果倍率計算
export function calculateDualTypeEffectiveness(attackType, defendType1, defendType2) {
  const effect1 = getEffectiveness(attackType, defendType1);
  const effect2 = getEffectiveness(attackType, defendType2);
  return effect1 * effect2;
}
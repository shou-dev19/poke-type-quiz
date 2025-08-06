import { PokemonType } from '../types/pokemon';

// requirements.md 3.4.1.1に基づく技名マッピング
export const getMoveNameByType = (type: PokemonType): string => {
  const moveMapping: Record<PokemonType, string> = {
    'ほのお': 'かえんほうしゃ',
    'みず': 'ハイドロポンプ',
    'でんき': 'かみなり',
    'くさ': 'ソーラービーム',
    'こおり': 'れいとうビーム',
    'かくとう': 'インファイト',
    'どく': 'ヘドロウェーブ',
    'じめん': 'じしん',
    'ひこう': 'ゴッドバード',
    'エスパー': 'サイコキネシス',
    'むし': 'とんぼがえり',
    'いわ': 'いわなだれ',
    'ゴースト': 'シャドーボール',
    'ドラゴン': 'りゅうせいぐん',
    'あく': 'かみくだく',
    'はがね': 'アイアンテール',
    'フェアリー': 'ムーンフォース',
    'ノーマル': 'はかいこうせん'
  };

  return moveMapping[type] || 'たいあたり';
};
import { useState } from 'react';
import { PokemonType, TYPE_COLORS } from '../types/pokemon';

interface TypeIconProps {
  type: PokemonType;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  className?: string;
}

export default function TypeIcon({ type, size = 'md', animated = true, className = '' }: TypeIconProps) {
  const [imageError, setImageError] = useState(false);
  
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-24 h-24'
  };

  // 日本語タイプ名を英語ファイル名にマッピング
  const getTypeFileName = (type: PokemonType): string => {
    const typeMapping: Record<PokemonType, string> = {
      'ノーマル': 'normal',
      'ほのお': 'fire',
      'みず': 'water',
      'でんき': 'electric',
      'くさ': 'grass',
      'こおり': 'ice',
      'かくとう': 'fighting',
      'どく': 'poison',
      'じめん': 'ground',
      'ひこう': 'flying',
      'エスパー': 'psychic',
      'むし': 'bug',
      'いわ': 'rock',
      'ゴースト': 'ghost',
      'ドラゴン': 'dragon',
      'あく': 'dark',
      'はがね': 'steel',
      'フェアリー': 'fairy'
    };
    return typeMapping[type];
  };

  const getTypeAnimation = (type: PokemonType) => {
    const baseClass = 'transition-all duration-300';
    
    if (!animated) return baseClass;

    const animations: Record<PokemonType, string> = {
      'ほのお': `${baseClass} animate-type-fire`,
      'みず': `${baseClass} animate-type-water`,
      'でんき': `${baseClass} animate-type-electric`,
      'くさ': `${baseClass} animate-type-grass`,
      'こおり': `${baseClass} animate-type-ice`,
      'かくとう': `${baseClass} animate-type-fighting`,
      'どく': `${baseClass} animate-type-poison`,
      'じめん': `${baseClass} animate-type-ground`,
      'ひこう': `${baseClass} animate-type-flying`,
      'エスパー': `${baseClass} animate-type-psychic`,
      'むし': `${baseClass} animate-type-bug`,
      'いわ': `${baseClass} animate-type-rock`,
      'ゴースト': `${baseClass} animate-type-ghost`,
      'ドラゴン': `${baseClass} animate-type-dragon`,
      'あく': `${baseClass} animate-type-dark`,
      'はがね': `${baseClass} animate-type-steel`,
      'フェアリー': `${baseClass} animate-type-fairy`,
      'ノーマル': `${baseClass} animate-type-normal`
    };

    return animations[type];
  };

  // フォールバック用のSVGアイコン（画像読み込み失敗時）
  const getFallbackIcon = (type: PokemonType) => {
    return (
      <div className="w-full h-full flex items-center justify-center text-white font-bold text-xs">
        {type.charAt(0)}
      </div>
    );
  };

  const imageUrl = `/images/types/${getTypeFileName(type)}.svg`;

  return (
    <div 
      className={`
        ${sizeClasses[size]} 
        ${getTypeAnimation(type)} 
        ${className}
        type-token rounded-full shrink-0
        flex items-center justify-center 
        border-2 border-pop-ink/80
        shadow-pop-soft
        relative
        overflow-hidden
      `}
      style={{ 
        backgroundColor: TYPE_COLORS[type]
      }}
    >
      {!imageError ? (
        <img 
          src={imageUrl}
          alt={`${type}タイプ`}
          className="w-full h-full object-contain p-1.5"
          onError={() => setImageError(true)}
          loading="lazy"
          decoding="async"
          width="64"
          height="64"
        />
      ) : (
        <div className="w-8 h-8 flex items-center justify-center">
          {getFallbackIcon(type)}
        </div>
      )}
    </div>
  );
}
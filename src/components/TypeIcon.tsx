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

  const imageUrl = `/pokemon-quiz/images/types/${getTypeFileName(type)}.svg`;

  return (
    <div 
      className={`
        ${sizeClasses[size]} 
        ${getTypeAnimation(type)} 
        ${className}
        rounded-full 
        flex items-center justify-center 
        border-2 border-white
        shadow-lg
        cursor-pointer
        relative
        overflow-hidden
      `}
      style={{ 
        backgroundColor: TYPE_COLORS[type],
        background: `linear-gradient(135deg, ${TYPE_COLORS[type]}, ${TYPE_COLORS[type]}dd)`
      }}
    >
      {!imageError ? (
        <img 
          src={imageUrl}
          alt={`${type}タイプ`}
          className="w-full h-full object-contain p-1"
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
      
      {/* タイプ別の特殊エフェクト */}
      {type === 'ほのお' && animated && (
        <div className="absolute inset-0 bg-gradient-to-t from-red-600 via-orange-500 to-yellow-400 opacity-30 animate-pulse pointer-events-none" />
      )}
      
      {type === 'みず' && animated && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-2 left-2 w-2 h-2 bg-blue-200 rounded-full animate-ping opacity-40" />
          <div className="absolute bottom-3 right-3 w-1 h-1 bg-white rounded-full animate-pulse opacity-60" />
        </div>
      )}
      
      {type === 'でんき' && animated && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1 right-2 w-1 h-4 bg-yellow-200 animate-pulse opacity-50" />
          <div className="absolute bottom-2 left-3 w-1 h-3 bg-white animate-ping opacity-40" />
        </div>
      )}
      
      {type === 'フェアリー' && animated && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-2 left-2 w-1 h-1 bg-pink-200 rounded-full animate-ping opacity-60" />
          <div className="absolute top-4 right-3 w-1 h-1 bg-white rounded-full animate-pulse opacity-70" />
          <div className="absolute bottom-3 left-4 w-1 h-1 bg-pink-100 rounded-full animate-ping opacity-50" style={{ animationDelay: '0.5s' }} />
        </div>
      )}
      
      {type === 'ゴースト' && animated && (
        <div className="absolute inset-0 bg-gradient-to-br from-purple-700 via-purple-900 to-gray-900 opacity-30 animate-pulse pointer-events-none" />
      )}
    </div>
  );
}
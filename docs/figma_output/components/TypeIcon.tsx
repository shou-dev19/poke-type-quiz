import React from 'react';
import { PokemonType, TYPE_COLORS } from '../types/pokemon';

interface TypeIconProps {
  type: PokemonType;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  className?: string;
}

export default function TypeIcon({ type, size = 'md', animated = true, className = '' }: TypeIconProps) {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-24 h-24'
  };

  const getTypeAnimation = (type: PokemonType) => {
    const baseClass = 'transition-all duration-300';
    
    if (!animated) return baseClass;

    const animations: Record<PokemonType, string> = {
      'ほのお': `${baseClass} animate-pulse hover:animate-bounce`,
      'みず': `${baseClass} hover:animate-pulse`,
      'でんき': `${baseClass} animate-pulse hover:animate-ping`,
      'くさ': `${baseClass} hover:animate-bounce`,
      'こおり': `${baseClass} animate-pulse hover:animate-spin`,
      'かくとう': `${baseClass} hover:animate-bounce`,
      'どく': `${baseClass} animate-pulse`,
      'じめん': `${baseClass} hover:animate-bounce`,
      'ひこう': `${baseClass} hover:animate-bounce`,
      'エスパー': `${baseClass} animate-pulse hover:animate-ping`,
      'むし': `${baseClass} hover:animate-bounce`,
      'いわ': `${baseClass} hover:animate-pulse`,
      'ゴースト': `${baseClass} animate-pulse hover:animate-ping`,
      'ドラゴン': `${baseClass} animate-pulse hover:animate-bounce`,
      'あく': `${baseClass} hover:animate-pulse`,
      'はがね': `${baseClass} hover:animate-pulse`,
      'フェアリー': `${baseClass} animate-pulse hover:animate-bounce`,
      'ノーマル': `${baseClass} hover:animate-pulse`
    };

    return animations[type];
  };

  const getTypeSymbol = (type: PokemonType) => {
    const symbols: Record<PokemonType, string> = {
      'ノーマル': '○',
      'ほのお': '🔥',
      'みず': '💧',
      'でんき': '⚡',
      'くさ': '🌿',
      'こおり': '❄️',
      'かくとう': '👊',
      'どく': '☠️',
      'じめん': '🌍',
      'ひこう': '🪶',
      'エスパー': '🔮',
      'むし': '🐛',
      'いわ': '🗿',
      'ゴースト': '👻',
      'ドラゴン': '🐉',
      'あく': '🌑',
      'はがね': '⚙️',
      'フェアリー': '✨'
    };
    return symbols[type];
  };

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
      <span className="text-2xl filter drop-shadow-sm">
        {getTypeSymbol(type)}
      </span>
      
      {/* タイプ別の特殊エフェクト */}
      {type === 'ほのお' && animated && (
        <div className="absolute inset-0 bg-gradient-to-t from-red-600 via-orange-500 to-yellow-400 opacity-60 animate-pulse" />
      )}
      
      {type === 'みず' && animated && (
        <div className="absolute inset-0">
          <div className="absolute top-2 left-2 w-2 h-2 bg-blue-200 rounded-full animate-ping opacity-60" />
          <div className="absolute bottom-3 right-3 w-1 h-1 bg-white rounded-full animate-pulse" />
        </div>
      )}
      
      {type === 'でんき' && animated && (
        <div className="absolute inset-0">
          <div className="absolute top-1 right-2 w-1 h-4 bg-yellow-200 animate-pulse opacity-80" />
          <div className="absolute bottom-2 left-3 w-1 h-3 bg-white animate-ping opacity-60" />
        </div>
      )}
      
      {type === 'フェアリー' && animated && (
        <div className="absolute inset-0">
          <div className="absolute top-2 left-2 w-1 h-1 bg-pink-200 rounded-full animate-ping" />
          <div className="absolute top-4 right-3 w-1 h-1 bg-white rounded-full animate-pulse" />
          <div className="absolute bottom-3 left-4 w-1 h-1 bg-pink-100 rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
        </div>
      )}
      
      {type === 'ゴースト' && animated && (
        <div className="absolute inset-0 bg-gradient-to-br from-purple-700 via-purple-900 to-gray-900 opacity-50 animate-pulse" />
      )}
    </div>
  );
}
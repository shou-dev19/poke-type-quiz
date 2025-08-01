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

  const getTypeIcon = (type: PokemonType) => {
    // SVGベースのタイプアイコン（type_table.pngを参考）
    const icons: Record<PokemonType, JSX.Element> = {
      'ノーマル': (
        <svg viewBox="0 0 24 24" className="w-full h-full">
          <circle cx="12" cy="12" r="8" fill="currentColor" opacity="0.8"/>
        </svg>
      ),
      'ほのお': (
        <svg viewBox="0 0 24 24" className="w-full h-full">
          <path d="M12 2C12 2 8 6 8 12C8 16 10 18 12 18C14 18 16 16 16 12C16 6 12 2 12 2Z" fill="currentColor"/>
          <path d="M10 12C10 12 8.5 10 8.5 8C8.5 6.5 9.5 6 10 6C10.5 6 11.5 6.5 11.5 8C11.5 10 10 12 10 12Z" fill="rgba(255,255,255,0.7)"/>
        </svg>
      ),
      'みず': (
        <svg viewBox="0 0 24 24" className="w-full h-full">
          <path d="M12 2C12 2 6 8 6 14C6 18 8.5 22 12 22C15.5 22 18 18 18 14C18 8 12 2 12 2Z" fill="currentColor"/>
          <ellipse cx="12" cy="14" rx="4" ry="6" fill="rgba(255,255,255,0.3)"/>
        </svg>
      ),
      'でんき': (
        <svg viewBox="0 0 24 24" className="w-full h-full">
          <path d="M14 2L8 12H12L10 22L16 12H12L14 2Z" fill="currentColor"/>
        </svg>
      ),
      'くさ': (
        <svg viewBox="0 0 24 24" className="w-full h-full">
          <path d="M12 22C12 22 6 18 6 12C6 8 8 6 12 6C16 6 18 8 18 12C18 18 12 22 12 22Z" fill="currentColor"/>
          <path d="M12 6C12 6 10 4 8 4C6 4 4 6 4 8C4 10 6 12 8 12" fill="currentColor"/>
          <path d="M12 6C12 6 14 4 16 4C18 4 20 6 20 8C20 10 18 12 16 12" fill="currentColor"/>
        </svg>
      ),
      'こおり': (
        <svg viewBox="0 0 24 24" className="w-full h-full">
          <path d="M12 2L14 6L18 4L16 8L20 10L16 12L18 16L14 14L12 18L10 14L6 16L8 12L4 10L8 8L6 4L10 6L12 2Z" fill="currentColor"/>
        </svg>
      ),
      'かくとう': (
        <svg viewBox="0 0 24 24" className="w-full h-full">
          <circle cx="12" cy="8" r="4" fill="currentColor"/>
          <rect x="8" y="10" width="8" height="8" rx="2" fill="currentColor"/>
          <rect x="6" y="14" width="4" height="6" rx="1" fill="currentColor"/>
          <rect x="14" y="14" width="4" height="6" rx="1" fill="currentColor"/>
        </svg>
      ),
      'どく': (
        <svg viewBox="0 0 24 24" className="w-full h-full">
          <circle cx="12" cy="16" r="6" fill="currentColor"/>
          <circle cx="8" cy="12" r="2" fill="currentColor" opacity="0.8"/>
          <circle cx="16" cy="12" r="2" fill="currentColor" opacity="0.8"/>
          <circle cx="12" cy="8" r="1.5" fill="currentColor" opacity="0.6"/>
        </svg>
      ),
      'じめん': (
        <svg viewBox="0 0 24 24" className="w-full h-full">
          <path d="M2 18L6 14L10 16L14 12L18 14L22 10V22H2V18Z" fill="currentColor"/>
        </svg>
      ),
      'ひこう': (
        <svg viewBox="0 0 24 24" className="w-full h-full">
          <path d="M12 2C12 2 8 6 2 8C2 8 8 10 12 8C16 10 22 8 22 8C16 6 12 2 12 2Z" fill="currentColor"/>
          <path d="M12 8C12 8 10 12 8 16C8 16 10 14 12 14C14 14 16 16 16 16C14 12 12 8 12 8Z" fill="currentColor" opacity="0.7"/>
        </svg>
      ),
      'エスパー': (
        <svg viewBox="0 0 24 24" className="w-full h-full">
          <circle cx="12" cy="12" r="8" fill="currentColor"/>
          <circle cx="12" cy="12" r="4" fill="rgba(255,255,255,0.8)"/>
          <circle cx="12" cy="12" r="2" fill="currentColor"/>
        </svg>
      ),
      'むし': (
        <svg viewBox="0 0 24 24" className="w-full h-full">
          <ellipse cx="12" cy="12" rx="6" ry="8" fill="currentColor"/>
          <circle cx="10" cy="8" r="1.5" fill="rgba(0,0,0,0.8)"/>
          <circle cx="14" cy="8" r="1.5" fill="rgba(0,0,0,0.8)"/>
          <path d="M6 10L4 8M18 10L20 8M6 14L4 16M18 14L20 16" stroke="currentColor" strokeWidth="2" fill="none"/>
        </svg>
      ),
      'いわ': (
        <svg viewBox="0 0 24 24" className="w-full h-full">
          <path d="M4 20L8 4L12 6L16 2L20 8L18 12L22 16L12 22L4 20Z" fill="currentColor"/>
        </svg>
      ),
      'ゴースト': (
        <svg viewBox="0 0 24 24" className="w-full h-full">
          <path d="M12 2C8 2 5 5 5 9V18C5 18 6 17 7 18C8 17 9 18 10 17C11 18 12 17 13 18C14 17 15 18 16 17C17 18 18 17 19 18V9C19 5 16 2 12 2Z" fill="currentColor"/>
          <circle cx="9" cy="9" r="1.5" fill="rgba(255,255,255,0.9)"/>
          <circle cx="15" cy="9" r="1.5" fill="rgba(255,255,255,0.9)"/>
        </svg>
      ),
      'ドラゴン': (
        <svg viewBox="0 0 24 24" className="w-full h-full">
          <path d="M12 2C8 2 4 6 4 12C4 16 6 20 10 22L12 18L14 22C18 20 20 16 20 12C20 6 16 2 12 2Z" fill="currentColor"/>
          <circle cx="9" cy="10" r="1" fill="rgba(255,255,255,0.9)"/>
          <circle cx="15" cy="10" r="1" fill="rgba(255,255,255,0.9)"/>
          <path d="M12 14C10 14 8 16 8 18" stroke="rgba(255,255,255,0.6)" strokeWidth="1" fill="none"/>
        </svg>
      ),
      'あく': (
        <svg viewBox="0 0 24 24" className="w-full h-full">
          <circle cx="12" cy="12" r="8" fill="currentColor"/>
          <path d="M8 10C8 8 9 6 12 6C15 6 16 8 16 10" stroke="rgba(255,255,255,0.8)" strokeWidth="2" fill="none"/>
          <circle cx="9" cy="14" r="1" fill="rgba(255,255,255,0.9)"/>
          <circle cx="15" cy="14" r="1" fill="rgba(255,255,255,0.9)"/>
        </svg>
      ),
      'はがね': (
        <svg viewBox="0 0 24 24" className="w-full h-full">
          <path d="M12 2L20 8V16L12 22L4 16V8L12 2Z" fill="currentColor"/>
          <path d="M12 6L16 9V15L12 18L8 15V9L12 6Z" fill="rgba(255,255,255,0.3)"/>
        </svg>
      ),
      'フェアリー': (
        <svg viewBox="0 0 24 24" className="w-full h-full">
          <path d="M12 2L14 8L20 6L16 12L22 14L16 16L20 18L14 16L12 22L10 16L4 18L8 16L2 14L8 12L4 6L10 8L12 2Z" fill="currentColor"/>
          <circle cx="12" cy="12" r="3" fill="rgba(255,255,255,0.8)"/>
        </svg>
      )
    };
    return icons[type];
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
      <div className="w-8 h-8 flex items-center justify-center">
        {getTypeIcon(type)}
      </div>
      
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
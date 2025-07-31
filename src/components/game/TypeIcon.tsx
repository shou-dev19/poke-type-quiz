import { PokemonType, TYPE_COLORS, TYPE_SYMBOLS, TYPE_ANIMATIONS } from '@/types/pokemon';

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
    const baseClass = 'transition-all';
    
    if (!animated) return `${baseClass} duration-300`;

    const config = TYPE_ANIMATIONS[type];
    const effectClasses = {
      'pulse': 'animate-pulse',
      'bounce': 'animate-bounce',
      'ping': 'animate-ping',
      'spin': 'animate-spin',
      'shake': 'animate-bounce' // Tailwindに標準的なshakeがないためbounceで代用
    };

    const durationClass = config.duration <= 0.3 ? 'duration-300' :
                         config.duration <= 0.6 ? 'duration-500' :
                         config.duration <= 0.9 ? 'duration-700' : 'duration-1000';

    const intensityClass = config.intensity === 'high' ? 'hover:scale-125' :
                          config.intensity === 'medium' ? 'hover:scale-110' : 'hover:scale-105';

    return `${baseClass} ${durationClass} ${effectClasses[config.effect]} ${intensityClass}`;
  };

  const getTypeSymbol = (type: PokemonType) => {
    return TYPE_SYMBOLS[type];
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
      {animated && (() => {
        const config = TYPE_ANIMATIONS[type];
        
        switch (type) {
          case 'ほのお':
            return <div className="absolute inset-0 bg-gradient-to-t from-red-600 via-orange-500 to-yellow-400 opacity-60 animate-pulse" />;
          
          case 'みず':
            return (
              <div className="absolute inset-0">
                <div className="absolute top-2 left-2 w-2 h-2 bg-blue-200 rounded-full animate-ping opacity-60" />
                <div className="absolute bottom-3 right-3 w-1 h-1 bg-white rounded-full animate-pulse" />
              </div>
            );
          
          case 'でんき':
            return (
              <div className="absolute inset-0">
                <div className="absolute top-1 right-2 w-1 h-4 bg-yellow-200 animate-pulse opacity-80" />
                <div className="absolute bottom-2 left-3 w-1 h-3 bg-white animate-ping opacity-60" />
              </div>
            );
          
          case 'フェアリー':
            return (
              <div className="absolute inset-0">
                <div className="absolute top-2 left-2 w-1 h-1 bg-pink-200 rounded-full animate-ping" />
                <div className="absolute top-4 right-3 w-1 h-1 bg-white rounded-full animate-pulse" />
                <div className="absolute bottom-3 left-4 w-1 h-1 bg-pink-100 rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
              </div>
            );
          
          case 'ゴースト':
            return <div className="absolute inset-0 bg-gradient-to-br from-purple-700 via-purple-900 to-gray-900 opacity-50 animate-pulse" />;
          
          case 'ドラゴン':
            return <div className="absolute inset-0 bg-gradient-to-r from-purple-800 via-blue-700 to-purple-800 opacity-40 animate-pulse" />;
          
          case 'こおり':
            return (
              <div className="absolute inset-0">
                <div className="absolute top-1 left-1 w-1 h-1 bg-blue-100 rounded-full animate-ping opacity-80" />
                <div className="absolute top-3 right-2 w-1 h-1 bg-white rounded-full animate-pulse opacity-90" />
                <div className="absolute bottom-2 left-3 w-1 h-1 bg-cyan-100 rounded-full animate-ping opacity-70" style={{ animationDelay: '0.3s' }} />
              </div>
            );
          
          default:
            return config.intensity === 'high' ? (
              <div className="absolute inset-0 opacity-20 animate-pulse" style={{ backgroundColor: config.color }} />
            ) : null;
        }
      })()}
    </div>
  );
}
import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import TypeIcon from './TypeIcon';
import { PokemonType } from '../types/pokemon';

interface AttackAnimationProps {
  attackType: PokemonType;
  defendType: PokemonType | [PokemonType, PokemonType];
  onAnimationComplete: () => void;
  isCorrect: boolean;
}

export default function AttackAnimation({ 
  attackType, 
  defendType, 
  onAnimationComplete, 
  isCorrect 
}: AttackAnimationProps) {
  const [showImpact, setShowImpact] = useState(false);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setShowImpact(true), 1000);
    const timer2 = setTimeout(() => setShowResult(true), 1300);
    // アニメーション完了後3秒で自動的に閉じる
    const timer3 = setTimeout(() => onAnimationComplete(), 3000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onAnimationComplete]);

  const defendTypes = Array.isArray(defendType) ? defendType : [defendType];

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="relative w-full max-w-2xl h-64">
        {/* 攻撃側アイコン */}
        <motion.div
          initial={{ x: -300, y: 0 }}
          animate={{ x: 0, y: 0 }}
          transition={{ 
            duration: 1, 
            ease: "easeOut",
            type: "spring",
            stiffness: 100
          }}
          className="absolute left-20 top-1/2 transform -translate-y-1/2"
        >
          <TypeIcon type={attackType} size="lg" />
          <p className="text-white text-center mt-2">{attackType}</p>
        </motion.div>

        {/* 防御側アイコン */}
        <div className="absolute right-20 top-1/2 transform -translate-y-1/2">
          {defendTypes.length === 1 ? (
            <div>
              <TypeIcon type={defendTypes[0]} size="lg" />
              <p className="text-white text-center mt-2">{defendTypes[0]}</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <div>
                <TypeIcon type={defendTypes[0]} size="md" />
                <p className="text-white text-center text-sm">{defendTypes[0]}</p>
              </div>
              <div>
                <TypeIcon type={defendTypes[1]} size="md" />
                <p className="text-white text-center text-sm">{defendTypes[1]}</p>
              </div>
            </div>
          )}
        </div>

        {/* 攻撃エフェクト */}
        <motion.div
          initial={{ x: -200, opacity: 0, scale: 0.5 }}
          animate={{ x: 200, opacity: 1, scale: 1 }}
          transition={{ 
            duration: 1, 
            delay: 0.5,
            ease: "easeInOut"
          }}
          className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
        >
          <div className="w-8 h-8 bg-yellow-400 rounded-full animate-ping" />
          <div className="absolute inset-0 w-8 h-8 bg-orange-500 rounded-full animate-pulse" />
        </motion.div>

        {/* インパクトエフェクト */}
        {showImpact && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.5, 1], opacity: [0, 1, 0] }}
            transition={{ duration: 0.6 }}
            className="absolute right-20 top-1/2 transform -translate-y-1/2"
          >
            <div className="w-32 h-32 rounded-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-600 opacity-80" />
            <div className="absolute inset-0 w-32 h-32 rounded-full bg-white animate-ping opacity-50" />
          </motion.div>
        )}

        {/* 結果表示 */}
        {showResult && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="absolute top-8 left-1/2 transform -translate-x-1/2"
          >
            <div className={`text-6xl ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
              {isCorrect ? '○' : '×'}
            </div>
            <div className={`text-xl mt-2 ${isCorrect ? 'text-green-300' : 'text-red-300'}`}>
              {isCorrect ? '正解！' : '不正解'}
            </div>
            
            {/* 自動進行の表示 */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="text-sm text-white/80 mt-4 text-center"
            >
              自動的に次に進みます...
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
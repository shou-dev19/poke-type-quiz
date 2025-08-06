import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import TypeIcon from './TypeIcon';
import MoveEffect from './MoveEffects';
import { PokemonType } from '../types/pokemon';

interface AttackAnimationProps {
  attackType: PokemonType;
  defendType: PokemonType | [PokemonType, PokemonType];
  onAnimationComplete: () => void;
  isCorrect: boolean;
  damageMultiplier?: number; // 実際のダメージ倍率
}

export default function AttackAnimation({ 
  attackType, 
  defendType, 
  onAnimationComplete, 
  isCorrect,
  damageMultiplier = 1
}: AttackAnimationProps) {
  // 新しい3Phase構成の状態管理
  const [phase, setPhase] = useState<'preparation' | 'move-effect' | 'result'>('preparation');
  const [showMoveEffect, setShowMoveEffect] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const onAnimationCompleteRef = useRef(onAnimationComplete);

  // onAnimationCompleteの最新の参照を保持
  useEffect(() => {
    onAnimationCompleteRef.current = onAnimationComplete;
  }, [onAnimationComplete]);

  useEffect(() => {
    console.log('AttackAnimation mounted, setting 3-phase timers');
    
    // Phase 1: 技発動準備 (0-300ms) - アイコン強調のみ
    // Phase 2: 技エフェクト実行 (300-1300ms)
    const timer1 = setTimeout(() => {
      console.log('Phase 2: 技エフェクト開始');
      setPhase('move-effect');
      setShowMoveEffect(true);
    }, 300);

    // Phase 3: 結果表示 (1300-3000ms)
    const timer2 = setTimeout(() => {
      console.log('Phase 3: 結果表示開始');
      setPhase('result');
      setShowResult(true);
    }, 1300);

    // 自動完了 (5秒後のフォールバック)
    const timer3 = setTimeout(() => {
      console.log('Timer 3: Auto-calling onAnimationComplete');
      onAnimationCompleteRef.current();
    }, 6000);

    return () => {
      console.log('AttackAnimation unmounting, clearing timers');
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []); // マウント時のみ実行

  const defendTypes = Array.isArray(defendType) ? defendType : [defendType];
  

  // ダメージ倍率に基づくエフェクト設定
  const getEffectStyle = (multiplier: number) => {
    if (multiplier >= 4) {
      // こうかばつぐん(4倍) - 最強エフェクト
      return {
        colors: 'from-red-400 via-orange-400 to-yellow-400',
        size: 'w-48 h-48 sm:w-56 sm:h-56',
        intensity: 'animate-ping',
        sparks: 12
      };
    } else if (multiplier >= 2) {
      // こうかばつぐん(2倍) - 強エフェクト  
      return {
        colors: 'from-orange-400 via-red-500 to-red-600',
        size: 'w-40 h-40 sm:w-44 sm:h-44',
        intensity: 'animate-pulse',
        sparks: 8
      };
    } else if (multiplier >= 1) {
      // ふつう(1倍) - 標準エフェクト
      return {
        colors: 'from-blue-400 via-blue-500 to-blue-600',
        size: 'w-32 h-32 sm:w-36 sm:h-36',
        intensity: '',
        sparks: 6
      };
    } else if (multiplier >= 0.5) {
      // こうかいまひとつ(0.5倍) - 弱エフェクト
      return {
        colors: 'from-gray-400 via-gray-500 to-gray-600',
        size: 'w-24 h-24 sm:w-28 sm:h-28',
        intensity: '',
        sparks: 4
      };
    } else if (multiplier >= 0.25) {
      // こうかいまひとつ(0.25倍) - 很弱エフェクト
      return {
        colors: 'from-gray-300 via-gray-400 to-gray-500',
        size: 'w-20 h-20 sm:w-24 sm:h-24',
        intensity: '',
        sparks: 2
      };
    } else {
      // こうかなし(0倍) - 無効エフェクト
      return {
        colors: 'from-gray-200 via-gray-300 to-gray-400',
        size: 'w-16 h-16 sm:w-20 sm:h-20',
        intensity: 'opacity-50',
        sparks: 0
      };
    }
  };

  const effectStyle = getEffectStyle(damageMultiplier);

  const handleClick = () => {
    // 結果が表示されたらクリックで次に進める
    console.log('AttackAnimation clicked, showResult:', showResult);
    if (showResult) {
      console.log('Calling onAnimationComplete');
      onAnimationCompleteRef.current();
    }
  };

  // デバッグ用: 状態変化をログ出力
  useEffect(() => {
    console.log('AttackAnimation phase:', phase);
  }, [phase]);

  useEffect(() => {
    console.log('AttackAnimation showResult:', showResult);
  }, [showResult]);


  return (
    <div 
      className={`fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 ${
        showResult ? 'cursor-pointer' : 'cursor-default'
      }`}
      onClick={handleClick}
    >
      <div className="relative w-full max-w-3xl h-64 sm:h-72 lg:h-80">
        {/* Phase 1: 攻撃側アイコン強調表示 */}
        <motion.div
          initial={{ scale: 1, opacity: 0.7 }}
          animate={{ 
            scale: phase === 'preparation' ? 1.1 : 1, 
            opacity: 1,
            filter: phase === 'preparation' ? 'brightness(1.3) drop-shadow(0 0 20px rgba(255,255,255,0.5))' : 'brightness(1)'
          }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="absolute left-4 sm:left-12 lg:left-20 top-1/2 transform -translate-y-1/2"
        >
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center justify-center">
              <TypeIcon type={attackType} size="lg" className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28" />
            </div>
            <p className="text-white text-center mt-2 text-sm sm:text-base font-bold">{attackType}</p>
          </div>
        </motion.div>

        {/* 防御側アイコン - 固定表示 */}
        <div className="absolute right-4 sm:right-12 lg:right-20 top-1/2 transform -translate-y-1/2">
          {defendTypes.length === 1 && defendTypes[0] ? (
            <div className="flex flex-col items-center justify-center">
              <div className="flex items-center justify-center">
                <TypeIcon type={defendTypes[0]} size="lg" className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28" />
              </div>
              <p className="text-white text-center mt-2 text-sm sm:text-base font-bold">{defendTypes[0]}</p>
            </div>
          ) : defendTypes.length >= 2 && defendTypes[0] && defendTypes[1] ? (
            <div className="flex flex-col items-center justify-center gap-2">
              <div className="flex flex-col items-center">
                <TypeIcon type={defendTypes[0]} size="md" className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24" />
                <p className="text-white text-center text-xs sm:text-sm font-bold mt-1">{defendTypes[0]}</p>
              </div>
              <div className="flex flex-col items-center">
                <TypeIcon type={defendTypes[1]} size="md" className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24" />
                <p className="text-white text-center text-xs sm:text-sm font-bold mt-1">{defendTypes[1]}</p>
              </div>
            </div>
          ) : null}
        </div>


        {/* Phase 2: 技エフェクト実行 */}
        {showMoveEffect && (
          <MoveEffect 
            attackType={attackType} 
            className="w-full h-full"
          />
        )}

        {/* Phase 2: 防御側への着弾表現 */}
        {showMoveEffect && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 2, 1], opacity: [0, 1, 0.6] }}
            transition={{ duration: 0.8, delay: 0.7, ease: "easeOut" }}
            className="absolute right-4 sm:right-12 lg:right-20 top-1/2 transform -translate-y-1/2"
          >
            {/* ダメージ倍率に基づくインパクトエフェクト */}
            <div className={`${effectStyle.size} rounded-full bg-gradient-to-r ${effectStyle.colors} opacity-80 ${effectStyle.intensity}`} />
            
            {/* 放射状エフェクト - スパーク数が倍率で変化 */}
            <div className={`absolute inset-0 ${effectStyle.size}`}>
              {[...Array(effectStyle.sparks)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-6 sm:w-1.5 sm:h-8 lg:w-2 lg:h-10 bg-white opacity-70"
                  style={{
                    left: '50%',
                    top: '50%',
                    transformOrigin: '1px 12px',
                    transform: `rotate(${i * (360 / effectStyle.sparks)}deg) translateY(-12px)`,
                  }}
                />
              ))}
            </div>
            
            {/* 4倍ダメージ時の特別エフェクト */}
            {damageMultiplier >= 4 && (
              <div className="absolute inset-0 w-48 h-48 rounded-full bg-gradient-to-r from-yellow-300 via-orange-300 to-red-300 opacity-20 animate-ping" />
            )}
            
            {/* 0倍ダメージ時の無効エフェクト */}
            {damageMultiplier === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-3xl sm:text-4xl lg:text-5xl opacity-70">❌</div>
              </div>
            )}
          </motion.div>
        )}

        {/* Phase 3: 結果表示 */}
        {showResult && (
          <motion.div
            initial={{ scale: 0, opacity: 0, y: -20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.6,
              type: "spring",
              stiffness: 200,
              damping: 20
            }}
            className="absolute top-12 sm:top-16 lg:top-20 left-1/2 transform -translate-x-1/2 text-center"
          >
            {/* メイン結果アイコン */}
            <motion.div
              initial={{ rotate: -180 }}
              animate={{ rotate: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className={`text-4xl sm:text-5xl lg:text-6xl font-bold ${isCorrect ? 'text-green-400' : 'text-red-400'} filter drop-shadow-lg`}
            >
              {isCorrect ? '○' : '×'}
            </motion.div>
            
            {/* 結果テキスト */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className={`text-base sm:text-lg lg:text-xl mt-1 sm:mt-2 font-bold ${isCorrect ? 'text-green-300' : 'text-red-300'}`}
            >
              {isCorrect ? '正解！' : '不正解'}
            </motion.div>

            {/* ダメージ倍率表示 */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="text-white text-sm sm:text-base mt-2 bg-black/50 px-3 py-1 rounded-full"
            >
              ダメージ倍率: {damageMultiplier}倍
            </motion.div>
            
            {/* 成功時のキラキラエフェクト */}
            {isCorrect && (
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ 
                      scale: [0, 1, 0], 
                      opacity: [0, 1, 0],
                      x: [0, (Math.random() - 0.5) * 100],
                      y: [0, (Math.random() - 0.5) * 100]
                    }}
                    transition={{ 
                      delay: 0.2 + i * 0.1,
                      duration: 1.5,
                      ease: "easeOut"
                    }}
                    className="absolute w-4 h-4 bg-yellow-300 rounded-full"
                    style={{
                      left: '50%',
                      top: '50%',
                    }}
                  />
                ))}
              </div>
            )}
            
            {/* クリック案内の表示 */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                boxShadow: [
                  "0 0 0 0 rgba(255, 255, 255, 0.3)",
                  "0 0 0 8px rgba(255, 255, 255, 0)",
                  "0 0 0 0 rgba(255, 255, 255, 0)"
                ]
              }}
              transition={{ 
                delay: 0.8, 
                duration: 0.5,
                boxShadow: {
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeOut"
                }
              }}
              className="text-sm sm:text-base text-white/90 mt-4 sm:mt-6 bg-black/40 px-3 sm:px-4 py-2 rounded-full backdrop-blur-sm border border-white/30 hover:bg-black/60 transition-colors"
            >
              📱 クリックして次に進む
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
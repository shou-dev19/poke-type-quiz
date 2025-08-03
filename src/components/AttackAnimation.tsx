import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import TypeIcon from './TypeIcon';
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
  const [showImpact, setShowImpact] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const onAnimationCompleteRef = useRef(onAnimationComplete);

  // onAnimationCompleteの最新の参照を保持
  useEffect(() => {
    onAnimationCompleteRef.current = onAnimationComplete;
  }, [onAnimationComplete]);

  useEffect(() => {
    console.log('AttackAnimation mounted, setting timers');
    // 攻撃アニメーション: 0.8s + 0.3s delay = 1.1s後にインパクト
    const timer1 = setTimeout(() => {
      console.log('Timer 1: Setting showImpact to true');
      setShowImpact(true);
    }, 1100);
    // インパクト後0.6s後に結果表示
    const timer2 = setTimeout(() => {
      console.log('Timer 2: Setting showResult to true');
      setShowResult(true);
    }, 1700);
    // 結果表示後5秒で自動的に閉じる（ユーザーがクリックしなかった場合のフォールバック）
    const timer3 = setTimeout(() => {
      console.log('Timer 3: Auto-calling onAnimationComplete');
      onAnimationCompleteRef.current();
    }, 6700);

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
    console.log('AttackAnimation showImpact:', showImpact);
  }, [showImpact]);

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
      <div className="relative w-full max-w-2xl h-48 sm:h-56 lg:h-64">
        {/* 攻撃側アイコン */}
        <motion.div
          initial={{ x: -200, y: 0 }}
          animate={{ x: 0, y: 0 }}
          transition={{ 
            duration: 1, 
            ease: "easeOut",
            type: "spring",
            stiffness: 100
          }}
          className="absolute left-4 sm:left-12 lg:left-20 top-1/2 transform -translate-y-1/2 flex flex-col items-center justify-center h-20 sm:h-24 lg:h-28"
        >
          <TypeIcon type={attackType} size="lg" className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28" />
          <p className="text-white text-center mt-2 text-sm sm:text-base font-bold">{attackType}</p>
        </motion.div>

        {/* 防御側アイコン */}
        <div className="absolute right-4 sm:right-12 lg:right-20 top-1/2 transform -translate-y-1/2 flex flex-col items-center justify-center">
          {defendTypes.length === 1 && defendTypes[0] ? (
            <div className="flex flex-col items-center justify-center h-20 sm:h-24 lg:h-28">
              <TypeIcon type={defendTypes[0]} size="lg" className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28" />
              <p className="text-white text-center mt-2 text-sm sm:text-base font-bold">{defendTypes[0]}</p>
            </div>
          ) : defendTypes.length >= 2 && defendTypes[0] && defendTypes[1] ? (
            <div className="flex flex-col gap-1 sm:gap-2 items-center justify-center h-20 sm:h-24 lg:h-28">
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

        {/* 攻撃エフェクト - タイプ別エフェクト */}
        <motion.div
          initial={{ x: -150, opacity: 0, scale: 0.5 }}
          animate={{ x: 150, opacity: 1, scale: 1 }}
          transition={{ 
            duration: 0.8, 
            delay: 0.3,
            ease: "easeInOut"
          }}
          className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
        >
          {attackType === 'ほのお' && (
            <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-orange-400 rounded-full animate-ping" />
          )}
          {attackType === 'みず' && (
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full animate-pulse" />
          )}
          {attackType === 'でんき' && (
            <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-yellow-200 rounded-full animate-ping" />
          )}
          {attackType === 'くさ' && (
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-lime-400 rounded-full animate-bounce" />
          )}
          {attackType === 'こおり' && (
            <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-300 rounded-full animate-pulse" />
          )}
          {/* デフォルトエフェクト */}
          {!['ほのお', 'みず', 'でんき', 'くさ', 'こおり'].includes(attackType) && (
            <>
              <div className="w-8 h-8 bg-yellow-400 rounded-full animate-ping" />
              <div className="absolute inset-0 w-8 h-8 bg-orange-500 rounded-full animate-pulse" />
            </>
          )}
        </motion.div>

        {/* インパクトエフェクト - ダメージ倍率別 */}
        {showImpact && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 2.5, 1], opacity: [0, 1, 0] }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="absolute right-4 sm:right-12 lg:right-20 top-1/2 transform -translate-y-1/2"
          >
            {/* メインインパクト */}
            <div className={`${effectStyle.size} rounded-full bg-gradient-to-r ${effectStyle.colors} opacity-90 ${effectStyle.intensity}`} />
            
            {/* 外側の光輪 */}
            <div className={`absolute inset-0 ${effectStyle.size} rounded-full bg-white animate-ping opacity-60`} />
            
            {/* 内側のキラキラエフェクト */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-4 h-4 sm:w-6 sm:h-6 lg:w-8 lg:h-8 bg-white rounded-full animate-bounce opacity-80" />
            </div>
            
            {/* 放射状エフェクト - スパーク数が倍率で変化 */}
            <div className={`absolute inset-0 ${effectStyle.size}`}>
              {[...Array(effectStyle.sparks)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-8 sm:w-1.5 sm:h-12 lg:w-2 lg:h-16 bg-white opacity-70"
                  style={{
                    left: '50%',
                    top: '50%',
                    transformOrigin: '1px 16px',
                    transform: `rotate(${i * (360 / effectStyle.sparks)}deg) translateY(-16px)`,
                  }}
                />
              ))}
            </div>
            
            {/* 4倍ダメージ時の特別エフェクト */}
            {damageMultiplier >= 4 && (
              <>
                <div className="absolute inset-0 w-64 h-64 rounded-full bg-gradient-to-r from-yellow-300 via-orange-300 to-red-300 opacity-30 animate-ping" />
                <div className="absolute inset-0 w-72 h-72 rounded-full bg-gradient-to-r from-red-200 via-orange-200 to-yellow-200 opacity-20 animate-pulse" />
              </>
            )}
            
            {/* 0倍ダメージ時の無効エフェクト */}
            {damageMultiplier === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-4xl sm:text-5xl lg:text-6xl opacity-70">❌</div>
              </div>
            )}
          </motion.div>
        )}

        {/* 結果表示 - 改善版 */}
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
            className="absolute top-4 sm:top-6 lg:top-8 left-1/2 transform -translate-x-1/2 text-center"
          >
            {/* メイン結果アイコン */}
            <motion.div
              initial={{ rotate: -180 }}
              animate={{ rotate: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className={`text-5xl sm:text-6xl lg:text-8xl font-bold ${isCorrect ? 'text-green-400' : 'text-red-400'} filter drop-shadow-lg`}
            >
              {isCorrect ? '○' : '×'}
            </motion.div>
            
            {/* 結果テキスト */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className={`text-lg sm:text-xl lg:text-2xl mt-1 sm:mt-2 font-bold ${isCorrect ? 'text-green-300' : 'text-red-300'}`}
            >
              {isCorrect ? '正解！' : '不正解'}
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
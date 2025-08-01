import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TypeIcon from './TypeIcon';
import { PokemonType, TYPE_ANIMATIONS, TYPE_COLORS } from '@/types/pokemon';

type AnimationPhase = 'attack' | 'impact' | 'result' | 'completion';
type TrajectoryType = 'straight' | 'parabolic';

interface AttackAnimationProps {
  attackType: PokemonType;
  defendType: PokemonType | [PokemonType, PokemonType];
  onAnimationComplete: () => void;
  isCorrect: boolean;
  trajectory?: TrajectoryType;
}

export default function AttackAnimation({ 
  attackType, 
  defendType, 
  onAnimationComplete, 
  isCorrect,
  trajectory = 'straight'
}: AttackAnimationProps) {
  const [currentPhase, setCurrentPhase] = useState<AnimationPhase>('attack');

  // TYPE_ANIMATIONSから動的なタイミング設定を取得
  const attackConfig = TYPE_ANIMATIONS[attackType];
  const attackColor = TYPE_COLORS[attackType];
  
  useEffect(() => {
    const phaseTimings = {
      attack: attackConfig.duration,
      impact: attackConfig.duration + 500,
      result: attackConfig.duration + 800,
      completion: attackConfig.duration + 2000
    };

    const timer1 = setTimeout(() => setCurrentPhase('impact'), phaseTimings.attack);
    const timer2 = setTimeout(() => setCurrentPhase('result'), phaseTimings.impact);
    const timer3 = setTimeout(() => setCurrentPhase('completion'), phaseTimings.result);
    const timer4 = setTimeout(() => onAnimationComplete(), phaseTimings.completion);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [onAnimationComplete, attackConfig.duration]);

  const defendTypes = Array.isArray(defendType) ? defendType : [defendType];

  // 軌道の設定
  const getTrajectoryPath = (trajectory: TrajectoryType) => {
    if (trajectory === 'parabolic') {
      return { x: 200, y: [-50, 0] }; // 放物線軌道
    }
    return { x: 200, y: 0 }; // 直線軌道
  };

  const trajectoryPath = getTrajectoryPath(trajectory);

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
      <div className="relative w-full max-w-4xl h-80">
        {/* 攻撃側アイコン */}
        <motion.div
          initial={{ x: -400, y: 0, scale: 0.8 }}
          animate={{ 
            x: currentPhase === 'attack' ? -50 : -50,
            y: 0,
            scale: currentPhase === 'attack' ? 1.2 : 1
          }}
          transition={{ 
            duration: attackConfig.duration / 1000, 
            ease: attackConfig.easing as any,
            type: "spring",
            stiffness: 120
          }}
          className="absolute left-20 top-1/2 transform -translate-y-1/2"
        >
          <div className={`p-4 rounded-full shadow-2xl`} style={{ backgroundColor: attackColor }}>
            <TypeIcon type={attackType} size="lg" />
          </div>
          <p className="text-white text-center mt-2 font-bold text-lg">{attackType}</p>
        </motion.div>

        {/* 防御側アイコン */}
        <motion.div 
          initial={{ scale: 1 }}
          animate={{ 
            scale: currentPhase === 'impact' ? [1, 0.8, 1.1, 1] : 1,
            rotate: currentPhase === 'impact' ? [0, -5, 5, 0] : 0
          }}
          transition={{ duration: 0.6 }}
          className="absolute right-20 top-1/2 transform -translate-y-1/2"
        >
          {defendTypes.length === 1 ? (
            <div>
              <div className={`p-4 rounded-full shadow-xl`} style={{ backgroundColor: TYPE_COLORS[defendTypes[0]] }}>
                <TypeIcon type={defendTypes[0]} size="lg" />
              </div>
              <p className="text-white text-center mt-2 font-bold text-lg">{defendTypes[0]}</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <div>
                <div className={`p-3 rounded-full shadow-lg`} style={{ backgroundColor: TYPE_COLORS[defendTypes[0]] }}>
                  <TypeIcon type={defendTypes[0]} size="md" />
                </div>
                <p className="text-white text-center text-sm font-medium mt-1">{defendTypes[0]}</p>
              </div>
              <div>
                <div className={`p-3 rounded-full shadow-lg`} style={{ backgroundColor: TYPE_COLORS[defendTypes[1]] }}>
                  <TypeIcon type={defendTypes[1]} size="md" />
                </div>
                <p className="text-white text-center text-sm font-medium mt-1">{defendTypes[1]}</p>
              </div>
            </div>
          )}
        </motion.div>

        {/* 攻撃エフェクト */}
        <AnimatePresence>
          {currentPhase === 'attack' && (
            <motion.div
              initial={{ x: -300, y: 0, opacity: 0, scale: 0.3 }}
              animate={{ 
                x: trajectoryPath.x, 
                y: trajectoryPath.y, 
                opacity: [0, 1, 1, 0], 
                scale: [0.3, 1.2, 1, 1.5] 
              }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ 
                duration: attackConfig.duration / 1000,
                ease: attackConfig.easing as any,
                times: [0, 0.3, 0.7, 1]
              }}
              className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
            >
              <div 
                className="w-12 h-12 rounded-full shadow-2xl animate-pulse"
                style={{ 
                  backgroundColor: attackColor,
                  boxShadow: `0 0 30px ${attackColor}, 0 0 60px ${attackColor}40`
                }}
              />
              <div 
                className="absolute inset-0 w-12 h-12 rounded-full animate-ping opacity-60"
                style={{ backgroundColor: attackColor }}
              />
              {/* 軌跡エフェクト */}
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "200px" }}
                className="absolute top-1/2 left-0 h-1 opacity-50"
                style={{ 
                  background: `linear-gradient(90deg, transparent, ${attackColor}, transparent)`,
                  transform: "translateY(-50%)"
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* インパクトエフェクト */}
        <AnimatePresence>
          {currentPhase === 'impact' && (
            <motion.div
              initial={{ scale: 0, opacity: 0, rotate: 0 }}
              animate={{ 
                scale: [0, 2, 1.2, 0], 
                opacity: [0, 1, 0.8, 0],
                rotate: [0, 180, 360]
              }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 0.8, times: [0, 0.3, 0.7, 1] }}
              className="absolute right-20 top-1/2 transform -translate-y-1/2"
            >
              {/* メインインパクト */}
              <div 
                className="w-40 h-40 rounded-full opacity-90"
                style={{
                  background: `radial-gradient(circle, ${attackColor}, ${attackColor}80, transparent)`,
                  boxShadow: `0 0 100px ${attackColor}`
                }}
              />
              {/* 衝撃波リング */}
              <motion.div
                initial={{ scale: 0, opacity: 1 }}
                animate={{ scale: 3, opacity: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="absolute inset-0 w-40 h-40 rounded-full border-4 border-white"
              />
              <motion.div
                initial={{ scale: 0, opacity: 1 }}
                animate={{ scale: 2, opacity: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                className="absolute inset-0 w-40 h-40 rounded-full border-2"
                style={{ borderColor: attackColor }}
              />
              {/* 火花エフェクト */}
              {Array.from({ length: 8 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, x: 0, y: 0 }}
                  animate={{ 
                    scale: [0, 1, 0], 
                    x: Math.cos(i * Math.PI / 4) * 80,
                    y: Math.sin(i * Math.PI / 4) * 80
                  }}
                  transition={{ duration: 0.6, delay: i * 0.05 }}
                  className="absolute top-1/2 left-1/2 w-3 h-3 rounded-full"
                  style={{ backgroundColor: attackColor }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* 結果表示 */}
        <AnimatePresence>
          {currentPhase === 'result' && (
            <motion.div
              initial={{ scale: 0, opacity: 0, y: -50 }}
              animate={{ 
                scale: [0, 1.3, 1], 
                opacity: 1, 
                y: 0,
                rotate: [0, 10, -10, 0]
              }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ 
                duration: 0.8, 
                type: "spring", 
                stiffness: 200,
                times: [0, 0.6, 1]
              }}
              className="absolute top-12 left-1/2 transform -translate-x-1/2 z-10"
            >
              {/* 結果アイコン背景 */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className={`w-32 h-32 rounded-full flex items-center justify-center shadow-2xl
                  ${isCorrect 
                    ? 'bg-gradient-to-br from-green-400 to-green-600' 
                    : 'bg-gradient-to-br from-red-400 to-red-600'
                  }`}
                style={{
                  boxShadow: isCorrect 
                    ? '0 0 60px rgba(34, 197, 94, 0.6)' 
                    : '0 0 60px rgba(239, 68, 68, 0.6)'
                }}
              >
                <div className={`text-7xl font-bold text-white drop-shadow-lg`}>
                  {isCorrect ? '○' : '×'}
                </div>
              </motion.div>
              
              {/* 結果テキスト */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className={`text-2xl font-bold mt-4 text-center drop-shadow-md
                  ${isCorrect ? 'text-green-300' : 'text-red-300'}`}
              >
                {isCorrect ? '🎉 正解！' : '💪 不正解'}
              </motion.div>
              
              {/* サブテキスト */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="text-white/80 text-center mt-2 text-sm"
              >
                {isCorrect ? 'Great job!' : 'Keep trying!'}
              </motion.div>
              
              {/* パーティクル効果（正解時のみ）*/}
              {isCorrect && (
                <div className="absolute inset-0">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                      animate={{ 
                        scale: [0, 1, 0], 
                        x: Math.cos(i * Math.PI / 6) * 100,
                        y: Math.sin(i * Math.PI / 6) * 100,
                        opacity: [1, 1, 0]
                      }}
                      transition={{ 
                        duration: 1.5, 
                        delay: 0.3 + i * 0.1,
                        ease: "easeOut"
                      }}
                      className="absolute top-1/2 left-1/2 w-2 h-2 bg-yellow-300 rounded-full"
                    />
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* 完了フェーズフェードアウト */}
        <AnimatePresence>
          {currentPhase === 'completion' && (
            <motion.div
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 bg-black/90"
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
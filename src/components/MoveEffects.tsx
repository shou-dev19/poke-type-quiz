import { motion } from 'framer-motion';
import { PokemonType } from '../types/pokemon';

interface MoveEffectProps {
  attackType: PokemonType;
  className?: string;
}

export default function MoveEffect({ attackType, className = '' }: MoveEffectProps) {
  const baseClassName = `absolute inset-0 pointer-events-none ${className}`;

  switch (attackType) {
    case 'ほのお': // かえんほうしゃ
      return (
        <div className={baseClassName}>
          {/* 炎の軌跡エフェクト */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: [0, 1, 0.8] }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="absolute left-0 top-1/2 w-full h-6 bg-gradient-to-r from-red-500 via-orange-400 to-yellow-300 transform -translate-y-1/2 origin-left"
            style={{ clipPath: 'polygon(0 30%, 100% 0%, 100% 100%, 0 70%)' }}
          />
          {/* 火花パーティクル */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, x: 0, y: 0, opacity: 0 }}
              animate={{ 
                scale: [0, 1, 0], 
                x: Math.random() * 200 - 100,
                y: Math.random() * 100 - 50,
                opacity: [0, 1, 0]
              }}
              transition={{ 
                duration: 1.2, 
                delay: 0.3 + i * 0.1,
                ease: "easeOut"
              }}
              className="absolute left-1/2 top-1/2 w-2 h-2 bg-orange-400 rounded-full"
            />
          ))}
        </div>
      );

    case 'みず': // ハイドロポンプ
      return (
        <div className={baseClassName}>
          {/* 水流エフェクト */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: [0, 1, 0.9] }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute left-0 top-1/2 w-full h-8 bg-gradient-to-r from-blue-600 via-cyan-400 to-blue-300 transform -translate-y-1/2 origin-left rounded-full"
          />
          {/* 水滴パーティクル */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, x: 0, y: 0, opacity: 0 }}
              animate={{ 
                scale: [0, 1, 0], 
                x: Math.random() * 150 - 75,
                y: Math.random() * 60 - 30,
                opacity: [0, 0.8, 0]
              }}
              transition={{ 
                duration: 1, 
                delay: 0.2 + i * 0.1,
                ease: "easeOut"
              }}
              className="absolute left-1/2 top-1/2 w-3 h-3 bg-cyan-300 rounded-full"
            />
          ))}
        </div>
      );

    case 'でんき': // かみなり
      return (
        <div className={baseClassName}>
          {/* 稲妻エフェクト */}
          <motion.div
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: [0, 1, 0.7] }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <svg className="w-full h-full" viewBox="0 0 400 200">
              <motion.path
                d="M50 100 L120 60 L180 120 L250 40 L320 100 L370 80"
                stroke="url(#lightning-gradient)"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
              <defs>
                <linearGradient id="lightning-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#fbbf24" />
                  <stop offset="50%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#fef3c7" />
                </linearGradient>
              </defs>
            </svg>
          </motion.div>
          {/* 電気火花 */}
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: [0, 1, 0], 
                opacity: [0, 1, 0],
                rotate: Math.random() * 360
              }}
              transition={{ 
                duration: 0.8, 
                delay: 0.1 + i * 0.05,
                ease: "easeOut"
              }}
              className="absolute w-1 h-6 bg-yellow-300"
              style={{
                left: `${20 + (i * 35)}%`,
                top: `${40 + Math.random() * 20}%`
              }}
            />
          ))}
        </div>
      );

    case 'くさ': // ソーラービーム
      return (
        <div className={baseClassName}>
          {/* 光線エフェクト */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: [0, 1, 0.8] }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="absolute left-0 top-1/2 w-full h-4 bg-gradient-to-r from-lime-400 via-green-300 to-yellow-200 transform -translate-y-1/2 origin-left"
            style={{ 
              boxShadow: '0 0 20px rgba(34, 197, 94, 0.8), 0 0 40px rgba(34, 197, 94, 0.4)',
              filter: 'brightness(1.2)'
            }}
          />
          {/* 光粒子 */}
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, x: 0, opacity: 0 }}
              animate={{ 
                scale: [0, 1, 0], 
                x: i * 30,
                opacity: [0, 1, 0]
              }}
              transition={{ 
                duration: 1.2, 
                delay: i * 0.1,
                ease: "easeOut"
              }}
              className="absolute left-4 top-1/2 w-2 h-2 bg-lime-300 rounded-full transform -translate-y-1/2"
              style={{ filter: 'brightness(1.5)' }}
            />
          ))}
        </div>
      );

    case 'こおり': // れいとうビーム
      return (
        <div className={baseClassName}>
          {/* 氷の結晶軌跡 */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: [0, 1, 0.9] }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="absolute left-0 top-1/2 w-full h-5 bg-gradient-to-r from-cyan-400 via-blue-300 to-white transform -translate-y-1/2 origin-left"
            style={{ 
              filter: 'brightness(1.3)',
              boxShadow: '0 0 15px rgba(59, 130, 246, 0.6)'
            }}
          />
          {/* 氷の結晶 */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, rotate: 0, opacity: 0 }}
              animate={{ 
                scale: [0, 1, 0.8], 
                rotate: [0, 360],
                opacity: [0, 1, 0]
              }}
              transition={{ 
                duration: 1.1, 
                delay: 0.2 + i * 0.1,
                ease: "easeOut"
              }}
              className="absolute text-cyan-300 text-lg"
              style={{
                left: `${10 + i * 12}%`,
                top: `${45 + Math.random() * 10}%`
              }}
            >
              ❄️
            </motion.div>
          ))}
        </div>
      );

    case 'かくとう': // インファイト
      return (
        <div className={baseClassName}>
          {/* パンチエフェクト */}
          <motion.div
            initial={{ scale: 0, x: -100, opacity: 0 }}
            animate={{ 
              scale: [0, 1.5, 1], 
              x: [0, 50, 150],
              opacity: [0, 1, 0.8]
            }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute left-1/4 top-1/2 w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-full transform -translate-y-1/2"
            style={{ filter: 'blur(2px) brightness(1.2)' }}
          />
          {/* 衝撃波 */}
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: [0, 2 + i * 0.5], 
                opacity: [0, 0.8, 0]
              }}
              transition={{ 
                duration: 1, 
                delay: i * 0.1,
                ease: "easeOut"
              }}
              className="absolute right-1/4 top-1/2 w-8 h-8 border-4 border-orange-400 rounded-full transform -translate-y-1/2"
            />
          ))}
        </div>
      );

    case 'どく': // ヘドロウェーブ
      return (
        <div className={baseClassName}>
          {/* 毒の波動 */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: [0, 1, 0.7] }}
            transition={{ duration: 1.1, ease: "easeInOut" }}
            className="absolute left-0 top-1/2 w-full h-10 bg-gradient-to-r from-purple-600 via-violet-500 to-purple-400 transform -translate-y-1/2 origin-left"
            style={{ 
              clipPath: 'polygon(0 20%, 100% 10%, 100% 90%, 0 80%)',
              filter: 'brightness(1.1)'
            }}
          />
          {/* 毒の泡 */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, y: 0, opacity: 0 }}
              animate={{ 
                scale: [0, 1, 0], 
                y: [0, -Math.random() * 30, -Math.random() * 60],
                opacity: [0, 0.8, 0]
              }}
              transition={{ 
                duration: 1.3, 
                delay: 0.3 + i * 0.1,
                ease: "easeOut"
              }}
              className="absolute w-4 h-4 bg-purple-400 rounded-full"
              style={{
                left: `${20 + i * 10}%`,
                top: '50%'
              }}
            />
          ))}
        </div>
      );

    case 'じめん': // じしん
      return (
        <div className={baseClassName}>
          {/* 地面の揺れエフェクト */}
          <motion.div
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ 
              scaleY: [0, 1, 0.8],
              opacity: [0, 1, 0.7],
              y: [0, -5, 0, -3, 0]
            }}
            transition={{ 
              duration: 1.2, 
              ease: "easeOut",
              y: { repeat: 3, duration: 0.3 }
            }}
            className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-amber-700 via-yellow-600 to-amber-500 origin-bottom"
          />
          {/* 土の粒子 */}
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, y: 0, x: 0, opacity: 0 }}
              animate={{ 
                scale: [0, 1, 0], 
                y: [-20, -40, -60],
                x: Math.random() * 100 - 50,
                opacity: [0, 0.9, 0]
              }}
              transition={{ 
                duration: 1.5, 
                delay: 0.2 + i * 0.08,
                ease: "easeOut"
              }}
              className="absolute w-2 h-2 bg-amber-600 rounded-sm"
              style={{
                left: `${10 + i * 8}%`,
                bottom: '0%'
              }}
            />
          ))}
        </div>
      );

    case 'ひこう': // ゴッドバード
      return (
        <div className={baseClassName}>
          {/* 羽ばたきエフェクト */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0, rotate: -10 }}
            animate={{ 
              scaleX: 1, 
              opacity: [0, 1, 0.8],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 1, 
              ease: "easeOut",
              rotate: { repeat: 2, duration: 0.3 }
            }}
            className="absolute left-0 top-1/2 w-full h-6 bg-gradient-to-r from-sky-400 via-white to-cyan-300 transform -translate-y-1/2 origin-left"
            style={{ clipPath: 'polygon(0 0%, 100% 20%, 100% 80%, 0 100%)' }}
          />
          {/* 風の渦 */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, rotate: 0, opacity: 0 }}
              animate={{ 
                scale: [0, 1.5, 1], 
                rotate: [0, 720],
                opacity: [0, 0.6, 0]
              }}
              transition={{ 
                duration: 1.2, 
                delay: i * 0.1,
                ease: "easeOut"
              }}
              className="absolute w-6 h-6 border-2 border-sky-300 rounded-full"
              style={{
                left: `${20 + i * 15}%`,
                top: `${40 + Math.random() * 20}%`
              }}
            />
          ))}
        </div>
      );

    case 'エスパー': // サイコキネシス
      return (
        <div className={baseClassName}>
          {/* サイキック波動 */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: [0, 2, 1.5],
              opacity: [0, 0.8, 0.6],
              rotate: [0, 180]
            }}
            transition={{ duration: 1.1, ease: "easeOut" }}
            className="absolute left-1/2 top-1/2 w-32 h-32 transform -translate-x-1/2 -translate-y-1/2"
          >
            <div className="w-full h-full rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 animate-pulse"
                 style={{ filter: 'blur(4px) brightness(1.2)' }} />
          </motion.div>
          {/* スピラル */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, rotate: 0, opacity: 0 }}
              animate={{ 
                scale: [0, 1, 0], 
                rotate: [0, 360],
                opacity: [0, 1, 0]
              }}
              transition={{ 
                duration: 1.3, 
                delay: i * 0.1,
                ease: "easeOut"
              }}
              className="absolute w-3 h-3 bg-purple-400 rounded-full"
              style={{
                left: `${40 + Math.cos(i) * 20}%`,
                top: `${40 + Math.sin(i) * 20}%`
              }}
            />
          ))}
        </div>
      );

    case 'むし': // とんぼがえり
      return (
        <div className={baseClassName}>
          {/* 虫の軌跡エフェクト */}
          <motion.div
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: [0, 1, 0.7] }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <svg className="w-full h-full" viewBox="0 0 400 200">
              <motion.path
                d="M50 100 Q150 50 250 100 Q300 150 350 100"
                stroke="url(#bug-gradient)"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, ease: "easeInOut" }}
              />
              <defs>
                <linearGradient id="bug-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#22c55e" />
                  <stop offset="50%" stopColor="#84cc16" />
                  <stop offset="100%" stopColor="#eab308" />
                </linearGradient>
              </defs>
            </svg>
          </motion.div>
          {/* 虫の羽音エフェクト */}
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: [0, 1, 0], 
                opacity: [0, 0.8, 0],
                y: [0, -10, 0]
              }}
              transition={{ 
                duration: 0.8, 
                delay: 0.2 + i * 0.2,
                ease: "easeOut",
                y: { repeat: 2, duration: 0.2 }
              }}
              className="absolute w-6 h-4 bg-green-400 rounded-full opacity-60"
              style={{
                left: `${30 + i * 20}%`,
                top: `${45 + Math.random() * 10}%`
              }}
            />
          ))}
        </div>
      );

    case 'いわ': // いわなだれ
      return (
        <div className={baseClassName}>
          {/* 岩の落下エフェクト */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, y: -100, x: 0, rotate: 0, opacity: 0 }}
              animate={{ 
                scale: [0, 1, 0.8], 
                y: [0, 150, 200],
                x: Math.random() * 100 - 50,
                rotate: Math.random() * 720,
                opacity: [0, 1, 0.8]
              }}
              transition={{ 
                duration: 1.2, 
                delay: i * 0.1,
                ease: "easeIn"
              }}
              className="absolute w-4 h-4 bg-stone-600 rounded-sm"
              style={{
                left: `${20 + i * 8}%`,
                top: '0%',
                boxShadow: '2px 2px 4px rgba(0,0,0,0.5)'
              }}
            />
          ))}
          {/* 地面の衝撃 */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: [0, 1, 0.5] }}
            transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
            className="absolute bottom-0 left-0 w-full h-4 bg-gradient-to-t from-stone-700 to-stone-500 origin-center"
          />
        </div>
      );

    case 'ゴースト': // シャドーボール
      return (
        <div className={baseClassName}>
          {/* 暗闇の球体 */}
          <motion.div
            initial={{ scale: 0, x: -150, opacity: 0 }}
            animate={{ 
              scale: [0, 1.2, 1], 
              x: [0, 150],
              opacity: [0, 0.9, 0.8]
            }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="absolute left-1/4 top-1/2 w-16 h-16 bg-gradient-to-br from-purple-900 via-gray-800 to-black rounded-full transform -translate-y-1/2"
            style={{ 
              filter: 'blur(1px)',
              boxShadow: '0 0 20px rgba(75, 0, 130, 0.8), inset 0 0 20px rgba(139, 69, 19, 0.3)'
            }}
          />
          {/* 幽霊のオーラ */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, opacity: 0, rotate: 0 }}
              animate={{ 
                scale: [0, 1.5, 1], 
                opacity: [0, 0.6, 0.3],
                rotate: [0, 360],
                x: Math.random() * 100 - 50,
                y: Math.random() * 60 - 30
              }}
              transition={{ 
                duration: 1.5, 
                delay: 0.2 + i * 0.1,
                ease: "easeOut"
              }}
              className="absolute w-8 h-8 bg-gradient-to-br from-purple-600 to-gray-700 rounded-full"
              style={{
                left: '50%',
                top: '50%',
                filter: 'blur(2px)'
              }}
            />
          ))}
        </div>
      );

    case 'ドラゴン': // りゅうせいぐん
      return (
        <div className={baseClassName}>
          {/* 流星群エフェクト */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, x: -200, y: -100, opacity: 0 }}
              animate={{ 
                scale: [0, 1, 0.8], 
                x: [0, 200 + i * 20],
                y: [0, 100 + i * 15],
                opacity: [0, 1, 0.8]
              }}
              transition={{ 
                duration: 1.3, 
                delay: i * 0.15,
                ease: "easeOut"
              }}
              className="absolute w-6 h-2 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-400 rounded-full"
              style={{
                left: '10%',
                top: '20%',
                filter: 'brightness(1.3)',
                boxShadow: '0 0 10px rgba(147, 51, 234, 0.7)'
              }}
            />
          ))}
          {/* 竜のオーラ */}
          <motion.div
            initial={{ scale: 0, opacity: 0, rotate: 0 }}
            animate={{ 
              scale: [0, 2, 1.5], 
              opacity: [0, 0.8, 0.6],
              rotate: [0, 180]
            }}
            transition={{ duration: 1.4, ease: "easeOut" }}
            className="absolute left-1/2 top-1/2 w-24 h-24 transform -translate-x-1/2 -translate-y-1/2"
          >
            <div className="w-full h-full rounded-full bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500"
                 style={{ filter: 'blur(3px) brightness(1.2)' }} />
          </motion.div>
        </div>
      );

    case 'あく': // かみくだく
      return (
        <div className={baseClassName}>
          {/* 牙のエフェクト */}
          <motion.div
            initial={{ scale: 0, rotate: -30, opacity: 0 }}
            animate={{ 
              scale: [0, 1.3, 1], 
              rotate: [0, 30, 0],
              opacity: [0, 1, 0.9]
            }}
            transition={{ duration: 0.9, ease: "easeInOut" }}
            className="absolute right-1/4 top-1/2 transform -translate-y-1/2"
          >
            {/* 上の牙 */}
            <div className="w-8 h-12 bg-gradient-to-b from-gray-300 to-gray-600 transform rotate-12"
                 style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />
            {/* 下の牙 */}
            <div className="w-8 h-12 bg-gradient-to-t from-gray-300 to-gray-600 transform -rotate-12 -mt-2"
                 style={{ clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)' }} />
          </motion.div>
          {/* 暗闇エフェクト */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: [0, 2 + i * 0.3], 
                opacity: [0, 0.3, 0]
              }}
              transition={{ 
                duration: 1.2, 
                delay: i * 0.1,
                ease: "easeOut"
              }}
              className="absolute right-1/4 top-1/2 w-6 h-6 bg-black rounded-full transform -translate-y-1/2"
            />
          ))}
        </div>
      );

    case 'はがね': // アイアンテール
      return (
        <div className={baseClassName}>
          {/* 金属光沢の軌跡 */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0, rotate: -15 }}
            animate={{ 
              scaleX: 1, 
              opacity: [0, 1, 0.9],
              rotate: [0, 15, 0]
            }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute left-0 top-1/2 w-full h-8 bg-gradient-to-r from-gray-400 via-white to-gray-300 transform -translate-y-1/2 origin-left"
            style={{ 
              filter: 'brightness(1.5)',
              boxShadow: '0 0 15px rgba(255, 255, 255, 0.8)'
            }}
          />
          {/* メタルスパーク */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: [0, 1, 0], 
                opacity: [0, 1, 0],
                x: Math.random() * 150 - 75,
                y: Math.random() * 60 - 30
              }}
              transition={{ 
                duration: 1, 
                delay: 0.2 + i * 0.08,
                ease: "easeOut"
              }}
              className="absolute left-1/2 top-1/2 w-2 h-2 bg-white rounded-full"
              style={{ filter: 'brightness(2)' }}
            />
          ))}
        </div>
      );

    case 'フェアリー': // ムーンフォース
      return (
        <div className={baseClassName}>
          {/* 妖精の光 */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: [0, 1.8, 1.4],
              opacity: [0, 0.9, 0.8],
              rotate: [0, 360]
            }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="absolute left-1/2 top-1/2 w-28 h-28 transform -translate-x-1/2 -translate-y-1/2"
          >
            <div className="w-full h-full rounded-full bg-gradient-to-r from-pink-300 via-purple-200 to-blue-200"
                 style={{ 
                   filter: 'blur(2px) brightness(1.4)',
                   boxShadow: '0 0 30px rgba(236, 72, 153, 0.6)'
                 }} />
          </motion.div>
          {/* キラキラパーティクル */}
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, opacity: 0, rotate: 0 }}
              animate={{ 
                scale: [0, 1, 0], 
                opacity: [0, 1, 0],
                rotate: [0, 180],
                x: Math.cos(i * 30 * Math.PI / 180) * 80,
                y: Math.sin(i * 30 * Math.PI / 180) * 80
              }}
              transition={{ 
                duration: 1.5, 
                delay: i * 0.1,
                ease: "easeOut"
              }}
              className="absolute left-1/2 top-1/2 text-pink-300 text-lg"
            >
              ✨
            </motion.div>
          ))}
        </div>
      );

    case 'ノーマル': // はかいこうせん
      return (
        <div className={baseClassName}>
          {/* 直線的な光線 */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: [0, 1, 0.9] }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="absolute left-0 top-1/2 w-full h-6 bg-gradient-to-r from-white via-yellow-200 to-orange-200 transform -translate-y-1/2 origin-left"
            style={{ 
              filter: 'brightness(1.6)',
              boxShadow: '0 0 20px rgba(255, 255, 255, 0.9)'
            }}
          />
          {/* エネルギー放射 */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: [0, 2 + i * 0.2], 
                opacity: [0, 0.6, 0]
              }}
              transition={{ 
                duration: 1.2, 
                delay: i * 0.1,
                ease: "easeOut"
              }}
              className="absolute right-1/4 top-1/2 w-4 h-4 border-2 border-yellow-300 rounded-full transform -translate-y-1/2"
            />
          ))}
        </div>
      );

    default:
      return (
        <div className={baseClassName}>
          {/* デフォルトエフェクト */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 0.8] }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="absolute left-1/2 top-1/2 w-12 h-12 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full transform -translate-x-1/2 -translate-y-1/2"
          />
        </div>
      );
  }
}
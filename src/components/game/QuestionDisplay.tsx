import { motion } from 'framer-motion';
import TypeIcon from './TypeIcon';
import { PokemonType } from '@/types/pokemon';
import { formatDefendType } from '@/utils/quizLogic';

interface QuestionDisplayProps {
  attackType: PokemonType;
  defendType: PokemonType | [PokemonType, PokemonType];
  questionNumber: number;
  totalQuestions: number;
  showAnimation?: boolean;
}

export default function QuestionDisplay({
  attackType,
  defendType,
  questionNumber,
  totalQuestions,
  showAnimation = true
}: QuestionDisplayProps) {
  const formattedDefendType = formatDefendType(defendType);

  return (
    <motion.div
      initial={showAnimation ? { opacity: 0, y: 20 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg p-6 shadow-lg"
    >
      {/* 問題番号 */}
      <div className="text-center mb-4">
        <span className="text-sm text-muted-foreground">
          問題 {questionNumber} / {totalQuestions}
        </span>
      </div>

      {/* 問題文 */}
      <motion.h2
        initial={showAnimation ? { scale: 0.9 } : false}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="text-xl md:text-2xl font-bold text-center mb-8"
      >
        <span className="text-blue-600">{attackType}</span>
        <span className="mx-2">タイプが</span>
        <span className="text-red-600">{formattedDefendType}</span>
        <span className="mx-2">タイプに</span>
        <br className="block md:hidden" />
        <span>与えるダメージは？</span>
      </motion.h2>

      {/* タイプアイコン表示 */}
      <div className="flex items-center justify-center gap-6 md:gap-12 mb-6">
        {/* 攻撃側 */}
        <motion.div
          initial={showAnimation ? { x: -50, opacity: 0 } : false}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center"
        >
          <TypeIcon type={attackType} size="lg" animated={true} />
          <p className="mt-3 font-semibold text-blue-600">{attackType}</p>
          <p className="text-sm text-muted-foreground">攻撃側</p>
        </motion.div>

        {/* 矢印 */}
        <motion.div
          initial={showAnimation ? { scale: 0 } : false}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, delay: 0.5 }}
          className="text-4xl text-muted-foreground font-bold"
        >
          →
        </motion.div>

        {/* 防御側 */}
        <motion.div
          initial={showAnimation ? { x: 50, opacity: 0 } : false}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center"
        >
          {Array.isArray(defendType) ? (
            // 複合タイプの表示
            <div className="flex flex-col gap-2">
              <div className="flex gap-2 justify-center">
                <TypeIcon type={defendType[0]} size="md" animated={true} />
                <TypeIcon type={defendType[1]} size="md" animated={true} />
              </div>
              <div className="flex gap-2 justify-center text-sm">
                <span>{defendType[0]}</span>
                <span>・</span>
                <span>{defendType[1]}</span>
              </div>
            </div>
          ) : (
            // 単一タイプの表示
            <div>
              <TypeIcon type={defendType} size="lg" animated={true} />
              <p className="mt-3 font-semibold text-red-600">{defendType}</p>
            </div>
          )}
          <p className="text-sm text-muted-foreground mt-1">防御側</p>
        </motion.div>
      </div>

      {/* 複合タイプの説明 */}
      {Array.isArray(defendType) && (
        <motion.div
          initial={showAnimation ? { opacity: 0, y: 10 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
          className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center"
        >
          <div className="text-sm text-blue-700">
            💡 複合タイプのダメージ計算では、両方のタイプとの相性を掛け算します
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
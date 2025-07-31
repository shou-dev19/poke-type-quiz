import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { DamageMultiplier } from '@/types/pokemon';
import { getAnswerText } from '@/utils/quizLogic';

interface AnswerChoicesProps {
  choices: DamageMultiplier[];
  selectedAnswer: DamageMultiplier | null;
  correctAnswer?: DamageMultiplier;
  showResult?: boolean;
  disabled?: boolean;
  onAnswer: (answer: DamageMultiplier) => void;
}

export default function AnswerChoices({
  choices,
  selectedAnswer,
  correctAnswer,
  showResult = false,
  disabled = false,
  onAnswer
}: AnswerChoicesProps) {
  const getButtonVariant = (choice: DamageMultiplier) => {
    if (!showResult) {
      return selectedAnswer === choice ? 'default' : 'outline';
    }

    // 結果表示時
    if (choice === correctAnswer) {
      return 'default'; // 正解は青色
    }
    if (selectedAnswer === choice && choice !== correctAnswer) {
      return 'destructive'; // 間違いは赤色
    }
    return 'outline';
  };

  const getButtonClassName = (choice: DamageMultiplier) => {
    let baseClass = 'h-14 text-base font-semibold transition-all duration-200';
    
    if (!showResult) {
      baseClass += ' hover:scale-105';
      if (selectedAnswer === choice) {
        baseClass += ' ring-2 ring-blue-500 ring-offset-2';
      }
    } else {
      // 結果表示時の追加スタイル
      if (choice === correctAnswer) {
        baseClass += ' bg-green-500 hover:bg-green-600 text-white border-green-500';
      } else if (selectedAnswer === choice && choice !== correctAnswer) {
        baseClass += ' bg-red-500 hover:bg-red-600 text-white border-red-500';
      }
    }

    return baseClass;
  };

  const getChoiceIcon = (choice: DamageMultiplier) => {
    if (showResult && choice === correctAnswer) {
      return '✓ ';
    }
    if (showResult && selectedAnswer === choice && choice !== correctAnswer) {
      return '✗ ';
    }
    return '';
  };

  // 4択と6択で異なるレイアウト
  const is6Choice = choices.length === 6;
  const gridCols = is6Choice ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-2';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.7 }}
      className={`grid ${gridCols} gap-3 md:gap-4`}
    >
      {choices.map((choice, index) => (
        <motion.div
          key={choice}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ 
            duration: 0.3, 
            delay: 0.8 + index * 0.1,
            type: "spring",
            stiffness: 300,
            damping: 20
          }}
        >
          <Button
            variant={getButtonVariant(choice)}
            className={getButtonClassName(choice)}
            onClick={() => onAnswer(choice)}
            disabled={disabled || selectedAnswer !== null}
          >
            <span className="flex items-center justify-center">
              {getChoiceIcon(choice)}
              {getAnswerText(choice)}
            </span>
          </Button>
        </motion.div>
      ))}
      
      {/* ヒントテキスト */}
      {!showResult && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 1.2 }}
          className={`${is6Choice ? 'col-span-2 md:col-span-3' : 'col-span-2'} text-center mt-2`}
        >
          <p className="text-sm text-muted-foreground">
            💡 タイプ相性を思い出して選択してください
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
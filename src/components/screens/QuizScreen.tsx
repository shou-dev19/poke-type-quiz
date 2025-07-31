import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import AttackAnimation from '@/components/game/AttackAnimation';
import QuestionDisplay from '@/components/game/QuestionDisplay';
import AnswerChoices from '@/components/game/AnswerChoices';
import { QuizState, DamageMultiplier, PokemonType, TYPE_EFFECTIVENESS } from '@/types/pokemon';
import { getAnswerChoices, getAnswerText } from '@/utils/quizLogic';
import { X } from 'lucide-react';

interface QuizScreenProps {
  quizState: QuizState;
  onAnswer: (answer: DamageMultiplier) => void;
  onNext: () => void;
  onQuit: () => void;
}

export default function QuizScreen({ quizState, onAnswer, onNext, onQuit }: QuizScreenProps) {
  const currentQuestion = quizState.questions[quizState.currentQuestion];
  const answerChoices = getAnswerChoices(quizState.difficulty);
  const progress = ((quizState.currentQuestion + 1) / quizState.totalQuestions) * 100;

  const handleAnswer = (answer: DamageMultiplier) => {
    if (quizState.selectedAnswer === null && !quizState.isAnimating) {      
      onAnswer(answer);
    }
  };

  // 単一タイプの効果計算（説明用）
  const calculateSingleTypeEffectiveness = (attackType: PokemonType, defendType: PokemonType): DamageMultiplier => {
    return TYPE_EFFECTIVENESS[attackType][defendType];
  };

  if (!currentQuestion) return null;

  const showResult = quizState.selectedAnswer !== null && !quizState.isAnimating;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-blue-800 p-4">
      {/* 攻撃アニメーション */}
      {quizState.isAnimating && (
        <AttackAnimation
          attackType={currentQuestion.attackType}
          defendType={currentQuestion.defendType}
          onAnimationComplete={() => {}}
          isCorrect={quizState.selectedAnswer === currentQuestion.correctAnswer}
        />
      )}

      <div className="max-w-4xl mx-auto space-y-6">
        {/* ヘッダー */}
        <div className="flex justify-between items-center">
          {/* 進行状況 */}
          <div className="flex-1">
            <div className="text-white mb-2 text-sm">
              問題 {quizState.currentQuestion + 1} / {quizState.totalQuestions}
            </div>
            <Progress value={progress} className="w-full max-w-md" />
            <div className="text-white/80 mt-1 text-xs">
              難易度: {quizState.difficulty} | スコア: {quizState.score}
            </div>
          </div>

          {/* 中断ボタン */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="outline" 
                size="sm"
                disabled={quizState.isAnimating}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <X className="w-4 h-4 mr-1" />
                中断
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>クイズを中断しますか？</AlertDialogTitle>
                <AlertDialogDescription>
                  現在の進行状況は保存されません。本当にクイズを中断してメニューに戻りますか？
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>キャンセル</AlertDialogCancel>
                <AlertDialogAction onClick={onQuit} className="bg-destructive hover:bg-destructive/90">
                  中断する
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {/* 問題表示 */}
        <QuestionDisplay
          attackType={currentQuestion.attackType}
          defendType={currentQuestion.defendType}
          questionNumber={quizState.currentQuestion + 1}
          totalQuestions={quizState.totalQuestions}
          showAnimation={true}
        />

        {/* 選択肢または結果 */}
        {!showResult ? (
          <AnswerChoices
            choices={answerChoices}
            selectedAnswer={quizState.selectedAnswer}
            disabled={quizState.selectedAnswer !== null}
            onAnswer={handleAnswer}
          />
        ) : (
          <div className="bg-white rounded-lg p-6 space-y-6">
            {/* 結果表示 */}
            <div className="text-center">
              <div className={`text-3xl font-bold ${quizState.selectedAnswer === currentQuestion.correctAnswer ? 'text-green-600' : 'text-red-600'}`}>
                {quizState.selectedAnswer === currentQuestion.correctAnswer ? '✓ 正解！' : '✗ 不正解'}
              </div>
              <div className="text-xl mt-2">
                正解: {getAnswerText(currentQuestion.correctAnswer)}
              </div>
            </div>

            {/* 複合タイプの説明 */}
            {Array.isArray(currentQuestion.defendType) && (
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">💡 複合タイプの計算</h4>
                <div className="text-sm space-y-1">
                  <p>
                    <span className="font-mono">{currentQuestion.attackType}</span> → <span className="font-mono">{currentQuestion.defendType[0]}</span> = {getAnswerText(calculateSingleTypeEffectiveness(currentQuestion.attackType, currentQuestion.defendType[0]))}
                  </p>
                  <p>
                    <span className="font-mono">{currentQuestion.attackType}</span> → <span className="font-mono">{currentQuestion.defendType[1]}</span> = {getAnswerText(calculateSingleTypeEffectiveness(currentQuestion.attackType, currentQuestion.defendType[1]))}
                  </p>
                  <p className="font-semibold border-t pt-2 mt-2">
                    最終結果 = {getAnswerText(currentQuestion.correctAnswer)}
                  </p>
                </div>
              </div>
            )}

            {/* 次へボタン */}
            <Button 
              onClick={onNext} 
              className="w-full py-3 text-lg"
              size="lg"
            >
              {quizState.currentQuestion + 1 < quizState.totalQuestions ? '➡️ 次の問題' : '🏆 結果を見る'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
import { useState, useCallback } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import TypeIcon from './TypeIcon';
import AttackAnimation from './AttackAnimation';
import { QuizState, DamageMultiplier, PokemonType, TYPE_EFFECTIVENESS } from '../types/pokemon';
import { getAnswerChoices, getAnswerText, formatDefendType } from '../utils/quizLogic';
import { X } from 'lucide-react';

interface QuizScreenProps {
  quizState: QuizState;
  onAnswer: (answer: DamageMultiplier) => void;
  onNext: () => void;
  onQuit: () => void;
  onAnimationComplete: () => void;
}

export default function QuizScreen({ quizState, onAnswer, onNext, onQuit, onAnimationComplete }: QuizScreenProps) {
  const [showExplanation, setShowExplanation] = useState(false);
  
  const currentQuestion = quizState.questions[quizState.currentQuestion];
  const answerChoices = getAnswerChoices(quizState.difficulty);
  const progress = ((quizState.currentQuestion + 1) / quizState.totalQuestions) * 100;

  const handleAnswer = (answer: DamageMultiplier) => {
    if (quizState.selectedAnswer === null && !quizState.isAnimating) {
      onAnswer(answer);
    }
  };

  // AttackAnimationが完了したときの処理
  const handleAnimationComplete = useCallback(() => {
    console.log('QuizScreen handleAnimationComplete called');
    // App.tsxの状態を更新してからローカル状態も更新
    onAnimationComplete();
    setShowExplanation(true);
  }, [onAnimationComplete]);

  const handleNext = () => {
    setShowExplanation(false);
    onNext();
  };

  // 単一タイプの効果計算
  const calculateSingleTypeEffectiveness = (attackType: PokemonType, defendType: PokemonType): DamageMultiplier => {
    return TYPE_EFFECTIVENESS[attackType][defendType];
  };

  if (!currentQuestion) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-3 sm:p-4">
      {/* 攻撃アニメーション */}
      {quizState.isAnimating && (
        <AttackAnimation
          attackType={currentQuestion.attackType}
          defendType={currentQuestion.defendType}
          onAnimationComplete={handleAnimationComplete}
          isCorrect={quizState.selectedAnswer === currentQuestion.correctAnswer}
          damageMultiplier={currentQuestion.correctAnswer}
        />
      )}

      <div className="max-w-5xl mx-auto">
        {/* ヘッダー */}
        <div className="mb-4 sm:mb-6">
          {/* 中断ボタン */}
          <div className="flex justify-end mb-3 sm:mb-4">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  disabled={quizState.isAnimating}
                  className="bg-white/10 border-white/20 text-gray-800 hover:bg-white/20 text-xs sm:text-sm"
                >
                  <X className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">クイズを中断</span>
                  <span className="sm:hidden">中断</span>
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

          {/* 進行状況 */}
          <div className="text-center">
            <div className="text-gray-800 mb-2 text-sm sm:text-base">
              問題 {quizState.currentQuestion + 1} / {quizState.totalQuestions}
            </div>
            <Progress value={progress} className="w-full max-w-md mx-auto" />
            <div className="text-gray-600 mt-2 text-xs sm:text-sm">
              <div className="flex flex-col sm:flex-row sm:justify-center sm:gap-4">
                <span>難易度: {quizState.difficulty}</span>
                <span>スコア: {quizState.score}</span>
              </div>
            </div>
          </div>
        </div>

        <Card className="shadow-2xl border-2 border-blue-200/50 bg-white/95 backdrop-blur-sm">
          <CardHeader className="p-6 sm:p-8 bg-gradient-to-br from-blue-50 to-purple-50 rounded-t-lg">
            <CardTitle className="text-center text-xl sm:text-2xl lg:text-3xl leading-tight font-bold text-gray-800">
              {currentQuestion.attackType}タイプが{formatDefendType(currentQuestion.defendType)}タイプに与えるダメージは？
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-6 sm:p-8">
            {/* タイプアイコン表示 */}
            <div className="flex items-center justify-center gap-6 sm:gap-8 lg:gap-12 mb-8 sm:mb-10">
              <div className="text-center p-4 bg-gradient-to-br from-red-50 to-orange-50 rounded-xl border border-red-200/50 shadow-lg">
                <TypeIcon type={currentQuestion.attackType} size="lg" className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32" />
                <p className="mt-2 sm:mt-3 text-lg sm:text-xl font-bold text-gray-800">{currentQuestion.attackType}</p>
                <p className="text-sm sm:text-base text-red-600 font-semibold">攻撃側</p>
              </div>
              
              <div className="text-4xl sm:text-5xl lg:text-6xl text-blue-500 font-bold animate-pulse">⚡</div>
              
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200/50 shadow-lg">
                {Array.isArray(currentQuestion.defendType) ? (
                  <div className="flex flex-col gap-2 sm:gap-3">
                    <div>
                      <TypeIcon type={currentQuestion.defendType[0]} size="md" className="w-20 h-20 sm:w-24 sm:h-24" />
                      <p className="text-sm sm:text-base font-bold mt-1">{currentQuestion.defendType[0]}</p>
                    </div>
                    <div>
                      <TypeIcon type={currentQuestion.defendType[1]} size="md" className="w-20 h-20 sm:w-24 sm:h-24" />
                      <p className="text-sm sm:text-base font-bold mt-1">{currentQuestion.defendType[1]}</p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <TypeIcon type={currentQuestion.defendType} size="lg" className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32" />
                    <p className="mt-2 sm:mt-3 text-lg sm:text-xl font-bold text-gray-800">{currentQuestion.defendType}</p>
                  </div>
                )}
                <p className="text-sm sm:text-base text-blue-600 font-semibold mt-1 sm:mt-2">防御側</p>
              </div>
            </div>

            {/* 選択肢 */}
            {!showExplanation && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
                {answerChoices.map((choice) => (
                  <Button
                    key={choice}
                    variant={quizState.selectedAnswer === choice ? "default" : "outline"}
                    className={`h-16 sm:h-18 lg:h-20 text-lg sm:text-xl lg:text-2xl py-4 px-6 font-bold shadow-lg transform hover:scale-105 transition-all duration-200 ${
                      quizState.selectedAnswer === choice 
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 shadow-2xl" 
                        : "bg-white border-2 border-gray-300 hover:border-blue-400 hover:bg-blue-50"
                    }`}
                    onClick={() => handleAnswer(choice)}
                    disabled={quizState.selectedAnswer !== null}
                  >
                    {getAnswerText(choice)}
                  </Button>
                ))}
              </div>
            )}

            {/* 結果と説明 */}
            {showExplanation && !quizState.isAnimating && (
              <div className="space-y-3 sm:space-y-4">
                <div className="text-center">
                  <div className={`text-xl sm:text-2xl ${quizState.selectedAnswer === currentQuestion.correctAnswer ? 'text-green-600' : 'text-red-600'}`}>
                    {quizState.selectedAnswer === currentQuestion.correctAnswer ? '正解！' : '不正解'}
                  </div>
                  <div className="text-base sm:text-lg mt-2">
                    正解: {getAnswerText(currentQuestion.correctAnswer)}
                  </div>
                </div>

                {Array.isArray(currentQuestion.defendType) && (
                  <div className="bg-muted p-3 sm:p-4 rounded-lg">
                    <h4 className="text-sm sm:text-base font-medium mb-2">複合タイプの計算</h4>
                    <p className="text-xs sm:text-sm">
                      {currentQuestion.attackType} → {currentQuestion.defendType[0]} = {getAnswerText(calculateSingleTypeEffectiveness(currentQuestion.attackType, currentQuestion.defendType[0]))}
                    </p>
                    <p className="text-xs sm:text-sm">
                      {currentQuestion.attackType} → {currentQuestion.defendType[1]} = {getAnswerText(calculateSingleTypeEffectiveness(currentQuestion.attackType, currentQuestion.defendType[1]))}
                    </p>
                    <p className="text-xs sm:text-sm font-medium">
                      結果: {getAnswerText(currentQuestion.correctAnswer)}
                    </p>
                  </div>
                )}

                <Button 
                  onClick={handleNext} 
                  className="w-full text-lg sm:text-xl py-4 sm:py-6 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white font-bold shadow-xl transform hover:scale-105 transition-all duration-200 border-0"
                  size="lg"
                >
                  {quizState.currentQuestion + 1 < quizState.totalQuestions ? '🏃 次の問題へ' : '🎯 結果を見る'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
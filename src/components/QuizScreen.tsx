import { useState, useEffect, useCallback } from 'react';
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
  const [autoAdvanceTimer, setAutoAdvanceTimer] = useState<number>(3);
  
  const currentQuestion = quizState.questions[quizState.currentQuestion];
  const answerChoices = getAnswerChoices(quizState.difficulty);
  const progress = ((quizState.currentQuestion + 1) / quizState.totalQuestions) * 100;

  // 結果表示後の自動進行タイマー
  useEffect(() => {
    let interval: NodeJS.Timeout;
    let timeout: NodeJS.Timeout;

    if (showExplanation && !quizState.isAnimating) {
      // カウントダウンタイマー
      interval = setInterval(() => {
        setAutoAdvanceTimer(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // 3秒後に自動進行
      timeout = setTimeout(() => {
        handleNext();
      }, 3000);
    }

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [showExplanation, quizState.isAnimating]);

  // showExplanationが変わったときにタイマーをリセット
  useEffect(() => {
    if (showExplanation) {
      setAutoAdvanceTimer(3);
    }
  }, [showExplanation]);

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
    setAutoAdvanceTimer(3);
    onNext();
  };

  // 単一タイプの効果計算
  const calculateSingleTypeEffectiveness = (attackType: PokemonType, defendType: PokemonType): DamageMultiplier => {
    return TYPE_EFFECTIVENESS[attackType][defendType];
  };

  if (!currentQuestion) return null;

  return (
    <div className="min-h-screen bg-white p-3 sm:p-4">
      {/* 攻撃アニメーション */}
      {quizState.isAnimating && (
        <AttackAnimation
          attackType={currentQuestion.attackType}
          defendType={currentQuestion.defendType}
          onAnimationComplete={handleAnimationComplete}
          isCorrect={quizState.selectedAnswer === currentQuestion.correctAnswer}
        />
      )}

      <div className="max-w-4xl mx-auto">
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

        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-center text-lg sm:text-xl lg:text-2xl leading-tight">
              {currentQuestion.attackType}タイプが{formatDefendType(currentQuestion.defendType)}タイプに与えるダメージは？
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-4 sm:p-6">
            {/* タイプアイコン表示 */}
            <div className="flex items-center justify-center gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8">
              <div className="text-center">
                <TypeIcon type={currentQuestion.attackType} size="md" className="sm:w-20 sm:h-20 lg:w-24 lg:h-24" />
                <p className="mt-1 sm:mt-2 text-sm sm:text-base">{currentQuestion.attackType}</p>
                <p className="text-xs sm:text-sm text-muted-foreground">攻撃側</p>
              </div>
              
              <div className="text-2xl sm:text-3xl lg:text-4xl text-muted-foreground">→</div>
              
              <div className="text-center">
                {Array.isArray(currentQuestion.defendType) ? (
                  <div className="flex flex-col gap-1 sm:gap-2">
                    <div>
                      <TypeIcon type={currentQuestion.defendType[0]} size="sm" className="sm:w-16 sm:h-16" />
                      <p className="text-xs sm:text-sm mt-1">{currentQuestion.defendType[0]}</p>
                    </div>
                    <div>
                      <TypeIcon type={currentQuestion.defendType[1]} size="sm" className="sm:w-16 sm:h-16" />
                      <p className="text-xs sm:text-sm mt-1">{currentQuestion.defendType[1]}</p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <TypeIcon type={currentQuestion.defendType} size="md" className="sm:w-20 sm:h-20 lg:w-24 lg:h-24" />
                    <p className="mt-1 sm:mt-2 text-sm sm:text-base">{currentQuestion.defendType}</p>
                  </div>
                )}
                <p className="text-xs sm:text-sm text-muted-foreground mt-1 sm:mt-2">防御側</p>
              </div>
            </div>

            {/* 選択肢 */}
            {!showExplanation && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                {answerChoices.map((choice) => (
                  <Button
                    key={choice}
                    variant={quizState.selectedAnswer === choice ? "default" : "outline"}
                    className="h-12 sm:h-14 lg:h-16 text-sm sm:text-base lg:text-lg py-3 px-4"
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

                {/* 自動進行タイマー表示 */}
                <div className="text-center text-muted-foreground text-xs sm:text-sm">
                  {autoAdvanceTimer > 0 ? (
                    <p>自動的に次に進みます... {autoAdvanceTimer}秒</p>
                  ) : (
                    <p>次に進んでいます...</p>
                  )}
                </div>

                <Button 
                  onClick={handleNext} 
                  className="w-full text-sm sm:text-base py-3 sm:py-4"
                  size="lg"
                >
                  {quizState.currentQuestion + 1 < quizState.totalQuestions ? '次の問題' : '結果を見る'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
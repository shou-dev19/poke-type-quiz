import { useState, useCallback } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Button, buttonVariants } from './ui/button';
import { Progress } from './ui/progress';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import TypeIcon from './TypeIcon';
import AttackAnimation from './AttackAnimation';
import { QuizState, DamageMultiplier, PokemonType, TYPE_COLORS, TYPE_EFFECTIVENESS } from '../types/pokemon';
import { getAnswerChoices, getAnswerText, formatDefendType } from '../utils/quizLogic';
import { ArrowRight, Check, Equal, Layers, Pause, Shield, Swords, Trophy, X } from 'lucide-react';

interface QuizScreenProps {
  quizState: QuizState;
  onAnswer: (answer: DamageMultiplier) => void;
  onNext: () => void;
  onQuit: () => void;
  onAnimationComplete: () => void;
}

export default function QuizScreen({ quizState, onAnswer, onNext, onQuit, onAnimationComplete }: QuizScreenProps) {
  const [showExplanation, setShowExplanation] = useState(false);
  const reducedMotion = useReducedMotion();
  
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

  const defendTypes = Array.isArray(currentQuestion.defendType) ? currentQuestion.defendType : [currentQuestion.defendType];

  return (
    <main className="game-surface min-h-screen px-4 py-5 text-pop-ink sm:px-8 sm:py-6">
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

      <div className="mx-auto max-w-[860px]">
        {/* 進捗・難易度・スコアをひとつのHUDにまとめる。 */}
        <header className="mb-5 grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-3 rounded-2xl border-2 border-pop-ink bg-white p-3 shadow-pop-soft sm:mb-5 sm:grid-cols-[1fr_auto_auto] sm:gap-5 sm:px-5">
          <div className="min-w-0">
            <div className="mb-2 text-sm font-extrabold sm:text-base">
              問題 {quizState.currentQuestion + 1} / {quizState.totalQuestions}
            </div>
            <Progress value={progress} aria-label="クイズの進捗" aria-valuenow={progress} className="h-3 border border-pop-ink bg-pop-paper [&>div]:rounded-pill [&>div]:bg-pop-green" />
          </div>
          <div className="col-start-1 row-start-2 flex flex-wrap items-center gap-2 text-xs font-bold sm:col-start-2 sm:row-start-1 sm:gap-3">
            <span className="rounded-pill border border-pop-ink/20 bg-pop-paper px-3 py-1.5">難易度: {quizState.difficulty}</span>
            <span className="inline-flex items-center gap-1.5 rounded-pill border border-pop-ink bg-pop-yellow px-3 py-1.5">
              <Trophy className="size-3.5" aria-hidden="true" />スコア: {quizState.score}
            </span>
          </div>
          <div className="col-start-2 row-span-2 row-start-1 border-l-2 border-dashed border-pop-ink/15 pl-3 sm:col-start-3 sm:row-span-1 sm:pl-5">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="pop-outline" disabled={quizState.isAnimating} className="min-h-[44px] px-3 text-xs sm:text-sm">
                  <Pause className="size-4" aria-hidden="true" />
                  <span className="hidden sm:inline">クイズを中断</span>
                  <span className="sm:hidden">中断</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="!rounded-panel border-pop-ink bg-pop-paper p-6 font-sans text-pop-ink !shadow-pop sm:p-8">
                <AlertDialogHeader className="gap-4">
                  <span className="mx-auto flex size-12 items-center justify-center rounded-2xl border-2 border-pop-ink bg-pop-yellow shadow-pop-soft sm:mx-0"><Pause className="size-6" aria-hidden="true" /></span>
                  <AlertDialogTitle className="text-xl font-extrabold">クイズを中断しますか？</AlertDialogTitle>
                  <AlertDialogDescription className="text-sm font-medium leading-relaxed">
                    現在の進行状況は保存されません。本当にクイズを中断してメニューに戻りますか？
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="mt-3 gap-3">
                  <AlertDialogCancel className={buttonVariants({ variant: 'pop-outline', className: 'min-h-[48px]' })}>キャンセル</AlertDialogCancel>
                  <AlertDialogAction onClick={onQuit} className={buttonVariants({ variant: 'pop', className: 'min-h-[48px] bg-pop-pink hover:bg-pop-pink' })}>
                    中断する
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </header>

        <motion.section
          key={quizState.currentQuestion}
          initial={reducedMotion ? false : { opacity: 0, y: 12, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: 'spring', stiffness: 240, damping: 23 }}
          className="game-panel p-4 sm:p-6"
          aria-labelledby="question-title"
        >
          <div className="mb-4 flex items-center justify-between text-muted-foreground sm:mb-4" aria-hidden="true">
            <span className="game-eyebrow">TYPE MATCHUP</span>
            <Swords className="size-5" />
          </div>
          <h1 id="question-title" className="mx-auto max-w-full text-balance text-center text-lg font-extrabold leading-relaxed sm:text-2xl">
            <span className="inline-block">{currentQuestion.attackType}タイプが</span><wbr /><span className="inline-block">{formatDefendType(currentQuestion.defendType)}タイプに</span><wbr /><span className="inline-block">与えるダメージは？</span>
          </h1>

          {/* タイプカラーの対戦カード。複合タイプも同じ高さで表示する。 */}
          <div className="relative my-5 grid grid-cols-2 gap-5 sm:my-5 sm:gap-10">
            <div className="flex flex-col items-center justify-center rounded-2xl border-2 px-2 py-3 shadow-pop-soft" style={{ borderColor: TYPE_COLORS[currentQuestion.attackType], backgroundColor: `${TYPE_COLORS[currentQuestion.attackType]}18` }}>
              <p className="mb-3 flex items-center gap-1.5 text-xs font-extrabold"><Swords className="size-3.5" aria-hidden="true" />攻撃側</p>
              <TypeIcon type={currentQuestion.attackType} size="md" animated={false} className="sm:!h-20 sm:!w-20" />
              <p className="mt-2 text-sm font-extrabold sm:text-lg">{currentQuestion.attackType}</p>
            </div>

            <span className="absolute left-1/2 top-1/2 z-10 flex size-10 -translate-x-1/2 -translate-y-1/2 -rotate-6 items-center justify-center rounded-xl border-2 border-pop-ink bg-pop-yellow text-sm font-black italic shadow-pop sm:size-12 sm:text-lg" aria-hidden="true">VS</span>

            <div className="flex flex-col items-center justify-center rounded-2xl border-2 px-2 py-3 shadow-pop-soft" style={{ borderColor: TYPE_COLORS[defendTypes[0]], background: defendTypes.length === 2 ? `linear-gradient(115deg, ${TYPE_COLORS[defendTypes[0]]}18 50%, ${TYPE_COLORS[defendTypes[1]]}18 50%)` : `${TYPE_COLORS[defendTypes[0]]}18` }}>
              <p className="mb-3 flex items-center gap-1.5 text-xs font-extrabold"><Shield className="size-3.5" aria-hidden="true" />防御側</p>
              <div className="flex items-center justify-center gap-2 sm:gap-5">
                {defendTypes.map(type => (
                  <div key={type} className="flex flex-col items-center">
                    <TypeIcon type={type} size={Array.isArray(currentQuestion.defendType) ? 'sm' : 'md'} animated={false} className="sm:!h-20 sm:!w-20" />
                    <p className={`mt-2 font-extrabold sm:text-lg ${Array.isArray(currentQuestion.defendType) ? 'text-xs' : 'text-sm'}`}>{type}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 選択肢の色は倍率だけに対応し、正解による強調はしない。 */}
          {!showExplanation && (
            <div className={`grid grid-cols-2 gap-3 pb-1 sm:gap-4 ${answerChoices.length === 6 ? 'lg:grid-cols-3' : ''}`}>
              {answerChoices.map((choice) => (
                <Button
                  key={choice}
                  aria-label={getAnswerText(choice)}
                  variant="pop"
                  className={`h-auto min-h-[88px] min-w-0 flex-col gap-1 whitespace-normal px-1.5 py-3 sm:min-h-[94px] sm:px-4 ${
                    quizState.selectedAnswer === choice
                      ? 'bg-pop-ink text-white'
                      : choice > 1 ? 'bg-pop-orange/15' : choice === 1 ? 'bg-pop-yellow/15' : choice === 0 ? 'bg-slate-100' : 'bg-pop-blue/15'
                  }`}
                  onClick={() => handleAnswer(choice)}
                  disabled={quizState.selectedAnswer !== null}
                >
                  <span className="text-2xl font-black leading-none sm:text-3xl" aria-hidden="true">{choice}<span className="ml-0.5 text-sm">×</span></span>
                  <span className="whitespace-nowrap text-center text-[12px] font-bold leading-relaxed sm:text-sm">
                    {getAnswerText(choice).split('(')[0]}<br className="sm:hidden" />{'(' + getAnswerText(choice).split('(')[1]}
                  </span>
                </Button>
              ))}
            </div>
          )}

          {/* 結果と説明 */}
          {showExplanation && !quizState.isAnimating && (
            <div className="space-y-4">
              <div className="border-t-2 border-dashed border-pop-ink/15 pt-4 text-center" role="status">
                <motion.div
                  initial={reducedMotion ? false : { opacity: 0, scale: 0.8, rotate: -5 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 16 }}
                  className={`inline-flex items-center gap-2 rounded-pill border-2 border-pop-ink px-6 py-2 text-2xl font-black shadow-pop-soft ${quizState.selectedAnswer === currentQuestion.correctAnswer ? 'bg-pop-green' : 'bg-pop-pink'}`}
                >
                  {quizState.selectedAnswer === currentQuestion.correctAnswer ? <Check className="size-6" aria-hidden="true" /> : <X className="size-6" aria-hidden="true" />}
                  {quizState.selectedAnswer === currentQuestion.correctAnswer ? '正解！' : '不正解'}
                </motion.div>
                <p className="mt-3 text-base font-extrabold sm:text-lg">正解: {getAnswerText(currentQuestion.correctAnswer)}</p>
              </div>

              {Array.isArray(currentQuestion.defendType) && (
                <div className="rounded-2xl border-2 border-pop-ink/15 bg-pop-paper p-3 sm:p-4">
                  <h4 className="mb-3 flex items-center gap-2 text-sm font-extrabold"><Layers className="size-4" aria-hidden="true" />複合タイプの計算</h4>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {currentQuestion.defendType.map(type => (
                      <div key={type} className="flex items-center justify-between gap-2 rounded-xl bg-white p-2">
                        <p className="sr-only">{currentQuestion.attackType} → {type} = {getAnswerText(calculateSingleTypeEffectiveness(currentQuestion.attackType, type))}</p>
                        <div className="flex shrink-0 items-center gap-2 sm:gap-3" aria-hidden="true">
                          <TypeIcon type={currentQuestion.attackType} size="sm" animated={false} className="!h-8 !w-8 sm:!h-10 sm:!w-10" />
                          <ArrowRight className="size-4" />
                          <TypeIcon type={type} size="sm" animated={false} className="!h-8 !w-8 sm:!h-10 sm:!w-10" />
                          <Equal className="size-4" />
                        </div>
                        <span className="text-right text-xs font-bold sm:text-sm" aria-hidden="true">{getAnswerText(calculateSingleTypeEffectiveness(currentQuestion.attackType, type))}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t-2 border-dashed border-pop-ink/15 pt-3">
                    <span className="text-lg font-black" aria-label="倍率の掛け算">{calculateSingleTypeEffectiveness(currentQuestion.attackType, currentQuestion.defendType[0])} × {calculateSingleTypeEffectiveness(currentQuestion.attackType, currentQuestion.defendType[1])} = {currentQuestion.correctAnswer}</span>
                    <p className="text-xs font-extrabold sm:text-sm">結果: {getAnswerText(currentQuestion.correctAnswer)}</p>
                  </div>
                </div>
              )}

              <Button onClick={handleNext} variant="pop" size="hero" className="w-full justify-between">
                {quizState.currentQuestion + 1 < quizState.totalQuestions ? <Swords className="size-5" aria-hidden="true" /> : <Trophy className="size-5" aria-hidden="true" />}
                {quizState.currentQuestion + 1 < quizState.totalQuestions ? '次の問題へ' : '結果を見る'}
                <ArrowRight className="size-5" aria-hidden="true" />
              </Button>
            </div>
          )}
        </motion.section>
      </div>
    </main>
  );
}

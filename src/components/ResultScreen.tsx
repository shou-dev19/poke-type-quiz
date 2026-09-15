import { useEffect } from 'react';
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from 'framer-motion';
import { ArrowRight, BookOpen, Flag, Gamepad2, Layers, Lightbulb, RotateCcw, Sparkles, Star, Target, ThumbsUp, Trophy, X } from 'lucide-react';
import { Button } from './ui/button';
import { QuizState } from '../types/pokemon';

interface ResultScreenProps {
  quizState: QuizState;
  onRestart: () => void;
  onBackToMenu: () => void;
}

// 数字とリングはひとつの値で動かし、読み上げには確定した正答率を渡す。
function ScoreRing({ percentage }: { percentage: number }) {
  const reducedMotion = useReducedMotion();
  const progress = useMotionValue(0);
  const count = useTransform(progress, value => Math.round(value));
  const offset = useTransform(progress, value => 100 - value);

  useEffect(() => {
    if (reducedMotion) {
      progress.set(percentage);
      return;
    }
    progress.set(0);
    const controls = animate(progress, percentage, { duration: 1.2, delay: 0.25, ease: 'easeOut' });
    return () => controls.stop();
  }, [percentage, progress, reducedMotion]);

  return (
    <div className="relative size-[184px] shrink-0 sm:size-[224px]" role="img" aria-label={`正答率: ${percentage}%`}>
      <svg viewBox="0 0 224 224" className="size-full -rotate-90" aria-hidden="true">
        <circle cx="112" cy="112" r="100" fill="white" stroke="currentColor" strokeWidth="2" />
        <circle cx="112" cy="112" r="89" fill="none" stroke="currentColor" strokeOpacity="0.09" strokeWidth="16" />
        <motion.circle
          cx="112" cy="112" r="89" fill="none" pathLength="100"
          className="text-pop-green" stroke="currentColor" strokeWidth="16"
          strokeDasharray="100 100" strokeLinecap={percentage === 0 ? 'butt' : 'round'}
          style={{ strokeDashoffset: offset }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center" aria-hidden="true">
        <Target className="mb-1 size-5 text-muted-foreground" />
        <span className="text-sm font-bold text-muted-foreground">正答率:</span>
        <span className="flex items-baseline font-black leading-tight tracking-tight">
          <motion.span className="text-[48px] tabular-nums sm:text-[58px]">{count}</motion.span>
          <span className="ml-1 text-xl">%</span>
        </span>
      </div>
    </div>
  );
}

export default function ResultScreen({ quizState, onRestart, onBackToMenu }: ResultScreenProps) {
  const scorePercentage = Math.round((quizState.score / quizState.totalQuestions) * 100);
  const reducedMotion = useReducedMotion();

  const getScoreGrade = (percentage: number) => {
    if (percentage >= 90) return { grade: 'S', color: 'bg-yellow-500', message: 'ポケモンマスター！' };
    if (percentage >= 80) return { grade: 'A', color: 'bg-green-500', message: 'すばらしい！' };
    if (percentage >= 70) return { grade: 'B', color: 'bg-blue-500', message: 'よくできました' };
    if (percentage >= 60) return { grade: 'C', color: 'bg-orange-500', message: 'もう少し！' };
    return { grade: 'D', color: 'bg-red-500', message: 'がんばろう！' };
  };

  const { message } = getScoreGrade(scorePercentage);
  const entrance = {
    hidden: { opacity: 0, y: reducedMotion ? 0 : 12 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 240, damping: 23 } },
  };
  const statistics = [
    { label: '難易度', value: quizState.difficulty, icon: Gamepad2, color: 'bg-pop-blue/15', iconColor: 'bg-pop-blue' },
    { label: '総問題数', value: quizState.totalQuestions, icon: Layers, color: 'bg-pop-green/15', iconColor: 'bg-pop-green' },
    { label: '間違い', value: quizState.totalQuestions - quizState.score, icon: X, color: 'bg-pop-pink/20', iconColor: 'bg-pop-pink' },
  ];

  return (
    <main className="game-surface flex min-h-screen items-center justify-center px-4 py-5 text-pop-ink sm:px-8 sm:py-8">
      <motion.section
        className="game-panel relative isolate w-full max-w-[860px] p-4 sm:p-8"
        aria-labelledby="result-title"
        initial={reducedMotion ? false : 'hidden'}
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: reducedMotion ? 0 : 0.1 } } }}
      >
        {/* 紙吹雪は90%以上の入場時のみ。装飾の描画領域をパネル内に収める。 */}
        {scorePercentage >= 90 && !reducedMotion && (
          <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-panel" aria-hidden="true" data-result-confetti>
            {Array.from({ length: 24 }, (_, index) => (
              <motion.span
                key={index}
                className={`absolute top-0 h-3 w-2 rounded-sm ${['bg-pop-yellow', 'bg-pop-orange', 'bg-pop-blue', 'bg-pop-green', 'bg-pop-pink'][index % 5]}`}
                style={{ left: `${4 + (index * 17) % 92}%` }}
                initial={{ opacity: 0, y: -16, rotate: 0 }}
                animate={{ opacity: [0, 1, 1, 0], y: [-16, 90, 300], x: [0, index % 2 ? 18 : -18, index % 2 ? -12 : 12], rotate: index % 2 ? 240 : -240 }}
                transition={{ duration: 1.8, delay: 0.35 + (index % 6) * 0.07 }}
              />
            ))}
          </div>
        )}

        <motion.header variants={entrance} className="flex items-center justify-between gap-3 border-b-2 border-dashed border-pop-ink/15 pb-4">
          <h1 id="result-title" className="flex items-center gap-3 text-2xl font-black sm:text-3xl">
            <span className="flex size-10 items-center justify-center rounded-xl border-2 border-pop-ink bg-pop-yellow shadow-pop-soft"><Flag className="size-5" aria-hidden="true" /></span>
            クイズ結果
          </h1>
          <span className="flex gap-1.5" aria-hidden="true">
            {['bg-pop-orange', 'bg-pop-blue', 'bg-pop-yellow', 'bg-pop-green'].map(color => <span key={color} className={`size-2.5 rounded-full border border-pop-ink ${color}`} />)}
          </span>
        </motion.header>

        <motion.div variants={entrance} className="my-5 flex flex-col items-center justify-center gap-3 sm:my-6 sm:flex-row sm:gap-10">
          <ScoreRing percentage={scorePercentage} />
          <div className="min-w-0 text-center">
            <motion.div
              variants={{
                hidden: { opacity: 0, scale: 0.75, rotate: -5 },
                visible: { opacity: 1, scale: 1, rotate: 0, transition: { type: 'spring', stiffness: 350, damping: 15 } },
              }}
              className="inline-flex max-w-full items-center gap-2 rounded-2xl border-2 border-pop-ink bg-pop-yellow px-4 py-3 text-xl font-black shadow-pop sm:px-5 sm:text-3xl"
            >
              <Trophy className="size-6 shrink-0 sm:size-7" aria-hidden="true" />
              {message}
            </motion.div>
            <p className="mt-4 text-base font-bold text-muted-foreground sm:mt-5 sm:text-xl">
              <span className="text-2xl font-black text-pop-ink sm:text-3xl">{quizState.score}</span> / {quizState.totalQuestions} 問正解
            </p>
          </div>
        </motion.div>

        <motion.dl variants={entrance} className="grid grid-cols-3 gap-2 sm:gap-4">
          {statistics.map(({ label, value, icon: Icon, color, iconColor }) => (
            <div key={label} className={`flex min-w-0 flex-col items-center rounded-2xl border-2 border-pop-ink/20 px-2 py-3 shadow-pop-soft sm:flex-row sm:justify-center sm:gap-3 sm:p-4 ${color}`}>
              <span className={`mb-1.5 flex size-8 shrink-0 items-center justify-center rounded-lg border border-pop-ink sm:mb-0 sm:size-10 sm:rounded-xl ${iconColor}`}><Icon className="size-4 sm:size-5" aria-hidden="true" /></span>
              <div className="text-center sm:text-left">
                <dt className="text-xs font-bold text-muted-foreground sm:text-sm">{label}</dt>
                <dd className="mt-0.5 text-base font-extrabold sm:text-xl">{value}</dd>
              </div>
            </div>
          ))}
        </motion.dl>

        <motion.div variants={entrance} className="my-5 rounded-2xl border-2 border-pop-ink/15 bg-pop-paper p-4 text-left sm:my-6 sm:p-5 [&_h2]:flex [&_h2]:items-center [&_h2]:gap-2 [&_h2]:text-lg [&_h2]:font-extrabold [&_p]:mt-2 [&_p]:text-base [&_p]:font-medium [&_p]:leading-relaxed [&_p]:text-muted-foreground">
          {scorePercentage >= 90 && (
            <>
              <h2><Trophy className="size-5 shrink-0" aria-hidden="true" />ポケモンマスターレベル！</h2>
              <p>完璧な知識です！あなたはもうポケモンバトルのエキスパートですね。</p>
            </>
          )}
          {scorePercentage >= 80 && scorePercentage < 90 && (
            <>
              <h2><Star className="size-5 shrink-0" aria-hidden="true" />エクセレント！</h2>
              <p>とても良い成績です！もう少しでマスターレベルに到達できます。</p>
            </>
          )}
          {scorePercentage >= 70 && scorePercentage < 80 && (
            <>
              <h2><ThumbsUp className="size-5 shrink-0" aria-hidden="true" />グッド！</h2>
              <p>良い成績です！復習を重ねてさらに上を目指しましょう。</p>
            </>
          )}
          {scorePercentage >= 60 && scorePercentage < 70 && (
            <>
              <h2><BookOpen className="size-5 shrink-0" aria-hidden="true" />もう少し！</h2>
              <p>基本は理解できています。練習を続けて知識を深めましょう。</p>
            </>
          )}
          {scorePercentage < 60 && (
            <>
              <h2><Sparkles className="size-5 shrink-0" aria-hidden="true" />ファイト！</h2>
              <p>タイプ相性を覚えるのは大変ですが、諦めずに挑戦し続けましょう！</p>
            </>
          )}
        </motion.div>

        <motion.div variants={entrance} className="flex flex-col gap-3 sm:flex-row sm:gap-4">
          <Button onClick={onRestart} variant="pop" size="hero" className="min-h-[56px] flex-1 justify-between px-4 text-base sm:text-lg">
            <RotateCcw className="size-5" aria-hidden="true" />同じ設定でもう一度<ArrowRight className="size-5" aria-hidden="true" />
          </Button>
          <Button onClick={onBackToMenu} variant="pop-outline" size="hero" className="min-h-[56px] flex-1 px-4 text-base sm:text-lg">
            <Gamepad2 className="size-5" aria-hidden="true" />メニューに戻る
          </Button>
        </motion.div>

        <motion.p variants={entrance} className="mt-5 flex items-start justify-center gap-1.5 text-sm font-medium leading-relaxed text-muted-foreground">
          <Lightbulb className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <span>ヒント: 異なる難易度でも挑戦してみましょう！</span>
        </motion.p>
      </motion.section>
    </main>
  );
}

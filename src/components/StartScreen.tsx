import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  Check,
  Gamepad2,
  Layers,
  Pause,
  Play,
  Sparkles,
  Swords,
  Trophy,
  Zap,
} from 'lucide-react';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Difficulty, POKEMON_TYPES, PokemonType } from '../types/pokemon';
import TypeIcon from './TypeIcon';

interface StartScreenProps {
  onStart: (difficulty: Difficulty, questionCount: number) => void;
  attackAnimationEnabled?: boolean;
  onAttackAnimationEnabledChange?: (enabled: boolean) => void;
  reducedMotion?: boolean;
}

const difficulties: Difficulty[] = ['かんたん', 'ふつう', 'むずかしい'];
const heroTypes: PokemonType[] = ['ほのお', 'くさ', 'みず'];
const rules = [
  {
    icon: Swords,
    color: 'bg-pop-orange',
    text: '攻撃側のタイプが防御側のタイプに与えるダメージ倍率を答えてください',
  },
  {
    icon: Zap,
    color: 'bg-pop-yellow',
    text: '回答後に正解とタイプ相性の解説が表示されます',
  },
  {
    icon: Layers,
    color: 'bg-pop-green',
    text: '複合タイプの場合は両方のタイプとの相性を計算します',
  },
  {
    icon: Trophy,
    color: 'bg-pop-blue',
    text: '全問題終了後に結果が表示されます',
  },
];

export default function StartScreen({
  onStart,
  attackAnimationEnabled = true,
  onAttackAnimationEnabledChange = () => undefined,
  reducedMotion: reducedMotionPreference = false,
}: StartScreenProps) {
  const [difficulty, setDifficulty] = useState<Difficulty>('ふつう');
  const [questionCount, setQuestionCount] = useState(10);
  const [marqueePaused, setMarqueePaused] = useState(false);
  const reducedMotion = useReducedMotion();

  const difficultyDescriptions = {
    かんたん: '基本的なタイプの相性のみ（4択）',
    ふつう: '全18タイプの相性問題（4択）',
    むずかしい: '複合タイプも含む（6択）',
  };

  const entrance = {
    hidden: { opacity: 0, y: reducedMotion ? 0 : 14 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 180, damping: 19 },
    },
  };

  return (
    <main className="game-surface min-h-screen overflow-hidden px-5 py-6 text-pop-ink sm:px-8 sm:py-8">
      <motion.div
        className="mx-auto max-w-[1080px]"
        initial={reducedMotion ? false : 'hidden'}
        animate="visible"
        variants={{
          visible: {
            transition: { staggerChildren: reducedMotion ? 0 : 0.09 },
          },
        }}
      >
        <motion.div
          variants={entrance}
          className="mb-7 flex items-center justify-between gap-3 sm:mb-9"
        >
          <div className="flex items-center gap-2.5">
            <span className="flex size-10 items-center justify-center rounded-xl border-2 border-pop-ink bg-pop-yellow shadow-pop-soft">
              <Gamepad2 className="size-6" aria-hidden="true" />
            </span>
            <span className="game-eyebrow">TYPE MATCHUP</span>
          </div>
          <span className="flex gap-1.5" aria-hidden="true">
            {[
              'bg-pop-orange',
              'bg-pop-blue',
              'bg-pop-yellow',
              'bg-pop-green',
            ].map((color) => (
              <span
                key={color}
                className={`size-3 rounded-full border border-pop-ink ${color}`}
              />
            ))}
          </span>
        </motion.div>

        <div className="grid items-center gap-7 lg:grid-cols-[1.12fr_1fr] lg:gap-12">
          <motion.header
            variants={entrance}
            className="relative text-center lg:text-left"
          >
            <span className="mb-4 inline-flex -rotate-3 items-center gap-2 rounded-pill border-2 border-pop-ink bg-pop-green px-4 py-1.5 text-xs font-extrabold shadow-pop-soft">
              <Sparkles className="size-4" aria-hidden="true" />{' '}
              ポケモンマスターへの道
            </span>
            <h1 className="game-logo relative font-display text-[36px] font-black leading-[1.4] tracking-tight sm:text-[52px] lg:text-[56px]">
              ポケモン
              <br />
              タイプ相性クイズ
            </h1>
            <div
              className="mx-auto mb-5 mt-2 flex h-2 w-48 -rotate-2 overflow-hidden rounded-pill lg:ml-0"
              aria-hidden="true"
            >
              <span className="flex-1 bg-pop-orange" />
              <span className="flex-1 bg-pop-blue" />
              <span className="flex-1 bg-pop-yellow" />
              <span className="flex-1 bg-pop-green" />
            </div>
            <p className="mx-auto max-w-[370px] text-balance text-base font-medium leading-relaxed text-muted-foreground lg:ml-0">
              ポケモンのタイプ相性を覚えて、ポケモンマスターを目指そう！
            </p>
            <div className="mt-6" aria-hidden="true">
              <div className="flex items-center justify-center gap-4 lg:justify-start lg:gap-5">
                {heroTypes.map((type, index) => (
                  <div key={type} className="flex items-center gap-4 lg:gap-5">
                    <div
                      className={`${index === 1 ? 'rotate-6' : '-rotate-6'} rounded-[24px] border-2 border-pop-ink bg-white p-2.5 shadow-pop sm:p-3`}
                    >
                      <TypeIcon type={type} size="md" animated={false} />
                    </div>
                    {index < heroTypes.length - 1 && (
                      <ArrowRight className="size-5" />
                    )}
                  </div>
                ))}
              </div>
              <p className="mt-4 flex items-center justify-center gap-2 text-xs font-bold text-muted-foreground lg:justify-start">
                <ArrowRight className="size-4" /> 効果ばつぐん
              </p>
            </div>
          </motion.header>

          <motion.section
            variants={entrance}
            className="game-panel relative"
            aria-label="クイズ設定"
          >
            <div className="mb-6 flex items-center justify-between border-b-2 border-dashed border-pop-ink/15 pb-4">
              <span className="game-eyebrow">READY TO PLAY?</span>
              <Swords className="size-5" aria-hidden="true" />
            </div>
            <div className="space-y-5">
              <div>
                <label
                  htmlFor="difficulty"
                  className="mb-3 flex items-center gap-2.5 text-base font-extrabold"
                >
                  <span
                    className="flex size-7 items-center justify-center rounded-lg bg-pop-green text-xs"
                    aria-hidden="true"
                  >
                    01
                  </span>
                  難易度を選択してください
                </label>
                <Select
                  value={difficulty}
                  onValueChange={(value) => setDifficulty(value as Difficulty)}
                >
                  <SelectTrigger
                    id="difficulty"
                    aria-describedby="difficulty-description"
                    className="game-select"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="game-select-menu">
                    {difficulties.map((value) => (
                      <SelectItem
                        key={value}
                        value={value}
                        className="game-select-option"
                      >
                        {value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p
                  id="difficulty-description"
                  className="mt-3 flex items-center gap-2 text-sm font-medium text-muted-foreground"
                  aria-live="polite"
                >
                  <Check className="size-4 shrink-0" aria-hidden="true" />
                  {difficultyDescriptions[difficulty]}
                </p>
              </div>
              <div>
                <label
                  htmlFor="question-count"
                  className="mb-3 flex items-center gap-2.5 text-base font-extrabold"
                >
                  <span
                    className="flex size-7 items-center justify-center rounded-lg bg-pop-blue text-xs"
                    aria-hidden="true"
                  >
                    02
                  </span>
                  問題数を選択してください
                </label>
                <Select
                  value={questionCount.toString()}
                  onValueChange={(value) => setQuestionCount(parseInt(value))}
                >
                  <SelectTrigger id="question-count" className="game-select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="game-select-menu">
                    {[5, 10, 15, 20].map((value) => (
                      <SelectItem
                        key={value}
                        value={value.toString()}
                        className="game-select-option"
                      >
                        {value}問
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <div className="flex items-center justify-between gap-4 rounded-2xl border-2 border-pop-ink/15 bg-pop-paper px-4 py-3">
                  <label htmlFor="attack-animation" className="min-w-0 cursor-pointer">
                    <span className="flex items-center gap-2.5 text-base font-extrabold">
                      <span
                        className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-pop-yellow text-xs"
                        aria-hidden="true"
                      >
                        03
                      </span>
                      回答後のバトル演出
                    </span>
                    <span id="attack-animation-description" className="mt-1.5 block text-sm font-medium leading-relaxed text-muted-foreground">
                      {reducedMotionPreference
                        ? '端末の「視差効果を減らす」設定により、現在は演出を省略します'
                        : attackAnimationEnabled
                          ? '回答後に攻撃アニメーションを表示します'
                          : '回答後すぐに正解と解説を表示します'}
                    </span>
                  </label>
                  <Switch
                    id="attack-animation"
                    checked={attackAnimationEnabled}
                    onCheckedChange={onAttackAnimationEnabledChange}
                    aria-describedby="attack-animation-description"
                    className="h-7 w-12 border-2 border-pop-ink bg-white data-[state=checked]:bg-pop-green [&_[data-slot=switch-thumb]]:size-5 [&_[data-slot=switch-thumb]]:border [&_[data-slot=switch-thumb]]:border-pop-ink"
                  />
                </div>
              </div>
            </div>
            <Button
              onClick={() => onStart(difficulty, questionCount)}
              variant="pop"
              size="hero"
              className="mt-7 w-full justify-between"
            >
              <Play className="size-5 fill-current" aria-hidden="true" />
              クイズを開始する
              <ArrowRight className="size-5" aria-hidden="true" />
            </Button>
          </motion.section>
        </div>

        <motion.section
          variants={entrance}
          className="mt-8 flex min-w-0 flex-col gap-3 rounded-panel border-2 border-pop-ink/15 bg-white/80 px-4 py-3 sm:flex-row sm:items-center sm:gap-6 sm:px-5"
          aria-label="全18タイプ対応"
        >
          <div className="flex shrink-0 items-center justify-between gap-2 sm:flex-col sm:items-start">
            <h2 className="text-sm font-extrabold">全18タイプ対応</h2>
            <button
              type="button"
              className="flex min-h-[44px] min-w-[44px] items-center justify-center gap-1.5 rounded-xl px-2 text-xs font-bold hover:bg-pop-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-reduce:hidden"
              onClick={() => setMarqueePaused(!marqueePaused)}
              aria-label={
                marqueePaused
                  ? 'タイプ一覧の自動スクロールを再生'
                  : 'タイプ一覧の自動スクロールを一時停止'
              }
              aria-pressed={marqueePaused}
            >
              {marqueePaused ? (
                <Play className="size-3" aria-hidden="true" />
              ) : (
                <Pause className="size-3" aria-hidden="true" />
              )}
              <span aria-hidden="true">
                {marqueePaused ? '再生' : '一時停止'}
              </span>
            </button>
          </div>
          <div
            className="type-marquee min-w-0 overflow-hidden py-2"
            data-paused={marqueePaused}
            tabIndex={0}
            role="region"
            aria-label="タイプ一覧"
          >
            {/* 同じ幅の2セットを半分だけ移動してシームレスに接続する。 */}
            <div className="type-marquee-track">
              {[0, 1].map((copy) => (
                <div
                  key={copy}
                  className={`flex shrink-0 gap-5 pr-5 ${copy === 1 ? 'type-marquee-copy' : ''}`}
                  aria-hidden={copy === 1 ? true : undefined}
                >
                  {POKEMON_TYPES.map((type) => (
                    <TypeIcon
                      key={type}
                      type={type}
                      size="sm"
                      animated={false}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        <motion.section
          variants={entrance}
          className="mt-7 pb-2"
          aria-labelledby="rules-title"
        >
          <h2
            id="rules-title"
            className="mb-4 flex items-center gap-2 text-base font-extrabold"
          >
            <Gamepad2 className="size-5" aria-hidden="true" />
            ルール
          </h2>
          <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {rules.map(({ icon: Icon, color, text }, index) => (
              <li key={text} className="flex items-start gap-3">
                <span
                  className={`relative flex size-10 shrink-0 items-center justify-center rounded-xl border-2 border-pop-ink ${color}`}
                >
                  <Icon className="size-5" aria-hidden="true" />
                  <span
                    className="absolute -right-1.5 -top-2 flex size-4 items-center justify-center rounded-full bg-pop-ink text-[9px] font-bold text-white"
                    aria-hidden="true"
                  >
                    {index + 1}
                  </span>
                </span>
                <p className="pt-0.5 text-sm font-medium leading-relaxed text-muted-foreground">
                  {text}
                </p>
              </li>
            ))}
          </ol>
        </motion.section>
      </motion.div>
    </main>
  );
}

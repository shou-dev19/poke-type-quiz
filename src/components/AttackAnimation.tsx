import { useEffect, useState, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Check, MousePointer2, Shield, ShieldCheck, Sparkles, Star, Swords, X, Zap } from 'lucide-react';
import TypeIcon from './TypeIcon';
import MoveEffect from './MoveEffects';
import { PokemonType, TYPE_COLORS } from '../types/pokemon';

interface AttackAnimationProps {
  attackType: PokemonType;
  defendType: PokemonType | [PokemonType, PokemonType];
  onAnimationComplete: () => void;
  isCorrect: boolean;
  damageMultiplier?: number; // 実際のダメージ倍率
}

// 衝撃の大きさ、ノックバック、ヒットストップを6段階で調整。
function getImpact(multiplier: number) {
  if (multiplier >= 4)
    return {
      scale: 1.65,
      push: 22,
      shake: 9,
      hold: 0.14,
      rays: 8,
      label: 'こうかは ばつぐんだ！',
      fill: 'bg-pop-orange',
    };
  if (multiplier >= 2)
    return {
      scale: 1.35,
      push: 14,
      shake: 5,
      hold: 0.09,
      rays: 6,
      label: 'こうかは ばつぐんだ！',
      fill: 'bg-pop-yellow',
    };
  if (multiplier >= 1)
    return {
      scale: 1,
      push: 8,
      shake: 0,
      hold: 0.04,
      rays: 4,
      label: 'ダメージが とどいた！',
      fill: 'bg-pop-yellow/30',
    };
  if (multiplier >= 0.5)
    return { scale: 0.65, push: 4, shake: 0, hold: 0, rays: 2, label: 'こうかは いまひとつ…', fill: 'bg-pop-blue/15' };
  if (multiplier > 0)
    return { scale: 0.4, push: 2, shake: 0, hold: 0, rays: 0, label: 'こうかは いまひとつ…', fill: 'bg-pop-blue/10' };
  return { scale: 0, push: 0, shake: 0, hold: 0, rays: 0, label: 'こうかが ないようだ…', fill: 'bg-slate-100' };
}

export default function AttackAnimation({
  attackType,
  defendType,
  onAnimationComplete,
  isCorrect,
  damageMultiplier = 1,
}: AttackAnimationProps) {
  const [phase, setPhase] = useState<'preparation' | 'move-effect' | 'result'>('preparation');
  const [hasImpact, setHasImpact] = useState(false);
  const reducedMotion = useReducedMotion();
  const onAnimationCompleteRef = useRef(onAnimationComplete);
  const completedRef = useRef(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    onAnimationCompleteRef.current = onAnimationComplete;
  }, [onAnimationComplete]);

  useEffect(() => {
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    overlayRef.current?.focus();
    // 準備 0–300ms → 飛翔・着弾 300–1450ms → 結果。6秒はマウント基準。
    const timers = [
      setTimeout(() => setPhase('move-effect'), 300),
      setTimeout(() => setHasImpact(true), 1000),
      setTimeout(() => setPhase('result'), 1450),
      setTimeout(() => {
        if (!completedRef.current) {
          completedRef.current = true;
          onAnimationCompleteRef.current();
        }
      }, 6000),
    ];
    return () => {
      timers.forEach(clearTimeout);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, []);

  const showResult = phase === 'result';
  const defendTypes = Array.isArray(defendType) ? defendType : [defendType];
  const impact = getImpact(damageMultiplier);
  const color = TYPE_COLORS[attackType];
  const finish = () => {
    if (showResult && !completedRef.current) {
      completedRef.current = true;
      onAnimationCompleteRef.current();
    }
  };

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label="攻撃アニメーション"
      tabIndex={-1}
      className={`fixed inset-0 z-50 overflow-y-auto bg-pop-paper/95 p-3 text-pop-ink backdrop-blur-xl sm:p-8 ${showResult ? 'cursor-pointer' : 'cursor-default'}`}
      onClick={finish}
      onKeyDown={(event) => {
        if (event.key === 'Tab') {
          event.preventDefault();
          if (showResult) nextRef.current?.focus();
        }
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          finish();
        }
      }}
    >
      <div className="flex min-h-full items-center justify-center">
        <motion.section
          className="relative isolate w-full max-w-[900px] overflow-hidden rounded-panel border-2 border-pop-ink bg-pop-paper shadow-pop-lg"
          initial={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.22 }}
        >
          <div
            className="pointer-events-none absolute inset-0 -z-10"
            style={{ background: `radial-gradient(ellipse at 50% 60%, #FFFCF3 15%, ${color}38 100%)` }}
            aria-hidden="true"
          />
          <div className="flex items-center justify-between border-b-2 border-pop-ink/10 px-5 py-3 sm:px-8">
            <span className="game-eyebrow flex items-center gap-2">
              <Swords className="size-4" aria-hidden="true" />
              TYPE BATTLE
            </span>
            <span
              className="flex items-center gap-1.5"
              aria-label={`フェーズ ${showResult ? 3 : phase === 'move-effect' ? 2 : 1} / 3`}
            >
              {[0, 1, 2].map((step) => (
                <span
                  key={step}
                  className={`h-2 w-6 rounded-pill border border-pop-ink/30 ${step <= (showResult ? 2 : phase === 'move-effect' ? 1 : 0) ? 'bg-pop-ink' : 'bg-white'}`}
                />
              ))}
            </span>
          </div>

          {/* 高さを予約した結果専用エリア。対戦アイコンとは通常フローで分離する。 */}
          <div
            className="relative flex h-[178px] flex-col items-center justify-center px-3 text-center sm:h-[190px]"
            role="status"
            aria-live="polite"
            aria-atomic="true"
          >
            {showResult ? (
              <>
                {isCorrect && !reducedMotion && (
                  <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
                    {Array.from({ length: 8 }, (_, i) => (
                      <motion.div
                        key={i}
                        className="absolute left-1/2 top-12"
                        initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                        animate={{
                          opacity: [0, 1, 1, 0],
                          scale: [0.5, 1, 0.8],
                          x: (i % 2 ? 1 : -1) * (95 + Math.floor(i / 2) * 30),
                          y: [-5, -25 + (i % 3) * 19, 66],
                          rotate: (i % 2 ? 1 : -1) * 110,
                        }}
                        transition={{ duration: 1.2, delay: i * 0.025 }}
                      >
                        {i % 2 ? (
                          <Star className="size-5 fill-pop-yellow text-pop-ink" />
                        ) : (
                          <span
                            className="block h-3 w-2 rounded-sm border border-pop-ink/40"
                            style={{ backgroundColor: [color, '#78C850', '#EE99AC'][i % 3] }}
                          />
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
                <motion.div
                  initial={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.65, y: 8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={reducedMotion ? { duration: 0.2 } : { type: 'spring', stiffness: 420, damping: 16 }}
                  className="relative"
                >
                  <motion.div
                    animate={!isCorrect && !reducedMotion ? { rotate: [0, -5, 4, -2, 0] } : { rotate: 0 }}
                    transition={{ duration: 0.4 }}
                    className={`inline-flex items-center gap-2 rounded-pill border-2 border-pop-ink px-6 py-2 text-3xl font-black shadow-pop sm:px-9 sm:text-4xl ${isCorrect ? 'bg-pop-green' : 'bg-pop-pink'}`}
                  >
                    {isCorrect ? (
                      <Check className="size-8" strokeWidth={3} aria-hidden="true" />
                    ) : (
                      <X className="size-8" strokeWidth={3} aria-hidden="true" />
                    )}
                    {isCorrect ? '正解！' : '不正解'}
                  </motion.div>
                </motion.div>
                <div
                  className={`mt-4 inline-flex items-baseline gap-2 rounded-pill border-2 border-pop-ink px-5 py-1.5 font-extrabold ${impact.fill}`}
                >
                  <span className="text-sm">ダメージ倍率:</span>
                  <span className="text-2xl sm:text-3xl">
                    {damageMultiplier}
                    <span className="ml-1 text-base">倍</span>
                  </span>
                </div>
                <p className="mt-2 text-sm font-bold">{impact.label}</p>
              </>
            ) : (
              <div>
                <span className="mb-3 inline-flex items-center gap-1.5 rounded-pill border border-pop-ink/20 bg-white/80 px-3 py-1 text-xs font-extrabold">
                  <Zap className="size-3.5" aria-hidden="true" />
                  {phase === 'preparation' ? 'パワーをためて…' : '技が はなたれた！'}
                </span>
                <h2 className="text-3xl font-black sm:text-4xl">
                  {attackType}
                  <span className="ml-1 text-lg sm:text-2xl">タイプの攻撃！</span>
                </h2>
                <p className="mt-3 text-sm font-bold text-muted-foreground">タイプの相性を 見てみよう</p>
              </div>
            )}
          </div>

          <motion.div
            className="relative mx-4 mb-3 h-[364px] overflow-hidden rounded-panel border-2 border-pop-ink/15 bg-white/65 sm:mx-8 sm:mb-5 sm:h-[264px]"
            animate={
              hasImpact && !reducedMotion && impact.shake
                ? { x: [0, -impact.shake, impact.shake, -impact.shake / 2, 0], y: [0, 3, -3, 0, 0] }
                : { x: 0, y: 0 }
            }
            transition={{ duration: 0.32, delay: impact.hold }}
          >
            <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-panel" aria-hidden="true">
              <div
                className="absolute inset-0 opacity-60"
                style={{
                  background: `repeating-conic-gradient(from 0deg at 50% 50%, ${color}24 0deg 9deg, transparent 9deg 26deg)`,
                }}
              />
              <div
                className="absolute inset-0"
                style={{ background: 'radial-gradient(ellipse, #FFFFFF00 20%, #FFFCF3 85%)' }}
              />
            </div>
            <div className="relative grid h-full grid-rows-[132px_1fr_132px] justify-items-center sm:grid-cols-[210px_1fr_210px] sm:grid-rows-1 sm:items-center">
              <motion.div
                className="relative row-start-3 flex h-[132px] w-[210px] flex-col items-center justify-center gap-2 sm:col-start-1 sm:row-start-1 sm:h-[208px] sm:gap-3"
                initial={false}
                animate={reducedMotion ? {} : { scale: phase === 'preparation' ? 1.06 : 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 18 }}
              >
                <p className="flex h-5 items-center gap-1.5 text-xs font-extrabold">
                  <Swords className="size-3.5" aria-hidden="true" />
                  攻撃側
                </p>
                <TypeIcon type={attackType} size="lg" animated={false} className="!size-[64px] sm:!size-[84px]" />
                <p className="h-5 text-sm font-extrabold sm:text-base">{attackType}</p>
              </motion.div>
              <div
                className="row-start-2 flex items-center justify-center sm:col-start-2 sm:row-start-1"
                aria-hidden="true"
              >
                <span className="-rotate-6 rounded-xl border-2 border-pop-ink/20 bg-white/90 px-3 py-1 text-xl font-black italic text-pop-ink/50 sm:text-3xl">
                  VS
                </span>
              </div>
              <div className="relative row-start-1 flex h-[132px] w-[210px] flex-col items-center justify-center gap-2 sm:col-start-3 sm:h-[208px] sm:gap-3">
                <p className="flex h-5 items-center gap-1.5 text-xs font-extrabold">
                  <Shield className="size-3.5" aria-hidden="true" />
                  防御側
                </p>
                {/* 回転した座標系で、モバイルのノックバックを上向きに揃える。 */}
                <div className="-rotate-90 sm:rotate-0">
                  <motion.div
                    animate={
                      hasImpact && !reducedMotion
                        ? {
                            x: [0, impact.push, impact.push, 0],
                            scale: [1, damageMultiplier ? 0.92 : 1, damageMultiplier ? 0.92 : 1, 1],
                            opacity: damageMultiplier >= 1 ? [1, 0.45, 1, 1] : 1,
                          }
                        : { x: 0, scale: 1, opacity: 1 }
                    }
                    transition={{
                      duration: 0.4 + impact.hold,
                      times: [0, 0.15, 0.15 + impact.hold / (0.4 + impact.hold), 1],
                    }}
                  >
                    <div className="flex rotate-90 items-center gap-3 sm:rotate-0">
                      {defendTypes.map((type) => (
                        <TypeIcon
                          key={type}
                          type={type}
                          size="lg"
                          animated={false}
                          className="!size-[64px] sm:!size-[84px]"
                        />
                      ))}
                    </div>
                  </motion.div>
                </div>
                <div className="flex h-5 items-center gap-3 text-sm font-extrabold sm:text-base">
                  {defendTypes.map((type) => (
                    <span
                      key={type}
                      className={defendTypes.length > 1 ? 'w-[64px] whitespace-nowrap text-center sm:w-[84px]' : ''}
                    >
                      {type}
                    </span>
                  ))}
                </div>
                {/* 着弾は対戦ステージ内に収め、結果専用エリアには侵入させない。 */}
                {hasImpact && phase !== 'result' && (
                  <div
                    className="pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2"
                    aria-hidden="true"
                  >
                    {damageMultiplier === 0 ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={
                          reducedMotion
                            ? { opacity: [0, 1, 0] }
                            : { opacity: [0, 1, 0], x: [0, -12, -35], rotate: [0, -12, -24] }
                        }
                        transition={{ duration: 0.45 }}
                        className="flex size-20 items-center justify-center rounded-full border-4 border-pop-ink bg-white/90"
                      >
                        <ShieldCheck className="size-12" />
                      </motion.div>
                    ) : (
                      <motion.svg
                        viewBox="0 0 160 160"
                        className="size-[112px] overflow-visible sm:size-[150px]"
                        initial={{ opacity: 0, scale: reducedMotion ? 1 : 0.35 }}
                        animate={
                          reducedMotion
                            ? { opacity: [0, 0.6, 0] }
                            : { scale: [0.35, impact.scale, impact.scale, impact.scale * 1.15], opacity: [0, 1, 1, 0] }
                        }
                        transition={{
                          duration: 0.42 + impact.hold,
                          times: [0, 0.12, 0.12 + impact.hold / (0.42 + impact.hold), 1],
                        }}
                      >
                        <circle
                          cx="80"
                          cy="80"
                          r="48"
                          fill="none"
                          stroke={color}
                          strokeWidth={damageMultiplier >= 2 ? 9 : 4}
                        />
                        <circle cx="80" cy="80" r="35" fill="none" stroke="#FFFFFF" strokeWidth="5" />
                        {Array.from({ length: impact.rays }, (_, i) => (
                          <path
                            key={i}
                            d="M80 12v14"
                            stroke={color}
                            strokeWidth="7"
                            strokeLinecap="round"
                            transform={`rotate(${(i * 360) / impact.rays} 80 80)`}
                          />
                        ))}
                      </motion.svg>
                    )}
                  </div>
                )}
              </div>
            </div>
            {/* 同じ右向き軌道をモバイルでは上向きに回転。端点は両アイコンの中心。 */}
            {phase === 'move-effect' && (
              <div className="pointer-events-none absolute left-1/2 top-1/2 h-[120px] w-[232px] -translate-x-1/2 -translate-y-1/2 -rotate-90 sm:w-[calc(100%-210px)] sm:rotate-0">
                <MoveEffect attackType={attackType} />
              </div>
            )}
          </motion.div>

          <div className="flex min-h-[76px] items-center justify-center px-3 pb-4 sm:min-h-[80px]">
            {showResult ? (
              <button
                ref={nextRef}
                type="button"
                onClick={finish}
                className="inline-flex min-h-[48px] items-center gap-2 rounded-pill border-2 border-pop-ink bg-white px-4 py-2 text-sm font-extrabold shadow-pop-soft outline-offset-4 hover:bg-pop-yellow/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-pop-ink"
              >
                <MousePointer2 className="size-4" aria-hidden="true" />
                <span>
                  <span className="hidden sm:inline">クリックして次に進む</span>
                  <span className="sm:hidden">タップ・クリックして次に進む</span>
                </span>
                <ArrowRight className="size-4" aria-hidden="true" />
              </button>
            ) : (
              <p className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                <Sparkles className="size-4" aria-hidden="true" />
                タイプの力が ぶつかりあう！
              </p>
            )}
          </div>
        </motion.section>
      </div>
    </div>
  );
}

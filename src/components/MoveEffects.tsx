import { motion, useReducedMotion } from 'framer-motion';
import { PokemonType, TYPE_COLORS } from '../types/pokemon';

interface MoveEffectProps {
  attackType: PokemonType;
  className?: string;
}

// 右向きの技を共通の座標系で描く。軌道の回転はステージ側が担当する。
function MoveShape({ type }: { type: PokemonType }) {
  switch (type) {
    case 'ほのお':
      return (
        <>
          <path d="M108 60C108 88 70 108 28 83L8 94 24 66 8 45 41 50 25 17 68 38C90 20 111 36 108 60Z" fill="#F08030" />
          <path d="M92 61C99 80 71 91 46 73L54 59 40 42 75 55 78 40Z" fill="#F8D030" stroke="none" />
          <path d="M88 65Q92 81 69 76L72 63Z" fill="#FFF9DC" stroke="none" />
        </>
      );
    case 'みず':
      return (
        <>
          <path d="M8 77Q29 52 51 65C34 28 79 12 100 39 124 71 94 102 62 92 35 83 25 94 8 90Z" fill="#6890F0" />
          <path
            d="M15 78Q45 64 69 79C94 94 110 53 84 43 70 38 59 50 69 59"
            fill="none"
            stroke="#DDFBFF"
            strokeWidth="8"
          />
          <path d="M25 35Q42 10 43 35C42 49 24 49 25 35Z" fill="#98D8D8" />
        </>
      );
    case 'でんき':
      return (
        <>
          <path d="M7 64 47 17 65 44 96 13 79 53 115 49 70 106 58 75 24 96 41 61Z" fill="#F8D030" />
          <path d="M31 59 47 40 60 61 76 46 68 67 91 61 73 84" stroke="#FFFDF0" strokeWidth="6" fill="none" />
        </>
      );
    case 'くさ':
      return (
        <>
          <path d="M21 85C1 30 55 17 101 17 99 68 77 107 21 85Z" fill="#78C850" />
          <path d="m21 85 65-45m-32 22-3-24m19 12 23 1" fill="none" stroke="#315C31" strokeWidth="4" />
          <path d="M70 95Q83 69 111 79 104 105 70 95Z" fill="#B6E577" />
        </>
      );
    case 'こおり':
      return (
        <>
          <path d="m60 7 17 24 26 14v30L77 90l-17 23-17-23-26-15V45l26-14Z" fill="#DDFBFF" />
          <g fill="none" stroke="#459BAA" strokeWidth="5">
            <path d="M60 17v86M23 39l74 43M23 82l74-43M48 25l12 12 12-12M48 95l12-12 12 12M27 52l16-5-3-17M80 90l-3-17 16-5M27 68l16 5-3 17M80 30l-3 17 16 5" />
          </g>
        </>
      );
    case 'かくとう':
      return (
        <>
          <path
            d="m9 48 25 2-5-30 27 18 21-27 6 32 31 6-24 21 10 32-34-9-22 20-9-29-29 2 18-20Z"
            fill="#F8D030"
            stroke="none"
          />
          <path d="M34 75V43q0-12 12-9 0-16 14-10 8-10 18 0 14-5 17 8l5 31q0 15-17 29H50Z" fill="#C03028" />
          <path d="M48 36v21m14-29v26m16-25v27M36 68q23-17 28 2l-8 9" fill="none" stroke="#FFD7BA" strokeWidth="5" />
        </>
      );
    case 'どく':
      return (
        <>
          <path
            d="M23 77Q4 61 22 44 14 18 41 22 63 3 79 27 110 20 106 48 124 71 98 83 92 103 69 93 37 110 23 77Z"
            fill="#A040A0"
          />
          <circle cx="45" cy="45" r="14" fill="#DE94DC" />
          <circle cx="83" cy="64" r="17" fill="#C869C9" />
          <path d="M39 39q5-5 10-1m28 19q6-6 11 0" fill="none" stroke="white" strokeWidth="5" />
          <circle cx="24" cy="99" r="7" fill="#A040A0" />
        </>
      );
    case 'じめん':
      return (
        <>
          <path d="m9 77 15-26 22 8 15-24 19 13 28-7 6 38-30 23-45-3Z" fill="#E0C068" />
          <path d="m65 37-9 27 22 8-29 27M57 64l-22 8-13-3m55 4 21-9" fill="none" stroke="#795333" strokeWidth="7" />
          <path d="m14 30 12-12 11 16-14 6m61-18 18-9 8 16-16 9" fill="#B18A45" />
        </>
      );
    case 'ひこう':
      return (
        <>
          <path
            d="M10 43h65q29 0 24-19C92 7 73 18 82 28M5 62h86q29 0 19 24c-9 19-32 8-24-6M17 81h38q25 0 14 23"
            fill="none"
            stroke="#A890F0"
            strokeWidth="12"
          />
          <path d="M11 43h65M6 62h84M18 81h37" fill="none" stroke="#F4F0FF" strokeWidth="4" />
        </>
      );
    case 'エスパー':
      return (
        <>
          <g fill="none" stroke="#F85888" strokeWidth="7">
            <ellipse cx="73" cy="60" rx="36" ry="47" />
            <ellipse cx="55" cy="60" rx="25" ry="34" />
            <ellipse cx="37" cy="60" rx="15" ry="21" />
          </g>
          <path d="m73 39 6 15 16 6-16 6-6 15-6-15-16-6 16-6Z" fill="#FFF0F7" stroke="#AD3067" />
        </>
      );
    case 'むし':
      return (
        <>
          <path
            d="M60 60C-5 60 14-6 48 25L60 48C90-10 126 25 85 54 130 71 94 107 65 76 27 122-5 81 45 65Z"
            fill="#DAE884"
          />
          <path d="m30 35 24 23m38-23L70 58M27 83l27-15m38 15L71 67" stroke="#A8B820" strokeWidth="5" />
          <path d="m47 63 17-17 23 17-23 16Z" fill="#A8B820" />
        </>
      );
    case 'いわ':
      return (
        <>
          <path d="m34 20 42-8 31 31-7 43-41 21-40-31Z" fill="#B8A038" />
          <path d="m34 20 23 34 50-11M57 54l2 53M19 76l38-22 43 32" fill="none" stroke="#75632F" strokeWidth="4" />
          <path d="m36 24 23 25 34-9-20-21Z" fill="#E6D586" stroke="none" />
          <path d="m9 94 13-8 9 16-15 7m78-4 13-9 8 11-12 8" fill="#B8A038" />
        </>
      );
    case 'ゴースト':
      return (
        <>
          <path d="M104 56c9 32-22 48-48 38L14 104l13-24L6 69l29-12C20 31 51 12 77 21q29 5 27 35Z" fill="#705898" />
          <path d="M30 78 9 87m19-40L10 39" stroke="#B09BCB" strokeWidth="7" />
          <path d="m57 49 13 6-10 8m29-18-11 9 10 4" fill="#F4EDFF" stroke="#F4EDFF" />
          <path d="m63 77 13-5 9 3" fill="none" stroke="#35254F" strokeWidth="4" />
        </>
      );
    case 'ドラゴン':
      return (
        <>
          <path d="M11 90Q52 93 35 64L17 45l28 4-5-32 29 20 23-27-1 31 24 9-16 35-33 13-15 15Z" fill="#7038F8" />
          <path d="m51 52 20 5 14-16 17 15-14 17-21 4Q51 91 28 88q40-3 23-36Z" fill="#BEA5FF" stroke="none" />
          <path d="m80 54 10 2-7 7" fill="white" />
          <path d="m98 78-14 5" stroke="white" strokeWidth="4" />
        </>
      );
    case 'あく':
      return (
        <>
          <path
            d="M102 10Q75 54 21 77L43 83Q87 60 102 10Zm11 26Q83 80 35 94l22 7q45-23 56-65ZM72 8Q47 41 9 55l16 9Q60 40 72 8Z"
            fill="#443840"
            stroke="#705848"
          />
          <path d="M93 26Q75 55 44 71m59-21Q87 76 57 88" fill="none" stroke="#E8C4D5" strokeWidth="3" />
        </>
      );
    case 'はがね':
      return (
        <>
          <path d="m13 96 35-48 50-35 11 11-35 50-47 35Z" fill="#B8B8D0" />
          <path d="m23 99 39-39 42-41M48 48l26 26" fill="none" stroke="white" strokeWidth="5" />
          <path
            d="m29 8 5 15 16 6-16 5-5 16-6-16-15-5 15-6m70 54 4 11 12 5-12 4-4 12-5-12-11-4 11-5"
            fill="#F8D030"
            stroke="none"
          />
        </>
      );
    case 'フェアリー':
      return (
        <>
          <path d="m65 12 14 28 32 5-23 23 6 32-29-15-29 15 6-32-23-23 32-5Z" fill="#EE99AC" />
          <path d="m65 32 9 20 22 3-16 15 3 15-18-10-18 10 3-15-16-15 22-3Z" fill="#FFF5CE" stroke="none" />
          <path
            d="m19 6 4 11 12 4-12 4-4 12-4-12-11-4 11-4m-1 56 4 10 11 4-11 4-4 10-4-10-10-4 10-4"
            fill="#F8D030"
            stroke="none"
          />
        </>
      );
    case 'ノーマル':
      return (
        <>
          <path d="m60 10 13 26 30-13-13 30 25 13-28 11 9 30-29-15-21 20-5-30-31-3 23-22-14-27 30 8Z" fill="#A8A878" />
          <path d="m63 38 8 16 19 5-17 12-3 19-15-13-19 3 8-18-9-17 20 2Z" fill="#FFF9DC" stroke="none" />
        </>
      );
  }
}

export default function MoveEffect({ attackType, className = '' }: MoveEffectProps) {
  const reducedMotion = useReducedMotion();
  const rotates =
    attackType === 'くさ' || attackType === 'むし' || attackType === 'こおり' || attackType === 'フェアリー';

  return (
    <div className={`pointer-events-none absolute inset-0 ${className}`} aria-hidden="true">
      {/* 少数の残像と主役の形状。固定値のみなので再レンダーでも軌道が変わらない。 */}
      {(reducedMotion ? [0] : [2, 1, 0]).map((index) => (
        <motion.div
          key={index}
          className="absolute inset-0"
          initial={{ opacity: 0, x: reducedMotion ? '55%' : '0%' }}
          animate={reducedMotion ? { opacity: [0, 0.85, 0] } : { x: ['0%', '100%', '100%'], opacity: [0, 1, 1, 0] }}
          transition={
            reducedMotion
              ? { duration: 1 }
              : {
                  duration: 1.05,
                  delay: index * 0.045,
                  x: { duration: 1.05, times: [0, 2 / 3, 1], ease: 'easeInOut' },
                  opacity: { duration: 1.05, times: [0, 0.12, 0.68, 1] },
                }
          }
        >
          <div
            className="absolute left-0 top-1/2 size-[104px] -translate-x-1/2 -translate-y-1/2 sm:size-[144px]"
            style={{ opacity: index === 0 ? 1 : 0.28 }}
          >
            <motion.svg
              viewBox="0 0 120 120"
              className="size-full overflow-visible"
              fill={TYPE_COLORS[attackType]}
              stroke="#26313D"
              strokeWidth="2.5"
              strokeLinejoin="round"
              strokeLinecap="round"
              initial={{ rotate: 0, y: 0, scale: reducedMotion ? 1 : 0.45 * (1 - index * 0.22) }}
              animate={
                reducedMotion
                  ? {}
                  : {
                      rotate: rotates ? [0, 135] : attackType === 'いわ' ? [-30, 20] : 0,
                      y: attackType === 'いわ' ? [0, -48, 0, 0] : 0,
                      scale: [0.45, 1, 1, 0.7].map((value) => value * (1 - index * 0.22)),
                    }
              }
              transition={{ duration: 1.05, times: [0, 0.35, 2 / 3, 1], ease: 'easeOut' }}
            >
              <MoveShape type={attackType} />
            </motion.svg>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

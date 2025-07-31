import { useState, useCallback, useRef, useEffect } from 'react';
import { PokemonType, TYPE_ANIMATIONS } from '@/types/pokemon';

interface AnimationState {
  isPlaying: boolean;
  currentPhase: 'idle' | 'attack' | 'impact' | 'result';
  progress: number;
}

interface UseAnimationControlReturn {
  animationState: AnimationState;
  startAttackAnimation: (attackType: PokemonType, defendType: PokemonType | [PokemonType, PokemonType], isCorrect: boolean, onComplete?: () => void) => void;
  resetAnimation: () => void;
  skipAnimation: () => void;
}

const initialAnimationState: AnimationState = {
  isPlaying: false,
  currentPhase: 'idle',
  progress: 0
};

export function useAnimationControl(): UseAnimationControlReturn {
  const [animationState, setAnimationState] = useState<AnimationState>(initialAnimationState);
  const timeoutRefs = useRef<ReturnType<typeof setTimeout>[]>([]);
  const onCompleteRef = useRef<(() => void) | undefined>();

  // クリーンアップ関数
  const clearTimeouts = useCallback(() => {
    timeoutRefs.current.forEach(timeout => clearTimeout(timeout));
    timeoutRefs.current = [];
  }, []);

  // コンポーネントアンマウント時のクリーンアップ
  useEffect(() => {
    return () => {
      clearTimeouts();
    };
  }, [clearTimeouts]);

  const startAttackAnimation = useCallback((
    attackType: PokemonType,
    defendType: PokemonType | [PokemonType, PokemonType],
    _isCorrect: boolean,
    onComplete?: () => void
  ) => {
    // 既存のタイマーをクリア
    clearTimeouts();
    
    // コールバックを保存
    onCompleteRef.current = onComplete;

    // アニメーション設定を取得
    const attackConfig = TYPE_ANIMATIONS[attackType];
    const defendConfig = Array.isArray(defendType) 
      ? TYPE_ANIMATIONS[defendType[0]] // 複合タイプの場合は最初のタイプの設定を使用
      : TYPE_ANIMATIONS[defendType];

    // アニメーション開始
    setAnimationState({
      isPlaying: true,
      currentPhase: 'attack',
      progress: 0
    });

    // 攻撃フェーズ (攻撃タイプの設定に基づく)
    const attackDuration = attackConfig.duration * 1000;
    const attackTimeout = setTimeout(() => {
      setAnimationState(prev => ({
        ...prev,
        currentPhase: 'impact',
        progress: 33
      }));
    }, attackDuration);
    timeoutRefs.current.push(attackTimeout);

    // インパクトフェーズ (防御タイプの設定に基づく)
    const impactDelay = attackDuration + defendConfig.delay * 1000;
    const impactTimeout = setTimeout(() => {
      setAnimationState(prev => ({
        ...prev,
        currentPhase: 'result',
        progress: 66
      }));
    }, impactDelay);
    timeoutRefs.current.push(impactTimeout);

    // 結果表示フェーズ
    const resultDelay = impactDelay + 800; // 結果表示時間
    const resultTimeout = setTimeout(() => {
      setAnimationState(prev => ({
        ...prev,
        progress: 100
      }));
    }, resultDelay);
    timeoutRefs.current.push(resultTimeout);

    // アニメーション完了
    const completeDelay = resultDelay + 1000; // 完了待機時間
    const completeTimeout = setTimeout(() => {
      setAnimationState(initialAnimationState);
      onCompleteRef.current?.();
      onCompleteRef.current = undefined;
    }, completeDelay);
    timeoutRefs.current.push(completeTimeout);

  }, [clearTimeouts]);

  const resetAnimation = useCallback(() => {
    clearTimeouts();
    setAnimationState(initialAnimationState);
    onCompleteRef.current = undefined;
  }, [clearTimeouts]);

  const skipAnimation = useCallback(() => {
    clearTimeouts();
    setAnimationState(initialAnimationState);
    // スキップ時もコールバックを実行
    onCompleteRef.current?.();
    onCompleteRef.current = undefined;
  }, [clearTimeouts]);

  return {
    animationState,
    startAttackAnimation,
    resetAnimation,
    skipAnimation
  };
}

// タイプ別のアニメーション効果を管理するフック
export function useTypeAnimation(type: PokemonType) {
  const config = TYPE_ANIMATIONS[type];
  
  return {
    duration: config.duration,
    delay: config.delay,
    effect: config.effect,
    color: config.color,
    intensity: config.intensity,
    cssClasses: {
      base: 'transition-all',
      duration: config.duration <= 0.3 ? 'duration-300' :
               config.duration <= 0.6 ? 'duration-500' :
               config.duration <= 0.9 ? 'duration-700' : 'duration-1000',
      effect: {
        'pulse': 'animate-pulse',
        'bounce': 'animate-bounce',
        'ping': 'animate-ping',
        'spin': 'animate-spin',
        'shake': 'animate-bounce'
      }[config.effect],
      intensity: config.intensity === 'high' ? 'hover:scale-125' :
                config.intensity === 'medium' ? 'hover:scale-110' : 'hover:scale-105'
    }
  };
}

// 画面遷移アニメーション管理フック
export function useScreenTransition() {
  const [isTransitioning, setIsTransitioning] = useState(false);

  const transitionTo = useCallback((callback: () => void, duration = 300) => {
    setIsTransitioning(true);
    
    setTimeout(() => {
      callback();
      setTimeout(() => {
        setIsTransitioning(false);
      }, duration);
    }, duration);
  }, []);

  return {
    isTransitioning,
    transitionTo
  };
}
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import App from '../App';
import type { DamageMultiplier, Difficulty, QuizState } from '../types/pokemon';

const { reducedMotionState } = vi.hoisted(() => ({
  reducedMotionState: { current: false },
}));

vi.mock('framer-motion', () => ({
  useReducedMotion: () => reducedMotionState.current,
}));

vi.mock('../utils/quizLogic', () => ({
  generateQuestions: () => [
    { attackType: 'ほのお', defendType: 'くさ', correctAnswer: 2 },
  ],
}));

vi.mock('../components/StartScreen', () => ({
  default: ({
    onStart,
    attackAnimationEnabled,
    onAttackAnimationEnabledChange,
  }: {
    onStart: (difficulty: Difficulty, questionCount: number) => void;
    attackAnimationEnabled: boolean;
    onAttackAnimationEnabledChange: (enabled: boolean) => void;
  }) => (
    <div>
      <span data-testid="saved-preference">{String(attackAnimationEnabled)}</span>
      <button onClick={() => onAttackAnimationEnabledChange(!attackAnimationEnabled)}>演出を切り替える</button>
      <button onClick={() => onStart('ふつう', 1)}>開始</button>
    </div>
  ),
}));

vi.mock('../components/QuizScreen', () => ({
  default: ({
    quizState,
    onAnswer,
    onAnimationComplete,
  }: {
    quizState: QuizState;
    onAnswer: (answer: DamageMultiplier) => void;
    onAnimationComplete: () => void;
  }) => (
    <div>
      <span data-testid="quiz-state">
        {quizState.isAnimating ? 'animating' : quizState.showResult ? 'result' : 'question'}
      </span>
      <button onClick={() => onAnswer(2)}>回答</button>
      <button onClick={onAnimationComplete}>演出完了</button>
    </div>
  ),
}));

vi.mock('../components/ResultScreen', () => ({
  default: () => <div>結果画面</div>,
}));

describe('App animation preference', () => {
  beforeEach(() => {
    window.localStorage.clear();
    reducedMotionState.current = false;
  });

  it('plays the attack animation by default', () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: '開始' }));
    fireEvent.click(screen.getByRole('button', { name: '回答' }));

    expect(screen.getByTestId('quiz-state')).toHaveTextContent('animating');
  });

  it('shows the result immediately and saves the preference when animation is disabled', () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: '演出を切り替える' }));
    expect(window.localStorage.getItem('poke-type-quiz:attack-animation')).toBe('false');

    fireEvent.click(screen.getByRole('button', { name: '開始' }));
    fireEvent.click(screen.getByRole('button', { name: '回答' }));

    expect(screen.getByTestId('quiz-state')).toHaveTextContent('result');
  });

  it('restores a saved preference', () => {
    window.localStorage.setItem('poke-type-quiz:attack-animation', 'false');

    render(<App />);

    expect(screen.getByTestId('saved-preference')).toHaveTextContent('false');
  });

  it('skips the animation when reduced motion is enabled by the device', () => {
    reducedMotionState.current = true;
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: '開始' }));
    fireEvent.click(screen.getByRole('button', { name: '回答' }));

    expect(screen.getByTestId('quiz-state')).toHaveTextContent('result');
  });
});

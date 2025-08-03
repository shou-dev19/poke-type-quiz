import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import QuizScreen from '../QuizScreen';
import type { QuizState } from '../../types/pokemon';

// Mock child components
vi.mock('../TypeIcon', () => ({
  default: ({ type }: { type: string }) => (
    <div data-testid={`type-icon-${type}`}>{type}</div>
  ),
}));

vi.mock('../AttackAnimation', () => ({
  default: ({ 
    attackType, 
    defendType, 
    onAnimationComplete, 
    isCorrect 
  }: {
    attackType: string;
    defendType: string | string[];
    onAnimationComplete: () => void;
    isCorrect: boolean;
  }) => (
    <div data-testid="attack-animation">
      <div data-testid={`attack-type-${attackType}`}>{attackType}</div>
      <div data-testid={`defend-type-${Array.isArray(defendType) ? defendType.join('-') : defendType}`}>
        {Array.isArray(defendType) ? defendType.join('・') : defendType}
      </div>
      <button 
        onClick={onAnimationComplete} 
        data-testid="animation-complete-button"
      >
        Complete Animation
      </button>
      <div data-testid={`animation-result-${isCorrect ? 'correct' : 'incorrect'}`}>
        {isCorrect ? 'Correct' : 'Incorrect'}
      </div>
    </div>
  ),
}));

describe('QuizScreen', () => {
  const mockQuizState: QuizState = {
    questions: [
      { attackType: 'ほのお', defendType: 'くさ', correctAnswer: 2 },
      { attackType: 'みず', defendType: ['ほのお', 'いわ'], correctAnswer: 4 },
      { attackType: 'でんき', defendType: 'ひこう', correctAnswer: 2 },
    ],
    currentQuestion: 0,
    totalQuestions: 3,
    score: 0,
    difficulty: 'ふつう',
    selectedAnswer: null,
    showResult: false,
    isAnimating: false,
  };

  const mockOnAnswer = vi.fn();
  const mockOnNext = vi.fn();
  const mockOnQuit = vi.fn();
  const mockOnAnimationComplete = vi.fn();

  beforeEach(() => {
    mockOnAnswer.mockClear();
    mockOnNext.mockClear();
    mockOnQuit.mockClear();
    mockOnAnimationComplete.mockClear();
  });

  it('should render first question correctly', () => {
    render(
      <QuizScreen 
        quizState={mockQuizState} 
        onAnswer={mockOnAnswer}
        onNext={mockOnNext}
        onQuit={mockOnQuit}
        onAnimationComplete={mockOnAnimationComplete}
      />
    );
    
    expect(screen.getByText('問題 1 / 3')).toBeInTheDocument();
    expect(screen.getByTestId('type-icon-ほのお')).toBeInTheDocument();
    expect(screen.getByTestId('type-icon-くさ')).toBeInTheDocument();
  });

  it('should display answer choices for normal difficulty', () => {
    render(
      <QuizScreen 
        quizState={mockQuizState} 
        onAnswer={mockOnAnswer}
        onNext={mockOnNext}
        onQuit={mockOnQuit}
        onAnimationComplete={mockOnAnimationComplete}
      />
    );
    
    expect(screen.getByText('こうかばつぐん(2倍)')).toBeInTheDocument();
    expect(screen.getByText('ふつう(1倍)')).toBeInTheDocument();
    expect(screen.getByText('こうかいまひとつ(0.5倍)')).toBeInTheDocument();
    expect(screen.getByText('こうかなし(0倍)')).toBeInTheDocument();
  });

  it('should call onAnswer when answer is selected', () => {
    render(
      <QuizScreen 
        quizState={mockQuizState} 
        onAnswer={mockOnAnswer}
        onNext={mockOnNext}
        onQuit={mockOnQuit}
        onAnimationComplete={mockOnAnimationComplete}
      />
    );
    
    const correctAnswer = screen.getByText('こうかばつぐん(2倍)');
    fireEvent.click(correctAnswer);
    
    expect(mockOnAnswer).toHaveBeenCalledWith(2);
  });

  it('should show attack animation when answer is selected', () => {
    const stateWithAnswer: QuizState = {
      ...mockQuizState,
      selectedAnswer: 2,
      isAnimating: true,
    };

    render(
      <QuizScreen 
        quizState={stateWithAnswer} 
        onAnswer={mockOnAnswer}
        onNext={mockOnNext}
        onQuit={mockOnQuit}
        onAnimationComplete={mockOnAnimationComplete}
      />
    );
    
    expect(screen.getByTestId('attack-animation')).toBeInTheDocument();
    expect(screen.getByTestId('attack-type-ほのお')).toBeInTheDocument();
    expect(screen.getByTestId('defend-type-くさ')).toBeInTheDocument();
  });

  it('should handle dual type questions correctly', () => {
    const stateWithDualType = {
      ...mockQuizState,
      currentQuestion: 1, // Second question with dual type
    };

    render(
      <QuizScreen 
        quizState={stateWithDualType} 
        onAnswer={mockOnAnswer}
        onNext={mockOnNext}
        onQuit={mockOnQuit}
        onAnimationComplete={mockOnAnimationComplete}
      />
    );
    
    expect(screen.getByText('問題 2 / 3')).toBeInTheDocument();
    expect(screen.getByTestId('type-icon-みず')).toBeInTheDocument();
    // Check that dual type is rendered correctly
    expect(screen.getByTestId('type-icon-ほのお')).toBeInTheDocument();
    expect(screen.getByTestId('type-icon-いわ')).toBeInTheDocument();
  });

  it('should show quit dialog when quit button is clicked', () => {
    render(
      <QuizScreen 
        quizState={mockQuizState} 
        onAnswer={mockOnAnswer}
        onNext={mockOnNext}
        onQuit={mockOnQuit}
        onAnimationComplete={mockOnAnimationComplete}
      />
    );
    
    const quitButton = screen.getByText('中断');
    fireEvent.click(quitButton);
    
    expect(screen.getByText('クイズを中断しますか？')).toBeInTheDocument();
  });

  it('should display progress correctly', () => {
    const stateWithProgress = {
      ...mockQuizState,
      currentQuestion: 1, // Second question
    };

    render(
      <QuizScreen 
        quizState={stateWithProgress} 
        onAnswer={mockOnAnswer}
        onNext={mockOnNext}
        onQuit={mockOnQuit}
        onAnimationComplete={mockOnAnimationComplete}
      />
    );
    
    expect(screen.getByText('問題 2 / 3')).toBeInTheDocument();
  });

  it('should call onAnimationComplete when animation completes', () => {
    const stateWithAnimation: QuizState = {
      ...mockQuizState,
      selectedAnswer: 2,
      isAnimating: true,
    };

    render(
      <QuizScreen 
        quizState={stateWithAnimation} 
        onAnswer={mockOnAnswer}
        onNext={mockOnNext}
        onQuit={mockOnQuit}
        onAnimationComplete={mockOnAnimationComplete}
      />
    );
    
    const completeButton = screen.getByTestId('animation-complete-button');
    fireEvent.click(completeButton);
    
    expect(mockOnAnimationComplete).toHaveBeenCalled();
  });
});
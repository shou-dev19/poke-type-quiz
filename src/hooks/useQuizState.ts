import { useState, useCallback } from 'react';
import { QuizState, Difficulty, DamageMultiplier } from '@/types/pokemon';
import { generateQuestions } from '@/utils/quizLogic';

interface UseQuizStateReturn {
  quizState: QuizState;
  startQuiz: (difficulty: Difficulty, questionCount: number) => void;
  answerQuestion: (answer: DamageMultiplier) => void;
  nextQuestion: () => void;
  resetQuiz: () => void;
  restartQuiz: () => void;
  quitQuiz: () => void;
  completeAnimation: () => void;
}

const initialQuizState: QuizState = {
  currentQuestion: 0,
  totalQuestions: 10,
  score: 0,
  difficulty: 'ふつう',
  questions: [],
  showResult: false,
  selectedAnswer: null,
  isAnimating: false
};

export function useQuizState(): UseQuizStateReturn {
  const [quizState, setQuizState] = useState<QuizState>(initialQuizState);

  const startQuiz = useCallback((difficulty: Difficulty, questionCount: number) => {
    const questions = generateQuestions(difficulty, questionCount);
    
    setQuizState({
      currentQuestion: 0,
      totalQuestions: questionCount,
      score: 0,
      difficulty,
      questions,
      showResult: false,
      selectedAnswer: null,
      isAnimating: false
    });
  }, []);

  const answerQuestion = useCallback((answer: DamageMultiplier) => {
    setQuizState(prev => {
      if (prev.selectedAnswer !== null || prev.isAnimating) {
        return prev; // 既に回答済みまたはアニメーション中の場合は何もしない
      }

      const currentQuestion = prev.questions[prev.currentQuestion];
      const isCorrect = answer === currentQuestion.correctAnswer;
      
      return {
        ...prev,
        selectedAnswer: answer,
        isAnimating: true,
        score: isCorrect ? prev.score + 1 : prev.score
      };
    });
  }, []);

  const nextQuestion = useCallback(() => {
    setQuizState(prev => {
      const nextQuestionIndex = prev.currentQuestion + 1;
      
      if (nextQuestionIndex >= prev.totalQuestions) {
        // クイズ終了 - 結果画面へ
        return {
          ...prev,
          showResult: true,
          isAnimating: false
        };
      } else {
        // 次の問題へ
        return {
          ...prev,
          currentQuestion: nextQuestionIndex,
          selectedAnswer: null,
          isAnimating: false
        };
      }
    });
  }, []);

  const resetQuiz = useCallback(() => {
    setQuizState(initialQuizState);
  }, []);

  const restartQuiz = useCallback(() => {
    setQuizState(prev => {
      const questions = generateQuestions(prev.difficulty, prev.totalQuestions);
      
      return {
        ...prev,
        currentQuestion: 0,
        score: 0,
        questions,
        showResult: false,
        selectedAnswer: null,
        isAnimating: false
      };
    });
  }, []);

  const quitQuiz = useCallback(() => {
    setQuizState(initialQuizState);
  }, []);

  const completeAnimation = useCallback(() => {
    setQuizState(prev => ({
      ...prev,
      isAnimating: false
    }));
  }, []);

  return {
    quizState,
    startQuiz,
    answerQuestion,
    nextQuestion,
    resetQuiz,
    restartQuiz,
    quitQuiz,
    completeAnimation
  };
}
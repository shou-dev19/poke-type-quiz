import { useState } from 'react';
import StartScreen from './components/StartScreen';
import QuizScreen from './components/QuizScreen';
import ResultScreen from './components/ResultScreen';
import { QuizState, Difficulty, DamageMultiplier } from './types/pokemon';
import { generateQuestions } from './utils/quizLogic';

type AppState = 'start' | 'quiz' | 'result';

export default function App() {
  const [appState, setAppState] = useState<AppState>('start');
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestion: 0,
    totalQuestions: 10,
    score: 0,
    difficulty: 'ふつう',
    questions: [],
    showResult: false,
    selectedAnswer: null,
    isAnimating: false
  });

  const handleStart = (difficulty: Difficulty, questionCount: number) => {
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
    setAppState('quiz');
  };

  const handleAnswer = (answer: DamageMultiplier) => {
    const currentQuestion = quizState.questions[quizState.currentQuestion];
    const isCorrect = answer === currentQuestion.correctAnswer;
    
    setQuizState(prev => ({
      ...prev,
      selectedAnswer: answer,
      isAnimating: true,
      score: isCorrect ? prev.score + 1 : prev.score
    }));
  };

  const handleNext = () => {
    const nextQuestionIndex = quizState.currentQuestion + 1;
    
    if (nextQuestionIndex >= quizState.totalQuestions) {
      // クイズ終了
      setAppState('result');
    } else {
      // 次の問題へ
      setQuizState(prev => ({
        ...prev,
        currentQuestion: nextQuestionIndex,
        showResult: false,
        selectedAnswer: null,
        isAnimating: false
      }));
    }
  };

  const handleQuit = () => {
    setAppState('start');
  };

  const handleRestart = () => {
    const questions = generateQuestions(quizState.difficulty, quizState.totalQuestions);
    setQuizState(prev => ({
      ...prev,
      currentQuestion: 0,
      score: 0,
      questions,
      showResult: false,
      selectedAnswer: null,
      isAnimating: false
    }));
    setAppState('quiz');
  };

  const handleBackToMenu = () => {
    setAppState('start');
  };

  // アニメーション完了時の処理
  const handleAnimationComplete = () => {
    console.log('App handleAnimationComplete called');
    setQuizState(prev => ({
      ...prev,
      showResult: true,
      isAnimating: false
    }));
  };

  return (
    <div className="min-h-screen">
      {appState === 'start' && (
        <StartScreen onStart={handleStart} />
      )}
      
      {appState === 'quiz' && (
        <QuizScreen 
          quizState={quizState}
          onAnswer={handleAnswer}
          onNext={handleNext}
          onQuit={handleQuit}
          onAnimationComplete={handleAnimationComplete}
        />
      )}
      
      {appState === 'result' && (
        <ResultScreen 
          quizState={quizState}
          onRestart={handleRestart}
          onBackToMenu={handleBackToMenu}
        />
      )}
    </div>
  );
}
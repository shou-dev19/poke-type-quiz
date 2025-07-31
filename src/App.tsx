import { useState } from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import StartScreen from '@/components/screens/StartScreen';
import QuizScreen from '@/components/screens/QuizScreen';
import ResultScreen from '@/components/screens/ResultScreen';
import { useQuizState } from '@/hooks/useQuizState';
import { Difficulty, DamageMultiplier } from '@/types/pokemon';

type AppState = 'start' | 'quiz' | 'result';

export default function App() {
  const [appState, setAppState] = useState<AppState>('start');
  const {
    quizState,
    startQuiz,
    answerQuestion,
    nextQuestion,
    resetQuiz,
    restartQuiz,
    quitQuiz
  } = useQuizState();

  const handleStart = (difficulty: Difficulty, questionCount: number) => {
    startQuiz(difficulty, questionCount);
    setAppState('quiz');
  };

  const handleAnswer = (answer: DamageMultiplier) => {
    answerQuestion(answer);
  };

  const handleNext = () => {
    const nextQuestionIndex = quizState.currentQuestion + 1;
    
    if (nextQuestionIndex >= quizState.totalQuestions) {
      // クイズ終了
      setAppState('result');
    } else {
      // 次の問題へ
      nextQuestion();
    }
  };

  const handleQuit = () => {
    quitQuiz();
    setAppState('start');
  };

  const handleRestart = () => {
    restartQuiz();
    setAppState('quiz');
  };

  const handleBackToMenu = () => {
    resetQuiz();
    setAppState('start');
  };


  return (
    <ErrorBoundary>
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
    </ErrorBoundary>
  );
}
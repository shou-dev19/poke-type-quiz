// import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
// import { Badge } from './ui/badge';
import { QuizState } from '../types/pokemon';

interface ResultScreenProps {
  quizState: QuizState;
  onRestart: () => void;
  onBackToMenu: () => void;
}

export default function ResultScreen({ quizState, onRestart, onBackToMenu }: ResultScreenProps) {
  const scorePercentage = Math.round((quizState.score / quizState.totalQuestions) * 100);
  
  const getScoreGrade = (percentage: number) => {
    if (percentage >= 90) return { grade: 'S', color: 'bg-yellow-500', message: 'ポケモンマスター！' };
    if (percentage >= 80) return { grade: 'A', color: 'bg-green-500', message: 'すばらしい！' };
    if (percentage >= 70) return { grade: 'B', color: 'bg-blue-500', message: 'よくできました' };
    if (percentage >= 60) return { grade: 'C', color: 'bg-orange-500', message: 'もう少し！' };
    return { grade: 'D', color: 'bg-red-500', message: 'がんばろう！' };
  };

  const { grade, color, message } = getScoreGrade(scorePercentage);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-3 sm:p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center p-4 sm:p-6">
          <CardTitle className="text-2xl sm:text-3xl lg:text-4xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            クイズ結果
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6 sm:space-y-8 p-4 sm:p-6">
          {/* スコア表示 */}
          <div className="text-center space-y-3 sm:space-y-4">
            <div className={`w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 mx-auto rounded-full ${color} flex items-center justify-center text-white text-4xl sm:text-5xl lg:text-6xl font-bold`}>
              {grade}
            </div>
            <div className="text-xl sm:text-2xl lg:text-3xl">{message}</div>
            <div className="text-base sm:text-lg lg:text-xl text-muted-foreground">
              {quizState.score} / {quizState.totalQuestions} 問正解
            </div>
            <div className="text-lg sm:text-xl lg:text-2xl">
              正答率: {scorePercentage}%
            </div>
          </div>

          {/* 難易度と詳細 */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            <Card>
              <CardContent className="text-center p-3 sm:p-4">
                <div className="text-lg sm:text-xl lg:text-2xl">{quizState.difficulty}</div>
                <div className="text-xs sm:text-sm text-muted-foreground">難易度</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="text-center p-3 sm:p-4">
                <div className="text-lg sm:text-xl lg:text-2xl">{quizState.totalQuestions}</div>
                <div className="text-xs sm:text-sm text-muted-foreground">総問題数</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="text-center p-3 sm:p-4">
                <div className="text-lg sm:text-xl lg:text-2xl">{quizState.totalQuestions - quizState.score}</div>
                <div className="text-xs sm:text-sm text-muted-foreground">間違い</div>
              </CardContent>
            </Card>
          </div>

          {/* 評価メッセージ */}
          <div className="bg-muted p-4 sm:p-6 rounded-lg text-center">
            {scorePercentage >= 90 && (
              <div>
                <h3 className="text-sm sm:text-base">🏆 ポケモンマスターレベル！</h3>
                <p className="text-xs sm:text-sm mt-2">完璧な知識です！あなたはもうポケモンバトルのエキスパートですね。</p>
              </div>
            )}
            {scorePercentage >= 80 && scorePercentage < 90 && (
              <div>
                <h3 className="text-sm sm:text-base">⭐ エクセレント！</h3>
                <p className="text-xs sm:text-sm mt-2">とても良い成績です！もう少しでマスターレベルに到達できます。</p>
              </div>
            )}
            {scorePercentage >= 70 && scorePercentage < 80 && (
              <div>
                <h3 className="text-sm sm:text-base">👍 グッド！</h3>
                <p className="text-xs sm:text-sm mt-2">良い成績です！復習を重ねてさらに上を目指しましょう。</p>
              </div>
            )}
            {scorePercentage >= 60 && scorePercentage < 70 && (
              <div>
                <h3 className="text-sm sm:text-base">📚 もう少し！</h3>
                <p className="text-xs sm:text-sm mt-2">基本は理解できています。練習を続けて知識を深めましょう。</p>
              </div>
            )}
            {scorePercentage < 60 && (
              <div>
                <h3 className="text-sm sm:text-base">💪 ファイト！</h3>
                <p className="text-xs sm:text-sm mt-2">タイプ相性を覚えるのは大変ですが、諦めずに挑戦し続けましょう！</p>
              </div>
            )}
          </div>

          {/* ボタン */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Button 
              onClick={onRestart}
              className="flex-1 text-sm sm:text-base py-3 sm:py-4"
              size="lg"
            >
              同じ設定でもう一度
            </Button>
            <Button 
              onClick={onBackToMenu}
              variant="outline"
              className="flex-1 text-sm sm:text-base py-3 sm:py-4"
              size="lg"
            >
              メニューに戻る
            </Button>
          </div>

          {/* 次のステップ提案 */}
          <div className="text-center text-xs sm:text-sm text-muted-foreground">
            <p>💡 ヒント: 異なる難易度でも挑戦してみましょう！</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
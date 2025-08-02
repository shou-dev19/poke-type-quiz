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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-3 sm:p-4">
      <Card className="w-full max-w-3xl shadow-2xl border-2 border-blue-200/50 bg-white/95 backdrop-blur-sm">
        <CardHeader className="text-center p-6 sm:p-8 bg-gradient-to-br from-blue-50 to-purple-50 rounded-t-lg">
          <CardTitle className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            🎯 クイズ結果
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6 sm:space-y-8 p-4 sm:p-6">
          {/* スコア表示 */}
          <div className="text-center space-y-3 sm:space-y-4">
            <div className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              {message}
            </div>
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
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { QuizState } from '@/types/pokemon';
import { calculateScore, getGradeInfo } from '@/utils/quizLogic';

interface ResultScreenProps {
  quizState: QuizState;
  onRestart: () => void;
  onBackToMenu: () => void;
}

export default function ResultScreen({ quizState, onRestart, onBackToMenu }: ResultScreenProps) {
  const scorePercentage = Math.round((quizState.score / quizState.totalQuestions) * 100);
  const finalScore = calculateScore(quizState.score, quizState.totalQuestions, quizState.difficulty);
  const { grade, color, message } = getGradeInfo(scorePercentage);
  
  // 結果詳細の分析
  const incorrectAnswers = quizState.totalQuestions - quizState.score;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-blue-800 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-2xl"
      >
        <Card>
          <CardHeader className="text-center">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <CardTitle className="text-4xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                🎉 クイズ結果
              </CardTitle>
            </motion.div>
          </CardHeader>
        
        <CardContent className="space-y-8">
          {/* スコア表示 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center space-y-4"
          >
            <motion.div
              initial={{ rotate: -180, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.6, type: "spring" }}
              className={`w-32 h-32 mx-auto rounded-full flex items-center justify-center text-white text-6xl font-bold shadow-2xl ${color.replace('text-', 'bg-')}`}
            >
              {grade}
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.0 }}
              className="text-3xl font-bold"
            >
              {message}
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.2 }}
              className="space-y-2"
            >
              <div className="text-xl text-muted-foreground">
                {quizState.score} / {quizState.totalQuestions} 問正解
              </div>
              <div className="text-2xl font-semibold">
                正答率: {scorePercentage}%
              </div>
              <div className="text-lg text-blue-600 font-medium">
                最終スコア: {finalScore}点
              </div>
            </motion.div>
          </motion.div>

          {/* 詳細統計 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="text-center p-4">
                <div className="text-2xl font-bold text-blue-600">{quizState.difficulty}</div>
                <div className="text-sm text-muted-foreground">難易度</div>
              </CardContent>
            </Card>
            
            <Card className="bg-green-50 border-green-200">
              <CardContent className="text-center p-4">
                <div className="text-2xl font-bold text-green-600">{quizState.score}</div>
                <div className="text-sm text-muted-foreground">正解数</div>
              </CardContent>
            </Card>
            
            <Card className="bg-red-50 border-red-200">
              <CardContent className="text-center p-4">
                <div className="text-2xl font-bold text-red-600">{incorrectAnswers}</div>
                <div className="text-sm text-muted-foreground">間違い</div>
              </CardContent>
            </Card>

            <Card className="bg-purple-50 border-purple-200">
              <CardContent className="text-center p-4">
                <div className="text-2xl font-bold text-purple-600">{finalScore}</div>
                <div className="text-sm text-muted-foreground">最終スコア</div>
              </CardContent>
            </Card>
          </motion.div>

          {/* 進行率バー */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.8, delay: 1.6 }}
            className="space-y-2"
          >
            <div className="flex justify-between text-sm">
              <span>正答率</span>
              <span>{scorePercentage}%</span>
            </div>
            <Progress value={scorePercentage} className="h-3" />
          </motion.div>

          {/* 評価メッセージ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.8 }}
            className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 p-6 rounded-lg text-center"
          >
            {scorePercentage >= 90 && (
              <div>
                <h3 className="text-xl font-bold text-yellow-600 mb-2">🏆 ポケモンマスターレベル！</h3>
                <p className="text-sm">完璧な知識です！あなたはもうポケモンバトルのエキスパートですね。</p>
              </div>
            )}
            {scorePercentage >= 80 && scorePercentage < 90 && (
              <div>
                <h3 className="text-xl font-bold text-green-600 mb-2">⭐ エクセレント！</h3>
                <p className="text-sm">とても良い成績です！もう少しでマスターレベルに到達できます。</p>
              </div>
            )}
            {scorePercentage >= 70 && scorePercentage < 80 && (
              <div>
                <h3 className="text-xl font-bold text-blue-600 mb-2">👍 グッド！</h3>
                <p className="text-sm">良い成績です！復習を重ねてさらに上を目指しましょう。</p>
              </div>
            )}
            {scorePercentage >= 60 && scorePercentage < 70 && (
              <div>
                <h3 className="text-xl font-bold text-orange-600 mb-2">📚 もう少し！</h3>
                <p className="text-sm">基本は理解できています。練習を続けて知識を深めましょう。</p>
              </div>
            )}
            {scorePercentage < 60 && (
              <div>
                <h3 className="text-xl font-bold text-red-600 mb-2">💪 ファイト！</h3>
                <p className="text-sm">タイプ相性を覚えるのは大変ですが、諦めずに挑戦し続けましょう！</p>
              </div>
            )}
          </motion.div>

          {/* ボタン */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 2.0 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Button 
              onClick={onRestart}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              size="lg"
            >
              🔄 同じ設定でもう一度
            </Button>
            <Button 
              onClick={onBackToMenu}
              variant="outline"
              className="flex-1 border-blue-300 text-blue-700 hover:bg-blue-50"
              size="lg"
            >
              🏠 メニューに戻る
            </Button>
          </motion.div>

          {/* 次のステップ提案 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 2.2 }}
            className="text-center text-sm text-muted-foreground space-y-2"
          >
            <p>💡 ヒント: 異なる難易度でも挑戦してみましょう！</p>
            {scorePercentage >= 80 && quizState.difficulty !== 'むずかしい' && (
              <p className="text-blue-600 font-medium">
                🌟 素晴らしい成績です！「むずかしい」レベルに挑戦してみませんか？
              </p>
            )}
            {scorePercentage < 60 && quizState.difficulty !== 'かんたん' && (
              <p className="text-green-600 font-medium">
                📖 「かんたん」レベルで基本を固めることをおすすめします
              </p>
            )}
          </motion.div>
        </CardContent>
      </Card>
      </motion.div>
    </div>
  );
}
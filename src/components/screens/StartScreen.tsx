import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Difficulty, DIFFICULTY_CONFIG } from '@/types/pokemon';
import TypeIcon from '@/components/game/TypeIcon';

interface StartScreenProps {
  onStart: (difficulty: Difficulty, questionCount: number) => void;
}

export default function StartScreen({ onStart }: StartScreenProps) {
  const [difficulty, setDifficulty] = useState<Difficulty>('ふつう');
  const [questionCount, setQuestionCount] = useState(10);

  const getDifficultyDescription = (difficulty: Difficulty) => {
    const config = DIFFICULTY_CONFIG[difficulty];
    const typeCount = config.types.length;
    const choiceText = `${config.choices}択`;
    const dualTypeText = config.dualTypes ? '複合タイプも含む' : '';
    const timeLimitText = config.timeLimit ? `制限時間${config.timeLimit}秒` : '';
    
    const parts = [
      typeCount === 6 ? '基本6タイプ' : `全${typeCount}タイプ`,
      choiceText,
      dualTypeText,
      timeLimitText
    ].filter(Boolean);
    
    return `${parts.join('・')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-blue-800 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl"
      >
        <Card>
          <CardHeader className="text-center">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <CardTitle className="text-4xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ポケモンタイプ相性クイズ
              </CardTitle>
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-muted-foreground mt-4"
            >
              ポケモンのタイプ相性を覚えて、バトルマスターを目指そう！
            </motion.p>
          </CardHeader>
        
        <CardContent className="space-y-8">
          {/* タイプアイコンデモンストレーション */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="grid grid-cols-6 gap-4 justify-items-center"
          >
            {['ほのお', 'みず', 'くさ', 'でんき', 'かくとう', 'エスパー'].map((type, index) => (
              <motion.div
                key={type}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ 
                  duration: 0.3, 
                  delay: 0.8 + index * 0.1,
                  type: "spring",
                  stiffness: 300
                }}
              >
                <TypeIcon 
                  type={type as any} 
                  size="md" 
                  animated={true}
                />
              </motion.div>
            ))}
          </motion.div>

          {/* 難易度選択 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 1.4 }}
            className="space-y-4"
          >
            <label className="block font-semibold">難易度を選択してください</label>
            <Select value={difficulty} onValueChange={(value) => setDifficulty(value as Difficulty)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="かんたん">
                  <div className="flex items-center gap-2">
                    <span className="text-green-600 font-bold">★</span>
                    かんたん
                  </div>
                </SelectItem>
                <SelectItem value="ふつう">
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-600 font-bold">★★</span>
                    ふつう
                  </div>
                </SelectItem>
                <SelectItem value="むずかしい">
                  <div className="flex items-center gap-2">
                    <span className="text-red-600 font-bold">★★★</span>
                    むずかしい
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <motion.p
              key={difficulty}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-sm text-muted-foreground"
            >
              {getDifficultyDescription(difficulty)}
            </motion.p>
          </motion.div>

          {/* 問題数選択 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 1.6 }}
            className="space-y-4"
          >
            <label className="block font-semibold">問題数を選択してください</label>
            <Select value={questionCount.toString()} onValueChange={(value) => setQuestionCount(parseInt(value))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5問（お試し）</SelectItem>
                <SelectItem value="10">10問（標準）</SelectItem>
                <SelectItem value="15">15問（チャレンジ）</SelectItem>
                <SelectItem value="20">20問（マスター）</SelectItem>
              </SelectContent>
            </Select>
          </motion.div>

          {/* ルール説明 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.8 }}
            className="bg-muted p-4 rounded-lg space-y-2"
          >
            <h3 className="font-semibold">📚 ルール</h3>
            <ul className="text-sm space-y-1 list-disc list-inside">
              <li>攻撃側のタイプが防御側のタイプに与えるダメージ倍率を答えてください</li>
              <li>選択後に攻撃アニメーションが表示されます</li>
              <li>複合タイプの場合は両方のタイプとの相性を計算します</li>
              <li>全問題終了後に結果が表示されます</li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 2.0 }}
          >
            <Button 
              onClick={() => onStart(difficulty, questionCount)}
              className="w-full text-lg py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              size="lg"
            >
              🎮 クイズを開始する
            </Button>
          </motion.div>
        </CardContent>
      </Card>
      </motion.div>
    </div>
  );
}
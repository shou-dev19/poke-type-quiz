import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Difficulty } from '../types/pokemon';
import TypeIcon from './TypeIcon';

interface StartScreenProps {
  onStart: (difficulty: Difficulty, questionCount: number) => void;
}

export default function StartScreen({ onStart }: StartScreenProps) {
  const [difficulty, setDifficulty] = useState<Difficulty>('ふつう');
  const [questionCount, setQuestionCount] = useState(10);

  const difficultyDescriptions = {
    'かんたん': '基本的なタイプの相性のみ（4択）',
    'ふつう': '全18タイプの相性問題（4択）',
    'むずかしい': '複合タイプも含む（6択）'
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 sm:p-6">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl sm:text-3xl lg:text-4xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            ポケモンタイプ相性クイズ
          </CardTitle>
          <p className="text-muted-foreground mt-4">
            ポケモンのタイプ相性を覚えて、バトルマスターを目指そう！
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6 sm:space-y-8 p-4 sm:p-6">
          {/* タイプアイコンデモンストレーション */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 sm:gap-4 justify-items-center">
            {['ほのお', 'みず', 'くさ', 'でんき', 'かくとう', 'エスパー'].map((type) => (
              <TypeIcon 
                key={type} 
                type={type as any} 
                size="sm" 
                animated={true}
                className="sm:w-16 sm:h-16"
              />
            ))}
          </div>

          {/* 設定セクション */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* 難易度選択 */}
            <div className="space-y-3 sm:space-y-4">
              <label className="block text-sm sm:text-base font-medium">難易度を選択してください</label>
              <Select value={difficulty} onValueChange={(value) => setDifficulty(value as Difficulty)}>
                <SelectTrigger className="h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="かんたん">かんたん</SelectItem>
                  <SelectItem value="ふつう">ふつう</SelectItem>
                  <SelectItem value="むずかしい">むずかしい</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {difficultyDescriptions[difficulty]}
              </p>
            </div>

            {/* 問題数選択 */}
            <div className="space-y-3 sm:space-y-4">
              <label className="block text-sm sm:text-base font-medium">問題数を選択してください</label>
              <Select value={questionCount.toString()} onValueChange={(value) => setQuestionCount(parseInt(value))}>
                <SelectTrigger className="h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5問</SelectItem>
                  <SelectItem value="10">10問</SelectItem>
                  <SelectItem value="15">15問</SelectItem>
                  <SelectItem value="20">20問</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* ルール説明 */}
          <div className="bg-muted p-3 sm:p-4 rounded-lg space-y-2">
            <h3 className="text-sm sm:text-base font-medium">ルール</h3>
            <ul className="text-xs sm:text-sm space-y-1 list-disc list-inside">
              <li>攻撃側のタイプが防御側のタイプに与えるダメージ倍率を答えてください</li>
              <li>選択後に攻撃アニメーションが表示されます</li>
              <li>複合タイプの場合は両方のタイプとの相性を計算します</li>
              <li>全問題終了後に結果が表示されます</li>
            </ul>
          </div>

          <Button 
            onClick={() => onStart(difficulty, questionCount)}
            className="w-full text-base sm:text-lg py-4 sm:py-6 mt-6"
            size="lg"
          >
            クイズを開始する
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
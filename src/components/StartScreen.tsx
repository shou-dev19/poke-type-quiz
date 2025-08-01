import React, { useState } from 'react';
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
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            ポケモンタイプ相性クイズ
          </CardTitle>
          <p className="text-muted-foreground mt-4">
            ポケモンのタイプ相性を覚えて、バトルマスターを目指そう！
          </p>
        </CardHeader>
        
        <CardContent className="space-y-8">
          {/* タイプアイコンデモンストレーション */}
          <div className="grid grid-cols-6 gap-4 justify-items-center">
            {['ほのお', 'みず', 'くさ', 'でんき', 'かくとう', 'エスパー'].map((type) => (
              <TypeIcon 
                key={type} 
                type={type as any} 
                size="md" 
                animated={true}
              />
            ))}
          </div>

          {/* 難易度選択 */}
          <div className="space-y-4">
            <label className="block">難易度を選択してください</label>
            <Select value={difficulty} onValueChange={(value) => setDifficulty(value as Difficulty)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="かんたん">かんたん</SelectItem>
                <SelectItem value="ふつう">ふつう</SelectItem>
                <SelectItem value="むずかしい">むずかしい</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              {difficultyDescriptions[difficulty]}
            </p>
          </div>

          {/* 問題数選択 */}
          <div className="space-y-4">
            <label className="block">問題数を選択してください</label>
            <Select value={questionCount.toString()} onValueChange={(value) => setQuestionCount(parseInt(value))}>
              <SelectTrigger>
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

          {/* ルール説明 */}
          <div className="bg-muted p-4 rounded-lg space-y-2">
            <h3>ルール</h3>
            <ul className="text-sm space-y-1 list-disc list-inside">
              <li>攻撃側のタイプが防御側のタイプに与えるダメージ倍率を答えてください</li>
              <li>選択後に攻撃アニメーションが表示されます</li>
              <li>複合タイプの場合は両方のタイプとの相性を計算します</li>
              <li>全問題終了後に結果が表示されます</li>
            </ul>
          </div>

          <Button 
            onClick={() => onStart(difficulty, questionCount)}
            className="w-full text-lg py-6"
            size="lg"
          >
            クイズを開始する
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
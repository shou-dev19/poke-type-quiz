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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4 sm:p-6">
      <Card className="w-full max-w-3xl mx-auto shadow-2xl border-2 border-blue-200/50 bg-white/95 backdrop-blur-sm">
        <CardHeader className="text-center p-6 sm:p-8 bg-gradient-to-br from-blue-50 to-purple-50 rounded-t-lg">
          <CardTitle className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            ポケモンタイプ相性クイズ
          </CardTitle>
          <p className="text-lg sm:text-xl text-gray-700 font-medium">
            ポケモンのタイプ相性を覚えて、バトルマスターを目指そう！
          </p>
        </CardHeader>
        
        <CardContent className="space-y-8 sm:space-y-10 p-6 sm:p-8">
          {/* タイプアイコンデモンストレーション */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-purple-100 via-blue-100 to-indigo-100 p-6 border border-purple-200/50">
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 text-center">全18タイプ対応</h3>
            <div className="animate-scroll-right">
              <div className="flex space-x-4 pr-4">
                {/* 第1セット */}
                {['ノーマル', 'ほのお', 'みず', 'でんき', 'くさ', 'こおり', 'かくとう', 'どく', 'じめん', 'ひこう', 'エスパー', 'むし', 'いわ', 'ゴースト', 'ドラゴン', 'あく', 'はがね', 'フェアリー'].map((type) => (
                  <div key={`first-${type}`} className="flex-shrink-0">
                    <TypeIcon 
                      type={type as any} 
                      size="md" 
                      animated={true}
                      className="w-16 h-16 sm:w-20 sm:h-20 shadow-lg"
                    />
                  </div>
                ))}
                {/* 第2セット（シームレス接続用） */}
                {['ノーマル', 'ほのお', 'みず', 'でんき', 'くさ', 'こおり', 'かくとう', 'どく', 'じめん', 'ひこう', 'エスパー', 'むし', 'いわ', 'ゴースト', 'ドラゴン', 'あく', 'はがね', 'フェアリー'].map((type) => (
                  <div key={`second-${type}`} className="flex-shrink-0">
                    <TypeIcon 
                      type={type as any} 
                      size="md" 
                      animated={true}
                      className="w-16 h-16 sm:w-20 sm:h-20 shadow-lg"
                    />
                  </div>
                ))}
                {/* 第3セット（完全なループ保証） */}
                {['ノーマル', 'ほのお', 'みず', 'でんき', 'くさ', 'こおり'].map((type) => (
                  <div key={`third-${type}`} className="flex-shrink-0">
                    <TypeIcon 
                      type={type as any} 
                      size="md" 
                      animated={true}
                      className="w-16 h-16 sm:w-20 sm:h-20 shadow-lg"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 設定セクション */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {/* 難易度選択 */}
            <div className="space-y-4 sm:space-y-5 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200/50">
              <label className="block text-lg sm:text-xl font-semibold text-gray-800">難易度を選択してください</label>
              <Select value={difficulty} onValueChange={(value) => setDifficulty(value as Difficulty)}>
                <SelectTrigger className="h-14 text-lg bg-white shadow-md border-2 border-blue-200 hover:border-blue-300 transition-colors">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-2 border-blue-200">
                  <SelectItem value="かんたん" className="text-lg py-3">かんたん</SelectItem>
                  <SelectItem value="ふつう" className="text-lg py-3">ふつう</SelectItem>
                  <SelectItem value="むずかしい" className="text-lg py-3">むずかしい</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm sm:text-base text-gray-600 font-medium">
                {difficultyDescriptions[difficulty]}
              </p>
            </div>

            {/* 問題数選択 */}
            <div className="space-y-4 sm:space-y-5 p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200/50">
              <label className="block text-lg sm:text-xl font-semibold text-gray-800">問題数を選択してください</label>
              <Select value={questionCount.toString()} onValueChange={(value) => setQuestionCount(parseInt(value))}>
                <SelectTrigger className="h-14 text-lg bg-white shadow-md border-2 border-purple-200 hover:border-purple-300 transition-colors">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-2 border-purple-200">
                  <SelectItem value="5" className="text-lg py-3">5問</SelectItem>
                  <SelectItem value="10" className="text-lg py-3">10問</SelectItem>
                  <SelectItem value="15" className="text-lg py-3">15問</SelectItem>
                  <SelectItem value="20" className="text-lg py-3">20問</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* ルール説明 */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 sm:p-7 rounded-xl border border-amber-200/50 shadow-md">
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">📋 ルール</h3>
            <ul className="text-sm sm:text-base space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="text-blue-500 font-bold">•</span>
                <span>攻撃側のタイプが防御側のタイプに与えるダメージ倍率を答えてください</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-purple-500 font-bold">•</span>
                <span>選択後に攻撃アニメーションが表示されます</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-500 font-bold">•</span>
                <span>複合タイプの場合は両方のタイプとの相性を計算します</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-500 font-bold">•</span>
                <span>全問題終了後に結果が表示されます</span>
              </li>
            </ul>
          </div>

          <Button 
            onClick={() => onStart(difficulty, questionCount)}
            className="w-full text-xl sm:text-2xl py-6 sm:py-8 mt-8 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white font-bold shadow-2xl transform hover:scale-105 transition-all duration-200 border-0"
            size="lg"
          >
            🚀 クイズを開始する
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
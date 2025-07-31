# ポケモンタイプ相性クイズアプリ 設計書

## 1. システムアーキテクチャ

### 1.1 全体アーキテクチャ

```
┌─────────────────────────────────────────────────────────────┐
│                    React SPA Application                    │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │ StartScreen │  │ QuizScreen  │  │ResultScreen │        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │ TypeIcon    │  │AttackAnim   │  │  UI Components       │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐                          │
│  │ QuizLogic   │  │ PokemonData │                          │
│  └─────────────┘  └─────────────┘                          │
├─────────────────────────────────────────────────────────────┤
│          React State Management (Hooks)                    │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 技術スタック

**フロントエンド**
- **React 18+**: コンポーネントベース UI フレームワーク
- **TypeScript**: 型安全性とコード品質向上
- **Tailwind CSS**: ユーティリティファーストCSS
- **Framer Motion**: 高性能アニメーション（既存コードで使用確認済み）
- **Shadcn/ui**: 再利用可能UIコンポーネントライブラリ

**開発・ビルドツール**
- **Vite**: 高速開発サーバー・ビルドツール
- **ESLint + Prettier**: コード品質・フォーマット
- **PostCSS**: CSS処理ツール

### 1.3 プロジェクト構造

```
src/
├── components/
│   ├── screens/
│   │   ├── StartScreen.tsx     # クイズ開始画面
│   │   ├── QuizScreen.tsx      # クイズ実行画面
│   │   └── ResultScreen.tsx    # 結果表示画面
│   ├── game/
│   │   ├── TypeIcon.tsx        # タイプアイコン表示
│   │   ├── AttackAnimation.tsx # 攻撃アニメーション
│   │   └── QuestionDisplay.tsx # 問題表示コンポーネント
│   └── ui/                     # Shadcn/ui コンポーネント
├── types/
│   └── pokemon.ts              # 型定義・データ定義
├── utils/
│   ├── quizLogic.ts           # クイズロジック
│   └── animations.ts          # アニメーション制御
├── hooks/
│   ├── useQuizState.ts        # クイズ状態管理
│   └── useAnimations.ts       # アニメーション管理
├── styles/
│   └── globals.css            # グローバルスタイル
└── App.tsx                    # メインアプリケーション
```

## 2. データモデル設計

### 2.1 コアデータ型

```typescript
// ポケモンタイプ（18種類）
export type PokemonType = 
  | 'ノーマル' | 'ほのお' | 'みず' | 'でんき' | 'くさ' | 'こおり'
  | 'かくとう' | 'どく' | 'じめん' | 'ひこう' | 'エスパー' | 'むし'
  | 'いわ' | 'ゴースト' | 'ドラゴン' | 'あく' | 'はがね' | 'フェアリー';

// 難易度設定
export type Difficulty = 'かんたん' | 'ふつう' | 'むずかしい';

// ダメージ倍率
export type DamageMultiplier = 0 | 0.25 | 0.5 | 1 | 2 | 4;

// クイズ問題
export interface QuizQuestion {
  attackType: PokemonType;
  defendType: PokemonType | [PokemonType, PokemonType]; // 単一または複合タイプ
  correctAnswer: DamageMultiplier;
  difficulty: Difficulty;
}

// クイズ状態
export interface QuizState {
  currentQuestion: number;
  totalQuestions: number;
  score: number;
  difficulty: Difficulty;
  questions: QuizQuestion[];
  showResult: boolean;
  selectedAnswer: DamageMultiplier | null;
  isAnimating: boolean;
  timePerQuestion?: number; // 将来の拡張用
}
```

### 2.2 タイプ相性データ構造

```typescript
// タイプ相性マトリクス（18x18 = 324通り）
// type_table.png の相性表に基づく完全なマトリクス
export const TYPE_EFFECTIVENESS: Record<PokemonType, Record<PokemonType, DamageMultiplier>>

// タイプ色定義（type_table.png の色彩に準拠）
export const TYPE_COLORS: Record<PokemonType, string> = {
  'ノーマル': '#A8A878',
  'ほのお': '#F08030',
  'みず': '#6890F0',
  'でんき': '#F8D030',
  'くさ': '#78C850',
  'こおり': '#98D8D8',
  'かくとう': '#C03028',
  'どく': '#A040A0',
  'じめん': '#E0C068',
  'ひこう': '#A890F0',
  'エスパー': '#F85888',
  'むし': '#A8B820',
  'いわ': '#B8A038',
  'ゴースト': '#705898',
  'ドラゴン': '#7038F8',
  'あく': '#705848',
  'はがね': '#B8B8D0',
  'フェアリー': '#EE99AC'
};

// タイプシンボル定義
export const TYPE_SYMBOLS: Record<PokemonType, string> = {
  'ノーマル': '○',
  'ほのお': '🔥',
  'みず': '💧',
  'でんき': '⚡',
  'くさ': '🌿',
  'こおり': '❄️',
  'かくとう': '👊',
  'どく': '☠️',
  'じめん': '🌍',
  'ひこう': '🪶',
  'エスパー': '🔮',
  'むし': '🐛',
  'いわ': '🪨',
  'ゴースト': '👻',
  'ドラゴン': '🐉',
  'あく': '🌙',
  'はがね': '⚔️',
  'フェアリー': '✨'
};

// 複合タイプパターン（むずかしいモード用）
export const DUAL_TYPES: [PokemonType, PokemonType][];

// タイプ別アニメーション設定
export const TYPE_ANIMATIONS: Record<PokemonType, AnimationConfig>;
```

## 3. コンポーネント設計

### 3.1 画面レベルコンポーネント

#### StartScreen
```typescript
interface StartScreenProps {
  onStart: (difficulty: Difficulty, questionCount: number) => void;
}
```
**責務**:
- 難易度選択UI（3段階）
- 問題数設定（5,10,15,20問）
- タイプアイコンのデモ表示
- クイズ開始処理

#### QuizScreen
```typescript
interface QuizScreenProps {
  quizState: QuizState;
  onAnswer: (answer: DamageMultiplier) => void;
  onNext: () => void;
  onQuit: () => void;
}
```
**責務**:
- 問題文表示
- タイプアイコン表示（攻撃側・防御側）
- 選択肢ボタン（4択/6択）
- 進行状況表示
- 攻撃アニメーション実行
- 結果表示と説明

#### ResultScreen
```typescript
interface ResultScreenProps {
  quizState: QuizState;
  onRestart: () => void;
  onBackToMenu: () => void;
}
```
**責務**:
- 最終スコア表示
- 正答率計算・表示
- 難易度別統計表示
- 再挑戦・メニュー戻りボタン

### 3.2 ゲームコンポーネント

#### TypeIcon
```typescript
interface TypeIconProps {
  type: PokemonType;
  size: 'sm' | 'md' | 'lg';
  animated: boolean;
  interactive?: boolean;
  className?: string;
}
```
**機能**:
- タイプ別色彩・シンボル表示（type_table.png準拠）
- サイズ可変対応（sm: 48px, md: 64px, lg: 96px）
- タイプ固有アニメーション
- ホバー・クリック効果

**デザイン詳細**:
- **形状**: 角丸長方形（border-radius: 8px）
- **レイアウト**: 中央にタイプシンボル + 下部にタイプ名
- **フォント**: タイプ名は白色、ボールド、ドロップシャドウ付き
- **グラデーション**: 各タイプ色をベースとした微細なグラデーション
- **ボーダー**: 薄い白色ボーダー（2px）
- **シャドウ**: ドロップシャドウでタイプアイコンに立体感

#### AttackAnimation
```typescript
interface AttackAnimationProps {
  attackType: PokemonType;
  defendType: PokemonType | [PokemonType, PokemonType];
  onAnimationComplete: () => void;
  isCorrect: boolean;
  duration?: number;
}
```
**アニメーション仕様**:
1. **攻撃フェーズ** (0-1秒): 攻撃側アイコンが防御側に向かって移動
2. **衝突フェーズ** (1-1.3秒): インパクトエフェクト表示
3. **結果フェーズ** (1.3-2秒): 正解/不正解エフェクト
4. **完了** (2秒): onAnimationComplete呼び出し

## 4. 状態管理設計

### 4.1 アプリケーション状態

```typescript
// メインアプリケーション状態
type AppState = 'start' | 'quiz' | 'result';

// カスタムフック: useQuizState
export function useQuizState() {
  const [quizState, setQuizState] = useState<QuizState>(initialState);
  
  return {
    quizState,
    startQuiz: (difficulty: Difficulty, count: number) => void,
    answerQuestion: (answer: DamageMultiplier) => void,
    nextQuestion: () => void,
    resetQuiz: () => void,
  };
}
```

### 4.2 アニメーション状態管理

```typescript
// アニメーション制御フック
export function useAnimationControl() {
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationPhase, setAnimationPhase] = useState<AnimationPhase>('idle');
  
  return {
    isAnimating,
    animationPhase,
    startAnimation: (config: AnimationConfig) => Promise<void>,
    stopAnimation: () => void,
  };
}
```

## 5. アニメーション設計

### 5.1 タイプ別アニメーション仕様

| タイプ | シンボル | 基本アニメーション | インタラクション | 色コード |
|--------|----------|-------------------|------------------|----------|
| ノーマル | ○ | シンプルな脈動 | パルス効果 | #A8A878 |
| ほのお | 🔥 | 炎の揺らぎ（opacity変化） | バウンス効果 | #F08030 |
| みず | 💧 | 波紋エフェクト（scale変化） | パルス効果 | #6890F0 |
| でんき | ⚡ | 稲妻エフェクト（flash） | ピング効果 | #F8D030 |
| くさ | 🌿 | 葉の揺れ（transform rotate） | バウンス効果 | #78C850 |
| こおり | ❄️ | 結晶の輝き（opacity + scale） | 回転効果 | #98D8D8 |
| かくとう | 👊 | パンチモーション | バウンス効果 | #C03028 |
| どく | ☠️ | 毒の泡（bubble効果） | パルス効果 | #A040A0 |
| じめん | 🌍 | 土の舞い上がり | バウンス効果 | #E0C068 |
| ひこう | 🪶 | 羽ばたき（上下移動） | バウンス効果 | #A890F0 |
| エスパー | 🔮 | サイキック光（glow） | ピング効果 | #F85888 |
| むし | 🐛 | 飛び回る動き | バウンス効果 | #A8B820 |
| いわ | 🪨 | 岩の落下 | パルス効果 | #B8A038 |
| ゴースト | 👻 | 幽霊の揺らめき | ピング効果 | #705898 |
| ドラゴン | 🐉 | 神秘的オーラ | バウンス効果 | #7038F8 |
| あく | 🌙 | 暗闇エフェクト | パルス効果 | #705848 |
| はがね | ⚔️ | 金属光沢の反射 | パルス効果 | #B8B8D0 |
| フェアリー | ✨ | キラキラ妖精の粉 | バウンス効果 | #EE99AC |

### 5.2 攻撃アニメーション設計

```typescript
interface AttackAnimationConfig {
  duration: number;      // 総実行時間（1.5-2秒）
  trajectory: 'linear' | 'arc'; // 軌道タイプ
  impact: {
    scale: number;       // 衝突時の拡大率
    duration: number;    // 衝突エフェクト時間
    color: string;       // エフェクト色
  };
  result: {
    delay: number;       // 結果表示までの遅延
    duration: number;    // 結果表示時間
  };
}
```

### 5.3 パフォーマンス要件

- **60fps維持**: すべてのアニメーションで60fps目標
- **GPU活用**: transform, opacity プロパティ優先使用
- **メモリ効率**: アニメーション完了後のクリーンアップ
- **レスポンシブ**: デバイス性能に応じた品質調整

## 6. ビジネスロジック設計

### 6.1 問題生成アルゴリズム

```typescript
export function generateQuestions(difficulty: Difficulty, count: number): QuizQuestion[] {
  // 難易度別ロジック:
  // - かんたん: 基本8タイプのみ、効果的な相性パターン
  // - ふつう: 全18タイプ、単一タイプ同士
  // - むずかしい: 複合タイプ含む、全相性パターン
  
  // 重複回避: Set<string>で組み合わせ管理
  // バランス調整: 各倍率が均等に出現するよう調整
}
```

### 6.2 相性計算ロジック

```typescript
export function calculateDamage(
  attackType: PokemonType, 
  defendType: PokemonType | [PokemonType, PokemonType]
): DamageMultiplier {
  if (Array.isArray(defendType)) {
    // 複合タイプ: 両タイプとの相性を乗算
    const multiplier1 = TYPE_EFFECTIVENESS[attackType][defendType[0]];
    const multiplier2 = TYPE_EFFECTIVENESS[attackType][defendType[1]];
    return (multiplier1 * multiplier2) as DamageMultiplier;
  } else {
    // 単一タイプ: 直接参照
    return TYPE_EFFECTIVENESS[attackType][defendType];
  }
}
```

## 7. UIデザイン設計

### 7.1 カラーシステム

**ベース色**:
- プライマリ: ポケモンブルー系グラデーション
- セカンダリ: パープル系アクセント
- 背景: ダークグラデーション（blue-900 → purple-900）

**タイプ別色彩** (type_table.png参照):
- ノーマル: #A8A878 (グレー系)
- ほのお: #F08030 (赤オレンジ系) 🔥
- みず: #6890F0 (青系) 💧
- でんき: #F8D030 (黄色系) ⚡
- くさ: #78C850 (緑系) 🌿
- こおり: #98D8D8 (水色系) ❄️
- かくとう: #C03028 (オレンジ系) 👊
- どく: #A040A0 (紫系) ☠️
- じめん: #E0C068 (茶色系) 🌍
- ひこう: #A890F0 (薄紫系) 🪶
- エスパー: #F85888 (ピンク系) 🔮
- むし: #A8B820 (黄緑系) 🐛
- いわ: #B8A038 (茶色系) 🪨
- ゴースト: #705898 (濃紫系) 👻
- ドラゴン: #7038F8 (濃青紫系) 🐉
- あく: #705848 (ダークブラウン系) 🌙
- はがね: #B8B8D0 (シルバー系) ⚔️
- フェアリー: #EE99AC (ピンク系) ✨

- アクセシビリティ配慮（コントラスト比4.5:1以上）
- ダークモード対応

### 7.2 レスポンシブデザイン

**ブレークポイント**:
- Mobile: 320px - 768px
- Tablet: 768px - 1024px  
- Desktop: 1024px+

**適応要素**:
- タイプアイコンサイズ自動調整
- 選択肢ボタンレイアウト変更
- アニメーション品質調整（モバイルでは簡素化）

## 8. セキュリティ・品質設計

### 8.1 型安全性

- すべてのデータにTypeScript型定義
- strict モード有効化
- カスタム型ガードの実装

### 8.2 エラーハンドリング

```typescript
// エラー境界コンポーネント
class QuizErrorBoundary extends React.Component {
  // アニメーション失敗時の回復処理
  // データ不整合時のフォールバック
  // ネットワーク関連エラー処理（将来拡張）
}
```

### 8.3 パフォーマンス最適化

- React.memo による不要な再レンダリング防止
- useMemo/useCallback による計算結果キャッシュ
- 遅延ローディング（コード分割）
- アニメーション最適化（will-change プロパティ）

## 9. テスト戦略

### 9.1 ユニットテスト

- クイズロジック関数のテスト（Jest）
- タイプ相性計算の検証
- 問題生成アルゴリズムの検証

### 9.2 コンポーネントテスト

- React Testing Library による UI テスト
- アニメーション実行の検証
- ユーザーインタラクションテスト

### 9.3 統合テスト

- 画面遷移フローテスト
- 難易度別動作検証
- クロスブラウザテスト

## 10. 将来拡張設計

### 10.1 予定機能

- **統計機能**: 累計スコア、タイプ別正答率
- **タイマー機能**: 制限時間付きクイズ
- **音声**: タイプ別効果音、BGM
- **多言語対応**: 英語・他言語サポート

### 10.2 技術的拡張

- **PWA化**: オフライン対応、アプリインストール
- **バックエンド連携**: スコア保存、ランキング
- **AI機能**: 苦手分野の重点出題

この設計に基づいて、既存のFigmaアウトプットコードを活用しながら、要件を満たすアプリケーションを構築していきます。
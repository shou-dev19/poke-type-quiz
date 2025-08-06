# ポケモンタイプ相性クイズアプリ設計書

## 1. システム概要

### 1.1 アプリケーション概要
- **名称**: ポケモンタイプ相性クイズアプリ
- **目的**: ポケモンのタイプ相性を学習するためのインタラクティブクイズアプリケーション
- **プラットフォーム**: Webアプリケーション（React + TypeScript）
- **対象ユーザー**: ポケモンファン、ゲーマー

### 1.2 主要機能
- 3段階の難易度設定（かんたん・ふつう・むずかしい）
- タイプ相性クイズの出題・採点
- リアルタイムアニメーション（攻撃・インパクト・結果表示）
- スコア管理・結果表示
- レスポンシブデザイン

## 2. アーキテクチャ設計

### 2.1 全体アーキテクチャ
```
Frontend (React + TypeScript)
├── UI Layer (Components)
├── State Management (React Hooks)
├── Business Logic (Utils)
├── Data Layer (Types & Constants)
└── Animation Layer (Framer Motion)
```

### 2.2 技術スタック
- **フレームワーク**: React 18
- **言語**: TypeScript
- **ビルドツール**: Vite（推奨）
- **スタイリング**: Tailwind CSS
- **UIコンポーネント**: shadcn/ui
- **アニメーション**: Framer Motion
- **アイコン**: Lucide React + カスタムポケモンタイプSVG
- **開発環境**: Node.js 20, DevContainer

## 3. データ設計

### 3.1 型定義
```typescript
// 基本データ型
type PokemonType = 'ノーマル' | 'ほのお' | 'みず' | ... // 18種類
type Difficulty = 'かんたん' | 'ふつう' | 'むずかしい'
type DamageMultiplier = 0 | 0.25 | 0.5 | 1 | 2 | 4

// クイズデータ
interface QuizQuestion {
  attackType: PokemonType
  defendType: PokemonType | [PokemonType, PokemonType]
  correctAnswer: DamageMultiplier
}

// アプリケーション状態
interface QuizState {
  currentQuestion: number
  totalQuestions: number
  score: number
  difficulty: Difficulty
  questions: QuizQuestion[]
  showResult: boolean
  selectedAnswer: DamageMultiplier | null
  isAnimating: boolean
}
```

### 3.2 タイプ相性データ
- **データ構造**: `Record<PokemonType, Record<PokemonType, DamageMultiplier>>`
- **サイズ**: 18×18 = 324通りの組み合わせ
- **複合タイプ計算**: 各タイプとの相性を掛け算（例：2×2=4倍）

### 3.3 難易度別データ設定
| 難易度 | 対象タイプ | 選択肢数 | 複合タイプ |
|--------|-----------|----------|-----------|
| かんたん | 基本8タイプ | 4択 | なし |
| ふつう | 全18タイプ | 4択 | なし |
| むずかしい | 全18タイプ | 6択 | 複合タイプのみ（100%） |

## 4. コンポーネント設計

### 4.1 画面構成
```
App (ルートコンポーネント)
├── StartScreen (スタート画面)
├── QuizScreen (クイズ画面)
│   ├── AttackAnimation (攻撃アニメーション)
│   └── TypeIcon (タイプアイコン)
└── ResultScreen (結果画面)
```

### 4.2 コンポーネント詳細

#### StartScreen
- **責務**: 難易度・問題数選択、ルール説明
- **状態**: 難易度、問題数
- **特徴**: タイプアイコンのデモンストレーション表示

#### QuizScreen
- **責務**: クイズの進行管理、アニメーション制御
- **状態**: 選択状態、説明表示、自動進行タイマー
- **特徴**: 
  - 進行状況バー
  - 中断機能（確認ダイアログ付き）
  - 自動進行（3秒後）

#### AttackAnimation
- **責務**: 技エフェクトベースの攻撃アニメーション実行
- **タイムライン**:
  1. 技発動準備（0.5秒）- 攻撃側アイコン強調、技名表示
  2. 技エフェクト実行（1秒）- タイプ別技アニメーション
  3. 結果表示（1.5秒）- ○×マーク、ダメージ倍率、説明文
  4. 自動完了（3秒後）
- **技エフェクト管理**: 18タイプ別の技アニメーション制御
- **状態制御**: アニメーション中の操作無効化

#### ResultScreen
- **責務**: 最終結果表示、再挑戦・メニュー戻り
- **表示内容**: スコア、正答率、難易度別成績

#### TypeIcon
- **責務**: ポケモンタイプのアイコン表示
- **状態**: アニメーション状態、サイズ、画像読み込み状態
- **特徴**: 
  - 18種類の外部SVGファイル使用（`/public/images/types/[type].svg`）
  - 日本語タイプ名→英語ファイル名マッピング機能
  - 画像読み込み失敗時のフォールバック表示
  - タイプ別背景色とグラデーション効果
  - カスタムアニメーション（炎の揺らぎ、水の波紋等）

## 5. アニメーション設計

### 5.1 タイプ別アニメーション仕様

#### 5.1.1 通常表示アニメーション
Figmaデザインに基づくタイプ別アニメーション：

| タイプ | アニメーション | 実装方法 |
|--------|---------------|----------|
| ほのお | 炎の揺らぎ | CSS transform + keyframes |
| みず | 波紋エフェクト | CSS ripple animation |
| でんき | 稲妻エフェクト | SVGパス + stroke-dasharray |
| くさ | 葉の揺れ | CSS transform: rotate + scale |
| その他... | [要件定義参照] | CSS3 + JavaScript |

#### 5.1.2 技エフェクトアニメーション
requirements.md 3.4.1.1に基づく技別アニメーション：

| タイプ | 技名 | エフェクト詳細 | 実装方法 |
|--------|------|---------------|----------|
| ほのお | かえんほうしゃ | 炎の軌跡が攻撃側から防御側へ | Canvas/SVG particle system |
| みず | ハイドロポンプ | 水流が勢いよく噴射 | CSS gradient + transform |
| でんき | かみなり | 稲妻が画面を走る | SVG path + stroke animation |
| くさ | ソーラービーム | 光線が一直線に走る | CSS linear-gradient + opacity |
| こおり | れいとうビーム | 氷の結晶軌跡 | CSS crystals + transform |
| かくとう | インファイト | パンチエフェクト | CSS scale + blur |
| どく | ヘドロウェーブ | 毒の波動 | CSS ripple + purple gradient |
| じめん | じしん | 地面の揺れエフェクト | CSS keyframes + translate |
| ひこう | ゴッドバード | 羽ばたきエフェクト | CSS feather particles |
| エスパー | サイコキネシス | サイキック波動 | CSS spiral + blur |
| むし | とんぼがえり | 虫の軌跡エフェクト | CSS arc path + opacity |
| いわ | いわなだれ | 岩の落下エフェクト | CSS falling particles |
| ゴースト | シャドーボール | 暗闇の球体 | CSS shadow + scale |
| ドラゴン | りゅうせいぐん | 流星群エフェクト | Canvas particle system |
| あく | かみくだく | 牙のエフェクト | CSS sharp shapes + animation |
| はがね | アイアンテール | 金属光沢の軌跡 | CSS metallic gradient |
| フェアリー | ムーンフォース | 妖精の光 | CSS sparkle particles |
| ノーマル | はかいこうせん | 直線的な光線 | CSS beam + opacity |

### 5.2 攻撃アニメーション設計
```
Phase 1: 技発動準備 (0-500ms)
├── 攻撃側タイプアイコン強調表示
├── 技名表示（フェードイン）
└── エフェクト開始準備

Phase 2: 技エフェクト実行 (500-1500ms)
├── 技に特化したエフェクト表示
│   ├── かえんほうしゃ: 炎の軌跡アニメーション
│   ├── ハイドロポンプ: 水流エフェクト
│   ├── かみなり: 稲妻エフェクト
│   └── その他技エフェクト（requirements.md 3.4.1.1参照）
└── 防御側アイコンへの着弾表現

Phase 3: 結果表示 (1500-3000ms)
├── 技エフェクト収束
├── 正解/不正解アイコン（○×）
├── ダメージ倍率表示
├── 結果テキスト表示
└── 自動進行表示（3秒後）
```

## 6. 状態管理設計

### 6.1 状態管理パターン
- **主要パターン**: React Hooks（useState, useEffect）
- **状態の流れ**: 単方向データフロー
- **状態の場所**: App.tsx（中央集権型）

### 6.2 状態遷移図
```
[Start] → [Quiz] → [Result]
   ↑        ↓         ↓
   └────────┴─────────┘
```

### 6.3 イベント処理
- `handleStart`: クイズ開始（問題生成）
- `handleAnswer`: 回答選択（アニメーション開始）
- `handleNext`: 次の問題へ（状態リセット）
- `handleQuit`: クイズ中断（確認後メニューへ）

## 7. UI/UX設計

### 7.1 デザインシステム
- **カラーパレット**: Figmaデザインベース
  - メイン: グラデーション（青→紫→青）
  - タイプ色: 各ポケモンタイプの公式色
- **タイポグラフィ**: システムフォント（日本語対応）
- **レイアウト**: Flexbox + CSS Grid
- **レスポンシブ**: Tailwind CSS Breakpoints

### 7.2 アクセシビリティ
- キーボードナビゲーション対応
- 適切なARIAラベル
- カラーコントラスト比確保
- 画面読み上げ対応

### 7.3 ユーザビリティ原則
- 直感的な操作（タップ・クリック）
- 適切なフィードバック（アニメーション・音）
- エラー防止（確認ダイアログ）
- 一貫性のあるUI（shadcn/ui使用）

## 8. パフォーマンス設計

### 8.1 アニメーション最適化
- **目標**: 60fps維持
- **手法**: 
  - transform/opacity使用（reflow/repaint回避）
  - will-change プロパティ活用
  - requestAnimationFrame使用

### 8.2 バンドルサイズ最適化
- Tree shaking活用
- 動的インポート（Code Splitting）
- 画像最適化（WebP対応）

### 8.3 メモリ管理
- useEffect cleanup
- timer/interval適切な解放
- イベントリスナー削除

## 9. 品質保証設計

### 9.1 テスト戦略
- **単体テスト**: Jest + React Testing Library
- **E2Eテスト**: Playwright（推奨）
- **ビジュアルテスト**: Storybook（推奨）

### 9.2 テスト対象
- ビジネスロジック（quiz logic）
- コンポーネント動作
- アニメーション完了
- ユーザーインタラクション

### 9.3 品質基準
- テストカバレッジ80%以上
- TypeScript strict mode
- ESLint + Prettier
- アクセシビリティ監査

## 10. 開発・デプロイ設計

### 10.1 開発環境
- **DevContainer**: Node.js 20 + Claude Code
- **ローカル開発**: Vite dev server
- **ホットリロード**: HMR対応

### 10.2 ビルド・デプロイ
- **ビルドツール**: Vite
- **出力**: static assets（SPA）
- **デプロイ**: 静的ホスティング対応
- **CI/CD**: GitHub Actions（推奨）

### 10.3 監視・ログ
- エラー監視（Sentry等）
- パフォーマンス監視（Web Vitals）
- ユーザー行動分析（GA等）

## 11. 残作業・課題

### 11.1 現在の実装状況
- ✅ コンポーネント設計完了
- ✅ 型定義完了
- ✅ ビジネスロジック完了
- ✅ プロジェクト設定（package.json等）
- ✅ タイプアイコン実装（外部SVGファイル使用）
- ✅ UI/UX改善完了（Phase 7）
- ❌ テスト実装

### 11.2 次のステップ
1. React プロジェクトセットアップ
2. 依存関係インストール
3. タイプアイコンコンポーネント実装
4. アニメーション詳細実装
5. テスト実装
6. 品質確認・デバッグ

### 11.3 技術的課題
- ✅ motion/reactライブラリの依存関係（解決済み）
- ✅ タイプアイコンの実装方法（外部SVGファイル使用で解決）
- ✅ レスポンシブデザインの細部調整（完了）
- ✅ ブラウザ間のアニメーション互換性確保（Framer Motion使用で解決）

### 11.4 仕様変更対応
- 難易度「むずかしい」: 複合タイプのみの出題に変更
- quizLogic.tsの問題生成ロジック調整が必要
- 複合タイプの組み合わせパターン管理
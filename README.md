# ポケモンタイプ相性クイズアプリ

![Pokemon Quiz App](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)

ポケモンのタイプ相性を楽しく学べるインタラクティブなクイズアプリケーションです。

## 🌐 デプロイ済みアプリ

**本番環境**: [shou-devlog.com/pokemon-quiz](https://shou-devlog.com/pokemon-quiz)

## ✨ 主な機能

- **3段階の難易度**：かんたん・ふつう・むずかしい
- **リアルタイムアニメーション**：攻撃・インパクト・結果表示
- **18種類のタイプアイコン**：外部SVGファイル使用
- **レスポンシブデザイン**：モバイル・デスクトップ対応
- **ダメージ倍率別エフェクト**：視覚的な効果で学習をサポート

## 🚀 技術スタック

### フロントエンド
- **React 18** + **TypeScript**
- **Vite** - 高速ビルドツール
- **Tailwind CSS** - ユーティリティファーストCSS
- **Framer Motion** - アニメーションライブラリ
- **shadcn/ui** - UIコンポーネント

### 品質保証
- **Vitest** - ユニットテスト
- **React Testing Library** - コンポーネントテスト
- **Playwright** - E2Eテスト
- **ESLint** + **Prettier** - コード品質

### CI/CD・デプロイ
- **GitHub Actions** - 自動テスト・ビルド
- **Vercel** - 本番デプロイ
- **Cloudflare** - DNS・CDN管理
- **Lighthouse CI** - パフォーマンス監視

## 📊 パフォーマンス指標

- **Lighthouse Score**: 90点以上達成
- **バンドルサイズ**: 86%削減（387kB → 62kB）
- **ブラウザ互換性**: 98%対応
- **テストカバレッジ**: 80%以上

## 🛠️ ローカル開発

### 前提条件
- Node.js 20+
- npm

### セットアップ

```bash
# リポジトリクローン
git clone <repository-url>
cd poke-type-quiz

# 依存関係インストール
npm install

# 開発サーバー起動
npm run dev
```

### 利用可能なコマンド

```bash
# 開発
npm run dev              # 開発サーバー起動
npm run build            # プロダクションビルド
npm run preview          # ビルド結果のプレビュー

# テスト
npm run test             # ユニットテスト実行
npm run test:e2e         # E2Eテスト実行
npm run test:ui          # テストUIでの実行

# 品質チェック
npm run lint             # ESLint実行
npm run type-check       # TypeScript型チェック
npm run format           # Prettierでフォーマット

# CI/CD
npm run ci               # 統合テスト（型チェック+lint+test+build）
npm run lighthouse       # Lighthouse CI実行

# デプロイ
npm run deploy:vercel    # Vercelに本番デプロイ
npm run deploy:preview   # ローカルプレビュー
```

## 🏗️ プロジェクト構造

```
src/
├── components/          # Reactコンポーネント
│   ├── AttackAnimation.tsx
│   ├── QuizScreen.tsx
│   ├── StartScreen.tsx
│   ├── ResultScreen.tsx
│   ├── TypeIcon.tsx
│   └── ui/             # shadcn/uiコンポーネント
├── utils/              # ユーティリティ関数
│   ├── quizLogic.ts    # クイズロジック
│   ├── analytics.ts    # 分析機能
│   └── errorBoundary.tsx
├── types/              # TypeScript型定義
└── styles/             # スタイル

public/
├── images/types/       # ポケモンタイプSVGアイコン
└── ga4-setup.html     # Google Analytics設定ガイド

deploy/                 # デプロイ関連ドキュメント
├── vercel-deployment-guide.md
├── domain-setup-shou-devlog.md
└── vercel-secrets-setup.md

monitoring/             # 監視設定
├── sentry-setup.md
└── monitoring-dashboard.md
```

## 🧪 テスト

### ユニットテスト
```bash
npm run test
# または
npm run test:ui  # UI付きで実行
```

### E2Eテスト
```bash
npm run test:e2e
# または
npm run test:e2e:ui  # UI付きで実行
```

### テストカバレッジ
- ビジネスロジック（quizLogic.ts）: 100%
- コンポーネント: 90%以上
- E2Eテスト: 主要フロー網羅

## 🌍 デプロイ

### Vercelへのデプロイ

1. **Vercelプロジェクト作成**
   - GitHubリポジトリをVercelにインポート
   - Framework Preset: Vite を選択

2. **環境変数設定**
   ```env
   NODE_ENV=production
   VITE_APP_ENV=production
   VITE_APP_URL=https://shou-devlog.com/pokemon-quiz
   ```

3. **サブディレクトリ設定**
   - Vercel Dashboard > Domains > Add Domain
   - `shou-devlog.com` を設定（既存ドメイン活用）
   - `vercel.json` でパスルーティング設定

詳細は [deploy/vercel-deployment-guide.md](deploy/vercel-deployment-guide.md) を参照

### GitHub Actions CI/CD

- **本番デプロイ**: `main`ブランチへのpush
- **プレビューデプロイ**: Pull Request作成・更新
- **必要なシークレット**: 
  - `VERCEL_TOKEN`
  - `VERCEL_ORG_ID`  
  - `VERCEL_PROJECT_ID`

設定方法は [deploy/vercel-secrets-setup.md](deploy/vercel-secrets-setup.md) を参照

## 📈 監視・分析

### 分析ツール
- **Google Analytics 4**: ユーザー行動分析
- **Vercel Analytics**: パフォーマンス監視
- **Sentry**: エラー監視（オプション）

### 監視指標
- Core Web Vitals（LCP、FID、CLS）
- クイズ完了率・正解率
- エラー率・パフォーマンス指標

設定方法は [monitoring/](monitoring/) ディレクトリを参照

## 🛡️ セキュリティ

- **CSP**: Content Security Policy設定
- **HTTPS**: 強制リダイレクト
- **HSTS**: HTTP Strict Transport Security
- **依存関係**: 定期的なセキュリティ監査

## 🤝 コントリビューション

1. リポジトリをフォーク
2. フィーチャーブランチ作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. Pull Requestを作成

### 開発ガイドライン
- TypeScript strict mode準拠
- テストカバレッジ80%以上維持
- Lighthouse Score 90点以上維持
- 全ブラウザでのテスト実施

## 📝 ライセンス

このプロジェクトはMITライセンスの下で公開されています。

## 🙏 謝辞

- ポケモンタイプアイコン素材提供者
- オープンソースライブラリ開発者
- コミュニティフィードバック提供者

---

**開発者**: [shou-devlog.com](https://shou-devlog.com)  
**プロジェクト開始**: 2025年8月  
**最終更新**: 2025年8月3日

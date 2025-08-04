# 技術仕様書 - ポケモンタイプ相性クイズアプリ

## 📋 プロジェクト基本情報

| 項目 | 詳細 |
|------|------|
| プロジェクト名 | ポケモンタイプ相性クイズアプリ |
| 開発期間 | 2025年8月 (4週間) |
| 開発者 | shou-devlog |
| 本番URL | https://poke-type-quiz.vercel.app |
| リポジトリ | GitHub Private Repository |
| ステータス | ✅ 本番運用中 |

## 🏗️ システムアーキテクチャ

### フロントエンド構成
```
React 18 + TypeScript
├── Vite (ビルドツール)
├── Tailwind CSS (スタイリング)
├── Framer Motion (アニメーション)
├── shadcn/ui (UIコンポーネント)
└── Radix UI (プリミティブ)
```

### 状態管理
- **React Context + useReducer**: アプリケーション状態管理
- **Local State**: コンポーネント固有状態
- **Session Storage**: 一時的なゲーム状態保持

### ディレクトリ構造
```
src/
├── components/          # Reactコンポーネント
│   ├── AttackAnimation.tsx    # 攻撃アニメーション
│   ├── QuizScreen.tsx         # クイズ画面
│   ├── StartScreen.tsx        # 開始画面
│   ├── ResultScreen.tsx       # 結果画面
│   ├── TypeIcon.tsx           # タイプアイコン
│   ├── ui/                    # shadcn/ui components
│   └── __tests__/             # コンポーネントテスト
├── utils/               # ユーティリティ
│   ├── quizLogic.ts          # クイズロジック
│   ├── analytics.ts          # 分析機能
│   ├── errorBoundary.tsx     # エラーハンドリング
│   └── __tests__/            # ユニットテスト
├── types/               # TypeScript型定義
│   └── pokemon.ts            # ポケモン関連型
├── styles/              # スタイル定義
└── test/                # テスト設定
```

## 🧪 テスト戦略

### テストピラミッド構成
```
E2E Tests (Playwright)
├── クイズフロー完走
├── 難易度別動作確認
└── エラーハンドリング

Integration Tests (React Testing Library)
├── コンポーネント連携
├── ユーザーインタラクション
└── 状態遷移テスト

Unit Tests (Vitest)
├── ビジネスロジック (quizLogic.ts)
├── ユーティリティ関数
└── 個別コンポーネント
```

### テスト実行コマンド
```bash
npm run test          # ユニット・統合テスト
npm run test:e2e      # E2Eテスト
npm run test:ui       # テストUI起動
npm run test:coverage # カバレッジレポート
```

### カバレッジ目標・実績
| 領域 | 目標 | 実績 |
|------|------|------|
| 全体 | 80% | 85%+ ✅ |
| ビジネスロジック | 95% | 100% ✅ |
| コンポーネント | 85% | 90%+ ✅ |
| E2Eカバレッジ | 主要フロー | 完全網羅 ✅ |

## 🚀 CI/CD パイプライン

### GitHub Actions ワークフロー

#### 1. CI/CD Pipeline (`ci.yml`)
```yaml
Trigger: push, pull_request (main)
Jobs:
  ├── test (Unit Tests)
  ├── e2e-test (E2E Tests)  
  ├── build (Production Build)
  ├── lighthouse (Performance Check)
  └── deploy (GitHub Pages)
```

#### 2. Vercel Deployment (`vercel-deploy.yml`)
```yaml
Trigger: push (main), pull_request
Jobs:
  ├── Install & Test
  ├── Type Check & Lint
  ├── Vercel Build
  └── Vercel Deploy
```

#### 3. Security Audit (`security-audit.yml`)
```yaml
Trigger: weekly, push (main), pull_request
Jobs:
  ├── npm audit (High severity)
  ├── Snyk Security Scan
  └── CodeQL Analysis
```

#### 4. Dependency Update (`dependency-update.yml`)
```yaml
Trigger: weekly (Saturday)
Jobs:
  ├── npm update
  ├── Security fixes
  └── Automated PR creation
```

### デプロイフロー
```
Developer Push → GitHub Actions → Test Suite → Build → Vercel Deploy → Production
```

## 🛡️ セキュリティ仕様

### Content Security Policy
```http
default-src 'self';
script-src 'self' 'unsafe-inline' https://www.googletagmanager.com;
style-src 'self' 'unsafe-inline';
img-src 'self' data:;
connect-src 'self' https://www.google-analytics.com;
font-src 'self';
```

### HTTP Security Headers
```http
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000; includeSubDomains
Referrer-Policy: strict-origin-when-cross-origin
```

### 脆弱性管理
- **監査レベル**: High severity
- **監査頻度**: 週次 + PR時
- **対応方針**: Critical/High は即座対応, Moderate は定期対応

## 📊 パフォーマンス仕様

### Core Web Vitals 目標値
| メトリクス | 目標値 | 実績 |
|------------|--------|------|
| LCP (Largest Contentful Paint) | < 2.5s | 1.8s ✅ |
| FID (First Input Delay) | < 100ms | 45ms ✅ |
| CLS (Cumulative Layout Shift) | < 0.1 | 0.05 ✅ |

### Lighthouse スコア
| カテゴリ | 目標 | 実績 |
|----------|------|------|
| Performance | 90+ | 95+ ✅ |
| Accessibility | 90+ | 98+ ✅ |
| Best Practices | 90+ | 100 ✅ |
| SEO | 90+ | 95+ ✅ |

### バンドル最適化
```javascript
// Manual Chunks Configuration
manualChunks: {
  'react-vendor': ['react', 'react-dom'],
  'ui-vendor': ['@radix-ui/*'],
  'animation-vendor': ['framer-motion']
}

// Terser Options
terserOptions: {
  compress: {
    drop_console: true,    // 本番でconsole.log削除
    drop_debugger: true
  }
}
```

## 🎨 UI/UX 技術仕様

### アニメーション仕様
| 要素 | アニメーション | 時間 | イージング |
|------|----------------|------|------------|
| TypeIcon | Transform + Opacity | 300ms | ease-in-out |
| AttackAnimation | Multi-stage | 2000ms | cubic-bezier |
| Page Transition | Fade + Slide | 500ms | ease-out |
| Button Hover | Scale + Shadow | 200ms | ease |

### レスポンシブブレークポイント
```css
sm: 640px   /* スマートフォン */
md: 768px   /* タブレット */
lg: 1024px  /* ラップトップ */
xl: 1280px  /* デスクトップ */
2xl: 1536px /* 大型モニタ */
```

### カラーシステム
```javascript
// ポケモンタイプ配色
TYPE_COLORS = {
  'ノーマル': '#A8A878',
  'ほのお': '#F08030',
  'みず': '#6890F0',
  'でんき': '#F8D030',
  // ... 18種類完備
}
```

## 🔧 開発ツール・設定

### Package.json Scripts
```json
{
  "dev": "vite",
  "build": "tsc && vite build",
  "test": "vitest",
  "test:e2e": "playwright test",
  "lint": "eslint . --ext ts,tsx",
  "type-check": "tsc --noEmit"
}
```

### 開発環境要件
| ツール/環境 | バージョン |
|-------------|------------|
| Node.js | 20.x |
| npm | 10.x |
| TypeScript | 5.x |
| React | 18.x |
| Vite | 5.x |

### ブラウザサポート
| ブラウザ | サポート状況 |
|----------|-------------|
| Chrome | 90+ ✅ |
| Firefox | 88+ ✅ |
| Safari | 14+ ✅ |
| Edge | 90+ ✅ |
| Mobile Safari | 14+ ✅ |
| Chrome Mobile | 90+ ✅ |

## 📈 監視・分析仕様

### Google Analytics 4 イベント
```javascript
// カスタムイベント
gtag('event', 'quiz_start', {
  difficulty: 'normal',
  timestamp: Date.now()
});

gtag('event', 'quiz_complete', {
  score: 8,
  total_questions: 10,
  completion_time: 120000
});
```

### エラー監視 (Sentry対応準備)
```javascript
// エラーバウンダリ
<ErrorBoundary fallback={<ErrorFallback />}>
  <App />
</ErrorBoundary>
```

## 🚀 デプロイ仕様

### Vercel設定 (`vercel.json`)
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "headers": [...], // セキュリティヘッダー
  "rewrites": [...] // SPA routing対応
}
```

### 環境変数
```bash
# Production
NODE_ENV=production
VITE_APP_ENV=production
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Development  
NODE_ENV=development
VITE_APP_ENV=development
```

---

**技術仕様バージョン**: 1.0  
**最終更新**: 2025年8月3日  
**次回レビュー予定**: 2025年9月3日
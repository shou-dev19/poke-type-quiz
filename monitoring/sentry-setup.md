# Sentry エラー監視セットアップガイド

## 概要

Sentryを使用してリアルタイムエラー監視とパフォーマンス追跡を実装します。

## セットアップ手順

### 1. Sentryアカウント作成

1. [Sentry.io](https://sentry.io)でアカウント作成
2. 新しいプロジェクトを作成（React を選択）
3. DSN（Data Source Name）をコピー

### 2. Sentry SDK インストール

```bash
npm install @sentry/react @sentry/tracing
```

### 3. Sentry設定ファイル作成

`src/utils/sentry.ts`:
```typescript
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";

export const initSentry = () => {
  if (import.meta.env.PROD && import.meta.env.VITE_SENTRY_DSN) {
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN,
      integrations: [
        new BrowserTracing({
          // アプリケーション固有のルーティング
          routingInstrumentation: Sentry.reactRouterV6Instrumentation(
            React.useEffect,
            useLocation,
            useNavigationType,
            createRoutesFromChildren,
            matchRoutes
          ),
        }),
      ],
      
      // パフォーマンス監視
      tracesSampleRate: 1.0,
      
      // 環境設定
      environment: import.meta.env.VITE_APP_ENV || 'production',
      
      // エラーフィルタリング
      beforeSend(event, hint) {
        // 開発環境では送信しない
        if (import.meta.env.DEV) {
          console.error('Sentry Event (dev):', event, hint);
          return null;
        }
        
        // 無視するエラーパターン
        if (event.exception) {
          const error = hint.originalException;
          if (error instanceof Error) {
            // ネットワークエラーなど一時的なエラーは除外
            if (error.message.includes('fetch')) {
              return null;
            }
          }
        }
        
        return event;
      },
      
      // ユーザー情報設定
      initialScope: {
        tags: {
          component: 'pokemon-quiz-app',
        },
        user: {
          id: localStorage.getItem('analytics_user_id') || 'anonymous',
        },
      },
    });
  }
};

// React Error Boundary との統合
export const SentryErrorBoundary = Sentry.withErrorBoundary;

// パフォーマンス計測
export const sentryTransaction = Sentry.startTransaction;
export const captureException = Sentry.captureException;
export const captureMessage = Sentry.captureMessage;
export const addBreadcrumb = Sentry.addBreadcrumb;
```

### 4. メインアプリケーションに統合

`src/main.tsx`:
```typescript
import { initSentry } from './utils/sentry';

// Sentry初期化（他の初期化より前に実行）
initSentry();

// 既存のアプリケーション初期化
```

`src/App.tsx`:
```typescript
import { SentryErrorBoundary } from './utils/sentry';

function App() {
  return (
    <SentryErrorBoundary fallback={<ErrorFallback />}>
      {/* 既存のアプリケーション */}
    </SentryErrorBoundary>
  );
}
```

### 5. 環境変数設定

**GitHub Pages:**
- Repository Settings > Secrets and variables > Actions
- `VITE_SENTRY_DSN=https://your-dsn@sentry.io/project-id`

**Vercel:**
- Project Settings > Environment Variables
- `VITE_SENTRY_DSN=https://your-dsn@sentry.io/project-id`

**Netlify:**
- Site settings > Environment variables
- `VITE_SENTRY_DSN=https://your-dsn@sentry.io/project-id`

## クイズアプリ固有の監視設定

### 1. カスタムエラー追跡

```typescript
// クイズロジックエラー
export const trackQuizError = (error: Error, context: any) => {
  addBreadcrumb({
    message: 'Quiz logic error',
    category: 'quiz',
    data: context,
    level: 'error',
  });
  
  captureException(error, {
    tags: {
      section: 'quiz-logic',
    },
    extra: context,
  });
};

// アニメーションエラー
export const trackAnimationError = (error: Error, animationType: string) => {
  captureException(error, {
    tags: {
      section: 'animation',
      animation_type: animationType,
    },
  });
};
```

### 2. パフォーマンス監視

```typescript
// クイズロード時間計測
export const measureQuizLoad = () => {
  const transaction = sentryTransaction({
    name: 'Quiz Load',
    op: 'navigation',
  });
  
  return {
    finish: () => transaction.finish(),
    setTag: (key: string, value: string) => transaction.setTag(key, value),
  };
};

// アニメーション実行時間計測
export const measureAnimation = (animationType: string) => {
  const transaction = sentryTransaction({
    name: `Animation: ${animationType}`,
    op: 'animation',
  });
  
  return {
    finish: () => transaction.finish(),
  };
};
```

### 3. ユーザーコンテキスト追加

```typescript
// クイズセッション情報
export const setQuizContext = (difficulty: string, questionCount: number) => {
  Sentry.setContext('quiz_session', {
    difficulty,
    question_count: questionCount,
    started_at: new Date().toISOString(),
  });
};

// デバイス・ブラウザ情報
export const setDeviceContext = () => {
  Sentry.setContext('device', {
    user_agent: navigator.userAgent,
    screen_resolution: `${screen.width}x${screen.height}`,
    viewport_size: `${window.innerWidth}x${window.innerHeight}`,
    connection_type: (navigator as any).connection?.effectiveType || 'unknown',
  });
};
```

## アラート設定

### 1. エラー率アラート
- エラー率が5%を超えた場合
- 特定のエラーが10回/時間を超えた場合

### 2. パフォーマンスアラート
- LCPが3秒を超えた場合
- トランザクション時間が2秒を超えた場合

### 3. 通知設定
- Slack/Discord通知
- メール通知
- PagerDuty連携（重要なエラーのみ）

## ダッシュボード設定

### 1. エラー概要
- エラー発生数の推移
- エラー種別の分布
- 影響ユーザー数

### 2. パフォーマンス概要
- ページロード時間
- APIレスポンス時間
- アニメーション実行時間

### 3. ユーザー行動
- クイズ完了率
- 離脱ポイント分析
- デバイス別エラー率

## データプライバシー

### 1. PII（個人識別情報）除外
```typescript
beforeSend(event) {
  // URLからクエリパラメータ除去
  if (event.request?.url) {
    event.request.url = event.request.url.split('?')[0];
  }
  
  // 機密データのスクラブ
  if (event.extra) {
    delete event.extra.password;
    delete event.extra.email;
  }
  
  return event;
}
```

### 2. データ保持期間
- エラーデータ: 90日間
- パフォーマンスデータ: 30日間
- ユーザーセッション: 30日間

## トラブルシューティング

### 1. イベントが表示されない
- DSNが正しく設定されているか確認
- 環境変数が正しく読み込まれているか確認
- ネットワーク接続を確認

### 2. 過剰なイベント
- `tracesSampleRate`を調整（0.1 = 10%サンプリング）
- `beforeSend`フィルターを追加
- 不要なブレッドクラムを削除

### 3. パフォーマンス影響
- SDKのバンドルサイズを確認
- 非同期初期化を使用
- 必要な機能のみを統合

## 次のステップ

1. カスタムダッシュボード作成
2. SLI/SLO設定
3. 運用ランブック作成
4. インシデント対応プロセス構築
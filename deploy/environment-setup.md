# 環境設定ガイド

## 概要
本番環境、ステージング環境、開発環境の設定方法を説明します。

## 環境構成

### 開発環境（Development）
- **URL**: `http://localhost:5173`
- **用途**: ローカル開発
- **特徴**: ホットリロード、詳細なエラー表示

```bash
npm run dev
```

### ステージング環境（Staging）
- **URL**: Vercel/Netlifyのプレビュー環境
- **用途**: テスト・レビュー
- **特徴**: 本番同等、プルリクエスト毎に作成

### 本番環境（Production）
- **URL**: GitHub Pages / カスタムドメイン
- **用途**: 一般ユーザー向け
- **特徴**: 最適化、監視、高可用性

## 環境変数設定

### 開発環境
`.env.development`ファイル作成：
```env
VITE_APP_ENV=development
VITE_API_BASE_URL=http://localhost:3000
VITE_ENABLE_DEVTOOLS=true
```

### ステージング環境
プラットフォーム設定：
```env
VITE_APP_ENV=staging
VITE_API_BASE_URL=https://staging-api.example.com
VITE_ENABLE_DEVTOOLS=true
```

### 本番環境
プラットフォーム設定：
```env
VITE_APP_ENV=production
VITE_API_BASE_URL=https://api.example.com
VITE_ENABLE_DEVTOOLS=false
```

## ビルド設定

### 開発ビルド
```bash
npm run build:dev
```

### ステージングビルド
```bash
npm run build:staging
```

### 本番ビルド
```bash
npm run build
```

## プラットフォーム別設定

### GitHub Pages
```yaml
# .github/workflows/ci.yml
env:
  VITE_APP_ENV: production
  NODE_ENV: production
```

### Vercel
```json
// vercel.json
{
  "env": {
    "VITE_APP_ENV": "production"
  },
  "build": {
    "env": {
      "VITE_APP_ENV": "production"
    }
  }
}
```

### Netlify
```toml
# netlify.toml
[build.environment]
  VITE_APP_ENV = "production"
  NODE_ENV = "production"
```

## セキュリティ設定

### 環境別セキュリティ

**開発環境:**
- CORS: 緩い設定
- HTTPS: 不要
- 認証: 簡略化

**ステージング環境:**
- CORS: 本番同等
- HTTPS: 強制
- 認証: 本番同等

**本番環境:**
- CORS: 厳格
- HTTPS: 強制
- セキュリティヘッダー: 完全

### Content Security Policy

```javascript
// 環境別CSP設定
const cspByEnv = {
  development: "default-src 'self' 'unsafe-inline' 'unsafe-eval'; connect-src *",
  staging: "default-src 'self' 'unsafe-inline'; connect-src 'self' https://staging-api.example.com",
  production: "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; connect-src 'self' https://api.example.com"
};
```

## 監視・ログ設定

### 開発環境
- コンソールログ: 全レベル
- エラー追跡: ローカルのみ
- パフォーマンス: 基本計測

### ステージング環境
- コンソールログ: warn以上
- エラー追跡: 統合
- パフォーマンス: 詳細計測

### 本番環境
- コンソールログ: error のみ
- エラー追跡: 完全統合
- パフォーマンス: 継続監視

## デプロイ戦略

### ブランチ戦略
```
main ────────────→ 本番環境
 ↑
develop ─────────→ ステージング環境
 ↑
feature/xxx ─────→ プレビュー環境
```

### 自動デプロイ
```yaml
# プルリクエスト: プレビュー環境
# develop ブランチ: ステージング環境
# main ブランチ: 本番環境
```

## 品質管理

### テスト戦略
- **開発**: ユニットテスト
- **ステージング**: E2Eテスト + パフォーマンステスト
- **本番**: 監視 + ユーザーテスト

### リリース判定
1. ✅ 全テストパス
2. ✅ Lighthouse 90点以上
3. ✅ セキュリティ監査パス
4. ✅ ステージング環境での動作確認

## バックアップ・復旧

### バックアップ対象
- ソースコード: Git
- ビルド成果物: アーティファクト保存
- 設定ファイル: バージョン管理

### 復旧手順
1. 問題のあるデプロイを特定
2. 前回成功バージョンをロールバック
3. 問題の根本原因調査
4. 修正版のテスト・デプロイ

## パフォーマンス最適化

### 環境別最適化
- **開発**: 開発者体験優先
- **ステージング**: 本番同等の最適化
- **本番**: 最大限の最適化

### CDN設定
- GitHub Pages: CloudFlare経由
- Vercel: Edge Network
- Netlify: Global CDN

## 次のステップ

1. 監視ダッシュボード構築
2. アラート設定
3. パフォーマンス継続改善
4. ユーザーフィードバック統合
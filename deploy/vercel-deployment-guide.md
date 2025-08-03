# Vercel デプロイメントガイド

## 概要

ポケモンタイプ相性クイズアプリをVercelにデプロイし、カスタムドメイン `shou-devlog.com` を使用してアクセス可能にします。

## 前提条件

- Vercelアカウント
- GitHubリポジトリ
- Cloudflareで管理されている `shou-devlog.com` ドメイン

## デプロイ手順

### 1. Vercelプロジェクト作成

1. [Vercel](https://vercel.com)にログイン
2. 「Add New」→「Project」をクリック
3. GitHubリポジトリ（poke-type-quiz）をインポート
4. プロジェクト設定：
   ```
   Framework Preset: Vite
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm ci
   ```

### 2. 環境変数設定

Vercel Dashboard > Project Settings > Environment Variables:

```env
# 本番環境
NODE_ENV=production
VITE_APP_ENV=production

# Google Analytics（任意）
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Sentry（任意）
VITE_SENTRY_DSN=https://your-dsn@sentry.io/project-id
```

### 3. 自動デプロイ設定

- **本番環境**: `main` ブランチ → `pokemon.shou-devlog.com`
- **プレビュー環境**: `develop` ブランチ → 自動生成URL
- **Pull Request**: 自動プレビューデプロイ

## カスタムドメイン設定

### 1. Vercelドメイン追加

1. Vercel Dashboard > Project Settings > Domains
2. 「Add Domain」をクリック
3. ドメインを入力: `pokemon.shou-devlog.com`
4. 「Add」をクリック

### 2. Cloudflare DNS設定

Cloudflare Dashboard > DNS > Records:

```
Type: CNAME
Name: pokemon
Content: cname.vercel-dns.com
Proxy status: プロキシ済み（オレンジクラウド）
TTL: Auto
```

### 3. SSL/TLS設定

Cloudflare > SSL/TLS:
- **暗号化モード**: フル (厳密)
- **最小TLSバージョン**: 1.2
- **Always Use HTTPS**: 有効

### 4. Cloudflare設定最適化

**Speed > Optimization:**
- Auto Minify: JavaScript, CSS, HTML 有効
- Brotli: 有効
- Rocket Loader: 有効

**Caching > Configuration:**
- Browser Cache TTL: 1年間
- Development Mode: 無効（本番のみ）

**Security > WAF:**
- セキュリティレベル: 中
- Bot Fight Mode: 有効

## パフォーマンス最適化

### 1. Vercel Analytics統合

```typescript
// vercel.json に追加
{
  "analytics": {
    "enable": true
  },
  "speed": {
    "enable": true
  }
}
```

### 2. Edge Functions（将来的）

```typescript
// api/analytics.ts
export default function handler(req, res) {
  // カスタム分析処理
}
```

### 3. ISR（Incremental Static Regeneration）

現在のSPAでは不要ですが、将来SSRに移行する場合:

```typescript
// next.config.js (Next.js移行時)
module.exports = {
  experimental: {
    isrMemoryCacheSize: 0,
  },
}
```

## 監視・アラート設定

### 1. Vercel Analytics

- Core Web Vitals監視
- Real User Monitoring
- エラー率追跡

### 2. Cloudflare Analytics

- トラフィック分析
- セキュリティイベント
- パフォーマンス指標

### 3. アップタイム監視

外部サービス（UptimeRobot等）で `pokemon.shou-devlog.com` を監視:

```
Check Type: HTTP(s)
URL: https://pokemon.shou-devlog.com
Interval: 5分
Alert Contacts: メール通知
```

## セキュリティ設定

### 1. Vercelセキュリティヘッダー

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",  
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Strict-Transport-Security",
          "value": "max-age=31536000; includeSubDomains"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self' https://www.google-analytics.com"
        }
      ]
    }
  ]
}
```

### 2. Cloudflare Security

- **Page Rules**: HTTPS強制リダイレクト
- **Firewall Rules**: 悪意のあるトラフィックブロック
- **Rate Limiting**: DDoS攻撃保護

## CI/CD統合

### 1. GitHub Actions + Vercel

既存のCIパイプラインにVercel CLIを統合:

```yaml
# .github/workflows/vercel-deploy.yml
name: Vercel Deploy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run tests
        run: npm test
        
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

### 2. プレビューデプロイメント

Pull Request毎に自動プレビューデプロイ:
- URL: `poke-type-quiz-git-[branch]-[username].vercel.app`
- 本番前テスト環境として活用

## トラブルシューティング

### 1. デプロイエラー

**ビルドエラー:**
```bash
# ローカルでビルド確認
npm run build

# 依存関係の確認
npm audit
```

**環境変数エラー:**
- Vercel Dashboard で環境変数が正しく設定されているか確認
- 再デプロイが必要な場合がある

### 2. ドメインエラー

**DNS設定確認:**
```bash
# DNS伝播確認
nslookup pokemon.shou-devlog.com

# SSL証明書確認
openssl s_client -connect pokemon.shou-devlog.com:443
```

**Cloudflare設定:**
- プロキシ設定（オレンジクラウド）が有効か確認
- SSL/TLS暗号化モードが「フル (厳密)」か確認

### 3. パフォーマンス問題

**Lighthouse監査:**
```bash
npm run lighthouse
```

**Core Web Vitals確認:**
- Vercel Analytics ダッシュボード
- Google PageSpeed Insights

## 運用チェックリスト

### デプロイ前
- [ ] ローカルでビルド成功
- [ ] 全テストパス
- [ ] Lighthouse スコア 90点以上
- [ ] Cross-browser テスト完了

### デプロイ後
- [ ] 本番URLアクセス確認
- [ ] Core Web Vitals確認
- [ ] Analytics動作確認
- [ ] エラー監視システム確認

### 定期確認（週次）
- [ ] Vercel Analytics レビュー
- [ ] エラー率確認
- [ ] パフォーマンス指標確認
- [ ] セキュリティログ確認

## サポートリソース

- **Vercel Documentation**: https://vercel.com/docs
- **Cloudflare Documentation**: https://developers.cloudflare.com/
- **プロジェクト固有設定**: `vercel.json`
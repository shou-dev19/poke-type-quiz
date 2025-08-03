# shou-devlog.com ドメイン設定ガイド

## 概要

既存の `shou-devlog.com` ドメインにサブドメイン `pokemon.shou-devlog.com` を追加し、ポケモンタイプ相性クイズアプリにアクセス可能にします。

## ドメイン構成

- **メインドメイン**: `shou-devlog.com` （既存ポートフォリオサイト）
- **新規サブディレクトリ**: `shou-devlog.com/pokemon-quiz` （ポケモンクイズアプリ）

## 設定手順

### 1. Vercel プロジェクト設定

1. Vercel Dashboard にログイン
2. ポケモンクイズプロジェクトを選択
3. Settings > Domains をクリック
4. 「Add Domain」をクリック
5. `shou-devlog.com` を入力（既存ドメインを使用）
6. 「Add」をクリック

### 2. Cloudflare 設定確認

既存の `shou-devlog.com` の設定を確認:

```
Type: CNAME (既存)
Name: shou-devlog.com
Content: cname.vercel-dns.com
Proxy status: プロキシ済み（オレンジクラウド有効）
TTL: Auto
```

### 3. SSL/TLS設定（Cloudflare）

Cloudflare > SSL/TLS で以下を確認・設定:

```
暗号化モード: フル (厳密)
最小TLSバージョン: 1.2
TLS 1.3: 有効
Always Use HTTPS: 有効
HTTP Strict Transport Security (HSTS): 有効
```

### 4. パフォーマンス最適化（Cloudflare）

**Speed > Optimization:**
```
Auto Minify:
  - JavaScript: 有効
  - CSS: 有効  
  - HTML: 有効
Brotli: 有効
Rocket Loader: 有効（テスト後問題なければ）
```

**Caching > Configuration:**
```
Browser Cache TTL: 1年間
Development Mode: 無効
```

**Page Rules設定:**
```
URL: pokemon.shou-devlog.com/*
Settings:
  - Always Use HTTPS: オン
  - Cache Level: Cache Everything
  - Edge Cache TTL: 1か月
```

### 5. セキュリティ設定（Cloudflare）

**Security > WAF:**
```
Security Level: 中
Bot Fight Mode: 有効
Challenge Passage: 30分
```

**Firewall Rules:**
```
Rule Name: Block Known Malicious IPs
Expression: (ip.geoip.country in {"CN" "RU"}) and (cf.threat_score gt 10)
Action: Block
```

**Rate Limiting:**
```
Rule Name: API Rate Limit
URL Pattern: pokemon.shou-devlog.com/*
Requests: 100 per 10 minutes per IP
Action: Block
```

## 環境変数設定

### Vercel Environment Variables

Production環境に以下を設定:

```env
# 基本設定
NODE_ENV=production
VITE_APP_ENV=production
VITE_APP_URL=https://pokemon.shou-devlog.com

# Analytics（Google Analytics使用時）
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Error Monitoring（Sentry使用時）
VITE_SENTRY_DSN=https://your-dsn@sentry.io/project-id
VITE_SENTRY_ENVIRONMENT=production

# Performance Monitoring
VITE_ENABLE_ANALYTICS=true
```

## デプロイ確認手順

### 1. DNS伝播確認

```bash
# DNS設定確認
nslookup pokemon.shou-devlog.com

# 期待する結果:
# pokemon.shou-devlog.com canonical name = cname.vercel-dns.com
```

### 2. SSL証明書確認

```bash
# SSL証明書情報確認
openssl s_client -connect pokemon.shou-devlog.com:443 -servername pokemon.shou-devlog.com

# ブラウザでも確認:
# https://pokemon.shou-devlog.com にアクセスし、鍵マークをクリック
```

### 3. パフォーマンステスト

```bash
# Lighthouse CLI実行
npx lighthouse https://pokemon.shou-devlog.com --view

# 期待スコア:
# Performance: 90+
# Accessibility: 90+
# Best Practices: 90+
# SEO: 90+
```

### 4. 機能テスト

- [ ] トップページ読み込み
- [ ] クイズ開始機能
- [ ] アニメーション動作
- [ ] レスポンシブデザイン（モバイル/デスクトップ）
- [ ] エラーハンドリング

## モニタリング設定

### 1. Cloudflare Analytics

Cloudflare > Analytics で以下を監視:
- トラフィック数
- 帯域幅使用量
- リクエスト状況
- セキュリティイベント
- パフォーマンス指標

### 2. Vercel Analytics

Vercel Dashboard > Analytics で以下を監視:
- Real User Monitoring
- Core Web Vitals
- エラー率
- 関数実行時間

### 3. アップタイム監視

外部監視サービス（UptimeRobot、Pingdom等）設定:
```
URL: https://pokemon.shou-devlog.com
Interval: 5分
Timeout: 30秒
Alert Contacts: メール通知
```

## トラブルシューティング

### DNSエラー

**症状**: `pokemon.shou-devlog.com` にアクセスできない

**対処法**:
1. Cloudflare DNS設定確認
2. DNS伝播待ち（最大48時間）
3. Vercelドメイン設定確認

### SSL証明書エラー

**症状**: 「安全でない接続」警告

**対処法**:
1. Cloudflare SSL/TLS設定確認
2. Vercel SSL証明書再発行
3. ブラウザキャッシュクリア

### パフォーマンス問題

**症状**: ページ読み込みが遅い

**対処法**:
1. Cloudflare キャッシュ設定確認
2. Vercel function実行時間確認
3. ネットワーク経路確認

## 本番リリース チェックリスト

### デプロイ前
- [ ] ローカルテスト完了
- [ ] ステージング環境テスト完了
- [ ] パフォーマンステスト完了
- [ ] セキュリティスキャン完了

### デプロイ後
- [ ] DNS設定確認
- [ ] SSL証明書確認
- [ ] 機能テスト実行
- [ ] パフォーマンス測定
- [ ] 監視システム確認

### 24時間後
- [ ] エラーログ確認
- [ ] トラフィック状況確認
- [ ] Core Web Vitals確認
- [ ] ユーザーフィードバック確認

## 運用・保守

### 定期確認（週次）
- Cloudflare Analytics レビュー
- Vercel Analytics レビュー
- エラーログ確認
- セキュリティイベント確認

### 定期確認（月次）
- パフォーマンス トレンド分析
- SSL証明書有効期限確認
- ドメイン更新期限確認
- バックアップ状況確認

## 緊急時対応

### サイトダウン時
1. Vercel Status Page確認
2. Cloudflare Status Page確認
3. DNS設定確認
4. 必要に応じてメンテナンスページ表示

### セキュリティインシデント
1. 攻撃源IP特定・ブロック
2. Cloudflare Security Center確認
3. ログ解析・影響範囲調査
4. 必要に応じてサイト一時停止
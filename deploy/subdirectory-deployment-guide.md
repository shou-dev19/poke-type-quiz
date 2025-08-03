# サブディレクトリ構成デプロイガイド

## 概要

ポケモンタイプ相性クイズアプリを `shou-devlog.com/pokemon-quiz` のサブディレクトリ構成でデプロイする方法を説明します。

## URL構成

```
shou-devlog.com/portfolio      # 既存ポートフォリオサイト
shou-devlog.com/pokemon-quiz   # ポケモンクイズアプリ（新規）
```

## Vercel設定

### 1. vercel.json設定

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm ci",
  "framework": "vite",
  "analytics": {
    "enable": true
  },
  "speed": {
    "enable": true
  },
  "rewrites": [
    {
      "source": "/pokemon-quiz/(.*)",
      "destination": "/index.html"
    },
    {
      "source": "/pokemon-quiz",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/pokemon-quiz/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### 2. Vite設定

```typescript
// vite.config.ts
export default defineConfig({
  base: '/pokemon-quiz/', // サブディレクトリパス
  plugins: [react()],
  // その他の設定...
})
```

## デプロイ手順

### 1. 既存ドメイン活用

- **ドメイン**: `shou-devlog.com` （既存を活用）
- **新規DNS設定**: 不要
- **SSL証明書**: 既存を継続使用

### 2. Vercel プロジェクト設定

1. Vercel Dashboard > Project Settings
2. Domains > Add Domain
3. `shou-devlog.com` を設定（既存ドメイン）
4. パスルーティングはvercel.jsonで制御

### 3. ビルド・デプロイ

```bash
# ビルド確認（ローカル）
npm run build

# 本番デプロイ
git push origin main
# GitHub Actionsが自動実行
```

## URL管理

### 1. アセットパス

**Before（ルート構成）:**
```
/images/types/fire.svg
/assets/main.js
```

**After（サブディレクトリ構成）:**
```
/pokemon-quiz/images/types/fire.svg
/pokemon-quiz/assets/main.js
```

### 2. 内部リンク

React Router使用時の注意点:
```typescript
// 正しい書き方
<Link to="/pokemon-quiz/quiz">クイズ開始</Link>

// または環境変数使用
const BASE_URL = import.meta.env.BASE_URL;
<Link to={`${BASE_URL}quiz`}>クイズ開始</Link>
```

## SEO設定

### 1. メタタグ更新

```html
<!-- index.html -->
<meta property="og:url" content="https://shou-devlog.com/pokemon-quiz" />
<link rel="canonical" href="https://shou-devlog.com/pokemon-quiz" />
```

### 2. サイトマップ

```xml
<!-- sitemap.xml（メインサイトに追加） -->
<url>
  <loc>https://shou-devlog.com/pokemon-quiz</loc>
  <lastmod>2025-08-03</lastmod>
  <priority>0.8</priority>
  <changefreq>monthly</changefreq>
</url>
```

### 3. robots.txt

```txt
# robots.txt（メインサイトに追加）
User-agent: *
Allow: /pokemon-quiz/

Sitemap: https://shou-devlog.com/sitemap.xml
```

## Cloudflare最適化

### 1. Page Rules設定

```
URL: shou-devlog.com/pokemon-quiz/*
Settings:
  - Cache Level: Cache Everything
  - Edge Cache TTL: 1 month
  - Browser Cache TTL: 1 year
```

### 2. キャッシュ戦略

**静的アセット:**
```
/pokemon-quiz/assets/* → 1年間キャッシュ
/pokemon-quiz/images/* → 1ヶ月キャッシュ
/pokemon-quiz/index.html → キャッシュなし
```

## 分析・監視

### 1. Google Analytics設定

```javascript
// GA4設定
gtag('config', 'GA_MEASUREMENT_ID', {
  page_title: 'Pokemon Quiz',
  page_location: 'https://shou-devlog.com/pokemon-quiz',
});
```

### 2. Vercel Analytics

- Real User Monitoring対応
- Core Web Vitals計測
- サブディレクトリ別分析可能

## テスト確認

### 1. ローカルテスト

```bash
# ビルド確認
npm run build

# ローカルプレビュー（サブディレクトリ対応）
npm run preview
# http://localhost:4173/pokemon-quiz でアクセス
```

### 2. 本番確認項目

- [ ] `https://shou-devlog.com/pokemon-quiz` アクセス可能
- [ ] アセット読み込み正常（画像・CSS・JS）
- [ ] 内部ナビゲーション動作
- [ ] PWA機能（将来実装時）
- [ ] SEOメタデータ正常

## トラブルシューティング

### 1. 404エラー

**症状**: `/pokemon-quiz` で404エラー

**対処法:**
1. vercel.json の rewrites設定確認
2. ビルドファイル構成確認
3. Vercel デプロイログ確認

### 2. アセット読み込みエラー

**症状**: CSS・画像が表示されない

**対処法:**
1. vite.config.ts の `base` 設定確認
2. index.html のパス確認
3. ブラウザDevToolsでパス確認

### 3. SEO問題

**症状**: 検索エンジンにインデックスされない

**対処法:**
1. sitemap.xml追加
2. Google Search Console登録
3. canonical URL設定確認

## 運用・保守

### 1. 定期確認

- ポートフォリオサイトとの競合チェック
- パフォーマンス指標監視
- SEOランキング確認

### 2. 将来の拡張

```
shou-devlog.com/
├── portfolio/          # 既存
├── pokemon-quiz/       # 新規
├── future-app1/        # 将来追加可能
└── future-app2/        # 将来追加可能
```

### 3. バックアップ戦略

- ソースコード: Git管理
- デプロイ設定: vercel.json管理
- ドメイン設定: Cloudflare管理
- 分析データ: 定期エクスポート

## メリット・デメリット

### メリット
- ✅ 既存ドメインのSEO権威性活用
- ✅ DNS・SSL設定の簡素化
- ✅ 統一されたブランディング
- ✅ 管理コストの削減

### デメリット
- ❌ 独立したキャッシュ制御の制限
- ❌ サブドメインより複雑なルーティング
- ❌ 将来的なドメイン分離時の移行コスト

## 結論

サブディレクトリ構成により、既存のポートフォリオサイトとの統合性を保ちながら、効率的な運用が可能になります。
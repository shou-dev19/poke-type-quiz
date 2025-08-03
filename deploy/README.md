# デプロイガイド

## 概要

ポケモンタイプ相性クイズアプリのデプロイ設定とガイドです。

## サポートするプラットフォーム

### 1. GitHub Pages（推奨）
✅ **設定済み** - `.github/workflows/ci.yml`で自動デプロイ

**メリット：**
- 無料
- GitHubと統合
- 自動デプロイ
- HTTPS対応

**設定方法：**
1. GitHubリポジトリの Settings > Pages
2. Source: "GitHub Actions" を選択
3. `main`ブランチへのpushで自動デプロイ

**URL:** `https://[username].github.io/[repository-name]`

### 2. Vercel
✅ **設定済み** - `vercel.json`設定ファイル作成済み

**メリット：**
- 高速CDN
- プレビューデプロイ
- 自動HTTPS
- カスタムドメイン対応

**設定方法：**
1. [Vercel](https://vercel.com)でアカウント作成
2. GitHubリポジトリをインポート
3. `vercel.json`設定が自動適用
4. 自動デプロイ開始

### 3. Netlify
✅ **設定済み** - `netlify.toml`設定ファイル作成済み

**メリット：**
- フォーム処理
- サーバーレス関数
- A/Bテスト機能
- 高度な配信設定

**設定方法：**
1. [Netlify](https://netlify.com)でアカウント作成
2. GitHubリポジトリを接続
3. `netlify.toml`設定が自動適用
4. 自動デプロイ開始

## デプロイ手順

### GitHub Pages
```bash
# メインブランチにpushするだけ
git push origin main
# GitHub Actionsが自動実行されデプロイ完了
```

### Vercel CLI
```bash
# Vercel CLIインストール
npm i -g vercel

# プロジェクトセットアップ
vercel

# デプロイ
vercel --prod
```

### Netlify CLI
```bash
# Netlify CLIインストール
npm i -g netlify-cli

# ログイン
netlify login

# サイト作成・デプロイ
netlify deploy --prod --dir=dist
```

## 環境変数設定

プラットフォームごとに以下の環境変数を設定：

### 共通設定
```
NODE_VERSION=20
NPM_VERSION=latest
BUILD_COMMAND=npm run build
PUBLISH_DIRECTORY=dist
```

### 本番環境用
```
NODE_ENV=production
VITE_APP_ENV=production
```

## カスタムドメイン設定

### 1. DNSレコード設定
```
Type: CNAME
Name: pokemon-quiz (または任意のサブドメイン)
Value: [プラットフォームのドメイン]
```

### 2. プラットフォーム別設定

**GitHub Pages:**
- `public/CNAME`ファイルに記載
- Settings > Pages > Custom domain

**Vercel:**
- Dashboard > Project > Settings > Domains

**Netlify:**
- Site settings > Domain management > Custom domains

## セキュリティ設定

全プラットフォームで以下のセキュリティヘッダーを設定済み：

```
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
```

## パフォーマンス最適化

### キャッシュ設定
- **アセットファイル**: 1年間キャッシュ（immutable）
- **HTMLファイル**: キャッシュなし（動的更新）

### CDN最適化
- 全プラットフォームでCDN配信
- 地理的に最適化されたキャッシュ

## 監視・ログ

### デプロイ状況確認
- GitHub Actions: Actions タブで確認
- Vercel: Dashboard > Deployments
- Netlify: Site overview > Deploys

### エラー監視
- ビルドエラー: 各プラットフォームのログ
- ランタイムエラー: ブラウザConsole + 監視ツール

## トラブルシューティング

### ビルドエラー
```bash
# ローカルでビルド確認
npm run build

# 型チェック
npm run type-check

# テスト実行
npm test
```

### ルーティングエラー
- SPA設定が正しく設定されているか確認
- リダイレクト設定を確認

### パフォーマンス問題
- Lighthouse CIレポート確認
- バンドルサイズ分析

## 推奨デプロイ戦略

1. **開発**: GitHub Pages（無料・シンプル）
2. **プロダクション**: Vercel（高速・高機能）
3. **エンタープライズ**: Netlify（高度な機能）

## 次のステップ

デプロイ完了後：
1. カスタムドメイン設定
2. 監視ツール統合（T028）
3. パフォーマンス継続監視
4. ユーザーフィードバック収集
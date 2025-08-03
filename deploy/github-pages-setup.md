# GitHub Pages セットアップガイド

## 概要
このガイドでは、ポケモンタイプ相性クイズアプリをGitHub Pagesにデプロイする手順を説明します。

## 前提条件
- GitHubアカウント
- リポジトリの管理者権限
- CI/CDワークフローファイルが設定済み

## セットアップ手順

### 1. リポジトリ設定

1. GitHubリポジトリページにアクセス
2. **Settings** タブをクリック
3. 左サイドバーの **Pages** をクリック

### 2. Pages設定

1. **Source** セクションで以下を選択：
   - Source: `Deploy from a branch` → `GitHub Actions` に変更
   
2. **Custom domain** セクション（オプション）：
   - カスタムドメインを使用する場合はドメイン名を入力
   - `public/CNAME`ファイルも更新

### 3. リポジトリ権限設定

1. **Settings** > **Actions** > **General**
2. **Workflow permissions** セクション：
   - `Read and write permissions` を選択
   - `Allow GitHub Actions to create and approve pull requests` をチェック

### 4. デプロイ実行

```bash
# mainブランチにpush
git push origin main
```

### 5. デプロイ確認

1. **Actions** タブでワークフロー実行状況を確認
2. 緑色のチェックマークでデプロイ成功を確認
3. **Settings** > **Pages** でサイトURLを確認

## URL構成

- **デフォルトURL**: `https://[ユーザー名].github.io/[リポジトリ名]`
- **カスタムドメイン**: `https://[設定したドメイン]`

## トラブルシューティング

### ビルドエラー
- **Actions**タブでエラーログを確認
- ローカルで`npm run build`が成功することを確認

### 404エラー
- SPAルーティング設定を確認
- `dist/404.html`ファイルが存在することを確認

### 権限エラー
- リポジトリのActions権限設定を確認
- `GITHUB_TOKEN`の権限を確認

## セキュリティ考慮事項

### HTTPS強制
GitHub Pagesは自動的にHTTPS対応されます。

### セキュリティヘッダー
GitHub Pagesでは一部制限がありますが、アプリケーション側で以下を実装：
- Content Security Policy
- X-Frame-Options
- XSS Protection

## パフォーマンス最適化

### キャッシュ活用
- GitHub PagesのCDNを活用
- アセットファイルの最適化済み

### 監視設定
- GitHub Actions内でLighthouse CI実行
- パフォーマンス指標の継続監視

## 次のステップ

1. カスタムドメイン設定（オプション）
2. 監視ツール統合
3. ユーザーフィードバック収集システム
4. A/Bテスト環境構築

## サポート

問題が発生した場合：
1. GitHub Actionsログを確認
2. GitHub Pagesのステータスページを確認
3. GitHub Communityで質問
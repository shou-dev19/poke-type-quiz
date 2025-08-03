# Vercel シークレット設定ガイド

## 概要

GitHub ActionsからVercelへの自動デプロイに必要なシークレット（認証情報）の設定方法を説明します。

## 必要なシークレット

### 1. VERCEL_TOKEN（Vercel API Token）

**取得方法:**
1. [Vercel Dashboard](https://vercel.com/dashboard) にログイン
2. Settings > Tokens をクリック
3. 「Create Token」をクリック
4. Token名を入力（例: `pokemon-quiz-ci`）
5. Scope: Full Account を選択
6. Expiration: No Expiration または適切な期間を設定
7. 「Create Token」をクリック
8. 表示されたトークンをコピー（一度しか表示されません）

**GitHub Secrets設定:**
- Repository Settings > Secrets and variables > Actions
- 「New repository secret」をクリック
- Name: `VERCEL_TOKEN`
- Secret: コピーしたトークンを貼り付け

### 2. VERCEL_ORG_ID（Organization ID）

**取得方法:**
1. Vercel Dashboard > Settings > General
2. 「Organization ID」をコピー

**GitHub Secrets設定:**
- Name: `VERCEL_ORG_ID`  
- Secret: コピーしたOrganization IDを貼り付け

### 3. VERCEL_PROJECT_ID（Project ID）

**取得方法:**
1. Vercelプロジェクトダッシュボード
2. Settings > General
3. 「Project ID」をコピー

**GitHub Secrets設定:**
- Name: `VERCEL_PROJECT_ID`
- Secret: コピーしたProject IDを貼り付け

## 環境変数設定

### Vercel Dashboard での設定

Project Settings > Environment Variables で以下を設定:

**Production Environment:**
```env
NODE_ENV=production
VITE_APP_ENV=production
VITE_APP_URL=https://pokemon.shou-devlog.com
```

**Preview Environment:**
```env
NODE_ENV=production
VITE_APP_ENV=staging
```

**Development Environment:**
```env
NODE_ENV=development
VITE_APP_ENV=development
```

### 分析・監視ツール（オプション）

**Google Analytics:**
```env
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

**Sentry Error Monitoring:**
```env
VITE_SENTRY_DSN=https://your-dsn@sentry.io/project-id
VITE_SENTRY_ENVIRONMENT=production
```

## セキュリティ設定

### 1. トークン権限の最小化

Vercel API Tokenの権限を必要最小限に設定:
- Deploy権限: 必須
- Domain権限: ドメイン管理する場合のみ
- Team権限: 不要（個人プロジェクトの場合）

### 2. トークン有効期限設定

- 定期的なローテーション（推奨: 90日）
- 使用されなくなったトークンの無効化
- アクセスログの定期確認

### 3. GitHub Secrets のアクセス制御

Repository Settings > Actions > General:
- Fork pull request workflows: Require approval for first-time contributors
- Fork pull request workflows in private repositories: Require approval for all outside collaborators

## CI/CD パイプライン設定

### 1. ワークフローファイル確認

`.github/workflows/vercel-deploy.yml` の内容確認:

```yaml
env:
  VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
  VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}

# ...

- name: Deploy Project Artifacts to Vercel
  run: vercel deploy --prebuilt --prod --token=${{ secrets.VERCEL_TOKEN }}
```

### 2. デプロイ戦略

**本番デプロイ:**
- Trigger: `main` ブランチへのpush
- URL: `pokemon.shou-devlog.com`
- 事前テスト: 必須

**プレビューデプロイ:**
- Trigger: Pull Request作成・更新
- URL: 自動生成 (`pokemon-quiz-git-[branch]-[username].vercel.app`)
- 用途: レビュー・テスト

### 3. ロールバック戦略

問題発生時の自動ロールバック設定:

```yaml
- name: Health Check
  run: |
    curl -f https://pokemon.shou-devlog.com || exit 1
    
- name: Rollback on failure
  if: failure()
  run: |
    vercel rollback --token=${{ secrets.VERCEL_TOKEN }}
```

## 監視・アラート設定

### 1. デプロイ成功・失敗通知

GitHub Actions > Settings で Slack/Discord通知設定:

```yaml
- name: Notify Success
  if: success()
  uses: 8398a7/action-slack@v3
  with:
    status: success
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
    
- name: Notify Failure  
  if: failure()
  uses: 8398a7/action-slack@v3
  with:
    status: failure
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

### 2. Vercel Deployment Hooks

Vercel > Project Settings > Git で以下を設定:
- Auto-deploy branches: `main` のみ
- Ignored Build Step: `git diff HEAD^ HEAD --quiet . && echo "🛑 Build cancelled"`
- Protection bypass for automation: 有効

## トラブルシューティング

### 1. 認証エラー

**症状**: `Error: Invalid token`

**対処法:**
1. VERCEL_TOKEN の有効性確認
2. トークン権限確認
3. 新しいトークン生成・設定

### 2. プロジェクト ID エラー

**症状**: `Error: Project not found`

**対処法:**
1. VERCEL_PROJECT_ID の正確性確認
2. プロジェクトアクセス権限確認
3. Organization ID 確認

### 3. デプロイエラー

**症状**: ビルドまたはデプロイ失敗

**対処法:**
1. ローカルビルド確認: `npm run build`
2. 環境変数設定確認
3. Vercel ログ確認
4. 依存関係確認: `npm audit`

### 4. ドメイン設定エラー

**症状**: カスタムドメインに接続できない

**対処法:**
1. DNS設定確認（Cloudflare）
2. Vercel ドメイン設定確認
3. SSL証明書状態確認
4. DNS伝播待ち（最大48時間）

## ベストプラクティス

### 1. セキュリティ

- シークレット値をコードに直接記述しない
- 環境ごとに異なる設定値を使用
- 定期的なトークンローテーション
- アクセスログの監視

### 2. 運用

- デプロイ前のテスト自動化
- ヘルスチェック設定
- ロールバック手順の整備
- 監視・アラート設定

### 3. パフォーマンス

- ビルドキャッシュ活用
- 不要な依存関係の除去
- バンドルサイズ最適化
- CDN最適化設定

## 次のステップ

1. シークレット設定完了後のテストデプロイ実行
2. カスタムドメイン設定
3. 監視システム統合
4. 運用手順書作成
5. インシデント対応プロセス構築
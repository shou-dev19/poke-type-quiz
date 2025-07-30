# 開発環境セットアップ手順

## 前提条件

- Visual Studio Code がインストールされていること
- Docker Desktop がインストールされ、起動していること
- Dev Containers 拡張機能がVSCodeにインストールされていること

## セットアップ手順

### 1. リポジトリのクローン

```bash
git clone <repository-url>
cd poke-type-quiz
```

### 2. Devcontainerでの開発環境起動

1. VSCodeでプロジェクトフォルダを開く
2. コマンドパレット（`Ctrl+Shift+P` / `Cmd+Shift+P`）を開く
3. "Dev Containers: Reopen in Container" を選択
4. 初回起動時は Docker イメージのダウンロードと環境構築が実行されます（数分かかります）

### 3. 環境変数の設定

1. `.env.example` ファイルを `.env` にコピー
2. 必要に応じて環境変数の値を調整

```bash
cp .env.example .env
```

### 4. 依存関係のインストール

Devcontainer起動時に自動実행されますが、手動でも実行可能：

```bash
npm install
```

## 開発環境の特徴

### 自動設定される機能

- **Node.js 18+**: 最新のNode.js環境
- **TypeScript**: 完全なTypeScript開発環境
- **ESLint + Prettier**: コード品質とフォーマット
- **Git**: バージョン管理
- **拡張機能**: TypeScript、Prettier、ESLint等が自動インストール

### ポート転送

以下のポートが自動的に転送されます：

- **3000**: メイン開発サーバー
- **5173**: Vite開発サーバー
- **8080**: プレビューサーバー

### VSCode設定

- **フォーマット**: 保存時に自動フォーマット
- **ESLint**: 保存時にコード修正
- **TypeScript**: インポートの自動更新
- **タブサイズ**: 2スペース

## トラブルシューティング

### Docker関連エラー

1. Docker Desktopが起動していることを確認
2. WSL2（Windows）が有効になっていることを確認
3. Dockerのディスク容量を確認

### Devcontainer起動エラー

1. VSCodeを再起動
2. "Dev Containers: Rebuild Container" を実行
3. Docker イメージをクリア：`docker system prune -a`

### パフォーマンス改善

- **Windows**: WSL2内でプロジェクトを作業することを推奨
- **macOS**: Docker Desktop の設定でリソース割り当てを調整
- **Linux**: 通常は追加設定不要

## Claude Code での開発

この環境はClaude Codeでの開発に最適化されています：

- 一貫したコード品質設定
- 自動フォーマットとリント
- TypeScript完全サポート
- テスト環境の統合

## 環境変数一覧

| 変数名 | デフォルト値 | 説明 |
|--------|-------------|------|
| `NODE_ENV` | `development` | 実行環境 |
| `USE_API` | `false` | API使用フラグ |
| `API_BASE_URL` | `http://localhost:3001` | APIベースURL |
| `DEFAULT_DIFFICULTY` | `normal` | デフォルト難易度 |
| `DEFAULT_QUESTION_COUNT` | `10` | デフォルト問題数 |

## 次のステップ

環境セットアップが完了したら、以下のタスクに進んでください：

1. **Task 1.1**: プロジェクトセットアップ
2. **Task 1.2**: クリーンアーキテクチャ基盤実装

## サポート

問題が発生した場合は、開発チームまでお問い合わせください。
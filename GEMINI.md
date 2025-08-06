# Gemini プロジェクト構成ガイド

## 概要

当プロジェクトは、React(TypeScript)で構築されたポケモンタイプ相性クイズアプリケーションです。Viteをビルドツールとして使用し、UIコンポーネントはshadcn/ui、スタイリングはTailwind CSSを採用しています。テストはVitestとPlaywright、デプロイはVercelとNetlifyで行っています。

## 主要技術スタック

*   **フレームワーク**: React 18.2.0
*   **言語**: TypeScript 5.2.2
*   **ビルドツール**: Vite 5.0.8
*   **UIコンポーネント**: shadcn/ui (Radix UIベース)
*   **スタイリング**: Tailwind CSS 3.4.0
*   **状態管理**: React Hooks (useState)
*   **テスト**:
    *   ユニット/コンポーネントテスト: Vitest
    *   E2Eテスト: Playwright
*   **リンター**: ESLint
*   **フォーマッター**: Prettier
*   **パッケージマネージャー**: npm
*   **デプロイ先**: Vercel, Netlify

## ディレクトリ構成

```
/workspace
├── .github/              # GitHub Actionsワークフロー
├── .vscode/              # VSCode設定
├── dist/                 # ビルド成果物
├── docs/                 # プロジェクトドキュメント
├── node_modules/         # 依存パッケージ
├── public/               # 静的ファイル
├── src/                  # ソースコード
│   ├── components/       # Reactコンポーネント
│   │   ├── ui/           # shadcn/uiコンポーネント
│   │   └── __tests__/    # コンポーネントテスト
│   ├── styles/           # グローバルCSS
│   ├── test/             # テスト設定
│   ├── types/            # 型定義
│   └── utils/            # ユーティリティ関数
├── tests/                # E2Eテスト
│   └── e2e/
├── .eslintrc.cjs         # ESLint設定
├── netlify.toml          # Netlify設定
├── package.json          # プロジェクト定義と依存関係
├── playwright.config.ts  # Playwright設定
├── tailwind.config.js    # Tailwind CSS設定
├── tsconfig.json         # TypeScript設定
├── vercel.json           # Vercel設定
├── vite.config.ts        # Vite設定
└── vitest.config.ts      # Vitest設定
```

## 主要なスクリプト

| コマンド | 説明 |
| :--- | :--- |
| `npm run dev` | 開発サーバーを起動します。 |
| `npm run build` | プロダクション用にプロジェクトをビルドします。 |
| `npm run lint` | ESLintでコードを静的解析します。 |
| `npm run format` | Prettierでコードをフォーマットします。 |
| `npm run test` | Vitestでユニットテストを実行します。 |
| `npm run test:e2e` | PlaywrightでE2Eテストを実行します。 |
| `npm run ci` | 型チェック、リンター、テスト、ビルドをまとめて実行します。 |
| `npm run deploy:vercel` | Vercelにデプロイします。 |

## コーディング規約

*   **リンター**: ESLint (`.eslintrc.cjs`参照)
*   **フォーマッター**: Prettier (`.prettierrc`参照)
*   **スタイル**: Tailwind CSSのユーティリティクラスを基本とします。

## テスト戦略

*   **ユニットテスト**: `src/utils`などのビジネスロジックを中心にVitestで記述します。
*   **コンポーネントテスト**: `src/components`内の各コンポーネントの振る舞いをVitestとReact Testing Libraryでテストします。
*   **E2Eテスト**: Playwrightを使用して、ユーザーの主要な操作フローをテストします。テストコードは`tests/e2e`に配置します。

## ビルドとデプロイ

*   **ビルド**: `npm run build`コマンドで`dist`ディレクトリに成果物が出力されます。
*   **デプロイ**:
    *   Vercel: `vercel.json`の設定に基づき、`main`ブランチへのプッシュをトリガーに自動デプロイされます。
    *   Netlify: `netlify.toml`の設定に基づき、デプロイされます。

## 状態管理

*   コンポーネント間の状態の受け渡しは、ReactのPropsとコールバック関数を基本とします。
*   アプリケーション全体のグローバルな状態は、`src/App.tsx`コンポーネントで管理しています。

---
*このドキュメントはGeminiによって自動生成されました。プロジェクトの構成変更があった場合は、適宜更新してください。*

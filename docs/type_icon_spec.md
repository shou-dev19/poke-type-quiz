# ポケモンタイプアイコン設計仕様

## 概要
type_table.png画像のヘッダー部分を参考に、各タイプの公式カラーとシンボルに基づいたアイコンを作成する。

## タイプ別アイコン仕様

| タイプID | 日本語名 | 基本カラー | シンボル | アニメーション |
|----------|----------|------------|----------|----------------|
| normal | ノーマル | #A8A878 | 丸/円形 | シンプルな脈動 |
| fire | ほのお | #F08030 | 炎 | 炎の揺らぎ |
| water | みず | #6890F0 | 水滴 | 波紋・流れ |
| electric | でんき | #F8D030 | 稲妻 | 電気の火花 |
| grass | くさ | #78C850 | 葉っぱ | 風による揺れ |
| ice | こおり | #98D8D8 | 雪の結晶 | キラキラした輝き |
| fighting | かくとう | #C03028 | 拳 | パンチモーション |
| poison | どく | #A040A0 | ドクロ/毒泡 | 毒の泡が湧く |
| ground | じめん | #E0C068 | 山/地面 | 土が舞い上がる |
| flying | ひこう | #A890F0 | 羽 | 羽ばたき・風の流れ |
| psychic | エスパー | #F85888 | 目/サイキック | 光の揺らぎ |
| bug | むし | #A8B820 | 昆虫 | 羽音・飛び回る |
| rock | いわ | #B8A038 | 岩石 | 岩の欠片が落ちる |
| ghost | ゴースト | #705898 | 幽霊 | 揺らめく・消える |
| dragon | ドラゴン | #7038F8 | ドラゴン | オーラの放射 |
| dark | あく | #705848 | 邪悪マーク | 暗闇から現れる |
| steel | はがね | #B8B8D0 | 金属/歯車 | 金属光沢の反射 |
| fairy | フェアリー | #EE99AC | 星/妖精 | キラキラした粉 |

## アイコンデザインガイドライン

### 基本仕様
- **サイズ**: 64x64px（基本）、スケーラブル対応
- **フォーマット**: SVG（ベクター形式）
- **背景**: 透明またはタイプカラーの円形背景

### デザイン原則
1. **視認性**: 小さいサイズでも識別可能
2. **一貫性**: 統一されたデザインスタイル
3. **アニメーション対応**: CSS/JSアニメーションに適した構造

### カラーパレット詳細

#### プライマリカラー（メインカラー）
```css
:root {
  --type-normal: #A8A878;
  --type-fire: #F08030;
  --type-water: #6890F0;
  --type-electric: #F8D030;
  --type-grass: #78C850;
  --type-ice: #98D8D8;
  --type-fighting: #C03028;
  --type-poison: #A040A0;
  --type-ground: #E0C068;
  --type-flying: #A890F0;
  --type-psychic: #F85888;
  --type-bug: #A8B820;
  --type-rock: #B8A038;
  --type-ghost: #705898;
  --type-dragon: #7038F8;
  --type-dark: #705848;
  --type-steel: #B8B8D0;
  --type-fairy: #EE99AC;
}
```

#### セカンダリカラー（グラデーション・エフェクト用）
```css
:root {
  --type-normal-light: #C8C878;
  --type-fire-light: #FF6030;
  --type-water-light: #88B0FF;
  --type-electric-light: #FFF030;
  --type-grass-light: #98E870;
  --type-ice-light: #B8F8F8;
  --type-fighting-light: #E05048;
  --type-poison-light: #C060C0;
  --type-ground-light: #FFE088;
  --type-flying-light: #C8B0FF;
  --type-psychic-light: #FF78A8;
  --type-bug-light: #C8D840;
  --type-rock-light: #D8C058;
  --type-ghost-light: #9078B8;
  --type-dragon-light: #9058FF;
  --type-dark-light: #906868;
  --type-steel-light: #D8D8F0;
  --type-fairy-light: #FFB9CC;
}
```

## SVGアイコン実装例

### ほのおタイプアイコン
```svg
<svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="fireGradient" cx="50%" cy="80%" r="60%">
      <stop offset="0%" stop-color="#FF6030"/>
      <stop offset="100%" stop-color="#F08030"/>
    </radialGradient>
  </defs>
  <circle cx="32" cy="32" r="30" fill="url(#fireGradient)" opacity="0.3"/>
  <path d="M32 10 C40 15, 45 25, 42 35 C50 30, 52 40, 45 45 C48 50, 40 55, 32 50 C28 52, 20 50, 22 45 C15 40, 18 30, 25 35 C22 25, 28 15, 32 10 Z" 
        fill="url(#fireGradient)" 
        class="flame-animation"/>
</svg>
```

### みずタイプアイコン
```svg
<svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="waterGradient" cx="50%" cy="30%" r="70%">
      <stop offset="0%" stop-color="#88B0FF"/>
      <stop offset="100%" stop-color="#6890F0"/>
    </radialGradient>
  </defs>
  <circle cx="32" cy="32" r="30" fill="url(#waterGradient)" opacity="0.3"/>
  <path d="M32 15 C38 20, 45 30, 45 40 C45 48, 39 52, 32 52 C25 52, 19 48, 19 40 C19 30, 26 20, 32 15 Z" 
        fill="url(#waterGradient)" 
        class="water-animation"/>
  <circle cx="28" cy="35" r="3" fill="#88B0FF" opacity="0.7"/>
</svg>
```

## アニメーション実装

### CSS Animation Classes
```css
.flame-animation {
  animation: flame-flicker 2s ease-in-out infinite;
  transform-origin: center bottom;
}

@keyframes flame-flicker {
  0% { transform: scale(1) rotate(-1deg); }
  25% { transform: scale(1.05) rotate(1deg); }
  50% { transform: scale(1.1) rotate(-0.5deg); }
  75% { transform: scale(1.05) rotate(0.5deg); }
  100% { transform: scale(1) rotate(-1deg); }
}

.water-animation {
  animation: water-ripple 3s ease-in-out infinite;
}

@keyframes water-ripple {
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.02); opacity: 0.9; }
  100% { transform: scale(1); opacity: 1; }
}
```

## 実装時の注意点

1. **パフォーマンス**: アニメーションはCSS Transformsを使用してGPUアクセラレーションを活用
2. **アクセシビリティ**: `prefers-reduced-motion`メディアクエリでアニメーション制御
3. **レスポンシブ**: viewBoxを使用してスケーラブル対応
4. **ファイルサイズ**: SVGの最適化でファイルサイズを最小化

## ファイル構成
```
assets/icons/types/
├── normal.svg
├── fire.svg
├── water.svg
├── electric.svg
├── grass.svg
├── ice.svg
├── fighting.svg
├── poison.svg
├── ground.svg
├── flying.svg
├── psychic.svg
├── bug.svg
├── rock.svg
├── ghost.svg
├── dragon.svg
├── dark.svg
├── steel.svg
└── fairy.svg
```
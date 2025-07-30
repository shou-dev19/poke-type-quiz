# ポケモンタイプ相性クイズアプリの設計書

## 1. システム全体アーキテクチャ

### 1.1 アーキテクチャ概要
```
┌─────────────────────────────────────────┐
│              Frontend (SPA)             │
├─────────────────────────────────────────┤
│  UI Components  │  Animation Engine     │
│  State Manager  │  Type Effect System   │
├─────────────────────────────────────────┤
│         Data Layer (JSON)               │
│  Type Data  │  Quiz Logic  │  Config    │
└─────────────────────────────────────────┘
```

### 1.2 技術スタック
- **Frontend**: HTML5, CSS3, TypeScript
- **フレームワーク**: 未定 (React/Vue.js/Vanilla TS)
- **アニメーション**: CSS3 Animations + TypeScript (requestAnimationFrame)
- **データ形式**: JSON
- **グラフィック**: SVG
- **型システム**: TypeScript 5.0+（strict mode）

### 1.3 モジュール構成（クリーンアーキテクチャ）
```
src/
├── domain/                 # ドメイン層（ビジネスロジック）
│   ├── entities/          # エンティティ
│   │   ├── PokemonType.ts
│   │   ├── Question.ts
│   │   └── GameState.ts
│   ├── repositories/      # リポジトリインターフェース
│   │   └── ITypeRepository.ts
│   └── services/          # ドメインサービス
│       └── ITypeEffectivenessService.ts
├── application/           # アプリケーション層（ユースケース）
│   ├── usecases/         # ユースケース実装
│   │   ├── StartQuizUseCase.ts
│   │   ├── AnswerQuestionUseCase.ts
│   │   └── CalculateScoreUseCase.ts
│   └── interfaces/       # アプリケーションサービス
│       └── IQuizService.ts
├── infrastructure/        # インフラ層（外部依存）
│   ├── repositories/     # リポジトリ実装
│   │   └── JsonTypeRepository.ts
│   ├── services/         # 外部サービス実装
│   │   ├── LocalTypeEffectivenessService.ts
│   │   └── ApiTypeEffectivenessService.ts
│   └── data/            # 静的データ
│       ├── types.json
│       └── effectiveness.json
├── presentation/          # プレゼンテーション層（UI）
│   ├── components/       # UIコンポーネント
│   ├── controllers/      # コントローラー
│   ├── animations/       # アニメーション
│   └── styles/          # CSS/スタイル
├── di/                   # 依存性注入コンテナ
│   └── container.ts
└── assets/               # 画像・アイコン
```

## 2. データモデル設計

### 2.1 ポケモンタイプデータ構造
```json
{
  "types": [
    {
      "id": "fire",
      "nameJa": "ほのお",
      "color": "#F08030",
      "colorLight": "#FF6030",
      "icon": "fire.svg",
      "symbol": "炎",
      "animation": "flame-flicker"
    },
    {
      "id": "water",
      "nameJa": "みず",
      "color": "#6890F0",
      "colorLight": "#88B0FF",
      "icon": "water.svg",
      "symbol": "水滴",
      "animation": "water-ripple"
    }
  ]
}
```

**アイコン設計仕様:**
- 公式タイプ相性表（type_table.png）のカラーとシンボルに準拠
- SVG形式でスケーラブル対応
- 各タイプ固有のアニメーション
- 64x64pxベースサイズ、レスポンシブ対応

**詳細仕様:** `docs/type_icon_spec.md` を参照

### 2.2 タイプ相性データ構造
```typescript
// 完全なタイプ相性データ（type_table.png画像から作成）
// 使用方法: infrastructure/data/typeEffectiveness.json として配置
import { TYPE_EFFECTIVENESS, TYPE_NAMES } from './type_effectiveness_data';
import { TypeId } from '../domain/types';

// 基本的な使用例
const effectiveness: number = TYPE_EFFECTIVENESS["fire"]["water"]; // 0.5 (こうかいまひとつ)
const effectiveness2: number = TYPE_EFFECTIVENESS["ice"]["dragon"]; // 2.0 (こうかばつぐん)

// 複合タイプの計算例
function calculateDualTypeEffectiveness(attackType: TypeId, defendType1: TypeId, defendType2: TypeId): number {
  const effect1: number = TYPE_EFFECTIVENESS[attackType][defendType1];
  const effect2: number = TYPE_EFFECTIVENESS[attackType][defendType2];
  return effect1 * effect2;
}

// 例：こおり技 → ドラゴン・じめん = 2.0 × 2.0 = 4.0倍
const dualResult: number = calculateDualTypeEffectiveness("ice", "dragon", "ground");
```

**データ構造の特徴:**
- 18×18 = 324通りの全ての組み合わせを網羅
- 画像から正確に転記された公式相性データ
- 英語IDベースでプログラム処理に最適化
- 日本語名マッピングも提供

**詳細データ:** `docs/type_effectiveness_data.js` を参照

### 2.3 クイズ問題データ構造
```json
{
  "question": {
    "id": "q001",
    "attackingType": "fire",
    "defendingType": ["dragon", "ground"], // 配列で複合タイプを表現、単一タイプは["water"]
    "correctAnswer": 4.0,
    "difficulty": "hard"
  }
}
```

**単一タイプの例:**
```json
{
  "question": {
    "id": "q002",
    "attackingType": "fire",
    "defendingType": ["water"],
    "correctAnswer": 0.5,
    "difficulty": "normal"
  }
}
```

### 2.4 タイプ効果Enum
```typescript
// domain/entities/TypeEffectiveness.ts
export type EffectivenessValue = 'NONE' | 'QUARTER_EFFECTIVE' | 'HALF_EFFECTIVE' | 'NORMAL_EFFECTIVE' | 'SUPER_EFFECTIVE' | 'ULTRA_EFFECTIVE';
export type DifficultyLevel = 'easy' | 'normal' | 'hard';

export class TypeEffectiveness {
  private constructor(
    public readonly value: EffectivenessValue,
    public readonly multiplier: number,
    private readonly displayKey: string
  ) {}

  toString(): string {
    return this.value;
  }

  toNumber(): number {
    return this.multiplier;
  }

  getDisplayText(): string {
    return TypeEffectiveness.DISPLAY_TEXTS[this.displayKey];
  }

  // 静的定数定義
  static readonly NONE = new TypeEffectiveness('NONE', 0, 'none');
  static readonly QUARTER_EFFECTIVE = new TypeEffectiveness('QUARTER_EFFECTIVE', 0.25, 'quarter');
  static readonly HALF_EFFECTIVE = new TypeEffectiveness('HALF_EFFECTIVE', 0.5, 'half');
  static readonly NORMAL_EFFECTIVE = new TypeEffectiveness('NORMAL_EFFECTIVE', 1.0, 'normal');
  static readonly SUPER_EFFECTIVE = new TypeEffectiveness('SUPER_EFFECTIVE', 2.0, 'super');
  static readonly ULTRA_EFFECTIVE = new TypeEffectiveness('ULTRA_EFFECTIVE', 4.0, 'ultra');

  // 表示テキストマッピング
  private static readonly DISPLAY_TEXTS: Record<string, string> = {
    none: 'こうかなし(0倍)',
    quarter: 'こうかいまひとつ(0.25倍)',
    half: 'こうかいまひとつ(0.5倍)',
    normal: 'ふつう(1倍)',
    super: 'こうかばつぐん(2倍)',
    ultra: 'こうかばつぐん(4倍)'
  };

  // 全ての値を配列で取得
  static getAllValues(): TypeEffectiveness[] {
    return [
      TypeEffectiveness.NONE,
      TypeEffectiveness.QUARTER_EFFECTIVE,
      TypeEffectiveness.HALF_EFFECTIVE,
      TypeEffectiveness.NORMAL_EFFECTIVE,
      TypeEffectiveness.SUPER_EFFECTIVE,
      TypeEffectiveness.ULTRA_EFFECTIVE
    ];
  }

  // 数値から対応するEnumを取得
  static fromMultiplier(multiplier: number): TypeEffectiveness {
    const effectiveness = TypeEffectiveness.getAllValues()
      .find(e => Math.abs(e.multiplier - multiplier) < 0.01);

    if (!effectiveness) {
      throw new Error(`Invalid multiplier: ${multiplier}`);
    }

    return effectiveness;
  }

  // 難易度に応じた選択肢を取得
  static getChoicesForDifficulty(difficulty: DifficultyLevel): TypeEffectiveness[] {
    switch (difficulty) {
      case 'easy':
      case 'normal':
        return [
          TypeEffectiveness.NONE,
          TypeEffectiveness.HALF_EFFECTIVE,
          TypeEffectiveness.NORMAL_EFFECTIVE,
          TypeEffectiveness.SUPER_EFFECTIVE
        ];
      case 'hard':
        return TypeEffectiveness.getAllValues();
      default:
        throw new Error(`Invalid difficulty: ${difficulty}`);
    }
}
```

### 2.5 型定義とデータ構造
```typescript
// 基本的な型定義
export type TypeId = 'normal' | 'fire' | 'water' | 'electric' | 'grass' | 'ice' | 
                     'fighting' | 'poison' | 'ground' | 'flying' | 'psychic' | 'bug' | 
                     'rock' | 'ghost' | 'dragon' | 'dark' | 'steel' | 'fairy';

// クイズ問題の型定義
export interface Question {
  id: string;
  attackingType: TypeId;
  defendingType: TypeId[]; // 単一タイプは[typeId]、複合タイプは[type1, type2]
  correctAnswer: EffectivenessValue;
  difficulty: DifficultyLevel;
}

// ゲーム状態の型定義
export interface GameState {
  currentQuestion: number;
  totalQuestions: number;
  score: number;
  difficulty: DifficultyLevel;
  questions: Question[];
  userAnswers: TypeEffectiveness[];
  isAnimating: boolean;
  timeStart: Date | null;
}

// ポケモンタイプの型定義
export interface PokemonTypeData {
  id: TypeId;
  nameJa: string;
  color: string;
  colorLight: string; 
  symbol: string;
  animation: string;
}
```

## 3. UIコンポーネント設計

### 3.1 コンポーネント階層
```
App
├── StartScreen
│   ├── DifficultySelector
│   ├── QuestionCountSelector
│   └── StartButton
├── QuizScreen
│   ├── QuestionDisplay
│   ├── TypeIconArea
│   │   ├── AttackingTypeIcon
│   │   └── DefendingTypeIcon
│   ├── ChoiceButtons
│   └── ProgressIndicator
├── ResultScreen
│   ├── AnswerFeedback
│   ├── ExplanationText
│   └── NextButton
└── EndScreen
    ├── ScoreDisplay
    ├── Statistics
    └── RestartButton
```

### 3.2 主要コンポーネント仕様

#### 3.2.1 StartScreen
```typescript
interface StartScreenProps {
  onGameStart: (config: GameConfig) => void;
}

interface StartScreenState {
  difficulty: DifficultyLevel;
  questionCount: number;
}

interface GameConfig {
  difficulty: DifficultyLevel;
  questionCount: number;
}

const StartScreen = {
  props: {
    onGameStart: Function as PropType<StartScreenProps['onGameStart']>
  },
  state: {
    difficulty: "normal" as DifficultyLevel,
    questionCount: 10
  },
  methods: {
    handleDifficultyChange(difficulty: DifficultyLevel): void {},
    handleQuestionCountChange(count: number): void {},
    handleStartClick(): void {}
  }
}
```

#### 3.2.2 QuizScreen
```typescript
import { TypeEffectiveness } from '../domain/entities/TypeEffectiveness';
import { Question } from '../domain/entities/Question';

interface QuizScreenProps {
  question: Question;
  onAnswerSelect: (answer: TypeEffectiveness) => void;
}

interface QuizScreenState {
  selectedAnswer: TypeEffectiveness | null;
  isAnimating: boolean;
  showResult: boolean;
  choices: TypeEffectiveness[];
}

interface ChoiceText {
  value: TypeEffectiveness;
  text: string;
}

const QuizScreen = {
  props: {
    question: Object as PropType<Question>,
    onAnswerSelect: Function as PropType<QuizScreenProps['onAnswerSelect']>
  },
  state: {
    selectedAnswer: null as TypeEffectiveness | null,
    isAnimating: false,
    showResult: false,
    choices: [] as TypeEffectiveness[]
  },
  computed: {
    // 選択肢を表示用テキストで取得
    choiceTexts(): ChoiceText[] {
      return this.state.choices.map((choice: TypeEffectiveness) => ({
        value: choice,
        text: choice.getDisplayText()
      }));
    }
  },
  methods: {
    handleAnswerSelect(selectedEnum: TypeEffectiveness): void {
      this.state.selectedAnswer = selectedEnum;
      this.triggerAttackAnimation();
    },
    triggerAttackAnimation(): void {},
    showAnswerFeedback(): void {}
  },
  mounted(): void {
    // 難易度に応じた選択肢を設定
    this.state.choices = TypeEffectiveness.getChoicesForDifficulty(this.props.question.difficulty);
  }
}
```

#### 3.2.3 TypeIcon
```typescript
import { TypeId } from '../domain/types';

interface TypeIconProps {
  type: TypeId;
  size: string;
  isAnimating: boolean;
  animationType: string;
}

const TypeIcon = {
  props: {
    type: String as PropType<TypeId>,
    size: String,
    isAnimating: Boolean,
    animationType: String
  },
  methods: {
    startIdleAnimation(): void {},
    startAttackAnimation(): void {},
    startDefenseAnimation(): void {}
  }
}
```

## 4. アニメーションシステム設計

### 4.1 アニメーション管理クラス
```typescript
import { TypeId } from '../domain/types';

interface Animation {
  id: string;
  element: HTMLElement;
  promise: Promise<void>;
}

class AnimationManager {
  private activeAnimations: Map<string, Animation>;
  private animationQueue: Animation[];

  constructor() {
    this.activeAnimations = new Map<string, Animation>();
    this.animationQueue = [];
  }
  
  // タイプ別アイドルアニメーション
  startIdleAnimation(typeId: TypeId, element: HTMLElement): string {
    // 実装内容
    return 'animation-id';
  }
  
  // 攻撃アニメーション
  startAttackAnimation(attackerElement: HTMLElement, defenderElement: HTMLElement): Promise<void> {
    return new Promise<void>((resolve) => {
      // 1. 攻撃側の移動アニメーション
      // 2. 衝突エフェクト
      // 3. 防御側の反応アニメーション
      // 4. 完了コールバック
      resolve();
    });
  }
  
  // フィードバックアニメーション
  showResultAnimation(isCorrect: boolean, element: HTMLElement): Promise<void> {
    return Promise.resolve();
  }
  
  // アニメーション停止
  stopAnimation(animationId: string): void {}
}
```

### 4.2 タイプ別アニメーション定義
```typescript
import { TypeId } from '../domain/types';

interface Keyframe {
  transform?: string;
  filter?: string;
  opacity?: number;
}

interface IdleAnimation {
  keyframes: Keyframe[];
  duration: number;
  iterations: number | 'Infinity';
}

interface AttackAnimation {
  path: string;
  duration: number;
  effects: string[];
}

interface TypeAnimation {
  idle: IdleAnimation;
  attack: AttackAnimation;
}

const TypeAnimations: Record<TypeId, TypeAnimation> = {
  fire: {
    idle: {
      keyframes: [
        { transform: 'scale(1) rotate(0deg)', filter: 'hue-rotate(0deg)' },
        { transform: 'scale(1.1) rotate(2deg)', filter: 'hue-rotate(10deg)' },
        { transform: 'scale(1) rotate(0deg)', filter: 'hue-rotate(0deg)' }
      ],
      duration: 2000,
      iterations: 'Infinity'
    },
    attack: {
      path: 'bezier-curve',
      duration: 1500,
      effects: ['fire-trail', 'spark-particles']
    }
  },
  // 他のタイプも同様に定義
  water: {
    idle: {
      keyframes: [
        { transform: 'scale(1)', opacity: 1 },
        { transform: 'scale(1.02)', opacity: 0.9 },
        { transform: 'scale(1)', opacity: 1 }
      ],
      duration: 3000,
      iterations: 'Infinity'
    },
    attack: {
      path: 'wave-motion',
      duration: 1200,
      effects: ['water-splash', 'ripple-effect']
    }
  }
  // ... 他の16タイプも同様
} as const;
```

## 5. クリーンアーキテクチャ設計

### 5.1 依存性注入とインターフェース

#### 5.1.1 タイプ効果計算サービスのインターフェース
```typescript
// domain/services/ITypeEffectivenessService.ts
import { TypeEffectiveness } from '../entities/TypeEffectiveness';
import { TypeId, PokemonTypeData } from '../types';

export interface ITypeEffectivenessService {
  /**
   * タイプ相性による効果倍率を計算
   * @param attackType - 攻撃タイプID
   * @param defendTypes - 防御タイプID配列
   * @returns 効果Enum値
   */
  calculateEffectiveness(attackType: TypeId, defendTypes: TypeId[]): Promise<TypeEffectiveness>;
  
  /**
   * タイプデータを取得
   * @param typeId - タイプID
   * @returns タイプデータ
   */
  getTypeData(typeId: TypeId): Promise<PokemonTypeData>;
}
```

#### 5.1.2 ローカル実装（現在の仕様）
```typescript
// infrastructure/services/LocalTypeEffectivenessService.ts
import { TypeEffectiveness } from '../../domain/entities/TypeEffectiveness';
import { ITypeEffectivenessService } from '../../domain/services/ITypeEffectivenessService';
import { ITypeRepository } from '../../domain/repositories/ITypeRepository';
import { TypeId, PokemonTypeData } from '../../domain/types';

export class LocalTypeEffectivenessService implements ITypeEffectivenessService {
  private typeRepository: ITypeRepository;

  constructor(typeRepository: ITypeRepository) {
    this.typeRepository = typeRepository;
  }
  
  async calculateEffectiveness(attackType: TypeId, defendTypes: TypeId[]): Promise<TypeEffectiveness> {
    const effectiveness = await this.typeRepository.getEffectiveness();
    
    const totalMultiplier = defendTypes.reduce((total: number, defendType: TypeId) => {
      const multiplier: number = effectiveness[attackType]?.[defendType] ?? 1.0;
      return total * multiplier;
    }, 1.0);
    
    // 数値からEnum値に変換
    return TypeEffectiveness.fromMultiplier(totalMultiplier);
  }
  
  async getTypeData(typeId: TypeId): Promise<PokemonTypeData> {
    return await this.typeRepository.getType(typeId);
  }
}
```

#### 5.1.3 API実装（将来の仕様）
```typescript
// infrastructure/services/ApiTypeEffectivenessService.ts
import { TypeEffectiveness } from '../../domain/entities/TypeEffectiveness';
import { ITypeEffectivenessService } from '../../domain/services/ITypeEffectivenessService';
import { TypeId, PokemonTypeData } from '../../domain/types';

interface ApiClient {
  post<T>(url: string, data: any): Promise<{ data: T }>;
  get<T>(url: string): Promise<{ data: T }>;
}

interface CalculateEffectivenessResponse {
  effectiveness: string | number;
}

export class ApiTypeEffectivenessService implements ITypeEffectivenessService {
  private apiClient: ApiClient;
  private baseUrl: string;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
    this.baseUrl = '/api/pokemon-types';
  }
  
  async calculateEffectiveness(attackType: TypeId, defendTypes: TypeId[]): Promise<TypeEffectiveness> {
    const response = await this.apiClient.post<CalculateEffectivenessResponse>(
      `${this.baseUrl}/calculate`, 
      {
        attackType,
        defendTypes
      }
    );
    
    // APIからEnum値が返される場合
    if (typeof response.data.effectiveness === 'string') {
      return (TypeEffectiveness as any)[response.data.effectiveness];
    }
    
    // APIから数値が返される場合の互換性対応
    return TypeEffectiveness.fromMultiplier(response.data.effectiveness);
  }
  
  async getTypeData(typeId: TypeId): Promise<PokemonTypeData> {
    const response = await this.apiClient.get<PokemonTypeData>(`${this.baseUrl}/${typeId}`);
    return response.data;
  }
}
```

### 5.2 ユースケース層

#### 5.2.1 回答処理ユースケース
```typescript
// application/usecases/AnswerQuestionUseCase.ts
import { TypeEffectiveness } from '../../domain/entities/TypeEffectiveness';
import { ITypeEffectivenessService } from '../../domain/services/ITypeEffectivenessService';
import { Question } from '../../domain/entities/Question';

interface AnswerQuestionResult {
  isCorrect: boolean;
  correctAnswer: TypeEffectiveness;
  userAnswer: TypeEffectiveness;
  explanation: string;
}

export class AnswerQuestionUseCase {
  private typeEffectivenessService: ITypeEffectivenessService;

  constructor(typeEffectivenessService: ITypeEffectivenessService) {
    this.typeEffectivenessService = typeEffectivenessService;
  }
  
  async execute(question: Question, userAnswerEnum: TypeEffectiveness): Promise<AnswerQuestionResult> {
    // タイプ相性計算（実装環境を意識しない）
    const correctAnswerEnum = await this.typeEffectivenessService.calculateEffectiveness(
      question.attackingType,
      question.defendingType
    );
    
    const isCorrect = userAnswerEnum.value === correctAnswerEnum.value;
    
    return {
      isCorrect,
      correctAnswer: correctAnswerEnum,
      userAnswer: userAnswerEnum,
      explanation: await this.generateExplanation(question, correctAnswerEnum)
    };
  }
  
  private async generateExplanation(question: Question, correctAnswerEnum: TypeEffectiveness): Promise<string> {
    const attackTypeData = await this.typeEffectivenessService.getTypeData(question.attackingType);
    
    // 複合タイプの場合の説明生成
    if (question.defendingType.length > 1) {
      const defendType1Data = await this.typeEffectivenessService.getTypeData(question.defendingType[0]);
      const defendType2Data = await this.typeEffectivenessService.getTypeData(question.defendingType[1]);
      return `${attackTypeData.nameJa}タイプの技は${defendType1Data.nameJa}・${defendType2Data.nameJa}タイプに対して${correctAnswerEnum.getDisplayText()}のダメージです。`;
    }
    
    const defendTypeData = await this.typeEffectivenessService.getTypeData(question.defendingType[0]);
    return `${attackTypeData.nameJa}タイプの技は${defendTypeData.nameJa}タイプに対して${correctAnswerEnum.getDisplayText()}のダメージです。`;
  }
}
```

### 5.3 依存性注入コンテナ
```typescript
// di/container.ts
import { JsonTypeRepository } from '../infrastructure/repositories/JsonTypeRepository';
import { LocalTypeEffectivenessService } from '../infrastructure/services/LocalTypeEffectivenessService';
import { ApiTypeEffectivenessService } from '../infrastructure/services/ApiTypeEffectivenessService';
import { AnswerQuestionUseCase } from '../application/usecases/AnswerQuestionUseCase';

type ServiceFactory<T = any> = (container: DIContainer) => T;

interface ServiceRegistration<T = any> {
  factory: ServiceFactory<T>;
  singleton: boolean;
}

export class DIContainer {
  private services: Map<string, ServiceRegistration>;
  private singletons: Map<string, any>;

  constructor() {
    this.services = new Map<string, ServiceRegistration>();
    this.singletons = new Map<string, any>();
  }
  
  // サービス登録
  register<T>(name: string, factory: ServiceFactory<T>, singleton: boolean = false): void {
    this.services.set(name, { factory, singleton });
  }
  
  // サービス取得
  resolve<T = any>(name: string): T {
    const service = this.services.get(name);
    if (!service) {
      throw new Error(`Service ${name} not found`);
    }
    
    if (service.singleton) {
      if (!this.singletons.has(name)) {
        this.singletons.set(name, service.factory(this));
      }
      return this.singletons.get(name) as T;
    }
    
    return service.factory(this) as T;
  }
}

// 設定例
const container = new DIContainer();

// リポジトリ登録
container.register('typeRepository', () => new JsonTypeRepository(), true);

// サービス登録（環境に応じて切り替え）
if (process.env.USE_API === 'true') {
  container.register('typeEffectivenessService', (c: DIContainer) => 
    new ApiTypeEffectivenessService(c.resolve('apiClient')), true);
} else {
  container.register('typeEffectivenessService', (c: DIContainer) => 
    new LocalTypeEffectivenessService(c.resolve('typeRepository')), true);
}

// ユースケース登録
container.register('answerQuestionUseCase', (c: DIContainer) => 
  new AnswerQuestionUseCase(c.resolve('typeEffectivenessService')));
```

### 5.2 難易度別ロジック
```typescript
import { TypeId, DifficultyLevel } from '../domain/types';
import { TypeEffectiveness } from '../domain/entities/TypeEffectiveness';

// 基本8タイプ（かんたん難易度用）
const BASIC_TYPES: TypeId[] = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice', 'fighting', 'poison'
];

// 全18タイプ
const ALL_SINGLE_TYPES: TypeId[] = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice', 'fighting', 'poison',
  'ground', 'flying', 'psychic', 'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
];

export class DifficultyManager {
  static getAvailableTypes(difficulty: DifficultyLevel): TypeId[] {
    switch (difficulty) {
      case 'easy':
        return BASIC_TYPES.slice(0, 8); // 基本8タイプ
      case 'normal':
        return ALL_SINGLE_TYPES; // 全18タイプ
      case 'hard':
        return ALL_SINGLE_TYPES; // 複合タイプは実行時に2つのタイプを組み合わせて生成
      default:
        throw new Error(`Invalid difficulty: ${difficulty}`);
    }
  }
  
  static generateDefendingType(difficulty: DifficultyLevel, availableTypes: TypeId[]): TypeId[] {
    if (difficulty === 'hard') {
      // 難易度「むずかしい」は必ず複合タイプ
      let type1: TypeId, type2: TypeId;
      do {
        type1 = availableTypes[Math.floor(Math.random() * availableTypes.length)];
        type2 = availableTypes[Math.floor(Math.random() * availableTypes.length)];
      } while (type1 === type2); // 異なるタイプになるまで繰り返し
      return [type1, type2];
    }
    // かんたん・ふつうは単一タイプのみ
    const type = availableTypes[Math.floor(Math.random() * availableTypes.length)];
    return [type];
  }
  
  static getChoiceOptions(difficulty: DifficultyLevel): TypeEffectiveness[] {
    return TypeEffectiveness.getChoicesForDifficulty(difficulty);
  }
}
```

## 6. 状態管理設計

### 6.1 状態管理パターン
```typescript
import { GameState, Question } from '../domain/entities/GameState';
import { TypeEffectiveness } from '../domain/entities/TypeEffectiveness';

type ScreenType = 'start' | 'quiz' | 'result' | 'end';

interface GameConfig {
  difficulty: DifficultyLevel;
  questionCount: number;
}

interface AppState {
  screen: ScreenType;
  gameConfig: GameConfig | null;
  currentQuestion: Question | null;
  userAnswers: TypeEffectiveness[];
  score: number;
  isAnimating: boolean;
}

type StateChangeCallback = (state: AppState) => void;

// シンプルなPub/Subパターンを使用
export class GameStateManager {
  private state: AppState;
  private listeners: Record<string, StateChangeCallback[]>;

  constructor() {
    this.state = {
      screen: 'start',
      gameConfig: null,
      currentQuestion: null,
      userAnswers: [],
      score: 0,
      isAnimating: false
    };
    this.listeners = {};
  }
  
  setState(updates: Partial<AppState>): void {
    this.state = { ...this.state, ...updates };
    this.notifyListeners();
  }
  
  getState(): AppState {
    return { ...this.state };
  }
  
  subscribe(event: string, callback: StateChangeCallback): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }
  
  unsubscribe(event: string, callback: StateChangeCallback): void {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    }
  }
  
  private notifyListeners(): void {
    Object.keys(this.listeners).forEach(event => {
      this.listeners[event].forEach(callback => callback(this.state));
    });
  }
}
```

## 7. パフォーマンス最適化設計

### 7.1 アニメーション最適化
- `requestAnimationFrame`を使用したスムーズなアニメーション
- CSS Transform/Opacityを優先してGPUアクセラレーションを活用
- アニメーション完了時のクリーンアップ処理

### 7.2 メモリ管理
- 使用済みアニメーションオブジェクトの適切な破棄
- イベントリスナーのクリーンアップ
- 大きな画像アセットの遅延読み込み

## 8. エラーハンドリング設計

### 8.1 アニメーション関連エラー
```typescript
interface FallbackAnimation {
  duration: number;
  keyframes: Array<{ opacity: number }>;
}

export class AnimationErrorHandler {
  static handleAnimationError(error: Error, context: string): FallbackAnimation {
    console.error(`Animation error in ${context}:`, error);
    // フォールバック: シンプルなアニメーションまたは静的表示
    return this.getFallbackAnimation(context);
  }
  
  static getFallbackAnimation(context: string): FallbackAnimation {
    // 軽量なCSSアニメーションにフォールバック
    return {
      duration: 500,
      keyframes: [{ opacity: 0 }, { opacity: 1 }]
    };
  }
}
```

### 8.2 データ関連エラー
```typescript
import { PokemonTypeData, TypeId } from '../domain/types';

export class DataErrorHandler {
  static validateTypeData(data: any): data is PokemonTypeData {
    const required: (keyof PokemonTypeData)[] = ['id', 'nameJa', 'color'];
    return required.every(field => data && data.hasOwnProperty(field));
  }
  
  static handleMissingData<T>(type: TypeId, fallback: T): T {
    console.warn(`Missing data for type: ${type}, using fallback`);
    return fallback;
  }
}
```

## 9. テスト設計

### 9.1 単体テスト対象
#### ドメイン層
- `TypeEffectiveness.fromMultiplier()`
- `TypeEffectiveness.getChoicesForDifficulty()`
- `LocalTypeEffectivenessService.calculateEffectiveness()`
- `DifficultyManager.generateDefendingType()`

#### アプリケーション層  
- `AnswerQuestionUseCase.execute()`
- `StartQuizUseCase.execute()`

#### インフラ層
- `JsonTypeRepository.getEffectiveness()`
- `AnimationManager.startAttackAnimation()`

#### テスト例
```typescript
// TypeEffectivenessのテスト例
import { TypeEffectiveness } from '../src/domain/entities/TypeEffectiveness';
import { DifficultyLevel } from '../src/domain/types';

describe('TypeEffectiveness', () => {
  test('fromMultiplier should return correct enum', () => {
    expect(TypeEffectiveness.fromMultiplier(2.0)).toBe(TypeEffectiveness.SUPER_EFFECTIVE);
    expect(TypeEffectiveness.fromMultiplier(0.25)).toBe(TypeEffectiveness.QUARTER_EFFECTIVE);
  });
  
  test('getDisplayText should return correct Japanese text', () => {
    expect(TypeEffectiveness.SUPER_EFFECTIVE.getDisplayText()).toBe('こうかばつぐん(2倍)');
    expect(TypeEffectiveness.NONE.getDisplayText()).toBe('こうかなし(0倍)');
  });
  
  test('getChoicesForDifficulty should return correct choices', () => {
    const hardChoices: TypeEffectiveness[] = TypeEffectiveness.getChoicesForDifficulty('hard' as DifficultyLevel);
    expect(hardChoices).toHaveLength(6);
    expect(hardChoices).toContain(TypeEffectiveness.ULTRA_EFFECTIVE);
    
    const normalChoices: TypeEffectiveness[] = TypeEffectiveness.getChoicesForDifficulty('normal' as DifficultyLevel);
    expect(normalChoices).toHaveLength(4);
    expect(normalChoices).not.toContain(TypeEffectiveness.ULTRA_EFFECTIVE);
  });
});
```

### 9.2 統合テスト対象
- 依存性注入コンテナの動作確認
- ローカルサービス⇔APIサービスの切り替え確認
- クイズフロー全体（開始→問題→結果→終了）
- 難易度別の動作確認

### 9.3 UIテスト対象
- 各画面の表示確認
- レスポンシブデザインの動作
- アニメーション連携の確認

## 10. 移行戦略

### 10.1 段階的API化
1. **Phase 1**: ローカル実装で完全動作
2. **Phase 2**: インターフェース導入、DI実装
3. **Phase 3**: API実装追加、環境変数での切り替え
4. **Phase 4**: 本格的なBEサービス移行

### 10.2 設定による切り替え
```typescript
// 環境設定例
type Environment = 'development' | 'staging' | 'production';

interface EnvironmentConfig {
  USE_API: boolean;
  API_BASE_URL: string;
}

const config: Record<Environment, EnvironmentConfig> = {
  development: {
    USE_API: false,
    API_BASE_URL: 'http://localhost:3001'
  },
  staging: {
    USE_API: true, 
    API_BASE_URL: 'https://staging-api.pokemon-quiz.com'
  },
  production: {
    USE_API: true,
    API_BASE_URL: 'https://api.pokemon-quiz.com'
  }
};

// 現在の環境設定を取得
function getCurrentConfig(): EnvironmentConfig {
  const env = (process.env.NODE_ENV as Environment) || 'development';
  return config[env];
}
```

この設計により、タイプ相性計算ロジックの実装環境（ローカル/API）を意識することなく、アプリケーションロジックを構築できます。将来のAPI化も環境変数とDIコンテナの設定変更のみで対応可能です。
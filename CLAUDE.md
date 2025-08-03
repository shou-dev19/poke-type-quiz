# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Pokémon type effectiveness quiz application built with React and TypeScript. The app allows users to test their knowledge of Pokémon type matchups through an interactive quiz interface with animations.

## Development Status

**Current State (Updated: 2025-08-02):**
- ✅ **Requirements defined** in `docs/requirements.md`
- ✅ **Design completed** in `docs/design.md` with detailed technical specifications
- ✅ **Development tasks planned** in `docs/tasks.md` with 24 tasks (T001-T024)
- ✅ **UI Design completed** in Figma and exported to TypeScript code in `src/` directory
- ✅ **Figma screenshots** available in `docs/figma_screenshot/` for reference
- ✅ **React project configuration** completed (package.json, Vite, TypeScript, Tailwind CSS)
- ✅ **Type icons implementation** completed using external SVG files
- ✅ **Phase 7: UI/UX improvements** completed (T019-T023)
- ✅ **StartScreen improvements** with type animation carousel and enhanced UI
- ✅ **QuizScreen improvements** with auto-transition removal and dialog fixes
- ✅ **AttackAnimation improvements** with damage-multiplier-based effects
- ✅ **ResultScreen improvements** with simplified score display
- ❌ **Testing framework** not set up yet

**Figma Integration:**
- UI designs were generated in Figma based on requirements.md specifications
- TypeScript code was exported from Figma and placed in the `src/` directory
- The Figma designs were nearly functional, so most UI implementation is complete
- Screenshots of the Figma designs are stored in `docs/figma_screenshot/` for reference

**Next Steps (Remaining Tasks):**
**🔴 CRITICAL - NEXT UP:**
- **T005**: 難易度「むずかしい」仕様変更 - quizLogic.tsで複合タイプのみ出題するよう修正（40% → 100%）

**🟡 HIGH PRIORITY:**
- **T012-T015**: テスト実装
  - T012: Jest + React Testing Library設定
  - T013: ビジネスロジックのテスト（quizLogic.ts）
  - T014: Reactコンポーネントテスト
  - T015: E2Eテスト（Playwright）

**🟢 MEDIUM PRIORITY:**
- **T016-T018**: 品質保証・リリース準備
  - T016: 受け入れ基準確認（requirements.md第5節）
  - T017: パフォーマンス最適化（Lighthouse 90点以上）
  - T018: ブラウザ互換性確認

**⏸️ PENDING:**
- **T025**: AttackAnimationアイコン高さ問題修正（後回し中）

**Phase Status:**
1. ✅ **Phase 1**: Project environment setup (T001-T004) - COMPLETED
2. ❌ **Phase 2**: Core functionality fixes (T005-T007) - **T005 PENDING**
3. ✅ **Phase 3**: Animation implementation (T008-T009) - COMPLETED
4. ✅ **Phase 4**: UI/UX improvements (T010-T011) - COMPLETED  
5. ❌ **Phase 5**: Testing & quality assurance (T012-T015) - PENDING
6. ❌ **Phase 6**: Final acceptance testing (T016-T018) - PENDING
7. ✅ **Phase 7**: Additional UI/UX improvements (T019-T023) - COMPLETED

## Architecture

### Core Structure
- **State Management**: React hooks with centralized state in `App.tsx`
- **Components**: Screen-based architecture (StartScreen, QuizScreen, ResultScreen)
- **Type System**: Comprehensive TypeScript definitions in `src/types/pokemon.ts`
- **Business Logic**: Quiz generation and damage calculation in `src/utils/quizLogic.ts`
- **UI Components**: shadcn/ui component library in `src/components/ui/`

### Key Files
- `src/App.tsx` - Main application state and screen routing
- `src/types/pokemon.ts` - Type definitions and Pokémon data
- `src/utils/quizLogic.ts` - Quiz generation and damage calculation logic
- `src/components/` - React components organized by screen and UI elements

### Data Model
- **18 Pokémon types** with complete type effectiveness matrix
- **3 difficulty levels**: かんたん (easy), ふつう (normal), むずかしい (hard)
- **Dual-type support** for complex matchups in hard mode (dual-type only for "むずかしい")
- **Animation states** for attack sequences and feedback

### Technical Design
Refer to `docs/design.md` for comprehensive technical specifications including:
- System architecture (React + TypeScript + Vite)
- Component design (4 main screens with detailed responsibilities)
- Animation system (3-phase attack animation with timing specifications)
- Data structures and type definitions
- State management patterns (React Hooks based)
- Performance optimization strategies (60fps target)
- Quality assurance and testing approach

## Development Workflow

This project follows a structured AI-assisted development approach:
1. **Requirements** defined in `docs/requirements.md`
2. **Design** completed in `docs/design.md` with comprehensive technical specifications
3. **Task breakdown** completed in `docs/tasks.md` with 18 specific implementation tasks
4. **One commit per task** for review clarity

**Development Planning Approach:**
- Requirements → Design → Task breakdown → Implementation
- Each phase builds upon previous phase outputs
- Clear deliverables and acceptance criteria for each task
- Risk assessment and dependency management included

**Design Phase Completed:**
- Comprehensive system architecture design
- Data model and type definitions
- Component architecture (4 main screens)
- Animation system specifications (3-phase attack animation)
- State management design (React Hooks based)
- UI/UX design system aligned with Figma
- Performance optimization strategy (60fps target)
- Quality assurance and testing strategy
- Difficulty specification: "むずかしい" mode uses dual-type Pokémon only (100%)

**Task Planning Phase Completed:**
- Detailed development plan created in `docs/tasks.md`
- 18 specific tasks organized into 6 phases (T001-T018)
- 3-week development schedule with priorities
- Task dependencies and risk assessment
- Comprehensive completion criteria defined
- Total estimated effort: 36 hours over 3-4 weeks

## Animation System

The app features a sophisticated animation system for type interactions:
- **Type-specific animations** for each of the 18 Pokémon types
- **Attack sequences** when user selects an answer
- **Impact effects** on type collision
- **Result feedback** with visual effects
- **Animation states** managed through `isAnimating` and `showResult` flags

## Design Assets

### Figma Screenshots
Reference the UI designs in `docs/figma_screenshot/`:
- `AttackAnimation.png` - Attack animation sequence design
- `QuizScreen.png` - Main quiz interface design  
- `StartScreen.png` - Initial screen design
- `demo_video.mp4` - Animation demonstration video

### Type Icons Reference
- `docs/type_table.png` - Official Pokémon type icons for implementation reference

## Common Tasks

**Initial Setup (Required First):**
```bash
# Create package.json and install dependencies
npm init -y
npm install react react-dom typescript @types/react @types/react-dom

# Set up build tool (Vite recommended)
npm install -D vite @vitejs/plugin-react

# Development server (after setup)
npm run dev

# Build for production (after setup)
npm run build

# Type checking (after setup)
npm run type-check

# Linting (after setup)
npm run lint
```

## Key Considerations

- **Japanese language support** - All UI text and type names are in Japanese
- **Responsive design** - Should work on both desktop and mobile
- **Performance** - Animations should maintain 60fps
- **Type safety** - Strict TypeScript usage throughout
- **Pokémon accuracy** - Type effectiveness must match official game data

## Required Dependencies (to be added)

Based on the code structure, this project needs:
- React & React DOM
- TypeScript
- Build tool (Vite recommended)
- Tailwind CSS
- shadcn/ui components
- Animation libraries for type effects
- Testing framework (Jest/Vitest recommended)
- ESLint & Prettier for code quality
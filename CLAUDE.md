# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Pokémon type effectiveness quiz application built with React and TypeScript. The app allows users to test their knowledge of Pokémon type matchups through an interactive quiz interface with animations.

## Development Status

**Current State:**
- ✅ **Requirements defined** in `docs/requirements.md`
- ✅ **Design completed** in `docs/design.md` with detailed technical specifications
- ✅ **UI Design completed** in Figma and exported to TypeScript code in `src/` directory
- ✅ **Figma screenshots** available in `docs/figma_screenshot/` for reference
- ❌ **React project configuration** missing (package.json, build tools, etc.)
- ❌ **Type icons implementation** needed (refer to `docs/type_table.png`)
- ❌ **Testing framework** not set up yet

**Figma Integration:**
- UI designs were generated in Figma based on requirements.md specifications
- TypeScript code was exported from Figma and placed in the `src/` directory
- The Figma designs were nearly functional, so most UI implementation is complete
- Screenshots of the Figma designs are stored in `docs/figma_screenshot/` for reference

**Remaining Work:**
1. **Set up React project infrastructure** - Configure package.json, build tools, and dependencies
2. **Implement type icons** - Create/integrate Pokémon type icons based on `docs/type_table.png`
3. **Quality assurance** - Implement tests to ensure requirements.md compliance
4. **Requirements gap analysis** - Review requirements.md to identify any missing implementations

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
3. **Task breakdown** for incremental implementation
4. **One commit per task** for review clarity

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
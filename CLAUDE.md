# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Pokemon type compatibility quiz application built in React with TypeScript. The application tests users' knowledge of Pokemon type effectiveness through interactive quizzes with three difficulty levels and animated type icons.

## Development Status

The project is currently in the figma output phase. The main application code is located in `/docs/figma_output/` and represents generated components from a Figma design. This is not yet a fully functional application - it requires proper setup as a React project.

## Architecture

### Core Components Structure
- **App.tsx** - Main application orchestrator handling state transitions between screens
- **StartScreen** - Quiz setup and difficulty selection
- **QuizScreen** - Main quiz interface with animated type interactions
- **ResultScreen** - Score display and quiz completion
- **AttackAnimation** - Pokemon type attack animations
- **TypeIcon** - Individual Pokemon type visual representations

### Key Data Models
- **PokemonType** - 18 official Pokemon types in Japanese
- **QuizQuestion** - Attack/defend type combinations with correct answers
- **QuizState** - Current quiz progress and configuration
- **TYPE_EFFECTIVENESS** - Complete 18x18 type compatibility matrix
- **DUAL_TYPES** - Predefined dual-type combinations for advanced mode

### Business Logic
- **quizLogic.ts** - Question generation, damage calculation, and answer validation
- **pokemon.ts** - Type definitions, effectiveness data, and color schemes

## UI Architecture

### Design System
- Uses Tailwind CSS with custom CSS variables for theming
- Dark/light mode support via CSS custom properties
- Shadcn/ui component library integration
- Responsive design with mobile-first approach

### Animation Requirements
- Type-specific animations for all 18 Pokemon types
- Attack animations with projectile motion and impact effects
- Smooth transitions between quiz states
- Performance target: 60fps animations

### Color System
Each Pokemon type has dedicated colors defined in `TYPE_COLORS` matching official Pokemon styling.

## Development Workflow

This project follows a structured AI-driven development approach:

1. **Requirements Definition** (`docs/requirements.md`) - Comprehensive feature specifications and acceptance criteria
2. **Design** (planned `design.md`) - Technical architecture and system design
3. **Task Planning** (planned `tasks.md`) - Implementation roadmap

## Project Setup Requirements

To convert this figma output into a working application:

1. Initialize as React project with TypeScript
2. Configure Tailwind CSS with the existing globals.css
3. Install shadcn/ui components
4. Set up build tooling (Vite recommended)
5. Configure animation libraries for type effects

## Language and Localization

- Primary language: Japanese
- All UI text, type names, and documentation in Japanese
- Type effectiveness terminology uses official Pokemon Japanese terms

## File Organization

```
docs/figma_output/
├── App.tsx                 # Main app component
├── components/            # React components
│   ├── StartScreen.tsx    # Quiz setup
│   ├── QuizScreen.tsx     # Main quiz interface  
│   ├── ResultScreen.tsx   # Results display
│   ├── AttackAnimation.tsx # Type attack animations
│   ├── TypeIcon.tsx       # Type visual components
│   └── ui/               # Shadcn/ui components
├── types/
│   └── pokemon.ts        # Core type definitions
├── utils/
│   └── quizLogic.ts      # Quiz business logic
└── styles/
    └── globals.css       # Tailwind configuration
```

## Key Implementation Notes

- Quiz supports 3 difficulty levels with different type combinations
- Complex dual-type damage calculation (multiplication of individual effectiveness)
- Animation timing critical for user experience (1.5-2 second attack sequences)
- State management handled via React hooks without external libraries
- No backend required - all data embedded in application
# Domain Repositories

This directory contains repository interfaces for the Pokemon Type Quiz application.

## Repository Interfaces to be implemented:

- **ITypeRepository.ts** - Interface for type data access
- **IQuestionRepository.ts** - Interface for question data access (future)
- **IGameStateRepository.ts** - Interface for game state persistence (future)

Each repository interface should:
- Define contracts for data access
- Be implementation-agnostic
- Support both local and API data sources
- Include proper TypeScript typing
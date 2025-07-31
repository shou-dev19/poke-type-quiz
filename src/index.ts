/**
 * Pokemon Type Quiz - Main Entry Point
 * Clean Architecture implementation for Pokemon type effectiveness quiz system
 */

// Application Layer
export { Application, ApplicationFactory } from './application/Application';
export * from './application/interfaces';
export * from './application/usecases';

// Domain Layer
export * from './domain/entities';
export * from './domain/services';
export * from './domain/types';

// Infrastructure Layer
export * from './infrastructure/services';
export * from './infrastructure/repositories';

// Dependency Injection
export * from './di';

/**
 * Quick Start Example:
 * 
 * ```typescript
 * import { ApplicationFactory } from './index';
 * 
 * async function main() {
 *   const app = await ApplicationFactory.getInstance();
 *   
 *   const gameSessionUseCase = app.getGameSessionUseCase();
 *   
 *   const session = await gameSessionUseCase.createSession({
 *     difficulty: 'normal',
 *     questionCount: 10
 *   });
 *   
 *   console.log('Session created:', session.sessionId);
 * }
 * ```
 */
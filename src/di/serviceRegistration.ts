/**
 * Service Registration Configuration
 * Configures all services in the Dependency Injection Container
 */

import { DIContainer } from './container';

// Infrastructure Layer
import { TypeEffectivenessService } from '@/infrastructure/services/TypeEffectivenessService';
import { QuestionGeneratorService } from '@/infrastructure/services/QuestionGeneratorService';
import { FileTypeRepository } from '@/infrastructure/repositories/FileTypeRepository';

// Application Layer
import { GameSessionUseCase } from '@/application/usecases/GameSessionUseCase';
import { QuestionManagementUseCase } from '@/application/usecases/QuestionManagementUseCase';
import { TypeManagementUseCase } from '@/application/usecases/TypeManagementUseCase';

// Domain Service Interfaces
import type { 
  ITypeEffectivenessService, 
  IQuestionGeneratorService,
  ITypeRepository 
} from '@/domain/services';

// Application Use Case Interfaces
import type {
  IGameSessionUseCase,
  IQuestionManagementUseCase,
  ITypeManagementUseCase
} from '@/application/interfaces';

/**
 * Service Registration Configuration
 * Registers all services with proper dependency injection
 */
export class ServiceRegistration {
  /**
   * Configure all services in the DI container
   */
  static configureServices(container: DIContainer): void {
    // Infrastructure Layer Services (Singletons for performance)
    
    container.register<ITypeRepository>(
      'TypeRepository',
      () => new FileTypeRepository(),
      true  // Singleton - Type data doesn't change during runtime
    );

    container.register<ITypeEffectivenessService>(
      'TypeEffectivenessService',
      () => new TypeEffectivenessService(),
      true  // Singleton - Effectiveness calculation logic is stateless
    );

    container.register<IQuestionGeneratorService>(
      'QuestionGeneratorService',
      (container) => new QuestionGeneratorService(
        container.resolve<ITypeEffectivenessService>('TypeEffectivenessService'),
        container.resolve<ITypeRepository>('TypeRepository')
      ),
      true  // Singleton - Question generation logic is stateless
    );

    // Application Layer Use Cases (Singletons for state management)

    container.register<IGameSessionUseCase>(
      'GameSessionUseCase',
      (container) => new GameSessionUseCase(
        container.resolve<IQuestionGeneratorService>('QuestionGeneratorService'),
        container.resolve<ITypeEffectivenessService>('TypeEffectivenessService')
      ),
      true  // Singleton - Manages session state across the application
    );

    container.register<IQuestionManagementUseCase>(
      'QuestionManagementUseCase',
      (container) => new QuestionManagementUseCase(
        container.resolve<IQuestionGeneratorService>('QuestionGeneratorService'),
        container.resolve<ITypeEffectivenessService>('TypeEffectivenessService'),
        container.resolve<ITypeRepository>('TypeRepository')
      ),
      true  // Singleton - Caches question metadata and statistics
    );

    container.register<ITypeManagementUseCase>(
      'TypeManagementUseCase',
      (container) => new TypeManagementUseCase(
        container.resolve<ITypeEffectivenessService>('TypeEffectivenessService'),
        container.resolve<ITypeRepository>('TypeRepository')
      ),
      true  // Singleton - Caches type information and statistics
    );
  }

  /**
   * Create and configure a new DI container with all services
   */
  static createConfiguredContainer(): DIContainer {
    const container = new DIContainer();
    ServiceRegistration.configureServices(container);
    return container;
  }

  /**
   * Validate that all required services are registered
   */
  static validateConfiguration(container: DIContainer): boolean {
    const requiredServices = [
      'TypeRepository',
      'TypeEffectivenessService', 
      'QuestionGeneratorService',
      'GameSessionUseCase',
      'QuestionManagementUseCase',
      'TypeManagementUseCase'
    ];

    for (const serviceName of requiredServices) {
      if (!container.has(serviceName)) {
        throw new Error(`Required service not registered: ${serviceName}`);
      }
    }

    return true;
  }

  /**
   * Get service dependency graph for debugging
   */
  static getDependencyGraph(): Record<string, string[]> {
    return {
      'TypeRepository': [],
      'TypeEffectivenessService': [],
      'QuestionGeneratorService': ['TypeEffectivenessService', 'TypeRepository'],
      'GameSessionUseCase': ['QuestionGeneratorService', 'TypeEffectivenessService'],
      'QuestionManagementUseCase': ['QuestionGeneratorService', 'TypeEffectivenessService', 'TypeRepository'],
      'TypeManagementUseCase': ['TypeEffectivenessService', 'TypeRepository']
    };
  }

  /**
   * Resolve all services to verify dependencies (for testing)
   */
  static verifyAllDependencies(container: DIContainer): boolean {
    try {
      const serviceNames = container.getServiceNames();
      
      for (const serviceName of serviceNames) {
        container.resolve(serviceName);
      }
      
      return true;
    } catch (error) {
      console.error('Dependency verification failed:', error);
      return false;
    }
  }

  /**
   * Get service registration summary
   */
  static getRegistrationSummary(container: DIContainer): {
    totalServices: number;
    serviceNames: string[];
    dependencyGraph: Record<string, string[]>;
  } {
    return {
      totalServices: container.getServiceNames().length,
      serviceNames: container.getServiceNames(),
      dependencyGraph: ServiceRegistration.getDependencyGraph()
    };
  }
}
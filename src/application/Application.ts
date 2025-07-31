/**
 * Application Entry Point
 * Main application class that initializes and manages the Pokemon Type Quiz system
 */

import { DIContainer } from '@/di/container';
import { ServiceRegistration } from '@/di/serviceRegistration';

// Application Use Case Interfaces
import type {
  IGameSessionUseCase,
  IQuestionManagementUseCase,
  ITypeManagementUseCase
} from '@/application/interfaces';

/**
 * Pokemon Type Quiz Application
 * Central application class that provides access to all use cases
 */
export class Application {
  private container: DIContainer;
  private initialized: boolean = false;

  constructor() {
    this.container = new DIContainer();
  }

  /**
   * Initialize the application with all services
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    try {
      // Configure all services in the DI container
      ServiceRegistration.configureServices(this.container);

      // Validate configuration
      ServiceRegistration.validateConfiguration(this.container);

      // Verify all dependencies can be resolved
      const dependenciesValid = ServiceRegistration.verifyAllDependencies(this.container);
      if (!dependenciesValid) {
        throw new Error('Failed to verify service dependencies');
      }

      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize application:', error);
      throw error;
    }
  }

  /**
   * Get Game Session Use Case
   */
  getGameSessionUseCase(): IGameSessionUseCase {
    this.ensureInitialized();
    return this.container.resolve<IGameSessionUseCase>('GameSessionUseCase');
  }

  /**
   * Get Question Management Use Case
   */
  getQuestionManagementUseCase(): IQuestionManagementUseCase {
    this.ensureInitialized();
    return this.container.resolve<IQuestionManagementUseCase>('QuestionManagementUseCase');
  }

  /**
   * Get Type Management Use Case
   */
  getTypeManagementUseCase(): ITypeManagementUseCase {
    this.ensureInitialized();
    return this.container.resolve<ITypeManagementUseCase>('TypeManagementUseCase');
  }

  /**
   * Get application status and configuration info
   */
  getApplicationInfo(): {
    initialized: boolean;
    services: {
      totalServices: number;
      serviceNames: string[];
      dependencyGraph: Record<string, string[]>;
    };
    version: string;
    buildTime: Date;
  } {
    const services = this.initialized 
      ? ServiceRegistration.getRegistrationSummary(this.container)
      : { totalServices: 0, serviceNames: [], dependencyGraph: {} };

    return {
      initialized: this.initialized,
      services,
      version: '1.0.0',
      buildTime: new Date()
    };
  }

  /**
   * Shutdown the application and cleanup resources
   */
  async shutdown(): Promise<void> {
    if (!this.initialized) {
      return;
    }

    try {
      // Perform cleanup if needed
      // Currently no explicit cleanup required, but placeholder for future needs
      
      this.container.clear();
      this.initialized = false;
    } catch (error) {
      console.error('Error during application shutdown:', error);
      throw error;
    }
  }

  /**
   * Check if application is initialized
   */
  isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * Get the DI container (for advanced usage)
   */
  getContainer(): DIContainer {
    this.ensureInitialized();
    return this.container;
  }

  /**
   * Create a child application with shared services
   */
  createChild(): Application {
    this.ensureInitialized();
    
    const childApp = new Application();
    childApp.container = this.container.createChild();
    childApp.initialized = true;
    
    return childApp;
  }

  /**
   * Health check for the application
   */
  async healthCheck(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    services: Record<string, 'ok' | 'error'>;
    timestamp: Date;
  }> {
    const result = {
      status: 'healthy' as 'healthy' | 'degraded' | 'unhealthy',
      services: {} as Record<string, 'ok' | 'error'>,
      timestamp: new Date()
    };

    if (!this.initialized) {
      result.status = 'unhealthy';
      result.services['application'] = 'error';
      return result;
    }

    try {
      // Test each use case
      const gameSessionUseCase = this.getGameSessionUseCase();
      result.services['GameSessionUseCase'] = gameSessionUseCase ? 'ok' : 'error';

      const questionManagementUseCase = this.getQuestionManagementUseCase();
      result.services['QuestionManagementUseCase'] = questionManagementUseCase ? 'ok' : 'error';

      const typeManagementUseCase = this.getTypeManagementUseCase();
      result.services['TypeManagementUseCase'] = typeManagementUseCase ? 'ok' : 'error';

      // Check if any services failed
      const hasErrors = Object.values(result.services).includes('error');
      if (hasErrors) {
        result.status = 'degraded';
      }

    } catch (error) {
      result.status = 'unhealthy';
      result.services['error'] = 'error';
    }

    return result;
  }

  /**
   * Ensure application is initialized
   */
  private ensureInitialized(): void {
    if (!this.initialized) {
      throw new Error('Application not initialized. Call initialize() first.');
    }
  }
}

/**
 * Global application instance factory
 */
export class ApplicationFactory {
  private static instance: Application | null = null;

  /**
   * Get or create the global application instance
   */
  static async getInstance(): Promise<Application> {
    if (!ApplicationFactory.instance) {
      ApplicationFactory.instance = new Application();
      await ApplicationFactory.instance.initialize();
    }
    return ApplicationFactory.instance;
  }

  /**
   * Reset the global instance (for testing)
   */
  static reset(): void {
    if (ApplicationFactory.instance) {
      ApplicationFactory.instance.shutdown().catch(console.error);
      ApplicationFactory.instance = null;
    }
  }

  /**
   * Create a new application instance (not global)
   */
  static async createNew(): Promise<Application> {
    const app = new Application();
    await app.initialize();
    return app;
  }
}
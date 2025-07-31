/**
 * Service Registration Unit Tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { DIContainer } from '@/di/container';
import { ServiceRegistration } from '@/di/serviceRegistration';

// Application Use Case Interfaces
import type {
  IGameSessionUseCase,
  IQuestionManagementUseCase,
  ITypeManagementUseCase
} from '@/application/interfaces';

// Domain Service Interfaces
import type { 
  ITypeEffectivenessService, 
  IQuestionGeneratorService,
  ITypeRepository 
} from '@/domain/services';

describe('ServiceRegistration', () => {
  let container: DIContainer;

  beforeEach(() => {
    container = new DIContainer();
  });

  describe('configureServices', () => {
    it('should register all required services', () => {
      ServiceRegistration.configureServices(container);

      const expectedServices = [
        'TypeRepository',
        'TypeEffectivenessService',
        'QuestionGeneratorService',
        'GameSessionUseCase',
        'QuestionManagementUseCase',
        'TypeManagementUseCase'
      ];

      expectedServices.forEach(serviceName => {
        expect(container.has(serviceName)).toBe(true);
      });

      expect(container.getServiceNames()).toHaveLength(6);
    });

    it('should resolve infrastructure services correctly', () => {
      ServiceRegistration.configureServices(container);

      const typeRepository = container.resolve<ITypeRepository>('TypeRepository');
      const typeEffectivenessService = container.resolve<ITypeEffectivenessService>('TypeEffectivenessService');
      const questionGeneratorService = container.resolve<IQuestionGeneratorService>('QuestionGeneratorService');

      expect(typeRepository).toBeDefined();
      expect(typeEffectivenessService).toBeDefined();
      expect(questionGeneratorService).toBeDefined();

      // Test that services have the expected methods
      expect(typeof typeRepository.getAllTypes).toBe('function');
      expect(typeof typeEffectivenessService.calculateEffectiveness).toBe('function');
      expect(typeof questionGeneratorService.generateQuestionsWithOptions).toBe('function');
    });

    it('should resolve application use cases correctly', () => {
      ServiceRegistration.configureServices(container);

      const gameSessionUseCase = container.resolve<IGameSessionUseCase>('GameSessionUseCase');
      const questionManagementUseCase = container.resolve<IQuestionManagementUseCase>('QuestionManagementUseCase');
      const typeManagementUseCase = container.resolve<ITypeManagementUseCase>('TypeManagementUseCase');

      expect(gameSessionUseCase).toBeDefined();
      expect(questionManagementUseCase).toBeDefined();
      expect(typeManagementUseCase).toBeDefined();

      // Test that use cases have the expected methods
      expect(typeof gameSessionUseCase.createSession).toBe('function');
      expect(typeof questionManagementUseCase.searchQuestions).toBe('function');
      expect(typeof typeManagementUseCase.getAllTypes).toBe('function');
    });

    it('should create singleton instances', () => {
      ServiceRegistration.configureServices(container);

      // Resolve the same service multiple times
      const service1 = container.resolve<ITypeEffectivenessService>('TypeEffectivenessService');
      const service2 = container.resolve<ITypeEffectivenessService>('TypeEffectivenessService');

      // Should be the same instance (singleton)
      expect(service1).toBe(service2);
    });

    it('should handle dependency injection correctly', () => {
      ServiceRegistration.configureServices(container);

      // Question generator should have dependencies injected
      const questionGenerator = container.resolve<IQuestionGeneratorService>('QuestionGeneratorService');
      
      // This should not throw - dependencies should be properly injected
      expect(() => {
        questionGenerator.generateQuestionsWithOptions({
          count: 1,
          difficulty: 'normal',
          allowDuplicates: true,
          minEffectivenessVariety: 1
        });
      }).not.toThrow();
    });
  });

  describe('createConfiguredContainer', () => {
    it('should create and configure a new container', () => {
      const configuredContainer = ServiceRegistration.createConfiguredContainer();

      expect(configuredContainer).toBeInstanceOf(DIContainer);
      expect(configuredContainer.getServiceNames()).toHaveLength(6);
      
      // Should be able to resolve all services
      expect(() => {
        configuredContainer.resolve('TypeRepository');
        configuredContainer.resolve('TypeEffectivenessService');
        configuredContainer.resolve('QuestionGeneratorService');
        configuredContainer.resolve('GameSessionUseCase');
        configuredContainer.resolve('QuestionManagementUseCase');
        configuredContainer.resolve('TypeManagementUseCase');
      }).not.toThrow();
    });
  });

  describe('validateConfiguration', () => {
    it('should validate correct configuration', () => {
      ServiceRegistration.configureServices(container);

      expect(() => {
        ServiceRegistration.validateConfiguration(container);
      }).not.toThrow();

      const isValid = ServiceRegistration.validateConfiguration(container);
      expect(isValid).toBe(true);
    });

    it('should throw error for missing services', () => {
      // Don't configure services - container is empty

      expect(() => {
        ServiceRegistration.validateConfiguration(container);
      }).toThrow('Required service not registered');
    });

    it('should throw error for partially configured container', () => {
      // Register only some services
      container.register('TypeRepository', () => ({}), true);
      container.register('TypeEffectivenessService', () => ({}), true);

      expect(() => {
        ServiceRegistration.validateConfiguration(container);
      }).toThrow('Required service not registered');
    });
  });

  describe('getDependencyGraph', () => {
    it('should return correct dependency graph', () => {
      const graph = ServiceRegistration.getDependencyGraph();

      expect(graph).toBeDefined();
      expect(typeof graph).toBe('object');

      // Check specific dependencies
      expect(graph['TypeRepository']).toEqual([]);
      expect(graph['TypeEffectivenessService']).toEqual([]);
      expect(graph['QuestionGeneratorService']).toContain('TypeEffectivenessService');
      expect(graph['QuestionGeneratorService']).toContain('TypeRepository');
      expect(graph['GameSessionUseCase']).toContain('QuestionGeneratorService');
      expect(graph['GameSessionUseCase']).toContain('TypeEffectivenessService');
    });

    it('should include all registered services', () => {
      const graph = ServiceRegistration.getDependencyGraph();
      const expectedServices = [
        'TypeRepository',
        'TypeEffectivenessService',
        'QuestionGeneratorService',
        'GameSessionUseCase',
        'QuestionManagementUseCase',
        'TypeManagementUseCase'
      ];

      expectedServices.forEach(serviceName => {
        expect(graph).toHaveProperty(serviceName);
        expect(Array.isArray(graph[serviceName])).toBe(true);
      });
    });
  });

  describe('verifyAllDependencies', () => {
    it('should verify all dependencies successfully', () => {
      ServiceRegistration.configureServices(container);

      const result = ServiceRegistration.verifyAllDependencies(container);
      expect(result).toBe(true);
    });

    it('should return false for broken dependencies', () => {
      // Register a service with broken factory
      container.register('BrokenService', () => {
        throw new Error('Broken factory');
      }, false);

      const result = ServiceRegistration.verifyAllDependencies(container);
      expect(result).toBe(false);
    });

    it('should handle empty container', () => {
      const result = ServiceRegistration.verifyAllDependencies(container);
      expect(result).toBe(true); // Empty container has no dependencies to verify
    });
  });

  describe('getRegistrationSummary', () => {
    it('should return correct summary for configured container', () => {
      ServiceRegistration.configureServices(container);

      const summary = ServiceRegistration.getRegistrationSummary(container);

      expect(summary).toBeDefined();
      expect(summary.totalServices).toBe(6);
      expect(summary.serviceNames).toHaveLength(6);
      expect(summary.dependencyGraph).toBeDefined();

      // Check that all expected services are listed
      const expectedServices = [
        'TypeRepository',
        'TypeEffectivenessService',
        'QuestionGeneratorService',
        'GameSessionUseCase',
        'QuestionManagementUseCase',
        'TypeManagementUseCase'
      ];

      expectedServices.forEach(serviceName => {
        expect(summary.serviceNames).toContain(serviceName);
      });
    });

    it('should return correct summary for empty container', () => {
      const summary = ServiceRegistration.getRegistrationSummary(container);

      expect(summary.totalServices).toBe(0);
      expect(summary.serviceNames).toHaveLength(0);
      expect(summary.dependencyGraph).toBeDefined();
    });
  });

  describe('integration test', () => {
    it('should create a working quiz session end-to-end', async () => {
      ServiceRegistration.configureServices(container);

      // Get the game session use case
      const gameSessionUseCase = container.resolve<IGameSessionUseCase>('GameSessionUseCase');

      // Create a session
      const createResponse = await gameSessionUseCase.createSession({
        difficulty: 'normal',
        questionCount: 3
      });

      expect(createResponse.sessionId).toBeDefined();
      expect(createResponse.config.difficulty).toBe('normal');
      expect(createResponse.config.questionCount).toBe(3);

      // Start the game
      const startResponse = await gameSessionUseCase.startGame({
        sessionId: createResponse.sessionId
      });

      expect(startResponse.sessionId).toBe(createResponse.sessionId);
      expect(startResponse.currentQuestion).toBeDefined();
    });

    it('should perform type management operations', async () => {
      ServiceRegistration.configureServices(container);

      // Get the type management use case
      const typeManagementUseCase = container.resolve<ITypeManagementUseCase>('TypeManagementUseCase');

      // Get all types
      const allTypesResponse = await typeManagementUseCase.getAllTypes({});

      expect(allTypesResponse.types).toBeDefined();
      expect(allTypesResponse.types.length).toBe(18);
      expect(allTypesResponse.totalCount).toBe(18);

      // Search for specific type
      const searchResponse = await typeManagementUseCase.searchTypes({
        searchText: 'fire'
      });

      expect(searchResponse.types.length).toBeGreaterThan(0);
      const fireType = searchResponse.types.find(t => t.id === 'fire');
      expect(fireType).toBeDefined();
    });

    it('should perform question management operations', async () => {
      ServiceRegistration.configureServices(container);

      // Get the question management use case
      const questionManagementUseCase = container.resolve<IQuestionManagementUseCase>('QuestionManagementUseCase');

      // Validate a type interaction
      const validationResponse = await questionManagementUseCase.validateQuestion({
        attackingType: 'fire',
        defendingType: ['grass'],
        difficulty: 'normal'
      });

      expect(validationResponse.isValid).toBe(true);
      expect(validationResponse.calculatedEffectiveness).toBeDefined();

      // Get question pool
      const poolResponse = await questionManagementUseCase.getQuestionPool({
        poolSize: 5,
        difficulty: 'normal'
      });

      expect(poolResponse.questions).toBeDefined();
      expect(poolResponse.questions.length).toBeGreaterThan(0);
      expect(poolResponse.poolMetadata).toBeDefined();
    });
  });
});
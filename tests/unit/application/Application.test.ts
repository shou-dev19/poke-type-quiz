/**
 * Application Unit Tests
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Application, ApplicationFactory } from '@/application/Application';

describe('Application', () => {
  let app: Application;

  beforeEach(() => {
    app = new Application();
  });

  afterEach(async () => {
    if (app.isInitialized()) {
      await app.shutdown();
    }
    ApplicationFactory.reset();
  });

  describe('initialization', () => {
    it('should start uninitialized', () => {
      expect(app.isInitialized()).toBe(false);
    });

    it('should initialize successfully', async () => {
      await app.initialize();
      expect(app.isInitialized()).toBe(true);
    });

    it('should handle multiple initialization calls', async () => {
      await app.initialize();
      await app.initialize(); // Should not throw
      expect(app.isInitialized()).toBe(true);
    });

    it('should throw error when accessing use cases before initialization', () => {
      expect(() => app.getGameSessionUseCase()).toThrow('Application not initialized');
      expect(() => app.getQuestionManagementUseCase()).toThrow('Application not initialized');
      expect(() => app.getTypeManagementUseCase()).toThrow('Application not initialized');
    });
  });

  describe('use case access', () => {
    beforeEach(async () => {
      await app.initialize();
    });

    it('should provide game session use case', () => {
      const useCase = app.getGameSessionUseCase();
      expect(useCase).toBeDefined();
      expect(typeof useCase.createSession).toBe('function');
      expect(typeof useCase.startGame).toBe('function');
      expect(typeof useCase.submitAnswer).toBe('function');
    });

    it('should provide question management use case', () => {
      const useCase = app.getQuestionManagementUseCase();
      expect(useCase).toBeDefined();
      expect(typeof useCase.searchQuestions).toBe('function');
      expect(typeof useCase.validateQuestion).toBe('function');
      expect(typeof useCase.getQuestionStatistics).toBe('function');
    });

    it('should provide type management use case', () => {
      const useCase = app.getTypeManagementUseCase();
      expect(useCase).toBeDefined();
      expect(typeof useCase.getAllTypes).toBe('function');
      expect(typeof useCase.searchTypes).toBe('function');
      expect(typeof useCase.getTypeStatistics).toBe('function');
    });

    it('should return same instance on multiple calls (singleton behavior)', () => {
      const useCase1 = app.getGameSessionUseCase();
      const useCase2 = app.getGameSessionUseCase();
      expect(useCase1).toBe(useCase2);
    });
  });

  describe('application info', () => {
    it('should provide info for uninitialized app', () => {
      const info = app.getApplicationInfo();
      
      expect(info.initialized).toBe(false);
      expect(info.services.totalServices).toBe(0);
      expect(info.services.serviceNames).toHaveLength(0);
      expect(info.version).toBe('1.0.0');
      expect(info.buildTime).toBeInstanceOf(Date);
    });

    it('should provide info for initialized app', async () => {
      await app.initialize();
      const info = app.getApplicationInfo();
      
      expect(info.initialized).toBe(true);
      expect(info.services.totalServices).toBe(6);
      expect(info.services.serviceNames).toHaveLength(6);
      expect(info.services.dependencyGraph).toBeDefined();
      
      const expectedServices = [
        'TypeRepository',
        'TypeEffectivenessService',
        'QuestionGeneratorService',
        'GameSessionUseCase',
        'QuestionManagementUseCase',
        'TypeManagementUseCase'
      ];
      
      expectedServices.forEach(serviceName => {
        expect(info.services.serviceNames).toContain(serviceName);
      });
    });
  });

  describe('health check', () => {
    it('should return unhealthy for uninitialized app', async () => {
      const health = await app.healthCheck();
      
      expect(health.status).toBe('unhealthy');
      expect(health.services.application).toBe('error');
      expect(health.timestamp).toBeInstanceOf(Date);
    });

    it('should return healthy for initialized app', async () => {
      await app.initialize();
      const health = await app.healthCheck();
      
      expect(health.status).toBe('healthy');
      expect(health.services.GameSessionUseCase).toBe('ok');
      expect(health.services.QuestionManagementUseCase).toBe('ok');
      expect(health.services.TypeManagementUseCase).toBe('ok');
      expect(health.timestamp).toBeInstanceOf(Date);
    });
  });

  describe('child application', () => {
    beforeEach(async () => {
      await app.initialize();
    });

    it('should create child application', () => {
      const child = app.createChild();
      
      expect(child).toBeInstanceOf(Application);
      expect(child.isInitialized()).toBe(true);
      expect(child).not.toBe(app);
    });

    it('should allow child to access use cases', () => {
      const child = app.createChild();
      
      expect(() => child.getGameSessionUseCase()).not.toThrow();
      expect(() => child.getQuestionManagementUseCase()).not.toThrow();
      expect(() => child.getTypeManagementUseCase()).not.toThrow();
    });
  });

  describe('shutdown', () => {
    it('should shutdown uninitialized app without error', async () => {
      await expect(app.shutdown()).resolves.not.toThrow();
    });

    it('should shutdown initialized app', async () => {
      await app.initialize();
      expect(app.isInitialized()).toBe(true);
      
      await app.shutdown();
      expect(app.isInitialized()).toBe(false);
    });

    it('should prevent use case access after shutdown', async () => {
      await app.initialize();
      await app.shutdown();
      
      expect(() => app.getGameSessionUseCase()).toThrow('Application not initialized');
    });
  });

  describe('container access', () => {
    beforeEach(async () => {
      await app.initialize();
    });

    it('should provide access to DI container', () => {
      const container = app.getContainer();
      expect(container).toBeDefined();
      expect(typeof container.resolve).toBe('function');
      expect(typeof container.has).toBe('function');
    });

    it('should throw error when accessing container before initialization', () => {
      const uninitializedApp = new Application();
      expect(() => uninitializedApp.getContainer()).toThrow('Application not initialized');
    });
  });
});

describe('ApplicationFactory', () => {
  afterEach(() => {
    ApplicationFactory.reset();
  });

  describe('getInstance', () => {
    it('should create and return singleton instance', async () => {
      const app1 = await ApplicationFactory.getInstance();
      const app2 = await ApplicationFactory.getInstance();
      
      expect(app1).toBe(app2);
      expect(app1.isInitialized()).toBe(true);
    });

    it('should return initialized application', async () => {
      const app = await ApplicationFactory.getInstance();
      
      expect(app.isInitialized()).toBe(true);
      expect(() => app.getGameSessionUseCase()).not.toThrow();
    });
  });

  describe('createNew', () => {
    it('should create new instance each time', async () => {
      const app1 = await ApplicationFactory.createNew();
      const app2 = await ApplicationFactory.createNew();
      
      expect(app1).not.toBe(app2);
      expect(app1.isInitialized()).toBe(true);
      expect(app2.isInitialized()).toBe(true);
    });

    it('should not affect singleton instance', async () => {
      const singleton = await ApplicationFactory.getInstance();
      const newApp = await ApplicationFactory.createNew();
      
      expect(singleton).not.toBe(newApp);
      
      const singleton2 = await ApplicationFactory.getInstance();
      expect(singleton).toBe(singleton2);
    });
  });

  describe('reset', () => {
    it('should reset singleton instance', async () => {
      const app1 = await ApplicationFactory.getInstance();
      ApplicationFactory.reset();
      const app2 = await ApplicationFactory.getInstance();
      
      expect(app1).not.toBe(app2);
    });

    it('should handle reset when no instance exists', () => {
      expect(() => ApplicationFactory.reset()).not.toThrow();
    });
  });

  describe('integration test', () => {
    it('should work end-to-end with factory', async () => {
      const app = await ApplicationFactory.getInstance();
      
      // Test complete workflow
      const gameSessionUseCase = app.getGameSessionUseCase();
      const typeManagementUseCase = app.getTypeManagementUseCase();
      
      // Create game session
      const sessionResponse = await gameSessionUseCase.createSession({
        difficulty: 'normal',
        questionCount: 2
      });
      
      expect(sessionResponse.sessionId).toBeDefined();
      
      // Get types
      const typesResponse = await typeManagementUseCase.getAllTypes({});
      expect(typesResponse.types.length).toBe(18);
      
      // Health check should be healthy
      const health = await app.healthCheck();
      expect(health.status).toBe('healthy');
    });
  });
});
/**
 * DIContainer Unit Tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { DIContainer } from '@/di/container';

describe('DIContainer', () => {
  let container: DIContainer;

  beforeEach(() => {
    container = new DIContainer();
  });

  describe('register and resolve', () => {
    it('should register and resolve a simple service', () => {
      // Arrange
      const testService = { name: 'test' };
      container.register('testService', () => testService);

      // Act
      const resolved = container.resolve('testService');

      // Assert
      expect(resolved).toBe(testService);
    });

    it('should create new instances for non-singleton services', () => {
      // Arrange
      container.register('service', () => ({ id: Math.random() }), false);

      // Act
      const instance1 = container.resolve('service');
      const instance2 = container.resolve('service');

      // Assert
      expect(instance1).not.toBe(instance2);
      expect(instance1.id).not.toBe(instance2.id);
    });

    it('should return same instance for singleton services', () => {
      // Arrange
      container.register('singleton', () => ({ id: Math.random() }), true);

      // Act
      const instance1 = container.resolve('singleton');
      const instance2 = container.resolve('singleton');

      // Assert
      expect(instance1).toBe(instance2);
      expect(instance1.id).toBe(instance2.id);
    });

    it('should pass container to factory function', () => {
      // Arrange
      let receivedContainer: DIContainer | undefined;
      container.register('service', (c) => {
        receivedContainer = c;
        return {};
      });

      // Act
      container.resolve('service');

      // Assert
      expect(receivedContainer).toBe(container);
    });
  });

  describe('error handling', () => {
    it('should throw error for unregistered service', () => {
      // Act & Assert
      expect(() => container.resolve('nonexistent')).toThrow(
        'Service nonexistent not found'
      );
    });
  });

  describe('utility methods', () => {
    it('should check if service exists', () => {
      // Arrange
      container.register('exists', () => ({}));

      // Act & Assert
      expect(container.has('exists')).toBe(true);
      expect(container.has('nonexistent')).toBe(false);
    });

    it('should return all service names', () => {
      // Arrange
      container.register('service1', () => ({}));
      container.register('service2', () => ({}));

      // Act
      const names = container.getServiceNames();

      // Assert
      expect(names).toContain('service1');
      expect(names).toContain('service2');
      expect(names).toHaveLength(2);
    });

    it('should clear all services', () => {
      // Arrange
      container.register('service', () => ({}));
      expect(container.has('service')).toBe(true);

      // Act
      container.clear();

      // Assert
      expect(container.has('service')).toBe(false);
      expect(container.getServiceNames()).toHaveLength(0);
    });
  });

  describe('child containers', () => {
    it('should create child container with inherited services', () => {
      // Arrange
      container.register('parent', () => ({ type: 'parent' }));
      
      // Act
      const child = container.createChild();
      
      // Assert
      expect(child.has('parent')).toBe(true);
      expect(child.resolve('parent')).toEqual({ type: 'parent' });
    });

    it('should allow child container to override parent services', () => {
      // Arrange
      container.register('service', () => ({ source: 'parent' }));
      const child = container.createChild();
      child.register('service', () => ({ source: 'child' }));

      // Act
      const parentResult = container.resolve('service');
      const childResult = child.resolve('service');

      // Assert
      expect(parentResult).toEqual({ source: 'parent' });
      expect(childResult).toEqual({ source: 'child' });
    });
  });
});
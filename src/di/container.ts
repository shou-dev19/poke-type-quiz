/**
 * Dependency Injection Container
 * Clean Architecture implementation for service management
 */

export type ServiceFactory<T = any> = (container: DIContainer) => T;

export interface ServiceRegistration<T = any> {
  factory: ServiceFactory<T>;
  singleton: boolean;
}

/**
 * Simple Dependency Injection Container
 * Manages service registration and resolution
 */
export class DIContainer {
  private services: Map<string, ServiceRegistration>;
  private singletons: Map<string, any>;

  constructor() {
    this.services = new Map<string, ServiceRegistration>();
    this.singletons = new Map<string, any>();
  }

  /**
   * Register a service with the container
   * @param name - Service identifier
   * @param factory - Factory function to create the service
   * @param singleton - Whether to create a singleton instance
   */
  register<T>(
    name: string,
    factory: ServiceFactory<T>,
    singleton: boolean = false
  ): void {
    this.services.set(name, { factory, singleton });
  }

  /**
   * Resolve a service from the container
   * @param name - Service identifier
   * @returns The resolved service instance
   * @throws Error if service is not found
   */
  resolve<T = any>(name: string): T {
    const service = this.services.get(name);
    if (!service) {
      throw new Error(`Service ${name} not found`);
    }

    if (service.singleton) {
      if (!this.singletons.has(name)) {
        this.singletons.set(name, service.factory(this));
      }
      return this.singletons.get(name) as T;
    }

    return service.factory(this) as T;
  }

  /**
   * Check if a service is registered
   * @param name - Service identifier
   * @returns True if service is registered
   */
  has(name: string): boolean {
    return this.services.has(name);
  }

  /**
   * Get all registered service names
   * @returns Array of service names
   */
  getServiceNames(): string[] {
    return Array.from(this.services.keys());
  }

  /**
   * Clear all services and singletons
   */
  clear(): void {
    this.services.clear();
    this.singletons.clear();
  }

  /**
   * Create a new child container with inherited services
   * @returns New DIContainer instance
   */
  createChild(): DIContainer {
    const child = new DIContainer();
    // Copy service registrations (not instances)
    this.services.forEach((registration, name) => {
      child.services.set(name, registration);
    });
    return child;
  }
}
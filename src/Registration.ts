import InstancePerDependencyResolver from './resolvers/InstancePerDependencyResolver';
import SingleInstanceResolver from './resolvers/SingleInstanceResolver';
import ServiceImplementationResolver from './resolvers/ServiceImplementationResolver';
import ProvidedInstanceResolver from './resolvers/ProvidedInstanceResolver';
import CombinedResolver from './resolvers/CombinedResolver';

export default class Registration implements IRegistration {
  public parameters: IParameter[] = [];
  public disposalFunction;
  private resolver: IResolver;

  constructor (public key: string, public factory: (...args) => any) {}

  public resolve(container: IContainer) {
    if (this.resolver == null) {
      throw new Error(`No resolution strategy specified for ${this.key}`);
    }
    return this.resolver.resolve(container);
  }

  public resolveMany(container: IContainer) {
    if (this.resolver == null) {
      throw new Error(`No resolution strategy specified for ${this.key}`);
    }
    return this.resolver.resolveMany(container);
  }

  public singleInstance() {
    if (this.resolver != null) {
      throw new Error(`Cannot specify singleInstance resolution strategy alongside other strategies (${this.key})`);
    }
    this.resolver = new SingleInstanceResolver(this);
    return this;
  }

  public instancePerDependency() {
    if (this.resolver != null) {
      throw new Error(`Cannot specify instancePerDependency resolution strategy alongside other strategies (${this.key})`);
    }
    this.resolver = new InstancePerDependencyResolver(this);
    return this;
  }

  public providedInstance(instance) {
    if (this.resolver != null) {
      throw new Error(`Cannot specify providedInstance resolution strategy alongside other strategies (${this.key})`);
    }
    this.resolver = new ProvidedInstanceResolver(instance);
  }

  public resetResolutionStrategy() {
    this.resolver = null;
    return this;
  }

  public implementedBy(serviceImplementerKey: string) {
    const implementerResolver = new ServiceImplementationResolver(serviceImplementerKey);
    if (this.resolver == null) {
      this.resolver = implementerResolver;
    } else if (this.resolver instanceof ServiceImplementationResolver || this.resolver instanceof CombinedResolver) {
      this.resolver = new CombinedResolver(this.key, [this.resolver, implementerResolver]);
    } else {
      throw new Error(`Attempted to use an invalid combination of resolution strategies (${this.key})`);
    }
    return this;
  }

  public disposeBy(disposalFunction) {
    if (this.disposalFunction != null) {
      throw new Error(`Disposal function already specified for ${this.key}`);
    }
    this.disposalFunction = disposalFunction;
    return this;
  }
}

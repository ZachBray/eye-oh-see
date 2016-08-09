/// <reference path="IRegistration.ts" />
/// <reference path="../parameters/IParameter.ts" />
/// <reference path="../resolvers/IResolver.ts" />
/// <reference path="../resolvers/IResolutionContext.ts" />
import InstancePerDependencyResolver from '../resolvers/InstancePerDependencyResolver';
import InstancePerScopeResolver from '../resolvers/InstancePerScopeResolver';
import SingleInstanceResolver from '../resolvers/SingleInstanceResolver';
import ServiceImplementationResolver from '../resolvers/ServiceImplementationResolver';
import ProvidedInstanceResolver from '../resolvers/ProvidedInstanceResolver';
import CombinedResolver from '../resolvers/CombinedResolver';

export default class Registration implements IRegistration {
  public parameters: IParameter[] = [];
  public disposalFunction: (instance: any) => void;
  private resolver: IResolver;
  private isResolving: boolean;

  constructor (public key: string, public factory: (...args: any[]) => any) {}

  public resolveOne(context: IResolutionContext): any {
    return this.protectAgainstCycles(() => {
      if (this.resolver == null) {
        throw new Error(`No resolution strategy specified for ${this.key}`);
      }
      return this.resolver.resolve(context);
    });
  }

  public resolveMany(context: IResolutionContext): any {
    return this.protectAgainstCycles(() => {
      if (this.resolver == null) {
        return [];
      }
      return this.resolver.resolveMany(context);
    });
  }

  public singleInstance() {
    if (this.resolver != null) {
      throw new Error(`Cannot specify singleInstance resolution strategy alongside other strategies (${this.key})`);
    }
    this.resolver = new SingleInstanceResolver(this);
    return this;
  }

  public instancePerScope(scopeName: string) {
    if (this.resolver != null) {
      throw new Error(`Cannot specify instancePerScope resolution strategy alongside other strategies (${this.key})`);
    }
    this.resolver = new InstancePerScopeResolver(scopeName, this);
    return this;
  }

  public instancePerDependency() {
    if (this.resolver != null) {
      throw new Error(`Cannot specify instancePerDependency resolution strategy alongside other strategies (${this.key})`);
    }
    this.resolver = new InstancePerDependencyResolver(this);
    return this;
  }

  public providedInstance(instance: any) {
    if (this.resolver != null) {
      throw new Error(`Cannot specify providedInstance resolution strategy alongside other strategies (${this.key})`);
    }
    this.resolver = new ProvidedInstanceResolver(instance);
  }

  public resetResolutionStrategy() {
    this.resolver = null;
    return this;
  }

  public implementedBy(serviceImpl: Function) {
    const implementerResolver = new ServiceImplementationResolver(serviceImpl);
    if (this.resolver == null) {
      this.resolver = implementerResolver;
    } else if (this.resolver instanceof ServiceImplementationResolver || this.resolver instanceof CombinedResolver) {
      this.resolver = new CombinedResolver(this.key, [this.resolver, implementerResolver]);
    } else {
      throw new Error(`Attempted to use an invalid combination of resolution strategies (${this.key})`);
    }
    return this;
  }

  public disposeBy(disposalFunction: (instance: any) => void) {
    if (this.disposalFunction != null) {
      throw new Error(`Disposal function already specified for ${this.key}`);
    }
    this.disposalFunction = disposalFunction;
    return this;
  }

  private protectAgainstCycles(action: () => void) {
    try {
      if (this.isResolving) {
        throw new Error('Cycle detected');
      }
      this.isResolving = true;
      return action();
    } catch(error) {
      throw new Error(`When resolving ${this.key}:\n\t${error}`);
    } finally {
      this.isResolving = false;
    }
  }
}

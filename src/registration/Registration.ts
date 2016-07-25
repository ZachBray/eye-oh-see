/// <reference path="IRegistration.ts" />
/// <reference path="../parameters/IParameter.ts" />
/// <reference path="../resolvers/IResolver.ts" />
/// <reference path="../resolvers/IResolutionContext.ts" />
import InstancePerDependencyResolver from '../resolvers/InstancePerDependencyResolver';
import SingleInstanceResolver from '../resolvers/SingleInstanceResolver';
import ServiceImplementationResolver from '../resolvers/ServiceImplementationResolver';
import ProvidedInstanceResolver from '../resolvers/ProvidedInstanceResolver';
import CombinedResolver from '../resolvers/CombinedResolver';

enum Quantity {
  One,
  Many
}

export default class Registration implements IRegistration {
  public parameters: IParameter[] = [];
  public disposalFunction;
  private resolver: IResolver;
  private isResolving: boolean;

  constructor (public key: string, public factory: (...args) => any) {}

  public resolveOne(context: IResolutionContext): any {
    return this.resolve(context, Quantity.One);
  }

  public resolveMany(context: IResolutionContext): any {
    return this.resolve(context, Quantity.Many);
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

  public disposeBy(disposalFunction) {
    if (this.disposalFunction != null) {
      throw new Error(`Disposal function already specified for ${this.key}`);
    }
    this.disposalFunction = disposalFunction;
    return this;
  }

  private resolve(context: IResolutionContext, quantity: Quantity) {
    if (this.resolver == null) {
      throw new Error(`No resolution strategy specified for ${this.key}`);
    }
    try {
      if (this.isResolving) {
        throw new Error('Loop detected');
      }
      this.isResolving = true;
      if (quantity === Quantity.One) {
        return this.resolver.resolve(context);
      } else {
        return this.resolver.resolveMany(context);
      }
    } catch(error) {
      throw new Error(`When resolving ${this.key}:\n\t${error}`);
    } finally {
      this.isResolving = false;
    }
  }
}

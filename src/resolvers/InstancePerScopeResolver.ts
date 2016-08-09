/// <reference path="IResolver.ts" />
/// <reference path="IResolutionContext.ts" />

import InstancePerDependencyResolver from './InstancePerDependencyResolver';

export default class InstancePerScopeResolver implements IResolver {
  private innerResolver: IResolver;

  constructor(private scopeName: string, private registration: IRegistration) {
    this.innerResolver = new InstancePerDependencyResolver(registration);
  }

  resolve(context: IResolutionContext) {
    const scopedContext = this.findScope(context);
    const containerInstances = scopedContext.resolvingContainer.instances;
    const existingInstance = containerInstances[this.registration.key];
    if (existingInstance) {
      return existingInstance;
    }
    const instance = this.innerResolver.resolve(scopedContext);
    containerInstances[this.registration.key] = instance;
    return instance;
  }

  resolveMany(context: IResolutionContext) {
    return [this.resolve(context)];
  }

  private findScope(context: IResolutionContext): IResolutionContext {
    if (context.resolvingContainer.scopeName === this.scopeName) {
      return context;
    }
    if (context.resolvingContainer === context.registeringContainer) {
      throw new Error(`Scope '${this.scopeName}' not found when resolving '${this.registration.key}'.`);
    }
    return this.findScope({
      registeringContainer: context.registeringContainer,
      resolvingContainer: context.resolvingContainer.parent
    });
  }
}


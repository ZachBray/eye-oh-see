/// <reference path="IResolver.ts" />
/// <reference path="IResolutionContext.ts" />

import InstancePerDependencyResolver from './InstancePerDependencyResolver';

export default class SingleInstanceResolver implements IResolver {
  private innerResolver: IResolver;

  constructor(private registration: IRegistration) {
    this.innerResolver = new InstancePerDependencyResolver(registration);
  }

  resolve(context: IResolutionContext) {
    const scopedContext = {
      registeringContainer: context.registeringContainer,
      resolvingContainer: context.registeringContainer
    };
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
}


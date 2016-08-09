/// <reference path="IResolver.ts" />
/// <reference path="IResolutionContext.ts" />

import InstancePerDependencyResolver from './InstancePerDependencyResolver';

export default class InstancePerFactoryContainer implements IResolver {
  private innerResolver: IResolver;

  constructor(private registration: IRegistration) {
    this.innerResolver = new InstancePerDependencyResolver(registration);
  }

  resolve(context: IResolutionContext) {
    const containerInstances = context.resolvingContainer.instances;
    const existingInstance = containerInstances[this.registration.key];
    if (existingInstance) {
      return existingInstance;
    }
    const instance = this.innerResolver.resolve(context);
    containerInstances[this.registration.key] = instance;
    return instance;
  }

  resolveMany(context: IResolutionContext) {
    return [this.resolve(context)];
  }
}


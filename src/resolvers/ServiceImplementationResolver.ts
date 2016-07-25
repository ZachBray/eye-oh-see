/// <reference path="IResolver.ts" />
/// <reference path="IResolutionContext.ts" />

export default class ServiceImplementationResolver implements IResolver {
  constructor(public serviceImpl: Function) {}

  resolve(context: IResolutionContext) {
    return context.resolvingContainer.resolve(this.serviceImpl);
  }

  resolveMany(context: IResolutionContext) {
    return context.resolvingContainer.resolveMany(this.serviceImpl);
  }
}

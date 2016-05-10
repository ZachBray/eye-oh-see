export default class ServiceImplementationResolver {
  constructor(public serviceImpl: Function) {}

  resolve(context: IResolutionContext) {
    return context.resolvingContainer.resolve(this.serviceImpl);
  }

  resolveMany(context: IResolutionContext) {
    return context.resolvingContainer.resolveMany(this.serviceImpl);
  }
}

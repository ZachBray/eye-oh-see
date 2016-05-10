export default class InstancePerDependencyResolver implements IResolver {
  constructor(private registration: IRegistration) {}

  resolve(context: IResolutionContext) {
    const args = this.registration.parameters.map(p => p.resolve(context.resolvingContainer));
    // TODO: is class?
    const instance = new this.registration.factory(...args);
    const dispose = this.registration.disposalFunction;
    if (dispose != null) {
      context.resolvingContainer.registerDisposable(() => dispose(instance));
    }
    return instance;
  }

  resolveMany(context: IResolutionContext) {
    return [this.resolve(context)];
  }
}

export default class InstancePerDependencyResolver implements IResolver {
  constructor(private registration: IRegistration) {}

  resolve(container: IContainer) {
    const args = this.registration.parameters.map(p => p.resolve(container));
    // TODO: is class?
    const instance = new this.registration.factory(...args);
    const dispose = this.registration.disposalFunction;
    if (dispose != null) {
      container.registerDisposable(() => dispose(instance));
    }
    return instance;
  }

  resolveMany(container: IContainer) {
    return [this.resolve(container)];
  }
}

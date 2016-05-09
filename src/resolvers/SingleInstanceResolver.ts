export default class SingleInstanceResolver implements IResolver {
  private hasResolved = false;
  private resolvedValue;

  constructor(private registration: IRegistration) {}

  resolve(container: IContainer) {
    if (!this.hasResolved) {
      const args = this.registration.parameters.map(p => p.resolve(container));
      // TODO: is class?
      this.resolvedValue = new this.registration.factory(...args);
      const dispose = this.registration.disposalFunction;
      if (dispose != null) {
        container.registerDisposable(() => dispose(this.resolvedValue));
      }
      this.hasResolved = true;
    }
    return this.resolvedValue;
  }

  resolveMany(container: IContainer) {
    return [this.resolve(container)];
  }
}


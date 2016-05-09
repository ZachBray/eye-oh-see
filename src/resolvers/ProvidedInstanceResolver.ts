export default class ProvidedInstanceResolver implements IResolver {
  constructor(private providedInstance) {}

  resolve(container: IContainer) {
    return this.providedInstance;
  }

  resolveMany(container: IContainer) {
    return [this.resolve(container)];
  }
}

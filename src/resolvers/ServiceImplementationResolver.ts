export default class ServiceImplementationResolver {
  constructor(public serviceImplementerKey: string) {}

  resolve(container: IContainer) {
    return container.resolve(this.serviceImplementerKey);
  }

  resolveMany(container: IContainer) {
    return container.resolveMany(this.serviceImplementerKey);
  }
}

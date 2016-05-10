export default class ServiceImplementationResolver {
  constructor(public serviceImpl: Function) {}

  resolve(container: IContainer) {
    return container.resolve(this.serviceImpl);
  }

  resolveMany(container: IContainer) {
    return container.resolveMany(this.serviceImpl);
  }
}

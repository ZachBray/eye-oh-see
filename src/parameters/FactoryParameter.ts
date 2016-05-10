export default class FactoryParameter {
  constructor(private service: Function) {}

  resolve(container: IContainer): any {
    return () => container.resolve(this.service);
  }
}

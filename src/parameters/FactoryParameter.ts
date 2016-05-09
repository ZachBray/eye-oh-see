export default class FactoryParameter {
  constructor(private serviceKey: string) {}

  resolve(container: IContainer): any {
    return () => container.resolve(this.serviceKey);
  }
}

export default class ArrayParameter {
  constructor(private serviceKey: string) {}

  resolve(container: IContainer): any {
    return container.resolveMany(this.serviceKey);
  }
}


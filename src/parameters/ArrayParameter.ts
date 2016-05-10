export default class ArrayParameter {
  constructor(private service: Function) {}

  resolve(container: IContainer): any {
    return container.resolveMany(this.service);
  }
}


export default class Parameter implements IParameter {
  constructor(private serviceKey: string) {}

  resolve(container: IContainer): any {
    return container.resolve(this.serviceKey);
  }
}

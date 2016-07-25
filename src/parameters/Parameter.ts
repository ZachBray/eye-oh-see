/// <reference path="IParameter.ts" />
/// <reference path="../IContainer.ts" />

export default class Parameter implements IParameter {
  constructor(private service: Function) {}

  resolve(container: IContainer): any {
    return container.resolve(this.service);
  }
}

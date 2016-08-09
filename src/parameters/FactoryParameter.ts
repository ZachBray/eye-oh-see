/// <reference path="../IContainer.ts" />

export default class FactoryParameter {
  constructor(private paramServices: Function[], private service: Function) {}

  resolve(container: IContainer): any {
    return (...args: any[]) => {
      if (args.length !== this.paramServices.length) {
        throw new Error('Incorrect number of arguments passed to factory.');
      }
      const child = container.createChild();
      args.forEach((arg, i) => {
        const paramService = this.paramServices[i];
        child.register(paramService).providedInstance(arg);
      });
      return child.resolve(this.service);
    };
  }
}

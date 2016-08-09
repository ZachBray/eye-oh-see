/// <reference path="./registration/IRegistration.ts" />

interface IContainer {
  parent: IContainer;
  instances: { [key: string]: any };
  createChild(): IContainer;
  resolve(service: Function): any;
  resolveMany(service: Function): any[];
  register(service: Function): IRegistration;
  registerDisposable(disposable: () => void): void;
  dispose(): void;
}

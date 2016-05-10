interface IContainer {
  parent: IContainer;
  createChild(): IContainer;
  resolve(service: Function): any;
  resolveMany(service: Function): any[];
  registerDisposable(disposable: () => void): void;
  dispose(): void;
}

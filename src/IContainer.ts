interface IContainer {
  resolve(service: Function): any;
  resolveMany(service: Function): any[];
  registerDisposable(disposable: () => void): void;
}

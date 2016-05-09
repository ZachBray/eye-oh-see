interface IContainer {
  resolve(serviceKey: string): any;
  resolveMany(serviceKey: string): any[];
  registerDisposable(disposable: () => void): void;
}

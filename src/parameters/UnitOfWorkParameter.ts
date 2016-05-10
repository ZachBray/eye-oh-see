export default class UnitOfWorkParameter {
  constructor(private service: Function) {}

  resolve(container: IContainer): any {
    return () => {
      const childContainer = container.createChild();
      const value = childContainer.resolve(this.service);
      const dispose = () => childContainer.dispose();
      return { value, dispose };
    };
  }
}

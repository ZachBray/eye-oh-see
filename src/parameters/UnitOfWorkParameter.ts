/// <reference path="../IContainer.ts" />
/// <reference path="IParameter.ts" />

import FactoryParameter from './FactoryParameter';

export default class UnitOfWorkParameter {
  private factoryParameter: IParameter;
  constructor(private paramServices: Function[], private service: Function) {
    this.factoryParameter = new FactoryParameter(paramServices, service);
  }

  resolve(container: IContainer): any {
    return (...args) => {
      const childContainer = container.createChild();
      const valueFactory = this.factoryParameter.resolve(childContainer);
      const value = valueFactory(...args);
      const dispose = () => childContainer.dispose();
      return { value, dispose };
    };
  }
}

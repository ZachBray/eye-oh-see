/// <reference path="../IContainer.ts" />
/// <reference path="IParameter.ts" />

import FactoryParameter from './FactoryParameter';

export default class UnitOfWorkParameter {
  private factoryParameter: IParameter;
  constructor(private paramServices: Function[], private service: Function, scopeName?: string) {
    this.factoryParameter = new FactoryParameter(paramServices, service, scopeName);
  }

  resolve(container: IContainer): any {
    return (...args: any[]) => {
      const childContainer = container.createChild();
      const valueFactory = this.factoryParameter.resolve(childContainer);
      const value = valueFactory(...args);
      const dispose = () => childContainer.dispose();
      return { value, dispose };
    };
  }
}

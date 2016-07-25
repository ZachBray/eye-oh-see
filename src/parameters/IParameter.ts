/// <reference path="../IContainer.ts" />

interface IParameter {
  resolve(container: IContainer): any;
}

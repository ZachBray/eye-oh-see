/// <reference path="../IContainer.d.ts" />
/// <reference path="IParameter.d.ts" />
export default class UnitOfWorkParameter {
    private paramServices;
    private service;
    private factoryParameter;
    constructor(paramServices: Function[], service: Function, scopeName?: string);
    resolve(container: IContainer): any;
}

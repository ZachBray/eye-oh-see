/// <reference path="../IContainer.d.ts" />
export default class FactoryParameter {
    private paramServices;
    private service;
    private scopeName;
    constructor(paramServices: Function[], service: Function, scopeName?: string);
    resolve(container: IContainer): any;
}

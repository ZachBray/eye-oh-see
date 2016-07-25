/// <reference path="../IContainer.d.ts" />
export default class FactoryParameter {
    private paramServices;
    private service;
    constructor(paramServices: Function[], service: Function);
    resolve(container: IContainer): any;
}

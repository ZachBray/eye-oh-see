/// <reference path="IParameter.d.ts" />
/// <reference path="../IContainer.d.ts" />
export default class Parameter implements IParameter {
    private service;
    constructor(service: Function);
    resolve(container: IContainer): any;
}

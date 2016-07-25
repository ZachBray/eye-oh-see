/// <reference path="../IContainer.d.ts" />
export default class ArrayParameter {
    private service;
    constructor(service: Function);
    resolve(container: IContainer): any;
}

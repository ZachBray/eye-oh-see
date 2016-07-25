export default class UnitOfWorkParameter {
    private paramServices;
    private service;
    private factoryParameter;
    constructor(paramServices: Function[], service: Function);
    resolve(container: IContainer): any;
}

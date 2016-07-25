export default class Parameter implements IParameter {
    private service;
    constructor(service: Function);
    resolve(container: IContainer): any;
}

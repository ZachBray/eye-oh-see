export default class ServiceImplementationResolver {
    serviceImpl: Function;
    constructor(serviceImpl: Function);
    resolve(context: IResolutionContext): any;
    resolveMany(context: IResolutionContext): any[];
}

/// <reference path="IResolver.d.ts" />
/// <reference path="IResolutionContext.d.ts" />
export default class ServiceImplementationResolver implements IResolver {
    serviceImpl: Function;
    constructor(serviceImpl: Function);
    resolve(context: IResolutionContext): any;
    resolveMany(context: IResolutionContext): any[];
}

/// <reference path="IRegistration.d.ts" />
/// <reference path="../parameters/IParameter.d.ts" />
/// <reference path="../resolvers/IResolver.d.ts" />
/// <reference path="../resolvers/IResolutionContext.d.ts" />
export default class Registration implements IRegistration {
    key: string;
    factory: (...args) => any;
    parameters: IParameter[];
    disposalFunction: any;
    private resolver;
    private isResolving;
    constructor(key: string, factory: (...args) => any);
    resolveOne(context: IResolutionContext): any;
    resolveMany(context: IResolutionContext): any;
    singleInstance(): this;
    instancePerDependency(): this;
    providedInstance(instance: any): void;
    resetResolutionStrategy(): this;
    implementedBy(serviceImpl: Function): this;
    disposeBy(disposalFunction: any): this;
    private resolve(context, quantity);
}

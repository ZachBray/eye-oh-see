/// <reference path="IRegistration.d.ts" />
/// <reference path="../parameters/IParameter.d.ts" />
/// <reference path="../resolvers/IResolver.d.ts" />
/// <reference path="../resolvers/IResolutionContext.d.ts" />
export default class Registration implements IRegistration {
    key: string;
    factory: Function;
    parameters: IParameter[];
    disposalFunction: (instance: any) => void;
    private resolver;
    private isResolving;
    constructor(key: string, factory: Function);
    resolveOne(context: IResolutionContext): any;
    resolveMany(context: IResolutionContext): any;
    singleInstance(): this;
    instancePerScope(scopeName: string): this;
    instancePerDependency(): this;
    providedInstance(instance: any): void;
    resetResolutionStrategy(): this;
    implementedBy(serviceImpl: Function): this;
    disposeBy(disposalFunction: (instance: any) => void): this;
    private protectAgainstCycles(action);
}

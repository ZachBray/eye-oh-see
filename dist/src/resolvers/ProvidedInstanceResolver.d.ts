/// <reference path="IResolver.d.ts" />
/// <reference path="IResolutionContext.d.ts" />
export default class ProvidedInstanceResolver implements IResolver {
    private providedInstance;
    constructor(providedInstance: any);
    resolve(context: IResolutionContext): any;
    resolveMany(context: IResolutionContext): any[];
}

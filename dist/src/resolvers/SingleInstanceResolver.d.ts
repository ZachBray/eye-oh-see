/// <reference path="IResolver.d.ts" />
/// <reference path="IResolutionContext.d.ts" />
export default class SingleInstanceResolver implements IResolver {
    private registration;
    private hasResolved;
    private resolvedValue;
    private innerResolver;
    constructor(registration: IRegistration);
    resolve(context: IResolutionContext): any;
    resolveMany(context: IResolutionContext): any[];
}

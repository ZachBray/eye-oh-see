/// <reference path="IResolver.d.ts" />
/// <reference path="IResolutionContext.d.ts" />
export default class InstancePerScopeResolver implements IResolver {
    private scopeName;
    private registration;
    private innerResolver;
    constructor(scopeName: string, registration: IRegistration);
    resolve(context: IResolutionContext): any;
    resolveMany(context: IResolutionContext): any[];
    private findScope(context);
}

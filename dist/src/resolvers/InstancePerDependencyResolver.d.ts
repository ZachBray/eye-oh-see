export default class InstancePerDependencyResolver implements IResolver {
    private registration;
    constructor(registration: IRegistration);
    resolve(context: IResolutionContext): any;
    resolveMany(context: IResolutionContext): any[];
}

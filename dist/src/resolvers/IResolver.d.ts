/// <reference path="IResolutionContext.d.ts" />
interface IResolver {
    resolve(context: IResolutionContext): any;
    resolveMany(context: IResolutionContext): any;
}

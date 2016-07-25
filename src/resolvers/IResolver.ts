/// <reference path="IResolutionContext.ts" />

interface IResolver {
  resolve(context: IResolutionContext): any;
  resolveMany(context: IResolutionContext): any;
}

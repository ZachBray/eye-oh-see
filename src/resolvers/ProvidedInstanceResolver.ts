/// <reference path="IResolver.ts" />
/// <reference path="IResolutionContext.ts" />

export default class ProvidedInstanceResolver implements IResolver {
  constructor(private providedInstance: any) {}

  resolve(context: IResolutionContext) {
    return this.providedInstance;
  }

  resolveMany(context: IResolutionContext) {
    return [this.resolve(context)];
  }
}

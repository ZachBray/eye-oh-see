export default class ProvidedInstanceResolver implements IResolver {
  constructor(private providedInstance) {}

  resolve(context: IResolutionContext) {
    return this.providedInstance;
  }

  resolveMany(context: IResolutionContext) {
    return [this.resolve(context)];
  }
}

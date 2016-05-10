export default class CombinedResolver implements IResolver {
  constructor(private key: string, private resolvers: IResolver[]) {}

  resolve(context: IResolutionContext) {
    throw new Error(`Attempted to resolve a single ${this.key} but it has multiple implementations`);
  }

  resolveMany(context: IResolutionContext) {
    const resolutions = this.resolvers.map(resolver => resolver.resolveMany(context));
    return Array.prototype.concat.apply([], resolutions);
  }
}

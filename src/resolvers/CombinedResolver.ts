export default class CombinedResolver implements IResolver {
  constructor(private key: string, private resolvers: IResolver[]) {}

  resolve(container: IContainer) {
    throw new Error(`Attempted to resolve a single ${this.key} but it has multiple implementations`);
  }

  resolveMany(container: IContainer) {
    const resolutions = this.resolvers.map(resolver => resolver.resolveMany(container));
    return Array.prototype.concat.apply([], resolutions);
  }
}

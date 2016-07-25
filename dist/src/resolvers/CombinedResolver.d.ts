export default class CombinedResolver implements IResolver {
    private key;
    private resolvers;
    constructor(key: string, resolvers: IResolver[]);
    resolve(context: IResolutionContext): void;
    resolveMany(context: IResolutionContext): any;
}

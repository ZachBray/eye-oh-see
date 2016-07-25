interface IResolver {
    resolve(context: IResolutionContext): any;
    resolveMany(context: IResolutionContext): any;
}

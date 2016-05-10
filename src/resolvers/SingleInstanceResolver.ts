import InstancePerDependencyResolver from './InstancePerDependencyResolver';

export default class SingleInstanceResolver implements IResolver {
  private hasResolved = false;
  private resolvedValue;
  private innerResolver: IResolver;

  constructor(private registration: IRegistration) {
    this.innerResolver = new InstancePerDependencyResolver(registration);
  }

  resolve(context: IResolutionContext) {
    if (!this.hasResolved) {
      this.resolvedValue = this.innerResolver.resolve({
        registeringContainer: context.registeringContainer,
        resolvingContainer: context.registeringContainer
      });
      this.hasResolved = true;
    }
    return this.resolvedValue;
  }

  resolveMany(context: IResolutionContext) {
    return [this.resolve(context)];
  }
}


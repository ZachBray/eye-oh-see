/// <reference path="IContainer.ts" />
import 'reflect-metadata';
import Registration from './registration/Registration';
import RegistrationMetadata from './attributes/RegistrationMetadata';

type Disposable = () => void;

export default class Container implements IContainer {
  private static nextId = 0;
  public instances = {};
  private registrations: {[key: string]: Registration} = {};
  private resources: {[key: string]: Disposable} = {};
  private removeParentDisposer: () => void = null;

  constructor(private parentImpl: Container = null, public scopeName?: string) {
  }

  public get parent() {
    return this.parentImpl;
  }

  public createChild(scopeName?: string) {
     return new Container(this, scopeName);
  }

  public register(factory: any) {
    const metadata = RegistrationMetadata.findOrCreate(factory);
    if (this.registrations[metadata.key] != null) {
      return this.registrations[metadata.key];
    }
    const registration = new Registration(metadata.key, factory);
    metadata.initializeRegistration(registration, this);
    this.registrations[metadata.key] = registration;
    return registration;
  }

  public resolve<TService>(service: new (...args:any[]) => TService, resolvingContainer: IContainer = this): TService {
    const serviceKey = RegistrationMetadata.findOrCreate(service).key;
    const registration = this.registrations[serviceKey];
    if (registration == null && this.parentImpl == null) {
      throw new Error(`No registrations in container for ${serviceKey}`);
    } else if (registration == null) {
      return this.parentImpl.resolve(service, resolvingContainer);
    }
    return registration.resolveOne({
      registeringContainer: this,
      resolvingContainer
    });
  }

  // TODO: Refactor to remove duplication here.
  public resolveMany<TService>(service: new (...args:any[]) => TService, resolvingContainer: IContainer = this): TService[] {
    const serviceKey = RegistrationMetadata.findOrCreate(service).key;
    const registration = this.registrations[serviceKey];
    if (registration == null && this.parentImpl == null) {
      throw new Error(`No registrations in container for ${serviceKey}`);
    } else if (registration == null) {
      return this.parentImpl.resolveMany(service, resolvingContainer);
    }
    return registration.resolveMany({
      registeringContainer: this,
      resolvingContainer
    });
  }

  public registerDisposable(disposable: () => void): () => void {
    if (this.removeParentDisposer == null && this.parentImpl != null) {
      this.removeParentDisposer = this.parentImpl.registerDisposable(() => this.dispose());
    }
    const resourceId = Container.nextId++;
    this.resources[resourceId] = disposable;
    return () => delete this.resources[resourceId];
  }

  public dispose() {
    if (this.removeParentDisposer != null) {
      this.removeParentDisposer();
    }
    Object.keys(this.resources).forEach(resourceKey => this.resources[resourceKey]());
    this.resources = {};
    this.registrations = {};
  }
}

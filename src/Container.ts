/// <reference path="../node_modules/reflect-metadata/reflect-metadata.d.ts" />
import 'reflect-metadata';
import Registration from './registration/Registration';
import RegistrationMetadata from './attributes/RegistrationMetadata';

export default class Container implements IContainer {
  public parent: IContainer;
  private registrations: {[key: string]: Registration} = {};
  private resources = [];

  constructor(private parentImpl: Container = null) {
    this.parent = parentImpl;
  }

  public createChild() {
    return new Container(this);
  }

  public register(factory) {
    const metadata = RegistrationMetadata.findOrCreate(factory);
    if (this.registrations[metadata.key] != null) {
      return this.registrations[metadata.key];
    }
    const registration = new Registration(metadata.key, factory);
    metadata.initializeRegistration(registration);
    this.registrations[metadata.key] = registration;
    return registration;
  }

  public resolve<TService>(service: new (...args) => TService, resolvingContainer: IContainer = this): TService {
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
  public resolveMany<TService>(service: new (...args) => TService, resolvingContainer: IContainer = this): TService[] {
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

  public registerDisposable(disposable: () => void) {
    this.resources.push(disposable);
  }

  public dispose() {
    this.resources.forEach(dispose => dispose());
    this.resources = [];
    this.registrations = {};
  }
}

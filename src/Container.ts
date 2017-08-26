/// <reference path="IContainer.ts" />
import 'reflect-metadata';
import Registration from './registration/Registration';
import RegistrationMetadata from './attributes/RegistrationMetadata';

export type Disposable = () => void;

export type Constructor<T> = { new(...args: any[]): T };

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

  public register(factory: Function) {
    const metadata = RegistrationMetadata.findOrCreate(factory);
    if (this.registrations[metadata.key] != null) {
      return this.registrations[metadata.key];
    }
    const registration = new Registration(metadata.key, factory);
    metadata.initializeRegistration(registration, this);
    this.registrations[metadata.key] = registration;
    return registration;
  }

  public resolve<TService>(service: Constructor<TService>, resolvingContainer: IContainer = this): TService {
    return this.resolveAbstract<TService>(service, resolvingContainer);
  }

  public resolveAbstract<TService>(service: Function, resolvingContainer: IContainer = this): TService {
    const serviceKey = RegistrationMetadata.findOrCreate(service).key;
    const registration = this.registrations[serviceKey];
    if (registration == null && this.parentImpl == null) {
      throw new Error(`No registrations in container for ${serviceKey}`);
    } else if (registration == null) {
      return <TService>this.parentImpl.resolveAbstract(service, resolvingContainer);
    }
    return registration.resolveOne({
      registeringContainer: this,
      resolvingContainer
    });
  }

  public resolveMany<TService>(service: Constructor<TService>, resolvingContainer: IContainer = this): TService[] {
    return this.resolveManyAbstract<TService>(service, resolvingContainer);
  }

  public resolveManyAbstract<TService>(service: Function, resolvingContainer: IContainer = this): TService[] {
    const serviceKey = RegistrationMetadata.findOrCreate(service).key;
    const registration = this.registrations[serviceKey];
    if (registration == null && this.parentImpl == null) {
      throw new Error(`No registrations in container for ${serviceKey}`);
    } else if (registration == null) {
      return <TService[]>this.parentImpl.resolveManyAbstract(service, resolvingContainer);
    }
    return registration.resolveMany({
      registeringContainer: this,
      resolvingContainer
    });
  }

  public registerDisposable(disposable: Disposable): Disposable {
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

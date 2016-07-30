/// <reference path="IContainer.ts" />
import 'reflect-metadata';
import Registration from './registration/Registration';
import RegistrationMetadata from './attributes/RegistrationMetadata';

type Disposable = () => void;

export default class Container implements IContainer {
  private static nextId = 0;
  public parent: IContainer;
  private registrations: {[key: string]: Registration} = {};
  private children: {[key: string]: Container} = {};
  private resources: Disposable[] = [];
  private id = ++Container.nextId;

  constructor(private parentImpl: Container = null) {
    this.parent = parentImpl;
  }

  public createChild() {
     const child = new Container(this);
     this.children[child.id] = child;
     child.registerDisposable(() => delete this.children[child.id]);
     return child;
  }

  public register(factory: any) {
    const metadata = RegistrationMetadata.findOrCreate(factory);
    if (this.registrations[metadata.key] != null) {
      return this.registrations[metadata.key];
    }
    const registration = new Registration(metadata.key, factory);
    metadata.initializeRegistration(registration);
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

  public registerDisposable(disposable: () => void) {
    this.resources.push(disposable);
  }

  public dispose() {
    Object.keys(this.children).forEach(id => this.children[id].dispose());
    this.children = {};
    this.resources.forEach(dispose => dispose());
    this.resources = [];
    this.registrations = {};
  }
}

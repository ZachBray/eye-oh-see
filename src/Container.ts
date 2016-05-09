/// <reference path="../node_modules/reflect-metadata/reflect-metadata.d.ts" />
import 'reflect-metadata';
import Registration from './Registration';
import RegistrationMetadata from './attributes/RegistrationMetadata';

export default class Container implements IContainer {
  private registrations: {[key: string]: Registration} = {};
  private resources = [];

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

  public resolve(locator: string | Function) {
    const serviceKey = typeof locator === 'string' ? locator : RegistrationMetadata.findOrCreate(locator).key;
    const registration = this.registrations[serviceKey];
    if (registration == null) {
      throw new Error(`No registrations in container for ${serviceKey}`);
    }
    return registration.resolve(this);
  }

  public resolveMany(locator: string | Function) {
    const serviceKey = typeof locator === 'string' ? locator : RegistrationMetadata.findOrCreate(locator).key;
    const registration = this.registrations[serviceKey];
    if (registration == null) {
      throw new Error(`No registrations in container for ${serviceKey}`);
    }
    return registration.resolveMany(this);
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

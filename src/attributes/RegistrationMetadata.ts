/// <reference path="../IContainer.ts" />
import 'reflect-metadata';
import Registration from '../registration/Registration';
import Parameter from '../parameters/Parameter';
import KeyFactory from './KeyFactory';

const IOC_METADATA_KEY = 'ioc:metadata';

export default class RegistrationMetadata {
  public key: string;
  private initializers: ((registration: Registration, container?: IContainer) => void)[] = [];

  public static hasMetadata(factory: any): boolean {
    return factory[IOC_METADATA_KEY] != null;
  }

  public static findOrCreate(factory: any): RegistrationMetadata {
    if (!RegistrationMetadata.hasMetadata(factory)) {
      Object.defineProperty(factory, IOC_METADATA_KEY, {
        // enumerable is false by default so we shouldn't inherit this property on sub types
        value: new RegistrationMetadata(factory)
      });
    }
    return factory[IOC_METADATA_KEY];
  }

  constructor(public factory: any) {
    this.key = KeyFactory.create(factory);
    this.findDependencies();
  }

  public initializeRegistration(registration: Registration, container: IContainer) {
    this.initializers.forEach(init => init(registration, container));
  }

  public addInitialization(initializer: (register: Registration, container?: IContainer) => void) {
    this.initializers.push(initializer);
  }

  private findDependencies() {
    const paramTypes = Reflect.getMetadata('design:paramtypes', this.factory);
    if (paramTypes != null) {
      this.addInitialization((registration: Registration) => {
        registration.parameters = paramTypes.map((t: any) => new Parameter(t));
      });
    }
  }
}

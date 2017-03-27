/// <reference path="../IContainer.ts" />
import 'reflect-metadata';
import Registration from '../registration/Registration';
import Parameter from '../parameters/Parameter';
import KeyFactory from './KeyFactory';

const IOC_METADATA_KEY = '__eyeohsee:registration:metadata';

export default class RegistrationMetadata {
  public key: string;
  private initializers: ((registration: Registration, container?: IContainer) => void)[] = [];

  public static hasMetadata(factory: any): boolean {
    return factory[IOC_METADATA_KEY] != null;
  }

  public static findOrCreate(factory: any): RegistrationMetadata {
    return factory[IOC_METADATA_KEY] = factory[IOC_METADATA_KEY] || new RegistrationMetadata(factory);
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

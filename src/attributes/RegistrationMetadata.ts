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
    return Reflect.hasOwnMetadata(IOC_METADATA_KEY, factory);
  }

  public static findOrCreate(factory: any): RegistrationMetadata {
    let metadata = Reflect.getOwnMetadata(IOC_METADATA_KEY, factory);
    if (!metadata) {
      metadata = new RegistrationMetadata(factory);
      Reflect.defineMetadata(IOC_METADATA_KEY, metadata, factory);
    }
    return metadata;
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

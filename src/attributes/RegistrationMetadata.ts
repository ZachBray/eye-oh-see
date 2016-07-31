import 'reflect-metadata';
import Registration from '../registration/Registration';
import Parameter from '../parameters/Parameter';
import KeyFactory from './KeyFactory';

const IOC_METADATA_KEY = 'ioc:metadata';

export default class RegistrationMetadata {
  public key: string;
  private initializers: ((registration: Registration) => void)[] = [];

  public static findOrCreate(factory: any): RegistrationMetadata {
    const existingMetadata = <RegistrationMetadata> Reflect.getOwnMetadata(IOC_METADATA_KEY, factory);
    if (existingMetadata != null) {
      return existingMetadata;
    }
    const metadata = new RegistrationMetadata(factory);
    Reflect.defineMetadata(IOC_METADATA_KEY, metadata, factory);
    return metadata;
  }

  constructor(public factory: any) {
    this.key = KeyFactory.create(factory);
    this.findDependencies();
  }

  public initializeRegistration(registration: Registration) {
    this.initializers.forEach(init => init(registration));
  }

  public addInitialization(initializer: (register: Registration) => void) {
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

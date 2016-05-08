/// <reference path="../node_modules/reflect-metadata/reflect-metadata.d.ts" />
import 'reflect-metadata';

const IOC_METADATA_KEY = 'ioc:metadata';

interface IInstanceFactory {
  construct(metadata: Metadata): any;
}

class PerResolutionInstanceFactory implements IInstanceFactory {
  construct(metadata: Metadata): any {
    const args = metadata.dependencies.map(d => d.resolve());
    return new metadata.factory(...args);
  }
}

class SingletonInstanceFactory implements IInstanceFactory {
  private hasConstructedInstance = false;
  private constructedInstance;

  construct(metadata: Metadata): any {
    if (!this.hasConstructedInstance) {
      const args = metadata.dependencies.map(d => d.resolve());
      this.constructedInstance = new metadata.factory(...args);
      this.hasConstructedInstance = true;
    }
    return this.constructedInstance;
  }
}

class RegisteredInstanceFactory implements IInstanceFactory {
  constructor(private instance: any) {}

  construct(metadata: Metadata): any {
    return this.instance;
  }
}

class FriendlyNameFactory {
  public static create(factory) {
    return factory.name || factory;
  }
}


class Metadata {
  public dependencies: Metadata[] = [];
  public instanceFactory: IInstanceFactory = new PerResolutionInstanceFactory();
  public implementations: Metadata[] = [];

  constructor(public factory) {}

  public resolve(): any {
    if (this.implementations.length === 0) {
      return this.instanceFactory.construct(this);
    } else if (this.implementations.length === 1) {
      return this.implementations[0].resolve();
    } else {
      const name = FriendlyNameFactory.create(this.factory);
      throw new Error(`Found multiple implementations for ${name}.`);
    }
  }
}

class MetadataFactory {
  public static create(factory: Function): Metadata {
    const existingMetadata = <Metadata> Reflect.getMetadata(IOC_METADATA_KEY, factory);
    if (existingMetadata != null) {
      return existingMetadata;
    }
    const metadata = new Metadata(factory);
    Reflect.defineMetadata(IOC_METADATA_KEY, metadata, factory);
    return metadata;
  }

  public static createLifetimeService(factory: Function, constructionStrategy: IInstanceFactory, service?: Function) {
    const metadata = MetadataFactory.create(factory);
    metadata.instanceFactory = constructionStrategy;
    if (service != null) {
      const serviceMetadata = MetadataFactory.create(service);
      serviceMetadata.implementations.push(metadata);
    }
    const paramTypes = Reflect.getMetadata('design:paramtypes', factory);
    if (paramTypes == null) {
      const name = FriendlyNameFactory.create(factory);
      throw new Error(`Failed to reflect over parameter types of ${name}. Ensure emitDecoratorMetadata is enabled.`);
    }
    metadata.dependencies = paramTypes.map(t => MetadataFactory.create(t));
  }
}

export class Container {
  resolve<TService>(factory: {new (...args): TService}): TService {
    const metadata = MetadataFactory.create(factory);
    return <TService> metadata.resolve();
  }

  registerInstance<TImpl extends TService, TService>(service: {new (...args):  TService}, instance: TImpl) {
    const metadata = MetadataFactory.create(service);
    metadata.instanceFactory = new RegisteredInstanceFactory(instance);
  }
}

export function Register(constructionStrategy: IInstanceFactory, service?: Function) {
  return function (target: Function) {
    MetadataFactory.createLifetimeService(target, constructionStrategy, service);
  };
}

export function Singleton(service?: Function) {
  return Register(new SingletonInstanceFactory(), service);
}

export function Transient(service?: Function) {
  return Register(new PerResolutionInstanceFactory(), service);
}

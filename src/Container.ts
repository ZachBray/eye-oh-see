/// <reference path="../node_modules/reflect-metadata/reflect-metadata.d.ts" />
import 'reflect-metadata';

const IOC_METADATA_KEY = 'ioc:metadata';

interface IInstanceFactory {
  create(metadata: Metadata): any;
}

class PerResolutionInstanceFactory implements IInstanceFactory {
  create(metadata: Metadata): any {
    const args = metadata.dependencies.map(d => d());
    return new metadata.factory(...args);
  }
}

class SingletonInstanceFactory implements IInstanceFactory {
  private hasConstructedInstance = false;
  private constructedInstance;

  create(metadata: Metadata): any {
    if (!this.hasConstructedInstance) {
      const args = metadata.dependencies.map(d => d());
      this.constructedInstance = new metadata.factory(...args);
      this.hasConstructedInstance = true;
    }
    return this.constructedInstance;
  }
}

class RegisteredInstanceFactory implements IInstanceFactory {
  constructor(private instance: any) {}

  create(metadata: Metadata): any {
    return this.instance;
  }
}

class FriendlyNameFactory {
  public static create(factory) {
    return factory.name || factory;
  }
}

interface IInstanceResolver {
  resolve(metadata: Metadata): any;
}

class SingleInstanceResolver implements IInstanceResolver {
  resolve(metadata: Metadata): any {
    if (metadata.implementations.length === 0) {
      return metadata.instanceFactory.create(metadata);
    } else if (metadata.implementations.length === 1) {
      return this.resolve(metadata.implementations[0]);
    } else {
      const name = FriendlyNameFactory.create(metadata.factory);
      throw new Error(`Found multiple implementations for ${name}.`);
    }
  }
}

class ArrayResolver implements IInstanceResolver {
  private resolver = new SingleInstanceResolver();

  resolve(metadata: Metadata): any {
    return metadata.implementations.map(impl => this.resolver.resolve(impl));
  }
}

class Metadata {
  public dependencies: (() => any)[] = [];
  public instanceFactory: IInstanceFactory = new PerResolutionInstanceFactory();
  public implementations: Metadata[] = [];

  constructor(public factory) {
    this.findDependencies();
  }

  public implementedBy(implementation: Metadata) {
    this.implementations.push(implementation);
  }

  private findDependencies() {
    const paramTypes = Reflect.getMetadata('design:paramtypes', this.factory);
    if (paramTypes != null) {
      this.dependencies = paramTypes.map(t => {
        const metadata = MetadataFactory.create(t);
        const resolver = new SingleInstanceResolver();
        return () => resolver.resolve(metadata);
      });
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
}

export class Container {
  private resolver = new SingleInstanceResolver();

  resolve<TService>(factory: {new (...args): TService}): TService {
    const metadata = MetadataFactory.create(factory);
    return <TService> this.resolver.resolve(metadata);
  }

  registerInstance<TImpl extends TService, TService>(service: {new (...args):  TService}, instance: TImpl) {
    const metadata = MetadataFactory.create(service);
    metadata.instanceFactory = new RegisteredInstanceFactory(instance);
  }
}

export function Register(constructionStrategy: IInstanceFactory, service?: Function) {
  return function (target: Function) {
    const metadata = MetadataFactory.create(target);
    metadata.instanceFactory = constructionStrategy;
    if (service != null) {
      const serviceMetadata = MetadataFactory.create(service);
      serviceMetadata.implementedBy(metadata);
    }
  };
}

export function Singleton(service?: Function) {
  return Register(new SingletonInstanceFactory(), service);
}

export function Transient(service?: Function) {
  return Register(new PerResolutionInstanceFactory(), service);
}

export function Many(service: Function) {
  return function(target: Function, key: string, index: number) {
    const metadata = MetadataFactory.create(target);
    const resolver = new ArrayResolver();
    const paramMetadata = MetadataFactory.create(service);
    metadata.dependencies[index] = () => resolver.resolve(paramMetadata);
  };
}

export function Factory(service: Function) {
  return function(target: Function, key: string, index: number) {
    const metadata = MetadataFactory.create(target);
    const resolver = new SingleInstanceResolver();
    const paramMetadata = MetadataFactory.create(service);
    metadata.dependencies[index] = () => () => resolver.resolve(paramMetadata);
  };
}


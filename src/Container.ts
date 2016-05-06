/// <reference path="../node_modules/reflect-metadata/reflect-metadata.d.ts" />
import 'reflect-metadata';

const IOC_METADATA_KEY = 'ioc:metadata';

interface IConstructionStrategy {
  construct(metadata: Metadata): any;
}

class TransientConstructionStrategy implements IConstructionStrategy {
  construct(metadata: Metadata): any {
    const args = metadata.dependencies.map(d => d.resolve());
    return new metadata.factory(...args);
  }
}

class SingletonConstructionStrategy implements IConstructionStrategy {
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

class FriendlyNameFactory {
  public static create(factory) {
    return factory.name || factory;
  }
}


class Metadata {
  public dependencies: Metadata[] = [];
  public constructionStrategy: IConstructionStrategy = new TransientConstructionStrategy();
  public implementations: Metadata[] = [];

  constructor(public factory) {}

  public resolve(): any {
    if (this.implementations.length === 0) {
      return this.constructionStrategy.construct(this);
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

  public static createLifetimeService(factory: Function, constructionStrategy: IConstructionStrategy, service?: Function) {
    const metadata = MetadataFactory.create(factory);
    metadata.constructionStrategy = constructionStrategy;
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
  resolve<TService>(factory: new (...args) => TService): TService {
    const metadata = MetadataFactory.create(factory);
    return <TService> metadata.resolve();
  }
}

export function Register(constructionStrategy: IConstructionStrategy, service?: Function) {
  return function (target: Function) {
    MetadataFactory.createLifetimeService(target, constructionStrategy, service);
  };
}

export function Singleton(service?: Function) {
  return Register(new SingletonConstructionStrategy(), service);
}

export function Transient(service?: Function) {
  return Register(new TransientConstructionStrategy(), service);
}

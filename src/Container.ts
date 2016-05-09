/// <reference path="../node_modules/reflect-metadata/reflect-metadata.d.ts" />
import 'reflect-metadata';

const IOC_METADATA_KEY = 'ioc:metadata';

class ContainerData {
  private resources: (() => void)[] = [];

  public trackResources(metadata: TypeMetadata, instance: any) {
    if (metadata.disposalFunction != null) {
      this.resources.push(() => metadata.disposalFunction(instance));
    }
  }

  public dispose() {
    this.resources.forEach(dispose => dispose());
    this.resources = [];
  }
}

interface IInstanceFactory {
  create(metadata: TypeMetadata, data: ContainerData): any;
}

class PerResolutionInstanceFactory implements IInstanceFactory {
  create(metadata: TypeMetadata, data: ContainerData): any {
    const args = metadata.dependencies.map(d => d(data));
    const instance = new metadata.factory(...args);
    data.trackResources(metadata, instance);
    return instance;
  }
}

class SingletonInstanceFactory implements IInstanceFactory {
  private hasConstructedInstance = false;
  private constructedInstance;

  create(metadata: TypeMetadata, data: ContainerData): any {
    if (!this.hasConstructedInstance) {
      const args = metadata.dependencies.map(d => d(data));
      this.constructedInstance = new metadata.factory(...args);
      data.trackResources(metadata, this.constructedInstance);
      this.hasConstructedInstance = true;
    }
    return this.constructedInstance;
  }
}

class RegisteredInstanceFactory implements IInstanceFactory {
  constructor(private instance: any) {}

  create(metadata: TypeMetadata, data: ContainerData): any {
    return this.instance;
  }
}

class FriendlyNameFactory {
  public static create(factory) {
    return factory.name || factory;
  }
}

interface IInstanceResolver {
  resolve(metadata: TypeMetadata, data: ContainerData): any;
}

class SingleInstanceResolver implements IInstanceResolver {
  resolve(metadata: TypeMetadata, data: ContainerData): any {
    if (metadata.implementations.length === 0) {
      return metadata.instanceFactory.create(metadata, data);
    } else if (metadata.implementations.length === 1) {
      return this.resolve(metadata.implementations[0], data);
    } else {
      const name = FriendlyNameFactory.create(metadata.factory);
      throw new Error(`Found multiple implementations for ${name}.`);
    }
  }
}

class ArrayResolver implements IInstanceResolver {
  private resolver = new SingleInstanceResolver();

  resolve(metadata: TypeMetadata, data: ContainerData): any {
    return metadata.implementations.map(impl => this.resolver.resolve(impl, data));
  }
}

class TypeMetadata {
  public dependencies: ((data: ContainerData) => any)[] = [];
  public instanceFactory: IInstanceFactory = new PerResolutionInstanceFactory();
  public implementations: TypeMetadata[] = [];
  public disposalFunction: (instance: any) => void = null;

  constructor(public factory) {
    this.findDependencies();
  }

  public implementedBy(implementation: TypeMetadata) {
    this.implementations.push(implementation);
  }

  private findDependencies() {
    const paramTypes = Reflect.getMetadata('design:paramtypes', this.factory);
    if (paramTypes != null) {
      this.dependencies = paramTypes.map(t => {
        const metadata = MetadataFactory.create(t);
        const resolver = new SingleInstanceResolver();
        return (data: ContainerData) => resolver.resolve(metadata, data);
      });
    }
  }
}

class MetadataFactory {
  public static create(factory: Function): TypeMetadata {
    const existingMetadata = <TypeMetadata> Reflect.getMetadata(IOC_METADATA_KEY, factory);
    if (existingMetadata != null) {
      return existingMetadata;
    }
    const metadata = new TypeMetadata(factory);
    Reflect.defineMetadata(IOC_METADATA_KEY, metadata, factory);
    return metadata;
  }
}

export class Container {
  private resolver = new SingleInstanceResolver();
  private data = new ContainerData();

  resolve<TService>(factory: {new (...args): TService}): TService {
    const metadata = MetadataFactory.create(factory);
    return <TService> this.resolver.resolve(metadata, this.data);
  }

  registerInstance<TImpl extends TService, TService>(service: {new (...args):  TService}, instance: TImpl) {
    const metadata = MetadataFactory.create(service);
    metadata.instanceFactory = new RegisteredInstanceFactory(instance);
  }

  dispose() {
    this.data.dispose();
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

export function SingleInstance(service?: Function) {
  return Register(new SingletonInstanceFactory(), service);
}

export function InstancePerDependency(service?: Function) {
  return Register(new PerResolutionInstanceFactory(), service);
}

export function ArrayOf(service: Function) {
  return function(target: Function, key: string, index: number) {
    const metadata = MetadataFactory.create(target);
    const resolver = new ArrayResolver();
    const paramMetadata = MetadataFactory.create(service);
    metadata.dependencies[index] = data => resolver.resolve(paramMetadata, data);
  };
}

export function Factory(service: Function) {
  return function(target: Function, key: string, index: number) {
    const metadata = MetadataFactory.create(target);
    const resolver = new SingleInstanceResolver();
    const paramMetadata = MetadataFactory.create(service);
    metadata.dependencies[index] = data => () => resolver.resolve(paramMetadata, data);
  };
}

export function Disposable(disposalFunction: (instance: any) => void = instance => instance.dispose()) {
  return function(target: Function) {
    const metadata = MetadataFactory.create(target);
    metadata.disposalFunction = disposalFunction;
  };
}

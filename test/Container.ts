import * as chai from 'chai';
import {Container, SingleInstance, InstancePerDependency, ArrayOf, Factory, Disposable, UnitOfWork} from '../src/Index';
const expect = chai.expect;

describe('Registration via attributes', () => {
  let sut: Container;

  beforeEach(() => {
    sut = new Container();
  });

  it('should return a new instance when resolving a transient entry', () => {
    // Arrange
    let instanceCount = 0;
    @InstancePerDependency()
    class Foo {
      constructor() {
        ++instanceCount;
      }
    }
    sut.register(Foo);
    // Act
    const instance = sut.resolve(Foo);
    // Assert
    expect(instance instanceof Foo).to.equal(true, `instance should be a Foo but was ${typeof instance}`);
    expect(instanceCount).to.equal(1);
  });

  it('should construct a new instance for each resolution of a transient entry', () => {
    // Arrange
    let instanceCount = 0;
    @InstancePerDependency()
    class Foo {
      constructor() {
        ++instanceCount;
      }
    }
    // Act
    sut.register(Foo);
    const instanceA =  sut.resolve(Foo);
    const instanceB =  sut.resolve(Foo);
    // Assert
    expect(instanceA instanceof Foo).to.be.true;
    expect(instanceB instanceof Foo).to.be.true;
    expect(instanceCount).to.equal(2);
    expect(instanceA).to.not.equal(instanceB);
  });

  it('should resolve implementation registered for service when resolving', () => {
    // Arrange
    class IAnimal {}
    @InstancePerDependency(IAnimal)
    class Dog {}
    sut.register(IAnimal);
    sut.register(Dog);
    // Arrange
    const instance = sut.resolve(IAnimal);
    // Assert
    expect(instance instanceof Dog).to.be.true;
  });

  it('should only construct one instance of a singleton entry', () => {
    // Arrange
    let instanceCount = 0;
    @SingleInstance()
    class Foo {
      constructor() {
        ++instanceCount;
      }
    }
    sut.register(Foo);
    // Act
    const instanceA = sut.resolve(Foo);
    const instanceB = sut.resolve(Foo);
    // Assert
    expect(instanceA instanceof Foo).to.be.true;
    expect(instanceB instanceof Foo).to.be.true;
    expect(instanceCount).to.equal(1);
    expect(instanceA).to.equal(instanceB);
  });

  it('should resolve parameters when resolving an instance', () => {
    // Arrange
    @InstancePerDependency()
    class Bar {}
    @InstancePerDependency()
    class Foo {
      constructor(public bar: Bar) {}
    }
    sut.register(Bar);
    sut.register(Foo);
    // Act
    const instance = sut.resolve(Foo);
    // Assert
    expect(instance instanceof Foo).to.be.true;
    expect(instance.bar instanceof Bar).to.be.true;
  });

  it('should respect parameters lifetimes when resolving an instance', () => {
    // Arrange
    let barInstanceCount = 0;
    let bazInstanceCount = 0;
    @SingleInstance()
    class Bar {
      constructor() {
        ++barInstanceCount;
      }
    }
    @InstancePerDependency()
    class Baz {
      constructor() {
        ++bazInstanceCount;
      }
    }
    @InstancePerDependency()
    class Foo {
      constructor(public bar: Bar, public baz: Baz) {}
    }
    sut.register(Foo);
    sut.register(Bar);
    sut.register(Baz);
    // Act
    sut.resolve(Foo);
    sut.resolve(Foo);
    // Assert
    expect(barInstanceCount).to.equal(1);
    expect(bazInstanceCount).to.equal(2);
  });

  it('should resolve registered instances rather than constructing new instances', () => {
    // Arrange
    let instanceCount = 0;
    @InstancePerDependency()
    class Foo {
      constructor() {
        ++instanceCount;
      }
    }
    const instanceA = new Foo();
    sut.register(Foo).resetResolutionStrategy().providedInstance(instanceA);
    // Act
    const instanceB = sut.resolve(Foo);
    // Assert
    expect(instanceB instanceof Foo).to.be.true;
    expect(instanceCount).to.equal(1);
    expect(instanceA).to.equal(instanceB);
  });

  it('should resolve all registrations for a service when resolving an array', () => {
    // Arrange
    class IAnimal {}
    @InstancePerDependency(IAnimal)
    class Dog implements IAnimal {}
    @InstancePerDependency(IAnimal)
    class Cat implements IAnimal {}
    @InstancePerDependency()
    class Zoo {
      constructor(@ArrayOf(IAnimal) public animals: IAnimal[]) {}
    }
    sut.register(IAnimal);
    sut.register(Dog);
    sut.register(Cat);
    sut.register(Zoo);
    // Act
    const instance = sut.resolve(Zoo);
    // Assert
    expect(instance.animals.length).to.equal(2);
    expect(instance.animals[0] instanceof Dog).to.be.true;
    expect(instance.animals[1] instanceof Cat).to.be.true;
  });

  it('should respect lifetime registrations when resolving arrays', () => {
    // Arrange
    let dogInstanceCount = 0;
    class IAnimal {}
    @SingleInstance(IAnimal)
    class Dog implements IAnimal {
      constructor() {
        ++dogInstanceCount;
      }
    }
    @InstancePerDependency(IAnimal)
    class Cat implements IAnimal {}
    @InstancePerDependency()
    class Zoo {
      constructor(@ArrayOf(IAnimal) public animals: IAnimal[]) {}
    }
    sut.register(IAnimal);
    sut.register(Dog);
    sut.register(Cat);
    sut.register(Zoo);
    // Act
    sut.resolve(Zoo);
    sut.resolve(Zoo);
    // Assert
    expect(dogInstanceCount).to.equal(1);
  });

  it('should inject factories where the factory attribute is used', () => {
    // Arrange
    @InstancePerDependency()
    class Foo {}
    @InstancePerDependency()
    class Bar {
      public a: Foo;
      public b: Foo;
      constructor(@Factory(Foo) factory: () => Foo) {
        this.a = factory();
        this.b = factory();
      }
    }
    sut.register(Foo);
    sut.register(Bar);
    // Act
    const instance = sut.resolve(Bar);
    // Arrange
    expect(instance.a instanceof Foo).to.be.true;
    expect(instance.b instanceof Foo).to.be.true;
    expect(instance.a === instance.b).to.be.false;
  });

  it('should respect the lifetime registrations when resolving through factories', () => {
    // Arrange
    let instanceCount = 0;
    @SingleInstance()
    class Foo {
      constructor() {
        ++instanceCount;
      }
    }
    @InstancePerDependency()
    class Bar {
      public a: Foo;
      public b: Foo;
      constructor(@Factory(Foo) factory: () => Foo) {
        this.a = factory();
        this.b = factory();
      }
    }
    sut.register(Foo);
    sut.register(Bar);
    // Act
    sut.resolve(Bar);
    // Arrange
    expect(instanceCount).to.equal(1);
  });

  it('should resolve descendants with arguments provided to factories', () => {
    // Arrange
    class Color {
      public static Red = new Color();
      public static Green = new Color();
    }
    @InstancePerDependency()
    class Knee {
      constructor(public color: Color) {}
    }
    @InstancePerDependency()
    class Leg {
      constructor(public knee: Knee) {}
    }
    @InstancePerDependency()
    class Robot {
      public left: Leg;
      public right: Leg;
      constructor(@Factory(Color, Leg) factory: (color: Color) => Leg) {
        this.left = factory(Color.Red);
        this.right = factory(Color.Green);
      }
    }
    sut.register(Knee);
    sut.register(Leg);
    sut.register(Robot);
    // Act
    const instance = sut.resolve(Robot);
    // Arrange
    expect(instance.left.knee.color).to.equal(Color.Red);
    expect(instance.right.knee.color).to.equal(Color.Green);
    expect(instance.left.knee.color).to.not.equal(instance.right.knee.color);
  });

  it('should dispose of transient resources when the container is disposed', () => {
    // Arrange
    let disposeCount = 0;
    @InstancePerDependency()
    @Disposable()
    class Foo {
      public dispose() {
        ++disposeCount;
      }
    }
    sut.register(Foo);
    sut.resolve(Foo);
    sut.resolve(Foo);
    // Act
    sut.dispose();
    // Arrange
    expect(disposeCount).to.equal(2);
  });

  it('should dispose of singleton resources when the container is disposed', () => {
    // Arrange
    let disposeCount = 0;
    @SingleInstance()
    @Disposable()
    class Foo {
      public dispose() {
        ++disposeCount;
      }
    }
    sut.register(Foo);
    sut.resolve(Foo);
    sut.resolve(Foo);
    // Act
    sut.dispose();
    // Arrange
    expect(disposeCount).to.equal(1);
  });

  it('should dispose of resources created through factories when the container is disposed', () => {
    // Arrange
    let disposeCount = 0;
    @InstancePerDependency()
    @Disposable()
    class Foo {
      public dispose() {
        ++disposeCount;
      }
    }
    @InstancePerDependency()
    class FooFactory {
      constructor(@Factory(Foo) private factory: () => Foo) {}

      create() {
        return this.factory();
      }
    }
    sut.register(Foo);
    sut.register(FooFactory);
    const factory = sut.resolve(FooFactory);
    factory.create();
    factory.create();
    // Act
    sut.dispose();
    // Arrange
    expect(disposeCount).to.equal(2);
  });

  it('should dispose of transitively owned resources when a unit of work is disposed', () => {
    // Arrange
    let disposeCount = 0;
    @InstancePerDependency()
    @Disposable()
    class OwnedResource {
      dispose() {
        ++disposeCount;
      }
    }
    @InstancePerDependency()
    class MyWorkManager {
      public unitOfWork: IUnitOfWork<OwnedResource>;
      constructor(@UnitOfWork(OwnedResource) workFactory: () => IUnitOfWork<OwnedResource>) {
        this.unitOfWork = workFactory();
      }
    }
    sut.register(OwnedResource);
    sut.register(MyWorkManager);
    const instance = sut.resolve(MyWorkManager);
    // Act
    instance.unitOfWork.dispose();
    // Assert
    expect(disposeCount).to.equal(1);
  });

  it('should not dispose of non-owned resources, e.g., singletons, when a unit of work is disposed', () => {
    // Arrange
    let disposeCount = 0;
    @SingleInstance()
    @Disposable()
    class NotOwnedResource {
      dispose() {
        ++disposeCount;
      }
    }
    @InstancePerDependency()
    class MyWorkManager {
      public unitOfWork: IUnitOfWork<NotOwnedResource>;
      constructor(@UnitOfWork(NotOwnedResource) workFactory: () => IUnitOfWork<NotOwnedResource>) {
        this.unitOfWork = workFactory();
      }
    }
    sut.register(NotOwnedResource);
    sut.register(MyWorkManager);
    const instance = sut.resolve(MyWorkManager);
    // Act
    instance.unitOfWork.dispose();
    // Assert
    expect(disposeCount).to.equal(0);
  });

  it('should dispose of nested child containers when an ancestor is disposed', () => {
    // Arrange
    let disposeCount = 0;
    @InstancePerDependency()
    @Disposable()
    class OwnedResource {
      dispose() {
        ++disposeCount;
      }
    }
    @InstancePerDependency()
    class MyWorkManager {
      public unitOfWork: IUnitOfWork<OwnedResource>;
      constructor(@UnitOfWork(OwnedResource) workFactory: () => IUnitOfWork<OwnedResource>) {
        this.unitOfWork = workFactory();
      }
    }
    @InstancePerDependency()
    class MyOuterWorkManager {
      public unitOfWork: IUnitOfWork<MyWorkManager>;
      constructor(@UnitOfWork(MyWorkManager) workFactory: () => IUnitOfWork<MyWorkManager>) {
        this.unitOfWork = workFactory();
      }
    }
    sut.register(OwnedResource);
    sut.register(MyWorkManager);
    sut.register(MyOuterWorkManager);
    const instance = sut.resolve(MyOuterWorkManager);
    // Act
    instance.unitOfWork.dispose();
    // Assert
    expect(disposeCount).to.equal(1);
  });

  it('should resolve descendants with arguments passed to unit of work factory', () => {
    // Arrange
    class Color {
      public static Blue = new Color();
    }
    @InstancePerDependency()
    class OwnedResource {
      constructor(public color: Color) {}
    }
    @InstancePerDependency()
    class MyWorkManager {
      public unitOfWork: IUnitOfWork<OwnedResource>;
      constructor(@UnitOfWork(Color, OwnedResource) workFactory: (color: Color) => IUnitOfWork<OwnedResource>) {
        this.unitOfWork = workFactory(Color.Blue);
      }
    }
    sut.register(OwnedResource);
    sut.register(MyWorkManager);
    // Act
    const instance = sut.resolve(MyWorkManager);
    // Assert
    expect(instance.unitOfWork.value.color).to.equal(Color.Blue);
  });
});

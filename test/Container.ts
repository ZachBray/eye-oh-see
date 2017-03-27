import * as chai from 'chai';
import {
  Container,
  SingleInstance, InstancePerDependency, InstancePerScope,
  ArrayOf, ScopedFactory, Factory, Disposable, UnitOfWork, ScopedUnitOfWork,
  hasRegistrationAnnotation
} from '../src/Index';
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

  it('should allow transient implementations to register as multiple services', () => {
    // Arrange
    class IAnimal {}
    class IPet {}
    @InstancePerDependency(IAnimal, IPet)
    class Dog {}
    sut.register(IAnimal);
    sut.register(IPet);
    sut.register(Dog);
    // Arrange
    const instanceA = sut.resolve(IAnimal);
    const instanceB = sut.resolve(IPet);
    // Assert
    expect(instanceA instanceof Dog).to.be.true;
    expect(instanceB instanceof Dog).to.be.true;
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

  it('should allow singleton implementations to register as multiple services', () => {
    // Arrange
    class IAnimal {}
    class IPet {}
    @SingleInstance(IAnimal, IPet)
    class Dog {}
    sut.register(IAnimal);
    sut.register(IPet);
    sut.register(Dog);
    // Arrange
    const instanceA = sut.resolve(IAnimal);
    const instanceB = sut.resolve(IPet);
    // Assert
    expect(instanceA instanceof Dog).to.be.true;
    expect(instanceB instanceof Dog).to.be.true;
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

  it('should resolve an empty array when there are no registrations for a service injected as an array', () => {
    // Arrange
    class IAnimal {}
    @InstancePerDependency()
    class Zoo {
      constructor(@ArrayOf(IAnimal) public animals: IAnimal[]) {}
    }
    sut.register(IAnimal);
    sut.register(Zoo);
    // Act
    const instance = sut.resolve(Zoo);
    // Assert
    expect(instance.animals.length).to.equal(0);
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
    // Assert
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
    // Assert
    expect(instanceCount).to.equal(1);
  });

  it('should respect per scope container registrations when resolving through factories', () => {
    // Arrange
    let instanceCount = 0;
    const MyScope = 'MyScope';
    @InstancePerScope(MyScope)
    class Leaf {
      constructor() {
        ++instanceCount;
      }
    }
    @InstancePerDependency()
    class Lv1 {
      constructor(public a: Leaf, public b: Leaf) {}
    }
    @InstancePerDependency()
    class Lv2 {
      public a: Lv1;
      public b: Lv1;
      public c: Lv1;
      constructor(
        @Factory(Lv1) private lv1Factory: () => Lv1,
        @ScopedFactory(MyScope, Lv1) private lv1FactoryScoped: () => Lv1) {
        this.a = lv1Factory();
        this.b = lv1Factory();
        this.c = lv1FactoryScoped();
      }
    }
    @InstancePerDependency()
    class Root {
      public a: Lv2;
      public b: Lv2;
      constructor(@ScopedFactory(MyScope, Lv2) factory: () => Lv2) {
        this.a = factory();
        this.b = factory();
      }
    }
    sut.register(Leaf);
    sut.register(Lv1);
    sut.register(Lv2);
    sut.register(Root);
    // Act
    sut.resolve(Root);
    // Assert
    expect(instanceCount).to.equal(4);
    // Details:
    // a->a->a: instance #1
    // a->a->b: instance #1
    // a->b->a: instance #1
    // a->b->b: instance #1
    // a->c->a: instance #2
    // a->c->b: instance #2
    // b->a->a: instance #3
    // b->a->b: instance #3
    // b->b->a: instance #3
    // b->b->b: instance #3
    // b->c->a: instance #4
    // b->c->b: instance #4
  });

  it('should respect per scope container registrations when resolving units of work', () => {
    // Arrange
    let instanceCount = 0;
    const MyScope = 'MyScope';
    @InstancePerScope(MyScope)
    class Leaf {
      constructor() {
        ++instanceCount;
      }
    }
    @InstancePerDependency()
    class Lv1 {
      constructor(public a: Leaf, public b: Leaf) {}
    }
    @InstancePerDependency()
    class Lv2 {
      public a: Lv1;
      public b: Lv1;
      public c: Lv1;
      constructor(
        @UnitOfWork(Lv1) private lv1Factory: () => IUnitOfWork<Lv1>,
        @ScopedUnitOfWork(MyScope, Lv1) private lv1FactoryScoped: () => IUnitOfWork<Lv1>) {
        this.a = lv1Factory().value;
        this.b = lv1Factory().value;
        this.c = lv1FactoryScoped().value;
      }
    }
    @InstancePerDependency()
    class Root {
      public a: Lv2;
      public b: Lv2;
      constructor(@ScopedUnitOfWork(MyScope, Lv2) factory: () => IUnitOfWork<Lv2>) {
        this.a = factory().value;
        this.b = factory().value;
      }
    }
    sut.register(Leaf);
    sut.register(Lv1);
    sut.register(Lv2);
    sut.register(Root);
    // Act
    sut.resolve(Root);
    // Assert
    expect(instanceCount).to.equal(4);
    // Details:
    // a->a->a: instance #1
    // a->a->b: instance #1
    // a->b->a: instance #1
    // a->b->b: instance #1
    // a->c->a: instance #2
    // a->c->b: instance #2
    // b->a->a: instance #3
    // b->a->b: instance #3
    // b->b->a: instance #3
    // b->b->b: instance #3
    // b->c->a: instance #4
    // b->c->b: instance #4
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
    // Assert
    expect(instance.left.knee.color).to.equal(Color.Red);
    expect(instance.right.knee.color).to.equal(Color.Green);
    expect(instance.left.knee.color).to.not.equal(instance.right.knee.color);
  });

  it('should override existing registrations when factory is provided with a parameter', () => {
    // Arrange
    @InstancePerDependency()
    class Param { }
    @InstancePerDependency()
    class Config { }
    @InstancePerDependency()
    class App {
      public config: Config;
      constructor(@Factory(Param, Config) factory: (param: Param) => Config) {
        this.config = factory(new Param());
      }
    }
    sut.register(Param); // Param exists as a transient in the global scope
    sut.register(Config);
    sut.register(App); // But it is also provided via a factory here
    // Act + Assert (no throw)
    sut.resolve(App);
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
    // Assert
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
    // Assert
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
    // Assert
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

  it('should be possible to determine whether an object is registered via an annotation or not', () => {
    // Arrange
    @SingleInstance()
    class Foo {}
    @InstancePerDependency()
    class Bar {}
    class Baz {}
    // Act
    const isFooAnnotated = hasRegistrationAnnotation(Foo);
    const isBarAnnotated = hasRegistrationAnnotation(Bar);
    const isBazAnnotated = hasRegistrationAnnotation(Baz);
    // Assert
    expect(isFooAnnotated).to.be.true;
    expect(isBarAnnotated).to.be.true;
    expect(isBazAnnotated).to.be.false;
  });
});

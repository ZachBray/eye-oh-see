import * as chai from 'chai';
import {Container, Singleton, Transient, Many} from '../src/Container';
const expect = chai.expect;

describe('Container', () => {
  let sut: Container;

  beforeEach(() => {
    sut = new Container();
  });

  it('should return a new instance when resolving a transient entry', () => {
    // Arrange
    let instanceCount = 0;
    @Transient()
    class Foo {
      constructor() {
        ++instanceCount;
      }
    }
    // Act
    const instance = sut.resolve(Foo);
    // Assert
    expect(instance instanceof Foo).to.be.true;
    expect(instanceCount).to.equal(1);
  });

  it('should construct a new instance for each resolution of a transient entry', () => {
    // Arrange
    let instanceCount = 0;
    @Transient()
    class Foo {
      constructor() {
        ++instanceCount;
      }
    }
    // Act
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
    @Transient(IAnimal)
    class Dog {}
    // Arrange
    const instance = sut.resolve(IAnimal);
    // Assert
    expect(instance instanceof Dog).to.be.true;
  });

  it('should only construct one instance of a singleton entry', () => {
    // Arrange
    let instanceCount = 0;
    @Singleton()
    class Foo {
      constructor() {
        ++instanceCount;
      }
    }
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
    @Transient()
    class Bar {}
    @Transient()
    class Foo {
      constructor(public bar: Bar) {}
    }
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
    @Singleton()
    class Bar {
      constructor() {
        ++barInstanceCount;
      }
    }
    @Transient()
    class Baz {
      constructor() {
        ++bazInstanceCount;
      }
    }
    @Transient()
    class Foo {
      constructor(public bar: Bar, public baz: Baz) {}
    }
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
    @Transient()
    class Foo {
      constructor() {
        ++instanceCount;
      }
    }
    const instanceA = new Foo();
    sut.registerInstance(Foo, instanceA);
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
    @Transient(IAnimal)
    class Dog implements IAnimal {}
    @Transient(IAnimal)
    class Cat implements IAnimal {}
    @Transient()
    class Zoo {
      constructor(@Many(IAnimal) public animals: IAnimal[]) {}
    }
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
    @Singleton(IAnimal)
    class Dog implements IAnimal {
      constructor() {
        ++dogInstanceCount;
      }
    }
    @Transient(IAnimal)
    class Cat implements IAnimal {}
    @Transient()
    class Zoo {
      constructor(@Many(IAnimal) public animals: IAnimal[]) {}
    }
    // Act
    sut.resolve(Zoo);
    sut.resolve(Zoo);
    // Assert
    expect(dogInstanceCount).to.equal(1);
  });

  // TODO:
  // Child containers
  // Factories
  // Disposal of resources
  // Multiple container instances (i.e., fix usage of essentially static metadata).
});

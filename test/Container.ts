import * as chai from 'chai';
import {Container, Singleton, Transient} from '../src/Container';
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

  // TODO:
  // Arrays/sequences
  // Child containers
  // Factories
  // Disposal of resources
  // Multiple container instances (i.e., fix usage of essentially static metadata).
});

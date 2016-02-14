import Container from '../src/index';
import {expect} from 'chai';

describe('EyeOhSee', () => {
  it('should fail to resolve by key when there are no matching bindings', () => {
    // Arrange
    const container = Container();
    // Act + Assert
    expect(() => container.resolve('testKey')).to.throw;
  });

  it('should resolve an instance when there is a matching binding', () => {
    // Arrange
    const container = Container();
    const service = 42;
    const testKey = container.bind(() => service);
    // Act
    const result = container.resolve(testKey);
    // Assert
    expect(result).to.equal(service);
  });

  it('should resolve the same instance multiple times when there is a singleton binding', () => {
    // Arrange
    const container = Container();
    let service = 0;
    const testKey = container.bind(() => service++).asSingleton;
    // Act
    const result1 = container.resolve(testKey);
    const result2 = container.resolve(testKey);
    // Assert
    expect(result1).to.equal(0);
    expect(result2).to.equal(0);
  });

  it('should pass resolved arguments to the binding factory', () => {
    // Arrange
    const container = Container();
    let providedArgs;
    const testService = 42;
    const testService2 = args => providedArgs = args;
    const testKey = container.bind(() => testService);
    const testKey2 = container.bind(testService2).with({testKey});
    // Act
    container.resolve(testKey2);
    // Assert
    expect(providedArgs).to.deep.equal({testKey: 42});
  });

  it('should resolve an instance by key when exported', () => {
    // Arrange
    const container = Container();
    const service = 42;
    container.bind(() => service).to('testKey');
    // Act
    const result = container.resolve('testKey');
    // Assert
    expect(result).to.equal(service);
  });

  it('should throw when resolving a key that has been exported multiple times', () => {
    // Arrange
    const container = Container();
    container.bind(() => 42).to('testKey');
    container.bind(() => 43).to('testKey');
    // Act + Assert
    expect(() => container.resolve('testKey')).to.throw;
  });

  it('should return the empty array when resolveMany is called to resolve a key with no exports', () => {
    // Arrange
    const container = Container();
    // Act
    const results = container.resolveMany('testKey');
    // Assert
    expect(results).to.deep.equal([]);
  });

  it('should return all matching services when resolveMany is called to resolve a key with many exports', () => {
    // Arrange
    const container = Container();
    container.bind(() => 42).to('testKey');
    container.bind(() => 43).to('testKey');
    // Act
    const results = container.resolveMany('testKey');
    // Assert
    expect(results).to.deep.equal([42, 43]);
  });

  it('should not dispose of resources tracked by the container until the container is disposed', () => {
    // Arrange
    const container = Container();
    let hasDisposed = false;
    const service = { dispose: () => hasDisposed = true };
    const testKey = container.bind(() => service).disposeBy(instance => instance.dispose());
    // Act
    container.resolve(testKey);
    // Assert
    expect(hasDisposed).to.be.false;
  });

  it('should dispose of resources tracked by the container when the container is disposed', () => {
    // Arrange
    const container = Container();
    let hasDisposed = false;
    const service = { dispose: () => hasDisposed = true };
    const testKey = container.bind(() => service).disposeBy(instance => instance.dispose());
    // Act
    container.resolve(testKey);
    container.dispose();
    // Assert
    expect(hasDisposed).to.be.true;
  });

  it('should allow the parent bindings to be overridden in child containers', () => {
    // Arrange
    const container = Container();
    const service = 42;
    const newService = 43;
    container.bind(() => service).to('testKey');
    const child = container.createScope('testScope');
    child.unbind('testKey');
    child.bind(() => newService).to('testKey');
    // Act
    const childResult = child.resolve('testKey');
    const result = container.resolve('testKey');
    // Assert
    expect(childResult).to.equal(newService);
    expect(result).to.equal(service);
  });

  it('should return the service bound in the parent when no bindings exist in the child', () => {
    // Arrange
    const container = Container();
    const service = 42;
    container.bind(() => service).to('testKey');
    const child = container.createScope('testScope');
    // Act
    const childResult = child.resolve('testKey');
    // Assert
    expect(childResult).to.equal(service);
  });

  it('should only dispose of resources tracked by the child container when it is disposed', () => {
    // Arrange
    const container = Container();
    let disposeCount = 0;
    const service = { dispose: () => disposeCount += 1 };
    const testKey = container.bind(() => service).disposeBy(instance => instance.dispose()).perScope('testScope');
    const testKey2 = container.bind(() => service).disposeBy(instance => instance.dispose());
    const child = container.createScope('testScope');
    // Act
    container.resolve(testKey2);
    child.resolve(testKey);
    child.dispose();
    // Assert
    expect(disposeCount).to.equal(1);
  });

  it('should dispose of resources tracked by child containers when a parent is disposed', () => {
    // Arrange
    const container = Container();
    let disposeCount = 0;
    const service = { dispose: () => disposeCount += 1 };
    const testKey = container.bind(() => service).disposeBy(instance => instance.dispose());
    const child = container.createScope('testScope');
    // Act
    container.resolve(testKey);
    child.resolve(testKey);
    container.dispose();
    // Assert
    expect(disposeCount).to.equal(2);
  });

  it('should throw when there is no matching scope to resolve from', () => {
    // Arrange
    const container = Container();
    let creationCount = 0;
    const service = () => creationCount++;
    const testKey = container.bind(() => service).perScope('testScopeY');
    // Act + Assert
    expect(() => container.resolve(testKey)).to.throw;
  });

  it('should only create a single instance per named scope for scoped singleton bindings', () => {
    // Arrange
    const container = Container();
    let creationCount = 0;
    const service = () => creationCount++;
    const testKey = container.bind(service).perScope('testScopeX');
    // Act
    const child = container.createScope('testScopeX');
    const result1 = child.resolve(testKey); // 1st - explicit scope
    const grandchild = child.createScope('testScopeY');
    const result2 = grandchild.resolve(testKey);
    const greatGrandchild = grandchild.createScope('testScopeX');
    const result3 = greatGrandchild.resolve(testKey); // 2nd - explicit scope
    // Assert
    expect(result1).to.equal(0);
    expect(result2).to.equal(0);
    expect(result3).to.equal(1);
  });
});

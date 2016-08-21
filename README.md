# EyeOhSee

[![Build Status](https://travis-ci.org/ZachBray/eye-oh-see.svg?branch=master)](https://travis-ci.org/ZachBray/eye-oh-see)

EyeOhSee is an inversion of control (IoC) container for TypeScript. 

It uses TypeScript attributes and metadata to perform constructor injection without relying on error-prone strings.

## Usage

### Install

To install the npm package in your project run the following command:

```bash
npm install --save eye-oh-see
```

Typings are included in the npm package.

### Prerequisites

EyeOhSee relies on metadata that the TypeScript compiler generates. The compiler will only generate this metadata if you include the following options in your `tsconfig.json` configuration file:

```json
{
  "emitDecoratorMetadata": true,
  "experimentalDecorators": true
}
```

### Basic usage

Decorate your services and implementations as shown in the features section. For example:

```typescript
import {InstancePerDependency} from 'eye-oh-see';

export abstract class MyService { ... }

@InstancePerDependency(MyService)
export class ServiceImpl extends MyService { ... }
```

Then register service interfaces and implementations with the container. For example:

```typescript
import {Container} from 'eye-oh-see';
import {MyService, ServiceImpl} from './SomeFile';

const container = new Container();
container.register(MyService);
container.register(ServiceImpl);
```

Then resolve services from the container. For example:

```typescript
const service = container.resolve(MyService);
```

### Advanced usage: Webpack automatic module/directory types registration

Decorate your services and implementations as shown in the features section.

Ensure all your services and implementations are module exports.

Install `webpack-env` typings using the following command:

```bash
typings install --save --global dt~webpack-env
```

Register all exported services and implementations from a module/directory using `require.context(...)`:

```typescript
import {Container} from 'eye-oh-see';

// Module directories
const modules = [
  require.context('./my-core-module', true, /^\.\/.*\.tsx?$/),
  require.context('./my-ui-module', true, /^\.\/.*\.tsx?$/),
  require.context('./my-connectivity-module', true, /^\.\/.*\.tsx?$/)
];

// Container
const container = new Container();

// Registration of module exports in container
modules.forEach(context => {
  const moduleObjects = context.keys().map(context);
  const moduleExports = flatten(moduleObjects.map(moduleObject => Object.keys(moduleObject).map(k => moduleObject[k])));
  const serviceExports = moduleExports.filter(moduleExport => typeof moduleExport === 'function');
  serviceExports.forEach(export => container.register(export));
});

// Resolution from container can happen from here!
```

### Gotchas

#### Interfaces

TypeScript interfaces are erased and their metadata is not accessible at runtime. This means that all interfaces look the same to EyeOhSee and it is unable to resolve them correctly. We could have added support in EyeOhSee for interfaces using string identifiers to distinguish them; however, we felt this was messy, error-prone and there is an alternative.

_This does not work with EyeOhSee_:

```typescript
interface ServiceA {
    a(): void;
}

interface ServiceB {
    abstract b(): void;
}

@SingleInstance(ServiceA, ServiceB)
class ServiceImpl implements ServiceA, ServiceB {
  ...
}
```

_This does work_:

```typscript
abstract class ServiceA {
    abstract a(): void;
}

abstract class ServiceB {
    abstract b(): void;
}

@SingleInstance(ServiceA, ServiceB)
class ServiceImpl implements ServiceA, ServiceB {
  ...
}
```

TypeScript supports multiple inheritance via `implements` from fully abstract classes. This allows us to keep the same semantics but avoid using error-prone string identifiers.

## Features

### Implemented

- [x] Constructor injection
- [x] Registration of transient dependencies - `@InstancePerDependency()`
- [x] Registration of singleton dependencies - `@SingleInstance()`
- [x] Registration of implementations for abstract services - `@InstancePerDependency(BaseClass)` and `@SingleInstance(BaseClass)`
- [x] Registration of a single implementation for multiple services - `@SingleInstance(BaseClassA, BaseClassB)` and `@InstancePerDependency(BaseClassA, BaseClassB)`
- [x] Array injection - `@ArrayOf(BaseClass)`
- [x] Factory injection - `@Factory(ReturnType)`
- [x] Parameterized factory injection - `@Factory(ParamTypeA, ParamTypeB, ReturnType)`
- [x] Automatic disposal of resolved instances - `@Disposable()` and `@Disposable(instance => instance.disposeMethod()`
- [x] Child-containers/unit-of-work injection - `@UnitOfWork(OwnedType)`
- [x] Parameterized child-container/unit-of-work factories - `@UnitOfWork(ParamTypeA, ParamTypeB, OwnedType)`
- [x] Automatic disposal of container descendants
- [x] Ability to override attribute registration for testing using container API
- [x] Registration of singleton-in-scope - @InstancePerScope("MyScopeName")


### Code snippets

#### Registering a singleton

```typescript
// This will only be constructed once
@SingleInstance()
class MySingleton { ... }
```

#### Registering a singleton that is resolved as its base class

```typescript
// This is what consumers resolve
class MyBaseClass { ... }

// This is the implementation
@SingleInstance(MyBaseClass)
class MySingleton extends MyBaseClass { ... }
```

#### Registering a singleton that can be resolved as multiple interfaces

```typescript
// This is one of the interfaces that consumers resolve
class MyBaseClassA { ... }

// This is another of the interfaces that consumers resolve
class MyBaseClassB { ... }

// This is the implementation
@SingleInstance(MyBaseClassA, MyBaseClassB)
class MySingleton implements MyBaseClassA, MyBaseClassB { ... }
```

#### Registering a transient

```typescript
// This will be constructed for each dependency
@InstancePerDependency()
class MyTransient { ... }
```

#### Registering a transient that is resolved as its base class

```typescript
// This is what consumers resolve
class MyBaseClass { ... }

// This is the implementation
@InstancePerDependency(MyBaseClass)
class MyTransient extends MyBaseClass { ... }
```

#### Registering a transient that can be resolved as multiple interfaces

```typescript
// This is one of the interfaces that consumers resolve
class MyBaseClassA { ... }

// This is another of the interfaces that consumers resolve
class MyBaseClassB { ... }

// This is the implementation
@InstancePerDependency(MyBaseClassA, MyBaseClassB)
class MyTransient implements MyBaseClassA, MyBaseClassB { ... }
```

#### Array injection

```typescript
// This is the service interface
class MyBaseClass { ... }

// This is one implementation
@InstancePerDependency(MyBaseClass)
class MyFirstImpl { ... }

// This is another implementation
// Notice that you can mix resolution strategies of implementations
@SingleInstance(MyBaseClass)
class MySecondImpl { ... }

// This is the consumer
@InstancePerDependency()
class MyConsumer {
  constructor(@ArrayOf(MyBaseClass) myThings: MyBaseClass[]) { ... }
  ...
}
```

#### Simple factory injection

```typescript
// The service
@InstancePerDependency()
class MyService { ... }

// The consumer
@InstancePerDependency()
class MyConsumer {
  constructor(@Factory(MyService) private factory: () => MyService) { ... }

  ...

  public later() {
    const myServiceInstance = this.factory();
    ...
  }
}
```

#### Factory injection with parameters / "robot legs"

```typescript

class ToeDirection {
  public static BigToeOnRight = new ToeDirection();
  public static BigToeOnLeft = new ToeDirection();
}

// A foot has a toe direction
@InstancePerDependency()
class Foot {
  constructor(toeDirection: ToeDirection) { ... }
  ...
}

// A leg has a foot
@InstancePerDependency() 
class Leg {
  constructor(foot: Foot) { ... }
  ...
}

// A robot has two legs
@InstancePerDependency()
class Robot {
  private leftLeg: Leg;
  private rightLeg: Leg;

  // Factory attributes can take multiple parameters but here we only use one
  constructor(@Factory(ToeDirection, Leg) legFactory: (toeDirection: ToeDirection) => Leg) {

    // We construct each leg specifying how ToeDirection should be resolved by descendants

    this.leftLeg = legFactory(ToeDirection.BigToeOnRight);
    this.rightLeg = legFactory(ToeDirection.BigToeOnLeft);
  }

  ...
}
```

#### Automatic disposal

```typescript
// It calls the disposal method when the container it was resolved from is disposed
// It defaults to calling a method called "dispose"
@InstancePerDependency()
@Disposable()
class MyFirstResource {
  dispose() {
    // Clean up stuff here
  }
}

// We can override the method it calls when the container is disposed
@InstancePerDependency()
@Disposable(instance => instance.cleanUp())
class MyFirstResource {
  cleanUp() {
    // Clean up stuff here
  }
}
```

#### Child containers / unit of work

```typescript
// Service used inside unit of work
@InstancePerDependency()
@Disposable()
class MyService {
  dispose() { ... }
}

// Business aspect with some lifetime that is shorter than that of the application
@InstancePerDependency()
class MyRequest {
  constructor(service: MyService)
}

// The application that handles the lifetimes of those business aspects
@InstancePerDependency()
class MyApplication {
  ...
  constructor(@UnitOfWork(MyRequest) private requestFactory: () => IUnitOfWork<MyRequest>) { ... }
  ...
  onStartRequest(id) {
    ...
    this.requests[id] = this.requestFactory();
    ...
  }

  onFinishRequest(id) {
    ...
    // Disposes the resolved instance of MyService for the given request
    this.requests[id].dispose();
    ...
  }
}
```


#### Parameterized child containers / unit of work

```typescript
// Service used inside unit of work
@InstancePerDependency()
@Disposable()
class MyService {
  // Accepts some configuration
  constructor(config: Config) { ... }
  dispose() { ... }
}

// Business aspect with some lifetime that is shorter than that of the application
@InstancePerDependency()
class MyRequest {
  constructor(service: MyService)
}

// The application that handles the lifetimes of those business aspects
@InstancePerDependency()
class MyApplication {
  ...
  constructor(@UnitOfWork(Config, MyRequest) private requestFactory: (config: Config) => IUnitOfWork<MyRequest>) { ... }
  ...
  onStartRequest(id) {
    ...
    // unit of work created with parameter that will be resolved by MyService instance
    this.requests[id] = this.requestFactory(this.config);
    ...
  }

  onFinishRequest(id) {
    ...
    // Disposes the resolved instance of MyService for the given request
    this.requests[id].dispose();
    ...
  }
}
```

#### Scoped instances

```typescript
const RequestScope = 'A Request';

// Service to be available as a singleton within a scope
@InstancePerScope(RequestScope)
class MyService { ... }

// First consumer of the service
@InstancePerDependency()
class MyFirstConsumer {
  constructor(private service: MyService) {}
  ...
}

// Second consumer of the service
@InstancePerDependency()
class MySecondConsumer {
  constructor(private service: MyService) {}
  ...
}

// Representation of a request or unit of work
@InstancePerDependency()
class Request {
  constructor(private consumer1: MyFirstConsumer, private consumer2: MySecondConsumer) {}
}

// Application where each request 
@InstancePerDependency()
class Application {
  // Note: we could also unit a @ScopedUnitOfWork(...) decorator here!
  constructor(@ScopedFactory(RequestScope, Request) private requestFactory: () => Request) {}
  ...
  onStartRequest(id) {
    ...
    // request created where request[1].consumer1.service === request[1].consumer2.service
    // but request[1].consumer1.service === request[2].consumer1.service
    this.requests[id] = this.requestFactory();
    ...
  }
  ...
}
```

# EyeOhSee

EyeOhSee is an IOC framework. It uses TypeScript attributes and metadata to perform constructor injection. 

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

### Road map

- [ ] Registration of singleton-in-scope - @InstancePerScope("MyScopeName")


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

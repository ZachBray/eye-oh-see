/* @flow */
declare class ExpectToBuilder<T> {
  equal(y:T): void;
}

declare class ExpectBuilder<T> {
  to: ExpectToBuilder<T>;
}

declare module 'chai' {
  declare function expect<T>(x:T):ExpectBuilder<T>;
}

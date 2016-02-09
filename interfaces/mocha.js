/* @flow */
declare module 'mocha' {
  declare function describe(description: string, tests: () => void) : void;
  declare function it(description: string, test: () => void): void;
}

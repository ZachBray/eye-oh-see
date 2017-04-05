import ScopedFactory from './ScopedFactory';
import { assert } from './Guards';

export default function Factory(...args: Function[]) {
  assert('(Factory) args', args).is.not.empty();
  args.forEach((arg, i) => assert(`(Factory) args[${i}]`, arg).is.a.function());
  return ScopedFactory(null, ...args);
}

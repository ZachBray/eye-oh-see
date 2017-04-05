import ScopedUnitOfWork from './ScopedUnitOfWork';
import { assert } from './Guards';

export default function (...args: Function[]) {
  assert('(UnitOfWork) args', args).is.not.empty();
  return ScopedUnitOfWork(null, ...args);
}

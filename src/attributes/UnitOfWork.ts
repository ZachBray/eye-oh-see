import ScopedUnitOfWork from './ScopedUnitOfWork';

export default function (...args: Function[]) {
  return ScopedUnitOfWork(null, ...args);
}

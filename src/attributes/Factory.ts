import ScopedFactory from './ScopedFactory';

export default function Factory(...args: Function[]) {
  return ScopedFactory(null, ...args);
}

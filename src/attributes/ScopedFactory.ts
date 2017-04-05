import RegistrationMetadata from './RegistrationMetadata';
import FactoryParameter from '../parameters/FactoryParameter';
import { assert } from './Guards';

export default function ScopedFactory(scopeName?: string, ...args: Function[]) {
  assert('(ScopedFactory) args', args).is.not.empty();
  args.forEach((arg, i) => assert(`(ScopedFactory) args[${i}]`, arg).is.a.function());
  return function(target: Function, key: string, index: number) {
    assert('(ScopedFactory) target', target).is.a.function();
    const metadata = RegistrationMetadata.findOrCreate(target);
    if (args.length === 0) {
      throw new Error(`Must provide at least the return type for a factory. Check the constructor of ${metadata.key}`);
    }
    const params = args.slice(0, args.length - 1);
    const service = args[args.length - 1];
    metadata.addInitialization(registration => registration.parameters[index] = new FactoryParameter(params, service, scopeName));
  };
}

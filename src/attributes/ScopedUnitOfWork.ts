import RegistrationMetadata from './RegistrationMetadata';
import UnitOfWorkParameter from '../parameters/UnitOfWorkParameter';
import { assert } from './Guards';

export default function ScopedUnitOfWork (scopeName: string, ...args: Function[]) {
  assert('(ScopedUnitOfWork) args', args).is.not.empty();
  return function(target: Function, key: string, index: number) {
    assert('(ScopedUnitOfWork) target', target).is.a.function();
    const metadata = RegistrationMetadata.findOrCreate(target);
    const params = args.slice(0, args.length - 1);
    const service = args[args.length - 1];
    metadata.addInitialization(registration => registration.parameters[index] = new UnitOfWorkParameter(params, service, scopeName));
  };
}

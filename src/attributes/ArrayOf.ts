import RegistrationMetadata from './RegistrationMetadata';
import ArrayParameter from '../parameters/ArrayParameter';
import { assert } from './Guards';

export default function ArrayOf(service: Function) {
  assert('(ArrayOf) service', service).is.a.function();
  return function(target: Function, key: string, index: number) {
    assert('(ArrayOf) target', target).is.a.function();
    const metadata = RegistrationMetadata.findOrCreate(target);
    metadata.addInitialization(registration => registration.parameters[index] = new ArrayParameter(service));
  };
}

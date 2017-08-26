import RegistrationMetadata from './RegistrationMetadata';
import Parameter from '../parameters/Parameter';
import { assert } from './Guards';

export default function ParamOf(service: Function) {
  assert('(ParamOf) service', service).is.a.function();
  return function(target: Function, key: string, index: number) {
    assert('(ParamOf) target', target).is.a.function();
    const metadata = RegistrationMetadata.findOrCreate(target);
    metadata.addInitialization(registration => registration.parameters[index] = new Parameter(service));
  };
}

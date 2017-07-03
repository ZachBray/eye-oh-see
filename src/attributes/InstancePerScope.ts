import RegistrationMetadata from './RegistrationMetadata';
import { assert } from './Guards';
import { registerServices } from './Utils';

export default function InstancePerScope(scopeName: string, ...services: Function[]) {
  services.forEach((arg, i) => assert(`(InstancePerScope) services[${i}]`, arg).is.a.function());
  return function (target: Function) {
    assert('(InstancePerScope) target', target).is.a.function();
    registerServices(target, services, registration => registration.instancePerScope(scopeName));
  };
}

import RegistrationMetadata from './RegistrationMetadata';
import { assert } from './Guards';
import { registerServices } from './Utils';

export default function InstancePerDependency(...services: Function[]) {
  services.forEach((arg, i) => assert(`(InstancePerDependency) services[${i}]`, arg).is.a.function());
  return function (target: Function) {
    assert('(InstancePerDependency) target', target).is.a.function();
    registerServices(target, services, registration => registration.instancePerDependency());
  };
}

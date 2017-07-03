import RegistrationMetadata from './RegistrationMetadata';
import { assert } from './Guards';
import { registerServices } from './Utils';

export default function SingleInstance(...services: Function[]) {
  services.forEach((arg, i) => assert(`(SingleInstance) services[${i}]`, arg).is.a.function());
  return function (target: Function) {
    registerServices(target, services, registration => registration.singleInstance());
  };
}

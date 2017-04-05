import RegistrationMetadata from './RegistrationMetadata';
import { assert } from './Guards';

export default function SingleInstance(...services: Function[]) {
  services.forEach((arg, i) => assert(`(SingleInstance) services[${i}]`, arg).is.a.function());
  return function (target: Function) {
    const metadata = RegistrationMetadata.findOrCreate(target);
    metadata.addInitialization(registration => registration.singleInstance());
    services.forEach(service => {
      metadata.addInitialization((_, container) => container.register(service).implementedBy(target));
    });
  };
}

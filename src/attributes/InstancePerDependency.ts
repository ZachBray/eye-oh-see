import RegistrationMetadata from './RegistrationMetadata';
import { assert } from './Guards';

export default function InstancePerDependency(...services: Function[]) {
  services.forEach((arg, i) => assert(`(InstancePerDependency) services[${i}]`, arg).is.a.function());
  return function (target: Function) {
    assert('(InstancePerDependency) target', target).is.a.function();
    const metadata = RegistrationMetadata.findOrCreate(target);
    metadata.addInitialization(registration => registration.instancePerDependency());
    services.forEach(service => {
      metadata.addInitialization((_, container) => container.register(service).implementedBy(target));
    });
  };
}

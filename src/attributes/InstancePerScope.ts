import RegistrationMetadata from './RegistrationMetadata';
import { assert } from './Guards';

export default function InstancePerScope(scopeName: string, ...services: Function[]) {
  services.forEach((arg, i) => assert(`(InstancePerScope) services[${i}]`, arg).is.a.function());
  return function (target: Function) {
    assert('(InstancePerScope) target', target).is.a.function();
    const metadata = RegistrationMetadata.findOrCreate(target);
    metadata.addInitialization(registration => registration.instancePerScope(scopeName));
    services.forEach(service => {
      metadata.addInitialization((_, container) => container.register(service).implementedBy(target));
    });
  };
}

import Registration from '../registration/Registration';
import RegistrationMetadata from './RegistrationMetadata';

export function registerServices(target: Function, services: Function[],
                                 initializer: (register: Registration, container?: IContainer) => void) {
  const metadata = RegistrationMetadata.findOrCreate(target);
  metadata.addInitialization(initializer);
  services.forEach(service => {
    if (service === target) {
      console.warn('A decorator (SingleInstance|InstancePerScope|InstancePerDependency) is being used to register a service as itself.',
                   'This is automatic and not required; therefore, it will be ignored.',
                   target);
      return;
    }
    metadata.addInitialization((_, container) => container.register(service).implementedBy(target));
  });
}

import RegistrationMetadata from './RegistrationMetadata';

export default function InstancePerScope(scopeName: string, ...services: Function[]) {
  return function (target: Function) {
    const metadata = RegistrationMetadata.findOrCreate(target);
    metadata.addInitialization(registration => registration.instancePerScope(scopeName));
    services.forEach(service => {
      metadata.addInitialization((_, container) => container.register(service).implementedBy(target));
    });
  };
}

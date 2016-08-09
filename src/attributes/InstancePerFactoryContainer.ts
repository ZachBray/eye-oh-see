import RegistrationMetadata from './RegistrationMetadata';

export default function InstancePerFactoryContainer(...services: Function[]) {
  return function (target: Function) {
    const metadata = RegistrationMetadata.findOrCreate(target);
    metadata.addInitialization(registration => registration.instancePerFactoryContainer());
    services.forEach(service => {
      metadata.addInitialization((_, container) => container.register(service).implementedBy(target));
    });
  };
}

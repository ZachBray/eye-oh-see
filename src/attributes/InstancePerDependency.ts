import RegistrationMetadata from './RegistrationMetadata';

export default function InstancePerDependency(...services: Function[]) {
  return function (target: Function) {
    const metadata = RegistrationMetadata.findOrCreate(target);
    metadata.addInitialization(registration => registration.instancePerDependency());
    services.forEach(service => {
      metadata.addInitialization((_, container) => container.register(service).implementedBy(target));
    });
  };
}

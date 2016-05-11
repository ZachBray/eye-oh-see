import RegistrationMetadata from './RegistrationMetadata';

export default function SingleInstance(...services: Function[]) {
  return function (target: Function) {
    const metadata = RegistrationMetadata.findOrCreate(target);
    metadata.addInitialization(registration => registration.instancePerDependency());
    services.forEach(service => {
      const serviceMetadata = RegistrationMetadata.findOrCreate(service);
      serviceMetadata.addInitialization(registration => registration.implementedBy(target));
    });
  };
}

import RegistrationMetadata from './RegistrationMetadata';

export default function SingleInstance(service?: Function) {
  return function (target: Function) {
    const metadata = RegistrationMetadata.findOrCreate(target);
    metadata.addInitialization(registration => registration.instancePerDependency());
    if (service != null) {
      const serviceMetadata = RegistrationMetadata.findOrCreate(service);
      serviceMetadata.addInitialization(registration => registration.implementedBy(target));
    }
  };
}

import RegistrationMetadata from './RegistrationMetadata';

export default function SingleInstance(...services: Function[]) {
  return function (target: Function) {
    const metadata = RegistrationMetadata.findOrCreate(target);
    metadata.addInitialization(registration => registration.singleInstance());
    services.forEach(service => {
      metadata.addInitialization((_, container) => container.register(service).implementedBy(target));
    });
  };
}

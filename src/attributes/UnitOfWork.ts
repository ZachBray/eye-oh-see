import RegistrationMetadata from './RegistrationMetadata';
import UnitOfWorkParameter from '../parameters/UnitOfWorkParameter';

export default function UnitOfWork (service: Function) {
  return function(target: Function, key: string, index: number) {
    const metadata = RegistrationMetadata.findOrCreate(target);
    metadata.addInitialization(registration => registration.parameters[index] = new UnitOfWorkParameter(service));
  };
}

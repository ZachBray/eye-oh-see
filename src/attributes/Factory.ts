import RegistrationMetadata from './RegistrationMetadata';
import FactoryParameter from '../parameters/FactoryParameter';

export default function Factory(service: Function) {
  return function(target: Function, key: string, index: number) {
    const metadata = RegistrationMetadata.findOrCreate(target);
    metadata.addInitialization(registration => registration.parameters[index] = new FactoryParameter(service));
  };
}

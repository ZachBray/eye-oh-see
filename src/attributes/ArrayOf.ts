import RegistrationMetadata from './RegistrationMetadata';
import ArrayParameter from '../parameters/ArrayParameter';

export default function ArrayOf(service: Function) {
  return function(target: Function, key: string, index: number) {
    const metadata = RegistrationMetadata.findOrCreate(target);
    metadata.addInitialization(registration => registration.parameters[index] = new ArrayParameter(service));
  };
}

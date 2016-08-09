import RegistrationMetadata from './RegistrationMetadata';
import FactoryParameter from '../parameters/FactoryParameter';

export default function ScopedFactory(scopeName?: string, ...args: Function[]) {
  return function(target: Function, key: string, index: number) {
    const metadata = RegistrationMetadata.findOrCreate(target);
    if (args.length === 0) {
      throw new Error(`Must provide at least the return type for a factory. Check the constructor of ${metadata.key}`);
    }
    const params = args.slice(0, args.length - 1);
    const service = args[args.length - 1];
    metadata.addInitialization(registration => registration.parameters[index] = new FactoryParameter(params, service, scopeName));
  };
}

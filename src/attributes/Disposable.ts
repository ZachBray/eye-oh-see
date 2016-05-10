import RegistrationMetadata from './RegistrationMetadata';

export default function Disposable(dispose: (instance: any) => void = instance => instance.dispose()) {
  return function (target: Function) {
    const metadata = RegistrationMetadata.findOrCreate(target);
    metadata.addInitialization(registration => registration.disposeBy(dispose));
  };
}

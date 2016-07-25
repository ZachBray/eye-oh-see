import 'reflect-metadata';
import Registration from '../registration/Registration';
export default class RegistrationMetadata {
    factory: any;
    key: string;
    private initializers;
    static findOrCreate(factory: any): RegistrationMetadata;
    constructor(factory: any);
    initializeRegistration(registration: Registration): void;
    addInitialization(initializer: (register: Registration) => void): void;
    private findDependencies();
}

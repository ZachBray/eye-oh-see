/// <reference path="../IContainer.d.ts" />
import 'reflect-metadata';
import Registration from '../registration/Registration';
export default class RegistrationMetadata {
    factory: any;
    key: string;
    private initializers;
    static hasMetadata(factory: any): boolean;
    static findOrCreate(factory: any): RegistrationMetadata;
    constructor(factory: any);
    initializeRegistration(registration: Registration, container: IContainer): void;
    addInitialization(initializer: (register: Registration, container?: IContainer) => void): void;
    private findDependencies();
}

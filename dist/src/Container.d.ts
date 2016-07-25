/// <reference path="../../node_modules/reflect-metadata/reflect-metadata.d.ts" />
import 'reflect-metadata';
import Registration from './registration/Registration';
export default class Container implements IContainer {
    private parentImpl;
    private static nextId;
    parent: IContainer;
    private registrations;
    private children;
    private resources;
    private id;
    constructor(parentImpl?: Container);
    createChild(): Container;
    register(factory: any): Registration;
    resolve<TService>(service: new (...args) => TService, resolvingContainer?: IContainer): TService;
    resolveMany<TService>(service: new (...args) => TService, resolvingContainer?: IContainer): TService[];
    registerDisposable(disposable: () => void): void;
    dispose(): void;
}

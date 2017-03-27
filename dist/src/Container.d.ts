/// <reference path="IContainer.d.ts" />
import 'reflect-metadata';
import Registration from './registration/Registration';
export default class Container implements IContainer {
    private parentImpl;
    scopeName: string;
    private static nextId;
    instances: {};
    private registrations;
    private resources;
    private removeParentDisposer;
    constructor(parentImpl?: Container, scopeName?: string);
    readonly parent: Container;
    createChild(scopeName?: string): Container;
    register(factory: any): Registration;
    resolve<TService>(service: new (...args: any[]) => TService, resolvingContainer?: IContainer): TService;
    resolveMany<TService>(service: new (...args: any[]) => TService, resolvingContainer?: IContainer): TService[];
    registerDisposable(disposable: () => void): () => void;
    dispose(): void;
}

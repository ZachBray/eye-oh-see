/// <reference path="IContainer.d.ts" />
import 'reflect-metadata';
import Registration from './registration/Registration';
export declare type Disposable = () => void;
export declare type Constructor<T> = {
    new (...args: any[]): T;
};
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
    register(factory: Function): Registration;
    resolve<TService>(service: Constructor<TService>, resolvingContainer?: IContainer): TService;
    resolveAbstract<TService>(service: Function, resolvingContainer?: IContainer): TService;
    resolveMany<TService>(service: Constructor<TService>, resolvingContainer?: IContainer): TService[];
    resolveManyAbstract<TService>(service: Function, resolvingContainer?: IContainer): TService[];
    registerDisposable(disposable: Disposable): Disposable;
    dispose(): void;
}

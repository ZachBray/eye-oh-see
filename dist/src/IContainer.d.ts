/// <reference path="registration/IRegistration.d.ts" />
interface IContainer {
    parent: IContainer;
    instances: {
        [key: string]: any;
    };
    scopeName: string;
    createChild(scopeName?: string): IContainer;
    resolve(service: Function): any;
    resolveMany(service: Function): any[];
    register(service: Function): IRegistration;
    registerDisposable(disposable: () => void): void;
    dispose(): void;
}

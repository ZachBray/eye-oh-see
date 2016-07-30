/// <reference path="../parameters/IParameter.d.ts" />
interface IRegistration {
    parameters: IParameter[];
    factory: any;
    disposalFunction: (instance: any) => void;
    providedInstance(instance: any): void;
}

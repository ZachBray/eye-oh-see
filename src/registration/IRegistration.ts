/// <reference path="../parameters/IParameter.ts" />

interface IRegistration {
  parameters: IParameter[];
  factory: any;
  disposalFunction: (instance: any) => void;
  providedInstance(instance: any): void;
  implementedBy(serviceImpl: any): void;
}

/// <reference path="../parameters/IParameter.ts" />

interface IRegistration {
  parameters: IParameter[];
  factory: any;
  key: string;
  disposalFunction: (instance: any) => void;
  resetResolutionStrategy(): IRegistration;
  providedInstance(instance: any): void;
  implementedBy(serviceImpl: any): void;
}

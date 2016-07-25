/// <reference path="../parameters/IParameter.ts" />

interface IRegistration {
  parameters: IParameter[];
  factory;
  disposalFunction;
  providedInstance(instance: any);
}

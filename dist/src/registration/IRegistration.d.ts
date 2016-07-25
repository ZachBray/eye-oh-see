interface IRegistration {
    parameters: IParameter[];
    factory: any;
    disposalFunction: any;
    providedInstance(instance: any): any;
}

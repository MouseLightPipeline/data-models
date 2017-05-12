import { IModelImportDefinition } from "./modelLoader";
import { Connector, IConnectionOptions } from "./connector";
export declare const AllSampleModels: IModelImportDefinition[];
export interface ISampleDatabaseModels {
    BrainArea?: any;
    Fluorophore?: any;
    InjectionVirus?: any;
    MouseStrain?: any;
    Sample?: any;
    Injection?: any;
    RegistrationTransform?: any;
    Neuron?: any;
}
export declare class SampleConnector extends Connector<ISampleDatabaseModels> {
    constructor(connectionOptions: IConnectionOptions);
}

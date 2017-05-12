import {BrainArea} from "../sample/brainArea";
import {Fluorophore} from "../sample/fluorophore";
import {Injection} from "../sample/injection";
import {InjectionVirus} from "../sample/InjectionVirus";
import {MouseStrain} from "../sample/mousestrain";
import {Neuron} from "../sample/neuron";
import {RegistrationTransform} from "../sample/registrationTransform";
import {Sample} from "../sample/sample";

import {IModelImportDefinition} from "./modelLoader";
import {Connector, IConnectionOptions} from "./connector";

export const AllSampleModels: IModelImportDefinition[] = [
    BrainArea,
    Fluorophore,
    Injection,
    InjectionVirus,
    MouseStrain,
    Neuron,
    RegistrationTransform,
    Sample
];

export interface ISampleDatabaseModels {
    BrainArea?: any
    Fluorophore?: any
    InjectionVirus?: any
    MouseStrain?: any
    Sample?: any;
    Injection?: any;
    RegistrationTransform?: any;
    Neuron?: any;
}

export class SampleConnector extends Connector<ISampleDatabaseModels> {
    public constructor(connectionOptions: IConnectionOptions) {
        super(connectionOptions, AllSampleModels);
    }
}

import { IModelImportDefinition } from "../connector/modelLoader";
import { INeuron } from "./neuron";
import { IFluorophore } from "./fluorophore";
import { IInjectionVirus } from "./InjectionVirus";
import { IBrainArea } from "./brainArea";
import { ISample } from "./sample";
export interface IInjection {
    id: string;
    brainAreaId: string;
    injectionVirusId: string;
    fluorophoreId: string;
    sampleId: string;
    createdAt: Date;
    updatedAt: Date;
    getSample(): ISample;
    getBrainArea(): IBrainArea;
    getInjectionVirus(): IInjectionVirus;
    getFluorophore(): IFluorophore;
    getNeurons(): INeuron[];
}
export declare const Injection: IModelImportDefinition;

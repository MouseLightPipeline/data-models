import { IModelImportDefinition } from "../connector/modelLoader";
import { IInjection } from "./injection";
import { IBrainArea } from "./brainArea";
export interface INeuron {
    id: string;
    idNumber?: number;
    idString?: string;
    tag?: string;
    keywords?: string;
    x?: number;
    y?: number;
    z?: number;
    doi?: string;
    sharing?: number;
    brainAreaId?: string;
    injectionId?: string;
    createdAt?: Date;
    updatedAt?: Date;
    getInjection?(): IInjection;
    getBrainArea?(): IBrainArea;
}
export interface INeuronInput {
    id: string;
    idNumber?: number;
    idString?: string;
    tag?: string;
    keywords?: string;
    x?: number;
    y?: number;
    z?: number;
    doi?: string;
    sharing?: number;
    brainAreaId?: string;
    injectionId?: string;
}
export declare const Neuron: IModelImportDefinition;

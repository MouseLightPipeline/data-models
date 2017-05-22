import { IModelImportDefinition } from "../connector/modelLoader";
import { ISample } from "./sample";
export interface IRegistrationTransform {
    id: string;
    location?: string;
    name?: string;
    notes?: string;
    sampleId?: string;
    createdAt?: Date;
    updatedAt?: Date;
    getSample?(): ISample;
}
export interface ITransformInput {
    id: string;
    location?: string;
    name?: string;
    notes?: string;
    sampleId?: string;
}
export declare const RegistrationTransform: IModelImportDefinition;

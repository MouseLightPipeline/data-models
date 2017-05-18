import { IModelImportDefinition } from "../connector/modelLoader";
import { ISample } from "./sample";
export interface IMouseStrain {
    id: string;
    name: string;
    createdAt?: Date;
    updatedAt?: Date;
    getSamples?(): ISample[];
}
export interface IMouseStrainInput {
    id: string;
    name?: string;
}
export declare const MouseStrain: IModelImportDefinition;

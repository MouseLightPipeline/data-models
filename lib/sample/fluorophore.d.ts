import { IModelImportDefinition } from "../connector/modelLoader";
import { IInjection } from "./injection";
export interface IFluorophore {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    getInjections(): IInjection[];
}
export interface IFluorophoreInput {
    id: string;
    name: string;
}
export declare const Fluorophore: IModelImportDefinition;

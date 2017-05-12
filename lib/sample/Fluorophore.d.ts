import { IModelImportDefinition } from "../index";
import { IInjection } from "./injection";
export interface IFluorophore {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    getInjections(): IInjection[];
}
export declare const Fluorophore: IModelImportDefinition;

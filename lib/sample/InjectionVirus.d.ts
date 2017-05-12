import { IModelImportDefinition } from "../connector/modelLoader";
import { IInjection } from "./injection";
export interface IInjectionVirus {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    getInjections(): IInjection;
}
export declare const InjectionVirus: IModelImportDefinition;

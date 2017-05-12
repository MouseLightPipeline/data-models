import { IModelImportDefinition } from "../index";
import { ISample } from "./sample";
export interface IRegistrationTransform {
    id: string;
    location: string;
    name: string;
    notes: string;
    sampleId: string;
    createdAt: Date;
    updatedAt: Date;
    getSample(): ISample;
}
export declare const RegistrationTransform: IModelImportDefinition;

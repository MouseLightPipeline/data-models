import { IModelImportDefinition } from "../connector/modelLoader";
import { IInjection } from "./injection";
import { IRegistrationTransform } from "./registrationTransform";
import { IMouseStrain } from "./mouseStrain";
export interface ISample {
    id: string;
    idNumber: number;
    animalId: string;
    tag: string;
    comment: string;
    sampleDate: Date;
    mouseStrainId: string;
    activeRegistrationTransformId: string;
    sharing: number;
    createdAt?: Date;
    updatedAt?: Date;
    getInjections?(): IInjection[];
    getRegistrationTransforms?(): IRegistrationTransform;
    getMouseStrain?(): IMouseStrain;
}
export interface ISampleInput {
    id: string;
    idNumber: number;
    animalId: string;
    tag: string;
    comment: string;
    sampleDate: number;
    mouseStrainId: string;
    mouseStrainName: string;
    activeRegistrationTransformId: string;
    sharing: number;
}
export declare const Sample: IModelImportDefinition;

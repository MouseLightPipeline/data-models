/// <reference types="sequelize" />
import { Sequelize, DataTypes } from "sequelize";
import { IInjection } from "./injection";
import { IRegistrationTransform } from "./registrationTransform";
import { IMouseStrain } from "./mousestrain";
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
    createdAt: Date;
    updatedAt: Date;
    getInjections(): IInjection[];
    getRegistrationTransforms(): IRegistrationTransform;
    getMouseStrain(): IMouseStrain;
}
export declare namespace Sample {
    const ModelName = "Sample";
    function sequelizeImport(sequelize: Sequelize, DataTypes: DataTypes): any;
}

/// <reference types="sequelize" />
import { Sequelize, DataTypes } from "sequelize";
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
export declare namespace RegistrationTransform {
    const ModelName = "RegistrationTransform";
    function sequelizeImport(sequelize: Sequelize, DataTypes: DataTypes): any;
}

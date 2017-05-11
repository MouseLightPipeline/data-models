/// <reference types="sequelize" />
import { Sequelize, DataTypes } from "sequelize";
import { IInjection } from "./injection";
export declare const ModelName = "Fluorophore";
export interface IFluorophore {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    getInjections(): IInjection[];
}
export declare function sequelizeImport(sequelize: Sequelize, DataTypes: DataTypes): any;

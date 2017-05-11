/// <reference types="sequelize" />
import { Sequelize, DataTypes } from "sequelize";
import { IInjection } from "./injection";
export interface IFluorophore {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    getInjections(): IInjection[];
}
export declare namespace Fluorophore {
    const ModelName = "Fluorophore";
    function sequelizeImport(sequelize: Sequelize, DataTypes: DataTypes): any;
}

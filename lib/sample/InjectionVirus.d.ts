/// <reference types="sequelize" />
import { Sequelize, DataTypes } from "sequelize";
import { IInjection } from "./injection";
export interface IInjectionVirus {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    getInjections(): IInjection;
}
export declare namespace InjectionVirus {
    const ModelName = "InjectionVirus";
    function sequelizeImport(sequelize: Sequelize, DataTypes: DataTypes): any;
}

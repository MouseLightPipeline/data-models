/// <reference types="sequelize" />
import { Sequelize, DataTypes } from "sequelize";
import { ISample } from "./sample";
export interface IMouseStrain {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    getSamples(): ISample[];
}
export declare namespace MouseStrain {
    const ModelName = "MouseStrain";
    function sequelizeImport(sequelize: Sequelize, DataTypes: DataTypes): any;
}

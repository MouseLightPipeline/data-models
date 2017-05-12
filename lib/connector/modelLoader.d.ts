/// <reference types="sequelize" />
import { DataTypes, Sequelize } from "sequelize";
export interface IModelImportDefinition {
    modelName: string;
    sequelizeImport(sequelize: Sequelize, DataTypes: DataTypes): any;
}
export declare function loadModels<T>(db: Sequelize, modelNamespaces: IModelImportDefinition[]): T;

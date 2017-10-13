/// <reference types="sequelize" />
import * as Sequelize from "sequelize";
import { IModelImportDefinition } from "./modelLoader";
import { Options } from "sequelize";
export interface IConnectionOptions extends Options {
    uri?: string;
    database?: string;
    username?: string;
    password?: string;
    ssl?: boolean;
}
export declare class Connector<T> {
    private _name;
    private _connection;
    private _models;
    private _isConnected;
    constructor(connectionOptions: IConnectionOptions, modelNamespaces: IModelImportDefinition[]);
    authenticate(): Promise<void>;
    readonly connection: Sequelize.Sequelize;
    readonly models: T;
    readonly isConnected: boolean;
}

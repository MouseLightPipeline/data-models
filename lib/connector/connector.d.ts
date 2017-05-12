/// <reference types="sequelize" />
import { IModelImportDefinition } from "./modelLoader";
import { Options } from "sequelize";
export interface IConnectionOptions extends Options {
    database: string;
    username: string;
    password: string;
}
export declare class Connector<T> {
    private _name;
    private _connection;
    private _models;
    private _isConnected;
    constructor(connectionOptions: IConnectionOptions, modelNamespaces: IModelImportDefinition[]);
    authenticate(): Promise<void>;
}

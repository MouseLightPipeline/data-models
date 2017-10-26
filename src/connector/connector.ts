import * as Sequelize from "sequelize";

import {IModelImportDefinition, loadModels} from "./modelLoader";
import {Options} from "sequelize";

const debug = require("debug")("ndb:data-models:connector");

export interface IConnectionOptions extends Options {
    uri?: string;
    host?: string;
    port?: number;
    database?: string;
    username?: string;
    password?: string;
    dialect?: string;
    dialectOptions?: any;
    logging?: boolean;
    ssl?: boolean;
}

export class Connector<T> {
    private _name: string;
    private _connection: Sequelize.Sequelize;
    private _models: T;
    private _isConnected: boolean;

    public constructor(connectionOptions: IConnectionOptions, modelNamespaces: IModelImportDefinition[]) {
        this._name = connectionOptions.database;
        this._connection = new Sequelize(connectionOptions.database, connectionOptions.username, connectionOptions.password, connectionOptions);
        this._models = loadModels<T>(this._connection, modelNamespaces);
        this._isConnected = false;
    }

    public async authenticate() {
        try {
            await this._connection.authenticate();

            this._isConnected = true;

            debug(`successful database connection: ${this._name}`);
        } catch (err) {
            debug(`failed database connection: ${this._name}`);
            debug(err);
            setTimeout(() => this.authenticate(), 5000);
        }
    }

    public get connection(): Sequelize.Sequelize {
        return this._connection;
    }

    public get models(): T {
        return this._models;
    }

    public get isConnected(): boolean {
        return this._isConnected;
    }
}

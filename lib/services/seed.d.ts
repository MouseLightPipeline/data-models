/// <reference types="sequelize" />
import * as Sequelize from "sequelize";
import { IConnectionOptions } from "../connector/connector";
export declare function seed(connectionOptions: IConnectionOptions, seedPath: string, pattern?: RegExp): Promise<void[]>;
export declare function seedFile(connection: Sequelize.Sequelize, filename: string): Promise<void>;

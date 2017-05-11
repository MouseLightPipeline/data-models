/// <reference types="sequelize" />
import { Sequelize, DataTypes } from "sequelize";
import { IInjection } from "./injection";
import { INeuron } from "./neuron";
export interface IBrainArea {
    id: string;
    structureId: number;
    depth: number;
    parentStructureId: number;
    structureIdPath: string;
    name: string;
    safeName: string;
    acronym: string;
    atlasId: number;
    graphId: number;
    graphOrder: number;
    hemisphereId: number;
    geometryFile: string;
    geometryColor: string;
    geometryEnable: boolean;
    createdAt: Date;
    updatedAt: Date;
    getInjections(): IInjection[];
    getNeurons(): INeuron[];
}
export declare const ModelName = "BrainArea";
export declare function sequelizeImport(sequelize: Sequelize, DataTypes: DataTypes): any;

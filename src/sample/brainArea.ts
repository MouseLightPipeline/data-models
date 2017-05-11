import {Sequelize, DataTypes} from "sequelize";

import {IInjection} from "./injection";
import {INeuron} from "./neuron";

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

export namespace BrainArea {
    export const ModelName = "BrainArea";

    export function sequelizeImport(sequelize: Sequelize, DataTypes: DataTypes): any {
        const BrainArea = sequelize.define(ModelName, {
            id: {
                primaryKey: true,
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4
            },
            structureId: DataTypes.INTEGER,
            depth: DataTypes.INTEGER,
            parentStructureId: DataTypes.INTEGER,
            structureIdPath: DataTypes.TEXT,
            name: DataTypes.TEXT,
            safeName: DataTypes.TEXT,
            acronym: DataTypes.TEXT
        }, {
            classMethods: {
                associate: (models: any) => {
                    BrainArea.hasMany(models.Injection, {foreignKey: "brainAreaId", as: "injections"});
                    BrainArea.hasMany(models.Neuron, {foreignKey: "brainAreaId", as: "neurons"});
                }
            },
            timestamps: true,
            paranoid: true
        });

        return BrainArea;
    }
}
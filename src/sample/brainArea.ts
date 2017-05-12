import {Sequelize, DataTypes} from "sequelize";

import {IModelImportDefinition} from "../connector/modelLoader";
import {IInjection} from "./injection";
import {INeuron} from "./neuron";

export interface IBrainArea {
    id: string;
    structureId: number;
    depth: number;
    name: string;
    parentStructureId: number;
    structureIdPath: string;
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

const ModelName = "BrainArea";

class BrainAreaModelDefinition implements IModelImportDefinition {
    private _modelName = ModelName;

    public get modelName() {return this._modelName; }

    public sequelizeImport(sequelize: Sequelize, DataTypes: DataTypes): any {
        const BrainArea = sequelize.define(ModelName, {
            id: {
                primaryKey: true,
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4
            },
            structureId: DataTypes.INTEGER,
            depth: DataTypes.INTEGER,
            name: DataTypes.TEXT,
            parentStructureId: DataTypes.INTEGER,
            structureIdPath: DataTypes.TEXT,
            safeName: DataTypes.TEXT,
            acronym: DataTypes.TEXT,
            atlasId: DataTypes.INTEGER,
            graphId: DataTypes.INTEGER,
            graphOrder: DataTypes.INTEGER,
            hemisphereId: DataTypes.INTEGER,
            geometryFile: DataTypes.TEXT,
            geometryColor: DataTypes.TEXT,
            geometryEnable: DataTypes.BOOLEAN
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

export const BrainArea: IModelImportDefinition = new BrainAreaModelDefinition();

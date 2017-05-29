import {Sequelize, DataTypes} from "sequelize";
import {isNull} from "util";

import {IModelImportDefinition} from "../connector/modelLoader";
import {IInjection} from "./injection";
import {IBrainArea} from "./brainArea";
import {isNullOrEmpty} from "../util/modelUtil";

export interface INeuron {
    id: string;
    idNumber?: number;
    idString?: string;
    tag?: string;
    keywords?: string;
    x?: number;
    y?: number;
    z?: number;
    brainAreaId?: string;
    injectionId?: string;
    sharing?: number;
    createdAt?: Date;
    updatedAt?: Date;

    getInjection?(): IInjection;
    getBrainArea?(): IBrainArea;
}

export interface INeuronInput {
    id: string;
    idNumber?: number;
    idString?: string;
    tag?: string;
    keywords?: string;
    x?: number;
    y?: number;
    z?: number;
    sharing?: number;
    brainAreaId?: string;
    injectionId?: string;
}

const ModelName = "Neuron";

class NeuronModelDefinition implements IModelImportDefinition {
    private _modelName = ModelName;

    public get modelName() {
        return this._modelName;
    }

    public sequelizeImport(sequelize: Sequelize, DataTypes: DataTypes): any {
        const Neuron: any = sequelize.define(ModelName, {
            id: {
                primaryKey: true,
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4
            },
            idNumber: {
                type: DataTypes.INTEGER,
                defaultValue: -1
            },
            idString: {
                type: DataTypes.TEXT,
                defaultValue: ""
            },
            tag: {
                type: DataTypes.TEXT,
                defaultValue: ""
            },
            keywords: {
                type: DataTypes.TEXT,
                defaultValue: ""
            },
            x: {
                type: DataTypes.DOUBLE,
                defaultValue: 0
            },
            y: {
                type: DataTypes.DOUBLE,
                defaultValue: 0
            },
            z: {
                type: DataTypes.DOUBLE,
                defaultValue: 0
            },
            sharing: {
                type: DataTypes.INTEGER,
                defaultValue: 0
            },
        }, {
            classMethods: {
                associate: (models: any) => {
                    Neuron.belongsTo(models.Injection, {foreignKey: "injectionId", as: "injection"});
                    Neuron.belongsTo(models.BrainArea, {
                        foreignKey: {name: "brainAreaId", allowNull: true},
                        as: "brainArea"
                    });

                    Neuron.BrainAreaModel = models.BrainArea;
                    Neuron.InjectionModel = models.Injection;
                    Neuron.SampleModel = models.Sample;
                }
            },
            timestamps: true,
            paranoid: true
        });

        Neuron.BrainAreaModel = null;
        Neuron.InjectionModel = null;
        Neuron.SampleModel = null;

        Neuron.isDuplicate = async (neuron: INeuron, id: string = null): Promise<boolean> => {
            const injection = await Neuron.InjectionModel.findById(neuron.injectionId);

            if (!injection) {
                return false;
            }

            const sample = await Neuron.SampleModel.findById(injection.sampleId);

            if (!sample) {
                return false;
            }

            // Now get all injections for this sample.
            const injectionIds = await Neuron.InjectionModel.findAll({where: {sampleId: sample.id}}).map((i: IInjection) => i.id);

            if (injectionIds.length === 0) {
                return false;
            }

            // All neurons for sample (via injections) that have the same idString
            const dupes = await Neuron.findAll({where: {injectionId: {$in: injectionIds}, idString: neuron.idString}});

            return dupes.length > 0 && (!id || (id !== dupes[0].id));
        };

        Neuron.createFromInput = async (neuron: INeuron): Promise<INeuron> => {
            if (!neuron.idString) {
                throw {message: "idString is a required input"};
            }

            const injection = await Neuron.InjectionModel.findById(neuron.injectionId);

            if (!injection) {
                throw {message: "the injection can not be found"};
            }

            const brainArea = await Neuron.InjectionModel.findById(neuron.brainAreaId);

            if (!brainArea) {
                throw {message: "the brain area can not be found"};
            }

            if (await Neuron.isDuplicate(neuron)) {
                throw {message: `A neuron id "${neuron.idString}" already exists on this sample`};
            }

            return await Neuron.create({
                idNumber: neuron.idNumber || 0,
                idString: neuron.idString,
                tag: neuron.tag || "",
                keywords: neuron.keywords || "",
                x: neuron.x || 0,
                y: neuron.y || 0,
                z: neuron.z || 0,
                brainAreaId: neuron.brainAreaId,
                injectionId: neuron.injectionId
            });
        };

        Neuron.updateFromInput = async (neuron: INeuron): Promise<INeuron> => {
            let row = await Neuron.findById(neuron.id);

            if (!row) {
                throw {message: "The neuron could not be found"};
            }

            if (neuron.idString && neuron.injectionId && await Neuron.isDuplicate(neuron, neuron.id)) {
                throw {message: `A neuron id "${neuron.idString}" already exists on this sample`};
            }

            // Undefined is ok (no update) - null, or empty is not.
            if (isNullOrEmpty(neuron.idString)) {
                throw {message: "idString cannot be empty"};
            }

            if (isNullOrEmpty(neuron.injectionId)) {
                throw {message: "injection id cannot be empty"};
            }

            if (neuron.injectionId) {
                const injection = await Neuron.InjectionModel.findById(neuron.injectionId);

                if (!injection) {
                    throw {message: "the injection can not be found"};
                }
            }

            if (isNullOrEmpty(neuron.brainAreaId)) {
                throw {message: "injection id cannot be empty"};
            }

            if (neuron.brainAreaId) {
                const brainArea = await Neuron.BrainAreaModel.findById(neuron.brainAreaId);

                if (!brainArea) {
                    throw {message: "the brain area can not be found"};
                }
            }

            // Undefined is ok (no update) - but prefer not null
            if (isNull(neuron.tag)) {
                neuron.tag = "";
            }

            if (isNull(neuron.keywords)) {
                neuron.keywords = "";
            }

            if (isNull(neuron.idNumber)) {
                neuron.idNumber = 0;
            }

            if (isNull(neuron.x)) {
                neuron.x = 0;
            }

            if (isNull(neuron.y)) {
                neuron.y = 0;
            }

            if (isNull(neuron.z)) {
                neuron.z = 0;
            }

            return row.update(neuron);
        };

        Neuron.deleteFromInput = async (neuron: INeuronInput): Promise<number> => {
            // Note - there is nothing here to prevent dangling swc tracings.  Caller assumes responsibility to
            // enforce relationships across database boundaries.
            if (!neuron.id) {
                throw {message: "The neuron id is a required input"};
            }

            return await Neuron.destroy({where: {id: neuron.id}});
        };

        return Neuron;
    }
}

export const Neuron: IModelImportDefinition = new NeuronModelDefinition();

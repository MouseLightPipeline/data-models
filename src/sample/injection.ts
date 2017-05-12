import {Sequelize, DataTypes} from "sequelize";
import {isNull} from "util";

import {IModelImportDefinition} from "../connector/modelLoader";
import {INeuron} from "./neuron";
import {IFluorophore} from "./fluorophore";
import {IInjectionVirus} from "./injectionVirus2";
import {IBrainArea} from "./brainArea";
import {ISample} from "./sample";

export interface IInjection {
    id: string;
    brainAreaId: string;
    injectionVirusId: string;
    fluorophoreId: string;
    sampleId: string;
    createdAt: Date;
    updatedAt: Date;

    getSample(): ISample;
    getBrainArea(): IBrainArea;
    getInjectionVirus(): IInjectionVirus;
    getFluorophore(): IFluorophore;
    getNeurons(): INeuron[];
}

const ModelName = "Injection";

class InjectionModelDefinition implements IModelImportDefinition {
    private _modelName = ModelName;

    public get modelName() {return this._modelName; }

    public sequelizeImport(sequelize: Sequelize, DataTypes: DataTypes): any {
        const Injection: any = sequelize.define(ModelName, {
            id: {
                primaryKey: true,
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4
            },
        }, {
            classMethods: {
                associate: (models: any) => {
                    Injection.belongsTo(models.Sample, {foreignKey: "sampleId", as: "sample"});
                    Injection.belongsTo(models.BrainArea, {foreignKey: "brainAreaId", as: "brainArea"});
                    Injection.belongsTo(models.InjectionVirus, {foreignKey: "injectionVirusId", as: "injectionVirus"});
                    Injection.belongsTo(models.Fluorophore, {foreignKey: "fluorophoreId", as: "fluorophore"});
                    Injection.hasMany(models.Neuron, {foreignKey: "injectionId", as: "neurons"});
                }
            },
            timestamps: true,
            paranoid: true
        });

        Injection.createFromInput = async (injection: IInjection): Promise<IInjection> => {
            if (!injection.sampleId || injection.sampleId.length === 0) {
                throw {message: "sample id is a required input"};
            }

            if (!injection.brainAreaId || injection.brainAreaId.length === 0) {
                throw {message: "brain area is a required input"};
            }

            if (!injection.injectionVirusId || injection.injectionVirusId.length === 0) {
                throw {message: "injection virus is a required input"};
            }

            if (!injection.fluorophoreId || injection.fluorophoreId.length === 0) {
                throw {message: "fluorophore is a required input"};
            }

            return await Injection.create({
                sampleId: injection.sampleId,
                brainAreaId: injection.brainAreaId,
                injectionVirusId: injection.injectionVirusId,
                fluorophoreId: injection.fluorophoreId
            });
        };

        Injection.updateFromInput = async (injection: IInjection): Promise<IInjection> => {
            let row = await Injection.findById(injection.id);

            if (!row) {
                throw {message: "The injection could not be found"};
            }

            // Undefined is ok, null is not allowed
            if (isNull(injection.sampleId) || (injection.sampleId && injection.sampleId.length === 0)) {
                throw {message: "sample id must be a valid sample"};
            }

            if (isNull(injection.brainAreaId) || (injection.brainAreaId && injection.brainAreaId.length === 0)) {
                throw {message: "brain area id must be a valid sample"};
            }

            if (isNull(injection.injectionVirusId) || (injection.injectionVirusId && injection.injectionVirusId.length === 0)) {
                throw {message: "injection virus id must be a valid sample"};
            }

            if (isNull(injection.fluorophoreId) || (injection.fluorophoreId && injection.fluorophoreId.length === 0)) {
                throw {message: "fluorophore id must be a valid sample"};
            }

            return row.update(injection);
        };

        return Injection;
    }
}

export const Injection: IModelImportDefinition = new InjectionModelDefinition();

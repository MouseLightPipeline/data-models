import {Sequelize, DataTypes} from "sequelize";
import {isNull} from "util";

import {IModelImportDefinition} from "../connector/modelLoader";
import {INeuron} from "./neuron";
import {IFluorophore} from "./fluorophore";
import {IInjectionVirus} from "./injectionVirus";
import {IBrainArea} from "./brainArea";
import {ISample} from "./sample";
import {isNullOrEmpty} from "../util/modelUtil";

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

export interface IInjectionInput {
    id: string;
    brainAreaId: string;
    injectionVirusId: string;
    injectionVirusName: string;
    fluorophoreId: string;
    fluorophoreName: string;
    sampleId: string;
}

const ModelName = "Injection";

class InjectionModelDefinition implements IModelImportDefinition {
    private _modelName = ModelName;

    public get modelName() {
        return this._modelName;
    }

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

                    Injection.InjectionVirusModel = models.InjectionVirus;
                    Injection.FluorophoreModel = models.Fluorophore;
                }
            },
            timestamps: true,
            paranoid: true
        });

        Injection.InjectionVirusModel = null;
        Injection.FluorophoreModel = null;

        Injection.createFromInput = async (injectionInput: IInjectionInput): Promise<IInjection> => {
            if (!injectionInput.sampleId || injectionInput.sampleId.length === 0) {
                throw {message: "sample id is a required input"};
            }

            if (!injectionInput.brainAreaId || injectionInput.brainAreaId.length === 0) {
                throw {message: "brain area is a required input"};
            }

            let injectionVirusId = null;

            if (injectionInput.injectionVirusName) {
                const out = await Injection.FluorophoreModel.findOrCreate(Injection.FluorophoreModel.duplicateWhereClause(injectionInput.injectionVirusName));

                injectionVirusId = out[0].id;
            } else {
                injectionVirusId = injectionInput.injectionVirusId;
            }

            if (!injectionVirusId) {
                throw {message: "injection virus is a required input"};
            }

            let fluorophoreId = null;

            if (injectionInput.fluorophoreName) {
                const out = await Injection.FluorophoreModel.findOrCreate(Injection.FluorophoreModel.duplicateWhereClause(injectionInput.fluorophoreName));

                fluorophoreId = out[0].id;
            } else {
                fluorophoreId = injectionInput.fluorophoreId;
            }

            if (!fluorophoreId) {
                throw {message: "fluorophore is a required input"};
            }

            return await Injection.create({
                sampleId: injectionInput.sampleId,
                brainAreaId: injectionInput.brainAreaId,
                injectionVirusId: injectionVirusId,
                fluorophoreId: fluorophoreId
            });
        };

        Injection.updateFromInput = async (injection: IInjectionInput): Promise<IInjection> => {
            let row = await Injection.findById(injection.id);

            if (!row) {
                throw {message: "The injection could not be found"};
            }

            // Undefined is ok (i.e., no update), null/empty is not allowed
            if (isNullOrEmpty(injection.sampleId)) {
                throw {message: "sample id must be a valid sample"};
            }

            if (isNullOrEmpty(injection.brainAreaId)) {
                throw {message: "brain area id must be a valid sample"};
            }

            if (isNullOrEmpty(injection.injectionVirusId)) {
                throw {message: "injection virus id must be a valid sample"};
            }

            if (isNullOrEmpty(injection.fluorophoreId)) {
                throw {message: "fluorophore id must be a valid sample"};
            }

            return row.update(injection);
        };

        Injection.findVirusForInput = async (injectionInput: IInjectionInput): Promise<string> => {
            let injectionVirusId = null;

            if (injectionInput.injectionVirusName) {
                const existing = await Injection.InjectionVirusModel.findOne({where: sequelize.where(sequelize.fn('lower', sequelize.col('name')), sequelize.fn('lower', injectionInput.injectionVirusName))});

                if (existing) {
                    injectionVirusId = existing.id;
                }
            }

            if (!injectionVirusId) {
                if (injectionInput.injectionVirusId) {
                    injectionVirusId = injectionInput.injectionVirusId;
                }
            }

            return injectionVirusId;
        };

        return Injection;
    }
}

export const Injection: IModelImportDefinition = new InjectionModelDefinition();

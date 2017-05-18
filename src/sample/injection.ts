import {Sequelize, DataTypes} from "sequelize";

import {IModelImportDefinition} from "../connector/modelLoader";
import {INeuron} from "./neuron";
import {IFluorophore} from "./fluorophore";
import {IInjectionVirus} from "./injectionVirus";
import {IBrainArea} from "./brainArea";
import {ISample} from "./sample";
import {isNullOrEmpty} from "../util/modelUtil";

export interface IInjection {
    id: string;
    brainAreaId?: string;
    injectionVirusId?: string;
    fluorophoreId?: string;
    sampleId?: string;
    createdAt?: Date;
    updatedAt?: Date;

    getSample?(): ISample;
    getBrainArea?(): IBrainArea;
    getInjectionVirus?(): IInjectionVirus;
    getFluorophore?(): IFluorophore;
    getNeurons?(): INeuron[];
}

export interface IInjectionInput {
    id: string;
    brainAreaId?: string;
    injectionVirusId?: string;
    injectionVirusName?: string;
    fluorophoreId?: string;
    fluorophoreName?: string;
    sampleId?: string;
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

        /**
         * A given sample can have one injection per brain area/compartment.
         * @param injectionInput
         * @returns {Promise<IFluorophore>}
         */
        Injection.findDuplicate = async (injectionInput: IInjectionInput): Promise<IFluorophore> => {
            if (!injectionInput || !injectionInput.sampleId || !injectionInput.brainAreaId) {
                return null;
            }

            return Injection.findOne({
                where: {
                    sampleId: injectionInput.sampleId,
                    brainAreaId: injectionInput.brainAreaId
                }
            });
        };

        Injection.createFromInput = async (injectionInput: IInjectionInput): Promise<IInjection> => {
            if (!injectionInput) {
                throw {message: "Injection properties are a required input"};
            }

            if (!injectionInput.sampleId) {
                throw {message: "Sample is a required input"};
            }

            if (!injectionInput.brainAreaId) {
                throw {message: "Brain area is a required input"};
            }

            const duplicate = await Injection.findDuplicate(injectionInput);

            if (duplicate) {
                throw {message: `An injection for this sample in this brain compartment exists`};
            }

            let injectionVirusId = null;

            if (injectionInput.injectionVirusName) {
                const out = await Injection.InjectionVirusModel.findOrCreateFromInput({
                    name: injectionInput.injectionVirusName
                });

                injectionVirusId = out[0].id;
            } else {
                injectionVirusId = injectionInput.injectionVirusId;
            }

            if (!injectionVirusId) {
                throw {message: "Injection virus is a required input"};
            }

            let fluorophoreId = null;

            if (injectionInput.fluorophoreName) {
                const out = await Injection.FluorophoreModel.findOrCreateFromInput({
                    name: injectionInput.fluorophoreName
                });

                fluorophoreId = out[0].id;
            } else {
                fluorophoreId = injectionInput.fluorophoreId;
            }

            if (!fluorophoreId) {
                throw {message: "Fluorophore is a required input"};
            }

            return await Injection.create({
                sampleId: injectionInput.sampleId,
                brainAreaId: injectionInput.brainAreaId,
                injectionVirusId: injectionVirusId,
                fluorophoreId: fluorophoreId
            });
        };

        Injection.updateFromInput = async (injectionInput: IInjectionInput): Promise<IInjection> => {
            if (!injectionInput) {
                throw {message: "Injection properties are a required input"};
            }

            if (!injectionInput.id) {
                throw {message: "Injection input must contain the id of the object to update"};
            }

            let row = await Injection.findById(injectionInput.id);

            if (!row) {
                throw {message: "The injection could not be found"};
            }

            // Undefined is ok (i.e., no update), null/empty is not allowed
            if (isNullOrEmpty(injectionInput.sampleId)) {
                throw {message: "Sample id must be a valid sample"};
            }

            if (isNullOrEmpty(injectionInput.brainAreaId)) {
                throw {message: "Brain compartment id must be a valid sample"};
            }

            if (isNullOrEmpty(injectionInput.injectionVirusId)) {
                throw {message: "Injection virus id must be a valid sample"};
            }

            if (isNullOrEmpty(injectionInput.fluorophoreId)) {
                throw {message: "Fluorophore id must be a valid sample"};
            }

            const merged = Object.assign(row, injectionInput);

            const duplicate = await Injection.findDuplicate(merged);

            if (duplicate && duplicate.id !== injectionInput.id) {
                throw {message: `This sample already contains an injection in this brain compartment`};
            }

            if (injectionInput.injectionVirusName) {
                const out = await Injection.InjectionVirusModel.findOrCreateFromInput({
                    name: injectionInput.injectionVirusName
                });

                injectionInput.injectionVirusId = out[0].id;
            }

            if (injectionInput.fluorophoreName) {
                const out = await Injection.FluorophoreModel.findOrCreateFromInput({
                    name: injectionInput.fluorophoreName
                });

                injectionInput.fluorophoreId = out[0].id;
            }

            return row.update(injectionInput);
        };

        Injection.deleteFromInput = async (injection: IInjectionInput): Promise<number> => {
            // Note - there is nothing here to prevent dangling transformed tracings.  Caller assumes responsibility to
            // enforce relationships across database boundaries.
            if (!injection.id) {
                throw {message: "The injection id is a required input"};
            }

            return await Injection.destroy({where: {id: injection.id}});
        };

        return Injection;
    }
}

export const Injection: IModelImportDefinition = new InjectionModelDefinition();

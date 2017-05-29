import {Sequelize, DataTypes} from "sequelize";
import {isNull, isNullOrUndefined} from "util";

import {IModelImportDefinition} from "../connector/modelLoader";
import {IInjection} from "./injection";
import {IRegistrationTransform} from "./registrationTransform";
import {IMouseStrain} from "./mouseStrain";

export interface ISample {
    id: string,
    idNumber?: number;
    animalId?: string;
    tag?: string;
    comment?: string;
    sampleDate?: Date;
    mouseStrainId?: string;
    activeRegistrationTransformId?: string;
    sharing?: number;
    createdAt?: Date;
    updatedAt?: Date;

    getInjections?(): IInjection[];
    getRegistrationTransforms?(): IRegistrationTransform;
    getMouseStrain?(): IMouseStrain;
}

export interface ISampleInput {
    id: string,
    idNumber: number;
    animalId: string;
    tag: string;
    comment: string;
    sampleDate: number;
    mouseStrainId: string;
    mouseStrainName: string;
    activeRegistrationTransformId: string;
    sharing: number;
}

const ModelName = "Sample";

class SampleModelDefinition implements IModelImportDefinition {
    private _modelName = ModelName;

    public get modelName() {
        return this._modelName;
    }

    public sequelizeImport(sequelize: Sequelize, DataTypes: DataTypes): any {
        const Sample: any = sequelize.define(ModelName, {
            id: {
                primaryKey: true,
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4
            },
            idNumber: {
                type: DataTypes.INTEGER,
                defaultValue: -1
            },
            animalId: DataTypes.TEXT,
            tag: {
                type: DataTypes.TEXT,
                defaultValue: ""
            },
            comment: {
                type: DataTypes.TEXT,
                defaultValue: ""
            },
            sampleDate: DataTypes.DATE,
            activeRegistrationTransformId: {
                type: DataTypes.TEXT,
                defaultValue: "",
            },
            sharing: {
                type: DataTypes.INTEGER,
                defaultValue: 0
            }
        }, {
            classMethods: {
                associate: (models: any) => {
                    Sample.hasMany(models.Injection, {foreignKey: "sampleId", as: "injections"});
                    Sample.hasMany(models.RegistrationTransform, {
                        foreignKey: "sampleId",
                        as: "registrationTransforms"
                    });
                    Sample.belongsTo(models.MouseStrain, {foreignKey: "mouseStrainId", as: "mouseStrain"});

                    Sample.MouseStrainModel = models.MouseStrain;
                }
            },
            timestamps: true,
            paranoid: true
        });

        Sample.MouseStrainModel = null;

        Sample.isDuplicate = async (sample: ISample, id: string = null): Promise<boolean> => {
            const dupes = await Sample.findAll({where: {idNumber: sample.idNumber}});

            return dupes.length > 0 && (!id || (id !== dupes[0].id));
        };

        Sample.createFromInput = async (sample: ISampleInput): Promise<ISample> => {
            if (isNullOrUndefined(sample)) {
                throw {message: "Sample input object is required"};
            }

            let idNumber = sample.idNumber;

            if (isNullOrUndefined(idNumber)) {
                const existing = await Sample.findAll({
                    attributes: ["idNumber"],
                    order: [["idNumber", "DESC"]],
                    limit: 1
                }).map((o: ISample) => o.idNumber);

                if (existing.length > 0) {
                    idNumber = existing[0] + 1;
                } else {
                    idNumber = 1;
                }
            } else if (await Sample.isDuplicate(sample)) {
                throw {message: `The id number ${sample.idNumber} has already been used`};
            }

            const sampleDate = sample.sampleDate ? new Date(sample.sampleDate) : new Date();
            const animalId = sample.animalId || "";
            const tag = sample.tag || "";
            const comment = sample.comment || "";
            const activeRegistrationTransformId = sample.activeRegistrationTransformId || null;
            const mouseStrainId = sample.mouseStrainId || null;
            const sharing = sample.sharing || 0;

            return await Sample.create({
                idNumber: idNumber,
                sampleDate: sampleDate,
                animalId: animalId,
                tag: tag,
                comment: comment,
                sharing: sharing,
                activeRegistrationTransformId: activeRegistrationTransformId,
                mouseStrainId: mouseStrainId
            });
        };

        Sample.updateFromInput = async (sample: ISampleInput): Promise<ISample> => {
            // Ok to be undefined (and not updated) - not ok to be null
            if (isNull(sample.idNumber) || sample.idNumber && isNaN(sample.idNumber)) {
                throw {message: `The id number can not be empty`};
            }

            let row = await Sample.findById(sample.id);

            if (!row) {
                throw {message: "The sample could not be found"};
            }

            if (sample.idNumber && await Sample.isDuplicate(sample, sample.id)) {
                throw {message: `The id number ${sample.idNumber} has already been used`};
            }

            // Ok to be undefined (and not updated) - not ok to be null
            if (isNull(sample.animalId)) {
                sample.animalId = "";
            }

            if (isNull(sample.tag)) {
                sample.tag = "";
            }

            if (isNull(sample.comment)) {
                sample.comment = "";
            }

            if (isNull(sample.sharing)) {
                sample.sharing = 0;
            }

            // Ok to be null.
            if (sample.mouseStrainName) {
                const out = await Sample.MouseStrainModel.findOrCreateFromInput({
                    name: sample.mouseStrainName
                });

                sample.mouseStrainId = out[0].id;
            } else if (isNull(sample.mouseStrainName)) {
                sample.mouseStrainName = null;
            }

            return row.update(sample);
        };

        Sample.deleteFromInput = async (sample: ISampleInput): Promise<number> => {
            if (!sample.id) {
                throw {message: "The sample id is a required input"};
            }

            return await Sample.destroy({where: {id: sample.id}});
        };

        return Sample;
    }
}

export const Sample: IModelImportDefinition = new SampleModelDefinition();

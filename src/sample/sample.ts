import {Sequelize, DataTypes} from "sequelize";
import {isNull} from "util";

import {IModelImportDefinition} from "../connector/modelLoader";
import {IInjection} from "./injection";
import {IRegistrationTransform} from "./registrationTransform";
import {IMouseStrain} from "./mouseStrain";

export interface ISample {
    id: string,
    idNumber: number;
    animalId: string;
    tag: string;
    comment: string;
    sampleDate: Date;
    mouseStrainId: string;
    activeRegistrationTransformId: string;
    sharing: number;
    createdAt: Date;
    updatedAt: Date;

    getInjections(): IInjection[];
    getRegistrationTransforms(): IRegistrationTransform;
    getMouseStrain(): IMouseStrain;
}

const ModelName = "Sample";

class SampleModelDefinition implements IModelImportDefinition {
    private _modelName = ModelName;

    public get modelName() {return this._modelName; }

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
                    Sample.belongsTo(models.MouseStrain, {foreignKey: "mouseStrainId", as: "fluorophore"});
                }
            },
            timestamps: true,
            paranoid: true
        });

        Sample.isDuplicate = async (sample: ISample, id: string = null): Promise<boolean> => {
            const dupes = await Sample.findAll({where: {idNumber: sample.idNumber}});

            return dupes.length > 0 && (!id || (id !== dupes[0].id));
        };

        Sample.createFromInput = async (sample: ISample): Promise<ISample> => {
            if (!sample.idNumber) {
                throw {message: "idNumber is a required input"};
            }

            if (await Sample.isDuplicate(sample)) {
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
                idNumber: sample.idNumber,
                sampleDate: sampleDate,
                animalId: animalId,
                tag: tag,
                comment: comment,
                sharing: sharing,
                activeRegistrationTransformId: activeRegistrationTransformId,
                mouseStrainId: mouseStrainId
            });
        };

        Sample.updateFromInput = async (sample: ISample): Promise<ISample> => {
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

            return row.update(sample);
        };

        return Sample;
    }
}

export const Sample: IModelImportDefinition = new SampleModelDefinition();

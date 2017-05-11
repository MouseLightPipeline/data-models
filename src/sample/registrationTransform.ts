import {Sequelize, DataTypes} from "sequelize";
import {isNull, isUndefined} from "util";

import {ISample} from "./sample";

export interface IRegistrationTransform {
    id: string;
    location: string;
    name: string;
    notes: string;
    sampleId: string;
    createdAt: Date;
    updatedAt: Date;

    getSample(): ISample;
}

export namespace RegistrationTransform {
    export const ModelName = "RegistrationTransform";

    export function sequelizeImport(sequelize: Sequelize, DataTypes: DataTypes): any {
        const RegistrationTransform: any = sequelize.define(ModelName, {
            id: {
                primaryKey: true,
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4
            },
            location: DataTypes.TEXT,
            name: DataTypes.TEXT,
            notes: DataTypes.TEXT,
        }, {
            classMethods: {
                associate: (models: any) => {
                    RegistrationTransform.belongsTo(models.Sample, {foreignKey: "sampleId", as: "sample"});

                    RegistrationTransform.SampleModel = models.Sample;
                }
            },
            timestamps: true,
            paranoid: true
        });

        RegistrationTransform.SampleModel = null;

        RegistrationTransform.isDuplicate = async (registrationTransform: IRegistrationTransform, id: string = null): Promise<boolean> => {
            const dupes = await RegistrationTransform.findAll({
                where: {
                    sampleId: registrationTransform.sampleId,
                    location: registrationTransform.location
                }
            });

            return dupes.length > 0 && (!id || (id !== dupes[0].id));
        };

        RegistrationTransform.createFromInput = async (registrationTransform: IRegistrationTransform): Promise<IRegistrationTransform> => {
            if (!registrationTransform.location || registrationTransform.location.length === 0) {
                throw {message: "location is a required input"};
            }

            if (await RegistrationTransform.isDuplicate(registrationTransform)) {
                throw {message: `The location "${registrationTransform.location}" already exists for this sample`};
            }

            const sample = await RegistrationTransform.SampleModel.findById(registrationTransform.sampleId);

            if (!sample) {
                throw {message: "the sample can not be found"};
            }

            return await RegistrationTransform.create({
                location: registrationTransform.location,
                name: registrationTransform.name || "",
                notes: registrationTransform.notes || "",
                sampleId: registrationTransform.sampleId
            });
        };

        RegistrationTransform.updateFromInput = async (registrationTransform: IRegistrationTransform): Promise<IRegistrationTransform> => {
            let row = await RegistrationTransform.findById(registrationTransform.id);

            if (!row) {
                throw {message: "The registration transform could not be found"};
            }

            if (registrationTransform.location && await RegistrationTransform.isDuplicate(registrationTransform, registrationTransform.id)) {
                throw {row, message: `The name "${registrationTransform.location}" has already been used`};
            }

            // Undefined is ok (no update) - null, or empty is not.
            if (!isUndefined(registrationTransform.location) && (isNull(registrationTransform.location) || (registrationTransform.location.length === 0))) {
                throw {row, message: "Location cannot be empty"};
            }

            // Same as above, but also must be existing sample
            if (isNull(registrationTransform.sampleId)) {
                throw {row, message: "Sample id cannot be empty"};
            }

            if (registrationTransform.sampleId) {
                if (!isUndefined(registrationTransform.location) && registrationTransform.location.length === 0) {
                    throw {row, message: "Sample id cannot be empty"};
                }

                const sample = await RegistrationTransform.SampleModel.findById(registrationTransform.sampleId);

                if (!sample) {
                    throw {row, message: "The sample can not be found"};
                }
            }

            // Undefined is ok (no update) - but prefer not null
            if (isNull(registrationTransform.name)) {
                registrationTransform.name = "";
            }

            if (isNull(registrationTransform.notes)) {
                registrationTransform.notes = "";
            }

            return row.update(registrationTransform);
        };

        RegistrationTransform.deleteFromInput = async (registrationTransform: IRegistrationTransform): Promise<number> => {
            // Note - there is nothing here to prevent dangling transformed tracings.  Caller assumes responsibility to
            // enforce relationships across database boundaries.
            if (!registrationTransform.id || registrationTransform.id.length === 0) {
                throw {message: "id is a required input"};
            }

            return await RegistrationTransform.destroy({where: {id: registrationTransform.id}});
        };

        return RegistrationTransform;
    }
}

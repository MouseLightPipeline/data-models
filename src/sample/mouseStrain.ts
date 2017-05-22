import {Sequelize, DataTypes} from "sequelize";

import {IModelImportDefinition} from "../connector/modelLoader";
import {ISample} from "./sample";
import {isNullOrEmpty} from "../util/modelUtil";

export interface IMouseStrain {
    id: string;
    name: string;
    createdAt?: Date;
    updatedAt?: Date;

    getSamples?(): ISample[];
}

export interface IMouseStrainInput {
    id: string;
    name?: string;
}

const ModelName = "MouseStrain";

class MouseStrainModelDefinition implements IModelImportDefinition {
    private _modelName = ModelName;

    public get modelName() {return this._modelName; }

    public sequelizeImport(sequelize: Sequelize, DataTypes: DataTypes): any {
        const MouseStrain: any = sequelize.define(ModelName, {
            id: {
                primaryKey: true,
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4
            },
            name: DataTypes.TEXT
        }, {
            classMethods: {
                associate: (models: any) => {
                    MouseStrain.hasMany(models.Sample, {foreignKey: "mouseStrainId", as: "samples"});
                }
            },
            timestamps: true,
            paranoid: true
        });

        MouseStrain.duplicateWhereClause = (name: string) => {
            return {where: sequelize.where(sequelize.fn("lower", sequelize.col("name")), sequelize.fn("lower", name))}
        };

        MouseStrain.findDuplicate = async (name: string): Promise<IMouseStrain> => {
            if (!name) {
                return null;
            }

            return MouseStrain.findOne(MouseStrain.duplicateWhereClause(name));
        };

        /**
         * Complex where clause to allow for case insensitive requires defaults property.  Wrapping for consistency as
         * a result.
         * @param {IMouseStrainInput} mouseStrain define name property
         **/
        MouseStrain.findOrCreateFromInput = async (mouseStrain: IMouseStrainInput): Promise<IMouseStrain> => {
            const options = MouseStrain.duplicateWhereClause(mouseStrain.name);

            options["defaults"] = {name: mouseStrain.name};

            return MouseStrain.findOrCreate(options);
        };

        MouseStrain.createFromInput = async (mouseStrain: IMouseStrainInput): Promise<IMouseStrain> => {
            if (!mouseStrain) {
                throw {message: "Mouse strain properties are a required input"};
            }

            if (!mouseStrain.name) {
                throw {message: "name is a required input"};
            }

            const duplicate = await MouseStrain.findDuplicate(mouseStrain.name);

            if (duplicate) {
                throw {message: `The name "${mouseStrain.name}" has already been used`};
            }

            return await MouseStrain.create({
                name: mouseStrain.name
            });
        };

        MouseStrain.updateFromInput = async (mouseStrain: IMouseStrainInput): Promise<IMouseStrain> => {
            if (!mouseStrain) {
                throw {message: "Mouse strain properties are a required input"};
            }

            if (!mouseStrain.id) {
                throw {message: "Mouse strain input must contain the id of the object to update"};
            }

            let row = await MouseStrain.findById(mouseStrain.id);

            if (!row) {
                throw {message: "The mouse strain could not be found"};
            }

            // Undefined is ok - although strange as that is the only property at the moment.
            if (isNullOrEmpty(mouseStrain.name)) {
                throw {message: "name cannot be empty or null"};
            }

            const duplicate = await MouseStrain.findDuplicate(mouseStrain.name);

            if (duplicate && duplicate.id !== mouseStrain.id) {
                throw {message: `The strain "${mouseStrain.name}" has already been created`};
            }

            return row.update(mouseStrain);
        };

        return MouseStrain;
    }
}

export const MouseStrain: IModelImportDefinition = new MouseStrainModelDefinition();

import {Sequelize, DataTypes} from "sequelize";
import {isNull} from "util";

import {IModelImportDefinition} from "../connector/modelLoader";
import {IInjection} from "./injection";
import {isNullOrEmpty} from "../util/modelUtil";

export interface IFluorophore {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;

    getInjections(): IInjection[];
}

export interface IFluorophoreInput {
    id: string;
    name: string;
}

const ModelName = "Fluorophore";

class FluorophoreModelDefinition implements IModelImportDefinition {
    private _modelName = ModelName;

    public get modelName() {
        return this._modelName;
    }

    public sequelizeImport(sequelize: Sequelize, DataTypes: DataTypes): any {
        const Fluorophore: any = sequelize.define(ModelName, {
            id: {
                primaryKey: true,
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4
            },
            name: DataTypes.TEXT
        }, {
            classMethods: {
                associate: (models: any) => {
                    Fluorophore.hasMany(models.Injection, {foreignKey: "fluorophoreId", as: "injections"});
                }
            },
            timestamps: true,
            paranoid: true
        });

        Fluorophore.duplicateWhereClause = (name: string) => {
            return {where: sequelize.where(sequelize.fn('lower', sequelize.col('name')), sequelize.fn('lower', name))}
        };

        Fluorophore.findDuplicate = async (name: string): Promise<IFluorophore> => {
            if (!name) {
                return null;
            }

            return Fluorophore.findOne(Fluorophore.duplicateWhereClause(name));
        };

        /**
         * Complex where clause to allow for case insensitive requires defaults property.  Wrapping for consistency as
         * a result.
         * @param {IFluorophoreInput} fluorophore define name property
         **/
        Fluorophore.findOrCreateFromInput = async (fluorophore: IFluorophoreInput): Promise<IFluorophore> => {
            const options = Fluorophore.duplicateWhereClause(fluorophore.name);

            options["defaults"] = {name: fluorophore.name};

            return Fluorophore.findOrCreate(options);
        };

        Fluorophore.createFromInput = async (fluorophoreInput: IFluorophoreInput): Promise<IFluorophore> => {
            if (!fluorophoreInput) {
                throw {message: "No fluorophore input provided"};
            }

            if (!fluorophoreInput.name) {
                throw {message: "name is a required input"};
            }

            const duplicate = await Fluorophore.findDuplicate(fluorophoreInput.name);

            if (duplicate) {
                throw {message: `The name "${fluorophoreInput.name}" has already been used`};
            }

            return await Fluorophore.create({
                name: fluorophoreInput.name
            });
        };

        Fluorophore.updateFromInput = async (fluorophoreInput: IFluorophoreInput): Promise<IFluorophore> => {
            if (!fluorophoreInput) {
                throw {message: "No fluorophore input provided"};
            }

            if (!fluorophoreInput.id) {
                throw {message: "Fluorophore input must contain the id of the object to update"};
            }

            let row = await Fluorophore.findById(fluorophoreInput.id);

            if (!row) {
                throw {message: "The fluorophore could not be found"};
            }

            const duplicate = await Fluorophore.findDuplicate(fluorophoreInput.name);

            if (duplicate && duplicate.id !== fluorophoreInput.id) {
                throw {message: `The name "${Fluorophore.name}" has already been used`};
            }

            // Undefined is ok - although strange as that is the only property at the moment.
            if (isNullOrEmpty(fluorophoreInput.name)) {
                throw {message: "name cannot be empty or null"};
            }

            return row.update(fluorophoreInput);
        };

        return Fluorophore;
    }
}

export const Fluorophore: IModelImportDefinition = new FluorophoreModelDefinition();

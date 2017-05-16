import {Sequelize, DataTypes} from "sequelize";

import {IModelImportDefinition} from "../connector/modelLoader";
import {IInjection} from "./injection";
import {isNullOrEmpty} from "../util/modelUtil";

export interface IInjectionVirus {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;

    getInjections(): IInjection;
}

export interface IInjectionVirusInput {
    id: string;
    name: string;
}

const ModelName = "InjectionVirus";

class InjectionVirusModelDefinition implements IModelImportDefinition {
    private _modelName = ModelName;

    public get modelName() {return this._modelName; }

    public sequelizeImport(sequelize: Sequelize, DataTypes: DataTypes): any {
        const InjectionVirus: any = sequelize.define(ModelName, {
            id: {
                primaryKey: true,
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4
            },
            name: DataTypes.TEXT
        }, {
            classMethods: {
                associate: (models: any) => {
                    InjectionVirus.hasMany(models.Injection, {foreignKey: "injectionVirusId", as: "injections"});
                }
            },
            tableName: "InjectionViruses",
            timestamps: true,
            paranoid: true
        });

        InjectionVirus.duplicateWhereClause = (name: string) => {
            return {where: sequelize.where(sequelize.fn('lower', sequelize.col('name')), sequelize.fn('lower', name))}
        };

        InjectionVirus.findDuplicate = async (name: string): Promise<IInjectionVirus> => {
            if (!name) {
                return null;
            }

            return InjectionVirus.findOne(InjectionVirus.duplicateWhereClause(name));
        };

        /**
         * Complex where clause to allow for case insensitive requires defaults property.  Wrapping for consistency as
         * a result.
         * @param {IFluorophoreInput} fluorophore define name property
         **/
        InjectionVirus.findOrCreateFromInput = async (fluorophore: IInjectionVirusInput): Promise<IInjectionVirus> => {
            const options = InjectionVirus.duplicateWhereClause(fluorophore.name);

            options["defaults"] = {name: fluorophore.name};

            return InjectionVirus.findOrCreate(options);
        };

        InjectionVirus.createFromInput = async (virusInput: IInjectionVirusInput): Promise<IInjectionVirus> => {
            if (!virusInput) {
                throw {message: "Injection virus properties are a required input"};
            }

            if (!virusInput.name) {
                throw {message: "name is a required input"};
            }

            const duplicate = await InjectionVirus.findDuplicate(virusInput.name);

            if (duplicate) {
                throw {message: `The name "${virusInput.name}" has already been used`};
            }

            return await InjectionVirus.create({
                name: virusInput.name
            });
        };

        InjectionVirus.updateFromInput = async (virusInput: IInjectionVirusInput): Promise<IInjectionVirus> => {
            if (!virusInput) {
                throw {message: "Injection virus properties are a required input"};
            }

            if (!virusInput.id) {
                throw {message: "Virus input must contain the id of the object to update"};
            }

            let row = await InjectionVirus.findById(virusInput.id);

            if (!row) {
                throw {message: "The injection virus could not be found"};
            }

            // Undefined is ok - although strange as that is the only property at the moment.
            if (isNullOrEmpty(virusInput.name)) {
                throw {message: "name cannot be empty"};
            }

            const duplicate = await InjectionVirus.findDuplicate(virusInput.name);

            if (duplicate && duplicate.id !== virusInput.id) {
                throw {message: `The name "${virusInput.name}" has already been used`};
            }

            return row.update(virusInput);
        };

        return InjectionVirus;
    }
}

export const InjectionVirus: IModelImportDefinition = new InjectionVirusModelDefinition();

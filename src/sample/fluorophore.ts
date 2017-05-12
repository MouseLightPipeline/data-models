import {Sequelize, DataTypes} from "sequelize";
import {isNull} from "util";

import {IModelImportDefinition} from "../index";
import {IInjection} from "./injection";

export interface IFluorophore {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;

    getInjections(): IInjection[];
}

const ModelName = "Fluorophore";

class FluorophoreModelDefinition implements IModelImportDefinition {
    private _modelName = ModelName;

    public get modelName() {return this._modelName; }

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

        Fluorophore.isDuplicate = async (fluorophore: IFluorophore, id: string = null): Promise<boolean> => {
            const dupes = await Fluorophore.findAll({where: {name: {$iLike: fluorophore.name}}});

            return dupes.length > 0 && (!id || (id !== dupes[0].id));
        };

        Fluorophore.createFromInput = async (fluorophore: IFluorophore): Promise<IFluorophore> => {
            if (!fluorophore.name || fluorophore.name.length === 0) {
                throw {message: "name is a required input"};
            }

            if (await Fluorophore.isDuplicate(fluorophore)) {
                throw {message: `The name "${fluorophore.name}" has already been used`};
            }

            return await Fluorophore.create({
                name: fluorophore.name
            });
        };

        Fluorophore.updateFromInput = async (fluorophore: IFluorophore): Promise<IFluorophore> => {
            let row = await Fluorophore.findById(fluorophore.id);

            if (!row) {
                throw {message: "The fluorophore could not be found"};
            }

            if (fluorophore.name && await Fluorophore.isDuplicate(fluorophore, fluorophore.id)) {
                throw {message: `The name "${Fluorophore.name}" has already been used`};
            }

            // Undefined is ok - although strange as that is the only property at the moment.
            if (isNull(fluorophore.name) || (fluorophore.name && fluorophore.name.length === 0)) {
                throw {message: "name cannot be empty"};
            }

            return row.update(fluorophore);
        };

        return Fluorophore;
    }
}

export const Fluorophore: IModelImportDefinition = new FluorophoreModelDefinition();

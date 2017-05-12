import {Sequelize, DataTypes} from "sequelize";
import {isNull} from "util";

import {IModelImportDefinition} from "../index";
import {IInjection} from "./injection";

export interface IInjectionVirus {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;

    getInjections(): IInjection;
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

        InjectionVirus.isDuplicate = async (injectionVirus: IInjectionVirus, id: string = null): Promise<boolean> => {
            const dupes = await InjectionVirus.findAll({where: {name: {$iLike: injectionVirus.name}}});

            return dupes.length > 0 && (!id || (id !== dupes[0].id));
        };

        InjectionVirus.createFromInput = async (injectionVirus: IInjectionVirus): Promise<IInjectionVirus> => {
            if (!injectionVirus.name || injectionVirus.name.length === 0) {
                throw {message: "name is a required input"};
            }

            if (await InjectionVirus.isDuplicate(injectionVirus)) {
                throw {message: `The name "${injectionVirus.name}" has already been used`};
            }

            return await InjectionVirus.create({
                name: injectionVirus.name
            });
        };

        InjectionVirus.updateFromInput = async (injectionVirus: IInjectionVirus): Promise<IInjectionVirus> => {
            let row = await InjectionVirus.findById(injectionVirus.id);

            if (!row) {
                throw {message: "The injection virus could not be found"};
            }

            if (injectionVirus.name && await InjectionVirus.isDuplicate(injectionVirus, injectionVirus.id)) {
                throw {message: `The name "${injectionVirus.name}" has already been used`};
            }

            // Undefined is ok - although strange as that is the only property at the moment.
            if (isNull(injectionVirus.name) || (injectionVirus.name && injectionVirus.name.length === 0)) {
                throw {message: "name cannot be empty"};
            }

            return row.update(injectionVirus);
        };

        return InjectionVirus;
    }
}

export const InjectionVirus: IModelImportDefinition = new InjectionVirusModelDefinition();

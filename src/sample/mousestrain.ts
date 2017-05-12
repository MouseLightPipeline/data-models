import {Sequelize, DataTypes} from "sequelize";
import {isNull} from "util";

import {IModelImportDefinition} from "../index";
import {ISample} from "./sample";

export interface IMouseStrain {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;

    getSamples(): ISample[];
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

        MouseStrain.isDuplicate = async (mouseStrain: IMouseStrain, id: string = null): Promise<boolean> => {
            const dupes = await MouseStrain.findAll({where: {name: {$iLike: mouseStrain.name}}});

            return dupes.length > 0 && (!id || (id !== dupes[0].id));
        };

        MouseStrain.createFromInput = async (mouseStrain: IMouseStrain): Promise<IMouseStrain> => {
            if (!mouseStrain.name || mouseStrain.name.length === 0) {
                throw {message: "name is a required input"};
            }

            if (await MouseStrain.isDuplicate(mouseStrain)) {
                throw {message: `The name "${mouseStrain.name}" has already been used`};
            }

            return await MouseStrain.create({
                name: mouseStrain.name
            });
        };

        MouseStrain.updateFromInput = async (mouseStrain: IMouseStrain): Promise<IMouseStrain> => {
            let row = await MouseStrain.findById(mouseStrain.id);

            if (!row) {
                throw {message: "The mouse strain could not be found"};
            }

            if (mouseStrain.name && await MouseStrain.isDuplicate(mouseStrain, mouseStrain.id)) {
                throw {message: `The name "${mouseStrain.name}" has already been used`};
            }

            // Undefined is ok - although strange as that is the only property to update at the moment.
            if (isNull(mouseStrain.name) || (mouseStrain.name && mouseStrain.name.length === 0)) {
                throw {message: "name cannot be empty"};
            }

            return row.update(mouseStrain);
        };

        return MouseStrain;
    }
}

export const MouseStrain: IModelImportDefinition = new MouseStrainModelDefinition();

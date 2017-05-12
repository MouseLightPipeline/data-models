import {DataTypes, Sequelize} from "sequelize";

export interface IModelImportDefinition {
    modelName: string;
    sequelizeImport(sequelize: Sequelize, DataTypes: DataTypes): any
}

export function loadModels<T>(db: Sequelize, modelNamespaces: IModelImportDefinition[]): T {
    const models: any = {};

    modelNamespaces.forEach(ns => {
        models[ns.modelName] = db.import(ns.modelName, ns.sequelizeImport);
    });

    Object.keys(models).map(modelName => {
        if (models[modelName].associate) {
            models[modelName].associate(models);
        }

        if (models[modelName].prepareContents) {
            models[modelName].prepareContents(models);
        }
    });

    return models;
}

import {DataTypes, Sequelize} from "sequelize";

import {BrainArea} from "./sample/brainArea";
import {Fluorophore} from "./sample/fluorophore";
import {Injection} from "./sample/injection";
import {InjectionVirus} from "./sample/InjectionVirus";
import {MouseStrain} from "./sample/mousestrain";
import {Neuron} from "./sample/neuron";
import {RegistrationTransform} from "./sample/registrationTransform";
import {Sample} from "./sample/sample";

export {BrainArea} from "./sample/BrainArea";
export {Fluorophore} from "./sample/Fluorophore";
export {Injection} from "./sample/Injection";
export {InjectionVirus} from "./sample/InjectionVirus";
export {MouseStrain} from "./sample/MouseStrain";
export {Neuron} from "./sample/Neuron";
export {RegistrationTransform} from "./sample/RegistrationTransform";
export {Sample} from "./sample/Sample";

export {IBrainArea} from "./sample/BrainArea";
export {IFluorophore} from "./sample/Fluorophore";
export {IInjection} from "./sample/Injection";
export {IInjectionVirus} from "./sample/InjectionVirus";
export {IMouseStrain} from "./sample/MouseStrain";
export {INeuron} from "./sample/Neuron";
export {IRegistrationTransform} from "./sample/RegistrationTransform";
export {ISample} from "./sample/Sample";

export interface IModelImportDefinition {
    modelName: string;
    sequelizeImport(sequelize: Sequelize, DataTypes: DataTypes): any
}

export const AllSampleModels: IModelImportDefinition[] = [
    BrainArea,
    Fluorophore,
    Injection,
    InjectionVirus,
    MouseStrain,
    Neuron,
    RegistrationTransform,
    Sample
];

export function loadModels(db: Sequelize, modelNamespaces: IModelImportDefinition[]) {
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

export function loadSampleModels(db: Sequelize) {
    return loadModels(db, AllSampleModels);
}

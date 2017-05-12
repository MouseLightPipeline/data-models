/// <reference types="sequelize" />
import { DataTypes, Sequelize } from "sequelize";
export { BrainArea } from "./sample/BrainArea";
export { Fluorophore } from "./sample/Fluorophore";
export { Injection } from "./sample/Injection";
export { InjectionVirus } from "./sample/InjectionVirus";
export { MouseStrain } from "./sample/MouseStrain";
export { Neuron } from "./sample/Neuron";
export { RegistrationTransform } from "./sample/RegistrationTransform";
export { Sample } from "./sample/Sample";
export { IBrainArea } from "./sample/BrainArea";
export { IFluorophore } from "./sample/Fluorophore";
export { IInjection } from "./sample/Injection";
export { IInjectionVirus } from "./sample/InjectionVirus";
export { IMouseStrain } from "./sample/MouseStrain";
export { INeuron } from "./sample/Neuron";
export { IRegistrationTransform } from "./sample/RegistrationTransform";
export { ISample } from "./sample/Sample";
export interface IModelImportDefinition {
    modelName: string;
    sequelizeImport(sequelize: Sequelize, DataTypes: DataTypes): any;
}
export declare const AllSampleModels: IModelImportDefinition[];
export declare function loadModels(db: Sequelize, modelNamespaces: IModelImportDefinition[]): any;
export declare function loadSampleModels(db: Sequelize): any;

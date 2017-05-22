import { IModelImportDefinition } from "../connector/modelLoader";
import { IInjection } from "./injection";
import { INeuron } from "./neuron";
export interface IBrainArea {
    id: string;
    structureId?: number;
    depth?: number;
    name?: string;
    parentStructureId?: number;
    structureIdPath?: string;
    safeName?: string;
    acronym?: string;
    atlasId?: number;
    graphId?: number;
    graphOrder?: number;
    hemisphereId?: number;
    geometryFile?: string;
    geometryColor?: string;
    geometryEnable?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    getInjections?(): IInjection[];
    getNeurons?(): INeuron[];
}
export declare const BrainArea: IModelImportDefinition;

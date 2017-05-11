export declare const TableName = "Sample";
export interface ISample {
    id: string;
    idNumber: number;
    animalId: string;
    tag: string;
    comment: string;
    sampleDate: Date;
    mouseStrainId: string;
    activeRegistrationTransformId: string;
    sharing: number;
    createdAt: Date;
    updatedAt: Date;
    getInjections(): any;
    getRegistrationTransforms(): any;
    getMouseStrain(): any;
}
export declare function sequelizeImport(sequelize: any, DataTypes: any): any;

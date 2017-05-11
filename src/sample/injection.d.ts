export declare const TableName = "Injection";
export interface IInjection {
    id: string;
    brainAreaId: string;
    injectionVirusId: string;
    fluorophoreId: string;
    sampleId: string;
    createdAt: Date;
    updatedAt: Date;
    getSample(): any;
    getBrainArea(): any;
    getInjectionVirus(): any;
    getFluorophore(): any;
    getNeurons(): any;
}
export declare function sequelizeImport(sequelize: any, DataTypes: any): any;

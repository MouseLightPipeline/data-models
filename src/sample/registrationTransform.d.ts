export interface IRegistrationTransform {
    id: string;
    location: string;
    name: string;
    notes: string;
    sampleId: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare const TableName = "RegistrationTransform";
export declare function sequelizeImport(sequelize: any, DataTypes: any): any;

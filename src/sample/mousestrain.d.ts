export declare const TableName = "MouseStrain";
export interface IMouseStrain {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    getSamples(): any;
}
export declare function sequelizeImport(sequelize: any, DataTypes: any): any;
